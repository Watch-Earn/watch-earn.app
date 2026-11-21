<?php

namespace Tests\Feature;

use App\Models\PushCampaign;
use App\Models\PushDevice;
use App\Models\User;
use App\Models\UserProfile;
use App\Services\NotificationService;
use App\Services\WalletService;
use App\Services\WithdrawalService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationAndFcmTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected string $token;
    protected NotificationService $notificationService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->notificationService = app(NotificationService::class);

        $this->user = User::create([
            'name' => 'Sunil Verma',
            'phone_hash' => hash('sha256', '+919876500000'),
            'phone_last_four' => '0000',
            'status' => 'active',
        ]);

        UserProfile::create([
            'user_id' => $this->user->id,
            'age_eligibility_status' => 'verified_18_plus',
        ]);

        $this->token = $this->user->createToken('test_token')->plainTextToken;
    }

    public function test_user_device_token_registration_and_revocation(): void
    {
        // 1. Register FCM token
        $response = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->postJson('/api/v1/push/devices', [
                'token' => 'fcm_test_token_abc_123',
                'platform' => 'android',
                'device_id' => 'device_hw_9981',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Device token registered successfully',
                'data' => [
                    'platform' => 'android',
                    'active' => true,
                ],
            ]);

        $this->assertDatabaseHas('push_devices', [
            'user_id' => $this->user->id,
            'token' => 'fcm_test_token_abc_123',
            'active' => 1,
        ]);

        // 2. Revoke device token on logout
        $revokeRes = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->deleteJson('/api/v1/push/devices', [
                'token' => 'fcm_test_token_abc_123',
            ]);

        $revokeRes->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('push_devices', [
            'user_id' => $this->user->id,
            'token' => 'fcm_test_token_abc_123',
            'active' => 0,
        ]);
    }

    public function test_notification_inbox_and_mark_read_flows(): void
    {
        // Send a notification via service
        $notification = $this->notificationService->sendToUser(
            $this->user,
            'WALLET_UPDATE',
            'Welcome Bonus',
            'You received 500 bonus coins!',
            'wallet',
            ['bonus_type' => 'signup']
        );

        $this->assertNotNull($notification);

        // 1. Fetch inbox
        $inboxRes = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/v1/notifications');

        $inboxRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'unread_count' => 1,
                ],
            ]);

        $recipientId = $inboxRes->json('data.items.0.id');
        $this->assertNotNull($recipientId);

        // 2. Mark single as read
        $readRes = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->patchJson("/api/v1/notifications/{$recipientId}/read");

        $readRes->assertStatus(200)
            ->assertJson(['success' => true]);

        // Unread count should now be 0
        $inboxRes2 = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/v1/notifications');
        $this->assertEquals(0, $inboxRes2->json('data.unread_count'));
    }

    public function test_user_preferences_get_and_update(): void
    {
        $getRes = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->getJson('/api/v1/notifications/preferences');

        $getRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'rewards_enabled' => true,
                    'promotional_enabled' => true,
                ],
            ]);

        $putRes = $this->withHeader('Authorization', "Bearer {$this->token}")
            ->putJson('/api/v1/notifications/preferences', [
                'promotional_enabled' => false,
                'quiet_hours_start' => '23:00',
                'quiet_hours_end' => '07:00',
            ]);

        $putRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'promotional_enabled' => false,
                ],
            ]);
    }

    public function test_withdrawal_workflow_triggers_notification(): void
    {
        $walletService = app(WalletService::class);
        $withdrawalService = app(WithdrawalService::class);

        // Credit coins
        $walletService->creditPendingReward($this->user, 15000, 'ref_test_fcm_1', 'idem_fcm_1');
        $walletService->releasePendingReward($this->user, 15000, 'ref_test_fcm_1');

        // Request withdrawal
        $withdrawalService->requestWithdrawal($this->user, 10000, 'sunil@okhdfcbank', 'idem_wd_fcm_1');

        // Verify notification inbox received the withdrawal notification
        $inbox = $this->notificationService->getUserInbox($this->user);
        $this->assertGreaterThanOrEqual(1, count($inbox['items']));
        $this->assertEquals('WITHDRAWAL_REQUESTED', $inbox['items'][0]['type']);
    }

    public function test_admin_push_campaign_dispatch(): void
    {
        // Register active device
        $this->notificationService->registerDevice($this->user, 'fcm_admin_campaign_token', 'android');

        $adminRes = $this->postJson('/api/v1/admin/push/send', [
            'title' => 'Double Rewards Weekend!',
            'body' => 'Earn 2x coins on all partner tasks today only.',
            'audience_filter' => 'all',
            'target_screen' => 'rewards',
        ]);

        $adminRes->assertStatus(200)
            ->assertJson(['success' => true]);

        $campaign = PushCampaign::latest('id')->first();
        $this->assertNotNull($campaign);
        $this->assertEquals('sent', $campaign->status);
    }
}
