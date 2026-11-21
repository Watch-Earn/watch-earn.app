<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    public function registerDevice(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string|max:500',
            'platform' => 'nullable|string|in:android,web,ios',
            'device_id' => 'nullable|string|max:128',
        ]);

        $device = $this->notificationService->registerDevice(
            user: $request->user(),
            token: $request->input('token'),
            platform: $request->input('platform', 'android'),
            deviceId: $request->input('device_id')
        );

        return response()->json([
            'success' => true,
            'message' => 'Device token registered successfully',
            'data' => [
                'device_id' => $device->id,
                'platform' => $device->platform,
                'active' => $device->active,
            ],
        ]);
    }

    public function revokeDevice(Request $request): JsonResponse
    {
        $token = $request->input('token');
        $revoked = $this->notificationService->revokeDevice($request->user(), $token);

        return response()->json([
            'success' => true,
            'message' => 'Device registration revoked',
            'data' => ['revoked_count' => $revoked],
        ]);
    }

    public function inbox(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('limit', 20);
        $inbox = $this->notificationService->getUserInbox($request->user(), $perPage);

        return response()->json([
            'success' => true,
            'data' => $inbox,
        ]);
    }

    public function markRead(Request $request, int $id): JsonResponse
    {
        $marked = $this->notificationService->markAsRead($request->user(), $id);

        return response()->json([
            'success' => $marked,
            'message' => $marked ? 'Notification marked as read' : 'Notification not found',
        ]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $count = $this->notificationService->markAllAsRead($request->user());

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read',
            'data' => ['updated_count' => $count],
        ]);
    }

    public function getPreferences(Request $request): JsonResponse
    {
        $pref = $this->notificationService->getUserPreferences($request->user());

        return response()->json([
            'success' => true,
            'data' => [
                'rewards_enabled' => $pref->rewards_enabled,
                'promotional_enabled' => $pref->promotional_enabled,
                'quiet_hours_start' => $pref->quiet_hours_start,
                'quiet_hours_end' => $pref->quiet_hours_end,
                'timezone' => $pref->timezone,
            ],
        ]);
    }

    public function updatePreferences(Request $request): JsonResponse
    {
        $request->validate([
            'rewards_enabled' => 'nullable|boolean',
            'promotional_enabled' => 'nullable|boolean',
            'quiet_hours_start' => 'nullable|string',
            'quiet_hours_end' => 'nullable|string',
            'timezone' => 'nullable|string',
        ]);

        $pref = $this->notificationService->updateUserPreferences(
            $request->user(),
            $request->only(['rewards_enabled', 'promotional_enabled', 'quiet_hours_start', 'quiet_hours_end', 'timezone'])
        );

        return response()->json([
            'success' => true,
            'message' => 'Notification preferences updated',
            'data' => $pref,
        ]);
    }
}
