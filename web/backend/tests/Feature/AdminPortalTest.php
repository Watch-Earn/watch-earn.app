<?php

namespace Tests\Feature;

use App\Models\Partner;
use App\Models\SupportTicket;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\WalletAccount;
use App\Models\Withdrawal;
use App\Services\WalletService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPortalTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected WalletService $walletService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->walletService = app(WalletService::class);

        $this->user = User::create([
            'name' => 'Aditya Verma',
            'phone_hash' => hash('sha256', '+919988776655'),
            'phone_last_four' => '6655',
            'status' => 'active',
        ]);

        UserProfile::create([
            'user_id' => $this->user->id,
            'age_eligibility_status' => 'verified_18_plus',
        ]);
    }

    public function test_admin_overview_and_integrity_check(): void
    {
        $resOverview = $this->getJson('/api/v1/admin/overview');
        $resOverview->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_users' => 1,
                ],
            ]);

        $resIntegrity = $this->getJson('/api/v1/admin/integrity-check');
        $resIntegrity->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'double_entry_balanced' => true,
                    'admob_isolation_policy' => 'STRICT_ENFORCED',
                ],
            ]);
    }

    public function test_admin_user_management_and_status_update(): void
    {
        $resUsers = $this->getJson('/api/v1/admin/users');
        $resUsers->assertStatus(200)
            ->assertJson(['success' => true]);

        $resStatus = $this->postJson("/api/v1/admin/users/{$this->user->id}/status", [
            'status' => 'suspended',
            'reason' => 'Multiple automated emulator detections',
        ]);

        $resStatus->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'User status updated to suspended',
            ]);

        $this->assertEquals('suspended', $this->user->fresh()->status);
    }

    public function test_admin_withdrawal_review_approve_and_reject(): void
    {
        // Credit 15,000 available coins
        $this->walletService->creditPendingReward($this->user, 15000, 'ref_admin_test_1', 'idem_admin_1');
        $this->walletService->releasePendingReward($this->user, 15000, 'ref_admin_test_1');

        $wd = Withdrawal::create([
            'user_id' => $this->user->id,
            'coins' => 10000,
            'amount_paise' => 1000,
            'payout_method' => 'upi',
            'upi_id' => 'aditya@okaxis',
            'status' => 'requested',
            'idempotency_key' => 'wd_admin_test_req_1',
        ]);

        // Review approval
        $resApprove = $this->postJson("/api/v1/admin/withdrawals/{$wd->id}/review", [
            'action' => 'approve',
            'reason' => 'KYC and risk check verified',
        ]);

        $resApprove->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Withdrawal approved for processing',
            ]);
        $this->assertEquals('approved', $wd->fresh()->status);
    }
}
