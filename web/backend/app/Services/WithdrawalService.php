<?php

namespace App\Services;

use App\Models\User;
use App\Models\Withdrawal;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;
use RuntimeException;

class WithdrawalService
{
    public function __construct(
        protected WalletService $walletService
    ) {}

    /**
     * Request a new UPI withdrawal.
     */
    public function requestWithdrawal(User $user, int $coins, string $upiId, string $idempotencyKey): array
    {
        // 1. Minimum Threshold & Divisibility Check
        $minCoins = (int) config('rewards.min_withdrawal_coins', 10000);
        if ($coins < $minCoins) {
            throw new InvalidArgumentException("Minimum withdrawal is {$minCoins} coins (₹" . ($minCoins / 1000) . ").");
        }

        if ($coins % 10 !== 0) {
            throw new InvalidArgumentException("Withdrawal coin amount must be divisible by 10 for integral paise calculation.");
        }

        // 2. UPI Format Check
        $cleanUpi = trim($upiId);
        if (!preg_match('/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/', $cleanUpi)) {
            throw new InvalidArgumentException("Invalid UPI ID format. Expected format: name@bank.");
        }

        // 3. User Age & Eligibility Verification
        $profile = $user->profile;
        if (!$profile || $profile->age_eligibility_status !== 'verified_18_plus') {
            throw new RuntimeException("Age eligibility verification required (18+ only).");
        }

        // 4. Daily Velocity Limit (Max 1 withdrawal request per 24 hours)
        $recentWithdrawal = Withdrawal::where('user_id', $user->id)
            ->where('created_at', '>=', Carbon::now()->subHours(24))
            ->whereIn('status', ['requested', 'under_review', 'approved', 'processing'])
            ->first();

        if ($recentWithdrawal) {
            throw new RuntimeException("A withdrawal request is already pending or completed in the last 24 hours.");
        }

        return DB::transaction(function () use ($user, $coins, $cleanUpi, $idempotencyKey) {
            // Check idempotency
            $existing = Withdrawal::where('idempotency_key', $idempotencyKey)->first();
            if ($existing) {
                return [
                    'status' => 'duplicate',
                    'message' => 'Withdrawal request already submitted',
                    'withdrawal' => $existing,
                ];
            }

            $amountPaise = intdiv($coins, 10);

            // Create withdrawal in requested state
            $withdrawal = Withdrawal::create([
                'user_id' => $user->id,
                'coins' => $coins,
                'amount_paise' => $amountPaise,
                'upi_id' => $cleanUpi,
                'status' => 'requested',
                'idempotency_key' => $idempotencyKey,
            ]);

            // Reserve coins atomically (available -> reserved)
            $this->walletService->reserveForWithdrawal($user, $coins, $withdrawal);

            return [
                'status' => 'success',
                'message' => 'Withdrawal request submitted successfully',
                'withdrawal' => $withdrawal,
            ];
        });
    }

    /**
     * Process signed payout webhook from payment partner (e.g., RazorpayX / Cashfree).
     */
    public function processPayoutWebhook(string $provider, array $payload, ?string $signature = null): array
    {
        $withdrawalId = (int) ($payload['withdrawal_id'] ?? 0);
        $payoutId = (string) ($payload['payout_id'] ?? '');
        $status = strtoupper((string) ($payload['status'] ?? ''));
        $failureReason = (string) ($payload['reason'] ?? 'Payment partner failure');

        $withdrawal = Withdrawal::find($withdrawalId);
        if (!$withdrawal) {
            throw new InvalidArgumentException("Withdrawal record #{$withdrawalId} not found.");
        }

        // If already finalized, idempotent return
        if ($withdrawal->status === 'paid' || $withdrawal->status === 'failed') {
            return [
                'status' => 'idempotent',
                'message' => "Withdrawal already in final state: {$withdrawal->status}",
                'withdrawal' => $withdrawal,
            ];
        }

        return DB::transaction(function () use ($withdrawal, $payoutId, $status, $failureReason) {
            if ($status === 'SUCCESS' || $status === 'PAID') {
                $this->walletService->finalizePaidWithdrawal($withdrawal, $payoutId);
                return [
                    'status' => 'paid',
                    'message' => 'Payout successfully confirmed and ledger finalized',
                    'withdrawal' => $withdrawal->fresh(),
                ];
            }

            if ($status === 'FAILED' || $status === 'REJECTED') {
                $this->walletService->releaseReservedWithdrawal($withdrawal, $failureReason);
                return [
                    'status' => 'failed',
                    'message' => 'Payout failed, reserved coins released back to available balance',
                    'withdrawal' => $withdrawal->fresh(),
                ];
            }

            if ($status === 'PROCESSING') {
                $withdrawal->update(['status' => 'processing', 'payout_id' => $payoutId]);
                return [
                    'status' => 'processing',
                    'message' => 'Payout is currently processing',
                    'withdrawal' => $withdrawal,
                ];
            }

            // Unknown or requires reconciliation
            $withdrawal->update(['status' => 'under_review']);
            return [
                'status' => 'under_review',
                'message' => 'Unrecognized payout status; placed under review for reconciliation',
                'withdrawal' => $withdrawal,
            ];
        });
    }
}
