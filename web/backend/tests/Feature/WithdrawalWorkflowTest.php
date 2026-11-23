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

    public function test_driver_configuration_and_graceful_fallback(): void
    {
        $this->withdrawalService->setDriver('cashfree');
        $this->assertEquals('cashfree', $this->withdrawalService->getDriver());

        $this->withdrawalService->setDriver('razorpayx');
        $this->assertEquals('razorpayx', $this->withdrawalService->getDriver());

        $this->withdrawalService->setDriver('sandbox');
        $this->assertEquals('mock', $this->withdrawalService->getDriver());

        // Invalid driver must gracefully fall back to mock
        $this->withdrawalService->setDriver('unsupported_gateway_xyz');
        $this->assertEquals('mock', $this->withdrawalService->getDriver());
    }

    public function test_dispatch_payout_with_cashfree_graceful_fallback(): void
    {
        $this->walletService->creditPendingReward($this->user, 15000, 'ref_cf_1', 'idem_cf_1');
        $this->walletService->releasePendingReward($this->user, 15000, 'ref_cf_1');

        $req = $this->withdrawalService->requestWithdrawal($this->user, 10000, 'user@okhdfcbank', 'idem_cf_req_1');
        $withdrawal = $req['withdrawal'];

        // Dispatch via cashfree driver without API keys -> must gracefully fall back to mock
        $dispatchRes = $this->withdrawalService->dispatchPayout($withdrawal, 'cashfree');
        $this->assertTrue($dispatchRes['success']);
        $this->assertTrue($dispatchRes['fallback_used']);
        $this->assertEquals('paid', $dispatchRes['status']);
        $this->assertEquals('paid', $withdrawal->fresh()->status);
    }

    public function test_dispatch_payout_with_razorpayx_graceful_fallback(): void
    {
        $this->walletService->creditPendingReward($this->user, 15000, 'ref_rz_1', 'idem_rz_1');
        $this->walletService->releasePendingReward($this->user, 15000, 'ref_rz_1');

        $req = $this->withdrawalService->requestWithdrawal($this->user, 10000, 'user@ybl', 'idem_rz_req_1');
        $withdrawal = $req['withdrawal'];

        // Dispatch via razorpayx driver without API keys -> must gracefully fall back to mock
        $dispatchRes = $this->withdrawalService->dispatchPayout($withdrawal, 'razorpayx');
        $this->assertTrue($dispatchRes['success']);
        $this->assertTrue($dispatchRes['fallback_used']);
        $this->assertEquals('paid', $dispatchRes['status']);
        $this->assertEquals('paid', $withdrawal->fresh()->status);
    }

    public function test_bank_statement_reconciliation_runner(): void
    {
        // Credit and reserve coins
        $this->walletService->creditPendingReward($this->user, 20000, 'ref_recon_1', 'idem_recon_1');
        $this->walletService->releasePendingReward($this->user, 20000, 'ref_recon_1');
        $req = $this->withdrawalService->requestWithdrawal($this->user, 10000, 'recon@okhdfcbank', 'idem_recon_req_1');

        // Balanced reconciliation test
        $recon = $this->withdrawalService->reconcileBankStatement();
        $this->assertTrue($recon['is_balanced']);
        $this->assertEquals('reconciled', $recon['status']);
        $this->assertEquals(10000, $recon['ledger_reserved_coins']);
        $this->assertEquals(1000, $recon['ledger_reserved_paise']);
        $this->assertEquals(0, $recon['discrepancy_paise']);

        // Discrepancy detection test (e.g., bank report has 1,500 paise vs ledger 1,000 paise)
        $reconDiscrepancy = $this->withdrawalService->reconcileBankStatement([
            'bank_balance_paise' => 1500,
        ]);
        $this->assertFalse($reconDiscrepancy['is_balanced']);
        $this->assertEquals('discrepancy_detected', $reconDiscrepancy['status']);
        $this->assertEquals(500, $reconDiscrepancy['discrepancy_paise']);
    }
}
