<?php

namespace App\Services;

use App\Models\AppNotification;
use App\Models\NotificationPreference;
use App\Models\NotificationRecipient;
use App\Models\PushCampaign;
use App\Models\PushDeliveryLog;
use App\Models\PushDevice;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;

class NotificationService
{
    public function __construct(
        protected FcmService $fcmService
    ) {}

    /**
     * Register or refresh an FCM device token for an authenticated user.
     */
    public function registerDevice(User $user, string $token, string $platform = 'android', ?string $deviceId = null): PushDevice
    {
        return PushDevice::updateOrCreate(
            [
                'user_id' => $user->id,
                'token' => $token,
            ],
            [
                'platform' => $platform,
                'device_id' => $deviceId,
                'active' => true,
                'last_seen_at' => now(),
            ]
        );
    }

    /**
     * Revoke device registration on logout.
     */
    public function revokeDevice(User $user, ?string $token = null): int
    {
        $query = PushDevice::where('user_id', $user->id);
        if ($token) {
            $query->where('token', $token);
        }
        return $query->update(['active' => false]);
    }

    /**
     * Retrieve or create default user notification preferences.
     */
    public function getUserPreferences(User $user): NotificationPreference
    {
        return NotificationPreference::firstOrCreate(
            ['user_id' => $user->id],
            [
                'rewards_enabled' => true,
                'promotional_enabled' => true,
                'timezone' => 'Asia/Kolkata',
            ]
        );
    }

    /**
     * Update user notification preferences.
     */
    public function updateUserPreferences(User $user, array $data): NotificationPreference
    {
        $pref = $this->getUserPreferences($user);
        $pref->update(array_intersect_key($data, array_flip([
            'rewards_enabled',
            'promotional_enabled',
            'quiet_hours_start',
            'quiet_hours_end',
            'timezone',
        ])));
        return $pref;
    }

    /**
     * Send an event-driven notification to a specific user.
     * Creates an inbox record and dispatches push to active devices.
     */
    public function sendToUser(
        User $user,
        string $type,
        string $title,
        string $body,
        ?string $targetScreen = null,
        array $targetData = []
    ): ?AppNotification {
        $pref = $this->getUserPreferences($user);

        // Check preference filters
        if (in_array($type, ['DAILY_REWARD', 'REWARD_EVENT', 'PROMOTIONAL']) && !$pref->promotional_enabled) {
            return null;
        }
        if (in_array($type, ['REWARD_CREDIT', 'WALLET_UPDATE']) && !$pref->rewards_enabled) {
            // Still write to inbox even if push disabled, but don't dispatch FCM
        }

        // 1. Create canonical notification
        $notification = AppNotification::create([
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'target_screen' => $targetScreen,
            'target_data' => $targetData,
        ]);

        // 2. Attach to user's inbox
        NotificationRecipient::create([
            'notification_id' => $notification->id,
            'user_id' => $user->id,
        ]);

        // 3. Dispatch to all active devices
        $devices = $user->pushDevices()->where('active', true)->get();
        foreach ($devices as $device) {
            $payloadData = array_merge($targetData, [
                'type' => $type,
                'screen' => $targetScreen ?? '',
                'notification_id' => (string) $notification->id,
                'channel_id' => $this->getChannelForType($type),
            ]);

            $result = $this->fcmService->sendToDevice($device, $title, $body, $payloadData);

            // Log attempt
            PushDeliveryLog::create([
                'notification_id' => $notification->id,
                'push_device_id' => $device->id,
                'user_id' => $user->id,
                'attempted_at' => now(),
                'status' => $result['status'],
                'error_code' => $result['error_code'],
                'fcm_message_id' => $result['message_id'],
            ]);

            // Deactivate invalid tokens
            if ($result['status'] === 'unregistered') {
                $device->update(['active' => false]);
            }
        }

        return $notification;
    }

