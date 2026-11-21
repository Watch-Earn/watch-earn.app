<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\Withdrawal;
use App\Services\WalletService;
use App\Services\WithdrawalService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use InvalidArgumentException;
use RuntimeException;
use Tests\TestCase;

class WithdrawalWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected WithdrawalService $withdrawalService;
    protected WalletService $walletService;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withdrawalService = app(WithdrawalService::class);
        $this->walletService = app(WalletService::class);

        $this->user = User::create([
            'phone_hash' => hash('sha256', '+919876543210'),
            'phone_last_four' => '3210',
            'status' => 'active',
        ]);

        UserProfile::create([
            'user_id' => $this->user->id,
            'age_eligibility_status' => 'verified_18_plus',
        ]);
    }

    public function test_rejects_withdrawal_below_minimum_threshold(): void
    {
        // Minimum is 10,000 coins (₹10.00). Try 5,000 coins.
        $this->expectException(InvalidArgumentException::class);
        $this->withdrawalService->requestWithdrawal($this->user, 5000, 'rohan@upi', 'idem_fail_1');
    }

    public function test_rejects_withdrawal_with_insufficient_available_balance(): void
    {
        // User has 0 coins. Requesting 10,000 coins.
        $this->expectException(RuntimeException::class);
        $this->withdrawalService->requestWithdrawal($this->user, 10000, 'rohan@upi', 'idem_fail_2');
    }

    public function test_successful_withdrawal_reservation_and_payout_webhook_flow(): void
    {
        // Credit 15,000 available coins
        $this->walletService->creditPendingReward($this->user, 15000, 'ref_payout_1', 'idem_p_1');
        $this->walletService->releasePendingReward($this->user, 15000, 'ref_payout_1');

        // Request 10,000 coins (₹10.00 / 1,000 paise)
        $req = $this->withdrawalService->requestWithdrawal($this->user, 10000, 'rohan@okhdfcbank', 'idem_succ_1');

        $this->assertEquals('success', $req['status']);
        $withdrawal = $req['withdrawal'];
        $this->assertEquals('requested', $withdrawal->status);
        $this->assertEquals(1000, $withdrawal->amount_paise);

        // Balances: available should now be 5,000; reserved should be 10,000
        $summary = $this->walletService->getBalanceSummary($this->user);
        $this->assertEquals(5000, $summary['available_coins']);
        $this->assertEquals(10000, $summary['reserved_coins']);

        // Payout provider sends webhook confirming SUCCESS
        $webhookPayload = [
            'withdrawal_id' => $withdrawal->id,
            'payout_id' => 'payout_bank_ref_7788',
            'status' => 'SUCCESS',
        ];

        $webhookRes = $this->withdrawalService->processPayoutWebhook('razorpayx', $webhookPayload);

        $this->assertEquals('paid', $webhookRes['status']);
        $this->assertEquals('paid', $withdrawal->fresh()->status);

        // Reserved coins must be 0, paid must be 10,000
        $finalSummary = $this->walletService->getBalanceSummary($this->user);
        $this->assertEquals(5000, $finalSummary['available_coins']);
        $this->assertEquals(0, $finalSummary['reserved_coins']);
        $this->assertEquals(10000, $finalSummary['paid_coins']);
    }
}
