<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\Withdrawal;
use App\Services\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use InvalidArgumentException;
use Tests\TestCase;

class LedgerAccountingTest extends TestCase
{
    use RefreshDatabase;

    protected WalletService $walletService;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
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

    public function test_exact_coin_to_inr_paise_conversion(): void
    {
        // Credit 10,000 coins (should be ₹10.00 / 1000 paise)
        $this->walletService->creditPendingReward(
            $this->user,
            10000,
            'ref_1',
            'idem_1',
            'Test reward'
        );

        $this->walletService->releasePendingReward(
            $this->user,
            10000,
            'ref_1',
            'Release hold'
        );

        $summary = $this->walletService->getBalanceSummary($this->user);

        $this->assertEquals(10000, $summary['available_coins']);
        $this->assertEquals(0, $summary['pending_coins']);
        $this->assertEquals(0, $summary['reserved_coins']);
        $this->assertEquals(1000, $summary['available_inr_paise']); // Exactly 1,000 paise
        $this->assertEquals('10.00', $summary['available_inr_rupees']);
        $this->assertTrue($summary['is_withdrawal_eligible']);
    }

    public function test_double_entry_balance_and_withdrawal_reservation(): void
    {
        // Credit 15,000 coins
        $this->walletService->creditPendingReward($this->user, 15000, 'ref_2', 'idem_2');
        $this->walletService->releasePendingReward($this->user, 15000, 'ref_2');

        $withdrawal = Withdrawal::create([
            'user_id' => $this->user->id,
            'coins' => 10000,
            'amount_paise' => 1000,
            'upi_id' => 'rohan@upi',
            'status' => 'requested',
            'idempotency_key' => 'wd_idem_100',
        ]);

        // Reserve 10,000 coins
        $this->walletService->reserveForWithdrawal($this->user, 10000, $withdrawal);

        $summary = $this->walletService->getBalanceSummary($this->user);
        $this->assertEquals(5000, $summary['available_coins']);
        $this->assertEquals(10000, $summary['reserved_coins']);

        // Finalize payout
        $this->walletService->finalizePaidWithdrawal($withdrawal, 'payout_gateway_ref_99');

        $afterSummary = $this->walletService->getBalanceSummary($this->user);
        $this->assertEquals(5000, $afterSummary['available_coins']);
        $this->assertEquals(0, $afterSummary['reserved_coins']);
        $this->assertEquals(10000, $afterSummary['paid_coins']);
        $this->assertEquals('paid', $withdrawal->fresh()->status);
    }

    public function test_withdrawal_failure_refunds_reserved_coins(): void
    {
        $this->walletService->creditPendingReward($this->user, 10000, 'ref_3', 'idem_3');
        $this->walletService->releasePendingReward($this->user, 10000, 'ref_3');

        $withdrawal = Withdrawal::create([
            'user_id' => $this->user->id,
            'coins' => 10000,
            'amount_paise' => 1000,
            'upi_id' => 'rohan@upi',
            'status' => 'requested',
            'idempotency_key' => 'wd_idem_101',
        ]);

        $this->walletService->reserveForWithdrawal($this->user, 10000, $withdrawal);
        $this->assertEquals(10000, $this->walletService->getBalanceSummary($this->user)['reserved_coins']);

        // Release on failure
        $this->walletService->releaseReservedWithdrawal($withdrawal, 'Bank server down');

        $summary = $this->walletService->getBalanceSummary($this->user);
        $this->assertEquals(10000, $summary['available_coins']);
        $this->assertEquals(0, $summary['reserved_coins']);
        $this->assertEquals('failed', $withdrawal->fresh()->status);
    }

    public function test_withdrawal_rejects_non_integral_paise_divisibility(): void
    {
        $this->walletService->creditPendingReward($this->user, 20000, 'ref_4', 'idem_4');
        $this->walletService->releasePendingReward($this->user, 20000, 'ref_4');

        $withdrawal = Withdrawal::create([
            'user_id' => $this->user->id,
            'coins' => 10005, // Not divisible by 10
            'amount_paise' => 1000,
            'upi_id' => 'rohan@upi',
            'status' => 'requested',
            'idempotency_key' => 'wd_idem_102',
        ]);

        $this->expectException(InvalidArgumentException::class);
        $this->walletService->reserveForWithdrawal($this->user, 10005, $withdrawal);
    }
}