    /**
     * Dispatch an approved admin push campaign to target audience.
     */
    public function sendCampaign(PushCampaign $campaign): array
    {
        $campaign->update(['status' => 'sending']);

        $userQuery = User::where('status', 'active');
        if ($campaign->audience_filter === 'active_7d') {
            $userQuery->where('updated_at', '>=', now()->subDays(7));
        }

        $users = $userQuery->get();
        $sentCount = 0;
        $failedCount = 0;

        foreach ($users as $user) {
            $pref = $this->getUserPreferences($user);
            if (!$pref->promotional_enabled) {
                continue;
            }

            // Create notification and inbox item
            $notification = AppNotification::create([
                'type' => 'CAMPAIGN',
                'title' => $campaign->title,
                'body' => $campaign->body,
                'target_screen' => $campaign->target_screen,
                'target_data' => $campaign->target_data,
            ]);

            NotificationRecipient::create([
                'notification_id' => $notification->id,
                'user_id' => $user->id,
            ]);

            $devices = $user->pushDevices()->where('active', true)->get();
            foreach ($devices as $device) {
                $payloadData = array_merge($campaign->target_data ?? [], [
                    'type' => 'CAMPAIGN',
                    'screen' => $campaign->target_screen ?? 'home',
                    'notification_id' => (string) $notification->id,
                    'campaign_id' => (string) $campaign->id,
                    'channel_id' => 'announcements_channel',
                ]);

                $res = $this->fcmService->sendToDevice($device, $campaign->title, $campaign->body, $payloadData);

                PushDeliveryLog::create([
                    'notification_id' => $notification->id,
                    'campaign_id' => $campaign->id,
                    'push_device_id' => $device->id,
                    'user_id' => $user->id,
                    'attempted_at' => now(),
                    'status' => $res['status'],
                    'error_code' => $res['error_code'],
                    'fcm_message_id' => $res['message_id'],
                ]);

                if ($res['success']) {
                    $sentCount++;
                } else {
                    $failedCount++;
                    if ($res['status'] === 'unregistered') {
                        $device->update(['active' => false]);
                    }
                }
            }
        }

        $campaign->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        return [
            'sent' => $sentCount,
            'failed' => $failedCount,
            'campaign_id' => $campaign->id,
        ];
    }

    /**
     * Retrieve paginated inbox for a user.
     */
    public function getUserInbox(User $user, int $perPage = 20): array
    {
        $recipients = NotificationRecipient::with('notification')
            ->where('user_id', $user->id)
            ->latest('id')
            ->paginate($perPage);

        $unreadCount = NotificationRecipient::where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();

        $items = $recipients->getCollection()->map(function ($r) {
            return [
                'id' => $r->id,
                'notification_id' => $r->notification_id,
                'type' => $r->notification?->type ?? 'GENERAL',
                'title' => $r->notification?->title ?? '',
                'body' => $r->notification?->body ?? '',
                'target_screen' => $r->notification?->target_screen,
                'target_data' => $r->notification?->target_data ?? [],
                'read_at' => $r->read_at?->toIso8601String(),
                'is_read' => $r->read_at !== null,
                'created_at' => $r->created_at?->toIso8601String(),
            ];
        });

        return [
            'items' => $items,
            'unread_count' => $unreadCount,
            'pagination' => [
                'current_page' => $recipients->currentPage(),
                'last_page' => $recipients->lastPage(),
                'total' => $recipients->total(),
            ],
        ];
    }

    public function markAsRead(User $user, int $recipientId): bool
    {
        $recipient = NotificationRecipient::where('user_id', $user->id)
            ->where('id', $recipientId)
            ->first();

        if ($recipient) {
            $recipient->update(['read_at' => now()]);
            return true;
        }
        return false;
    }

    public function markAllAsRead(User $user): int
    {
        return NotificationRecipient::where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    protected function getChannelForType(string $type): string
    {
        return match ($type) {
            'WALLET_UPDATE', 'WITHDRAWAL_UPDATE', 'WITHDRAWAL_REQUESTED', 'WITHDRAWAL_PAID', 'WITHDRAWAL_REJECTED' => 'wallet_channel',
            'DAILY_REWARD', 'REWARD_EVENT', 'REWARD_CREDIT' => 'rewards_channel',
            'SECURITY_ALERT' => 'security_channel',
            default => 'announcements_channel',
        };
    }
}
