<?php

namespace App\Services;

use App\Models\Offer;
use App\Models\Partner;
use App\Models\RewardEvent;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;
use RuntimeException;

class RewardVerificationService
{
    public function __construct(
        protected WalletService $walletService
    ) {}

    /**
     * Compute expected HMAC-SHA256 signature for payload.
     */
    public function computeSignature(Partner $partner, array $payload): string
    {
        ksort($payload);
        $canonicalString = http_build_query($payload);
        return hash_hmac('sha256', $canonicalString, $partner->secret_key);
    }

    /**
     * Verify partner signature.
     */
    public function verifySignature(Partner $partner, array $payload, string $providedSignature): bool
    {
        $expected = $this->computeSignature($partner, $payload);
        return hash_equals($expected, $providedSignature);
    }

    /**
     * Process an incoming server-to-server reward completion callback.
     */
    public function processRewardEvent(Partner $partner, array $payload, ?string $signature = null): array
    {
        // 1. Signature Verification
        if ($signature !== null && config('rewards.rewards_provider_mode') !== 'mock') {
            if (!$this->verifySignature($partner, $payload, $signature)) {
                throw new InvalidArgumentException("Invalid partner HMAC signature.");
            }
        }

        // 2. Extract and validate required fields
        $externalEventId = (string) ($payload['event_id'] ?? '');
        $userId = (int) ($payload['user_id'] ?? 0);
        $offerId = isset($payload['offer_id']) ? (int) $payload['offer_id'] : null;
        $rewardCoins = (int) ($payload['reward_coins'] ?? config('rewards.standard_reward_coins', 20));
        $timestamp = isset($payload['timestamp']) ? (int) $payload['timestamp'] : time();

        if (empty($externalEventId) || $userId <= 0 || $rewardCoins <= 0) {
            throw new InvalidArgumentException("Missing or invalid required payload parameters.");
        }

        // Replay drift check (max 300 seconds)
        if (abs(time() - $timestamp) > 300 && config('rewards.rewards_provider_mode') !== 'mock') {
            throw new InvalidArgumentException("Expired event timestamp. Replay check failed.");
        }

        $user = User::find($userId);
        if (!$user) {
            throw new InvalidArgumentException("User ID {$userId} not found.");
        }

        if ($user->status !== 'active') {
            throw new RuntimeException("User account {$userId} is suspended or banned.");
        }

        return DB::transaction(function () use ($partner, $payload, $signature, $externalEventId, $user, $offerId, $rewardCoins) {
            // 3. Idempotency Check on (partner_id, external_event_id)
            $existingEvent = RewardEvent::where('partner_id', $partner->id)
                ->where('external_event_id', $externalEventId)
                ->first();

            if ($existingEvent) {
                return [
                    'status' => 'duplicate',
                    'message' => 'Event already processed',
                    'event' => $existingEvent,
                ];
            }

            // 4. Daily Completion Cap Check (Default: 10 per day)
            $dailyLimit = (int) config('rewards.standard_daily_limit', 10);
            $todayCompletions = RewardEvent::where('user_id', $user->id)
                ->where('status', '!=', 'rejected')
                ->where('received_at', '>=', Carbon::today())
                ->count();

            if ($todayCompletions >= $dailyLimit) {
                $rejectedEvent = RewardEvent::create([
                    'partner_id' => $partner->id,
                    'external_event_id' => $externalEventId,
                    'user_id' => $user->id,
                    'offer_id' => $offerId,
                    'reward_coins' => 0,
                    'status' => 'rejected',
                    'signature' => $signature,
                    'raw_payload' => $payload,
                    'received_at' => now(),
                ]);

                return [
                    'status' => 'rejected',
                    'message' => "Daily activity limit of {$dailyLimit} reached. No coins awarded.",
                    'event' => $rejectedEvent,
                ];
            }

            // 5. Create Pending Event Record
            $event = RewardEvent::create([
                'partner_id' => $partner->id,
                'external_event_id' => $externalEventId,
                'user_id' => $user->id,
                'offer_id' => $offerId,
                'reward_coins' => $rewardCoins,
                'status' => 'pending',
                'signature' => $signature,
                'raw_payload' => $payload,
                'received_at' => now(),
            ]);

            // 6. Credit Pending Coins in Ledger
            $idempotencyKey = "partner_{$partner->id}_evt_{$externalEventId}";
            $tx = $this->walletService->creditPendingReward(
                $user,
                $rewardCoins,
                (string) $event->id,
                $idempotencyKey,
                "Reward for partner event: {$externalEventId}"
            );

            // In mock mode or if hold period is 0, auto-release for immediate testing
            if ((int) config('rewards.reward_hold_hours', 24) === 0 || config('rewards.rewards_provider_mode') === 'mock_instant') {
                $this->walletService->releasePendingReward(
                    $user,
                    $rewardCoins,
                    (string) $event->id,
                    "Instant test release"
                );
                $event->update(['status' => 'settled']);
            }

            return [
                'status' => 'success',
                'message' => 'Reward credited successfully',
                'event' => $event,
                'transaction' => $tx,
            ];
        });
    }

    /**
     * Process compensating reversal if partner later invalidates a completion.
     */
    public function reverseRewardEvent(Partner $partner, string $externalEventId, string $reason): array
    {
        return DB::transaction(function () use ($partner, $externalEventId, $reason) {
            $event = RewardEvent::where('partner_id', $partner->id)
                ->where('external_event_id', $externalEventId)
                ->firstOrFail();

            if ($event->status === 'reversed') {
                return [
                    'status' => 'already_reversed',
                    'message' => 'Event was already reversed',
                    'event' => $event,
                ];
            }

            $user = $event->user;
            $coins = $event->reward_coins;

            $reversalTx = $this->walletService->reverseReward(
                $user,
                $coins,
                (string) $event->id,
                $reason
            );

            $event->update(['status' => 'reversed']);

            return [
                'status' => 'success',
                'message' => 'Event reversed and compensating ledger entry created',
                'event' => $event,
                'transaction' => $reversalTx,
            ];
        });
    }
}
