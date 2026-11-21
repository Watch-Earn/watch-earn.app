<?php

namespace Tests\Feature;

use App\Models\Offer;
use App\Models\Partner;
use App\Models\User;
use App\Models\UserProfile;
use App\Services\RewardVerificationService;
use App\Services\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RewardVerificationTest extends TestCase
{
    use RefreshDatabase;

    protected RewardVerificationService $rewardService;
    protected WalletService $walletService;
    protected Partner $partner;
    protected User $user;
    protected Offer $offer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->rewardService = app(RewardVerificationService::class);
        $this->walletService = app(WalletService::class);

        $this->partner = Partner::create([
            'name' => 'AdNetwork Alpha',
            'slug' => 'adnetwork-alpha',
            'secret_key' => 'super_secret_test_key_999',
            'status' => 'active',
        ]);

        $this->user = User::create([
            'phone_hash' => hash('sha256', '+919876543210'),
            'phone_last_four' => '3210',
            'status' => 'active',
        ]);

        UserProfile::create([
            'user_id' => $this->user->id,
            'age_eligibility_status' => 'verified_18_plus',
        ]);

        $this->offer = Offer::create([
            'partner_id' => $this->partner->id,
            'external_offer_id' => 'survey_101',
            'title' => 'Test Survey',
            'reward_coins' => 20,
            'daily_cap' => 10,
            'status' => 'active',
        ]);
    }

    public function test_signature_verification_and_reward_crediting(): void
    {
        $payload = [
            'event_id' => 'evt_test_001',
            'user_id' => $this->user->id,
            'offer_id' => $this->offer->id,
            'reward_coins' => 20,
            'timestamp' => time(),
        ];

        $signature = $this->rewardService->computeSignature($this->partner, $payload);

        $result = $this->rewardService->processRewardEvent($this->partner, $payload, $signature);

        $this->assertEquals('success', $result['status']);
        $this->assertEquals(20, $this->walletService->getBalanceSummary($this->user)['pending_coins']);
    }

    public function test_idempotent_duplicate_event_handling(): void
    {
        $payload = [
            'event_id' => 'evt_test_002',
            'user_id' => $this->user->id,
            'offer_id' => $this->offer->id,
            'reward_coins' => 20,
            'timestamp' => time(),
        ];
        $signature = $this->rewardService->computeSignature($this->partner, $payload);

        // First attempt -> success
        $res1 = $this->rewardService->processRewardEvent($this->partner, $payload, $signature);
        $this->assertEquals('success', $res1['status']);

        // Second attempt with same event_id -> duplicate returned, no extra coins granted
        $res2 = $this->rewardService->processRewardEvent($this->partner, $payload, $signature);
        $this->assertEquals('duplicate', $res2['status']);

        // Balance must remain strictly 20 coins
        $this->assertEquals(20, $this->walletService->getBalanceSummary($this->user)['pending_coins']);
    }

    public function test_daily_cap_enforcement_max_10_completions(): void
    {
        // Execute 10 completions
        for ($i = 1; $i <= 10; $i++) {
            $payload = [
                'event_id' => "evt_daily_cap_{$i}",
                'user_id' => $this->user->id,
                'offer_id' => $this->offer->id,
                'reward_coins' => 20,
                'timestamp' => time(),
            ];
            $sig = $this->rewardService->computeSignature($this->partner, $payload);
            $res = $this->rewardService->processRewardEvent($this->partner, $payload, $sig);
            $this->assertEquals('success', $res['status']);
        }

        // 11th completion must be rejected by daily cap
        $payload11 = [
            'event_id' => 'evt_daily_cap_11',
            'user_id' => $this->user->id,
            'offer_id' => $this->offer->id,
            'reward_coins' => 20,
            'timestamp' => time(),
        ];
        $sig11 = $this->rewardService->computeSignature($this->partner, $payload11);
        $res11 = $this->rewardService->processRewardEvent($this->partner, $payload11, $sig11);

        $this->assertEquals('rejected', $res11['status']);
        // 10 * 20 = exactly 200 coins max
        $this->assertEquals(200, $this->walletService->getBalanceSummary($this->user)['pending_coins']);
    }

    public function test_partner_reversal_creates_compensating_entry(): void
    {
        $payload = [
            'event_id' => 'evt_to_reverse_01',
            'user_id' => $this->user->id,
            'offer_id' => $this->offer->id,
            'reward_coins' => 50,
            'timestamp' => time(),
        ];
        $sig = $this->rewardService->computeSignature($this->partner, $payload);
        $this->rewardService->processRewardEvent($this->partner, $payload, $sig);

        $this->assertEquals(50, $this->walletService->getBalanceSummary($this->user)['pending_coins']);

        // Partner sends reversal
        $revResult = $this->rewardService->reverseRewardEvent($this->partner, 'evt_to_reverse_01', 'Invalid bot traffic detected by advertiser');

        $this->assertEquals('success', $revResult['status']);
        // Pending balance should now be 0 after compensating entry
        $this->assertEquals(0, $this->walletService->getBalanceSummary($this->user)['pending_coins']);
    }
}
