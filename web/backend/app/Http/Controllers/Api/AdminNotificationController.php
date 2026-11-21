<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\PushCampaign;
use App\Models\PushDeliveryLog;
use App\Models\PushDevice;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminNotificationController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    public function stats(): JsonResponse
    {
        $totalDevices = PushDevice::where('active', true)->count();
        $totalSent = PushDeliveryLog::where('status', 'accepted')->count();
        $totalFailed = PushDeliveryLog::where('status', 'failed')->count();
        $campaignsCount = PushCampaign::count();

        return response()->json([
            'success' => true,
            'data' => [
                'active_devices' => $totalDevices,
                'total_sent' => $totalSent,
                'total_failed' => $totalFailed,
                'delivery_rate' => $totalSent + $totalFailed > 0 ? round(($totalSent / ($totalSent + $totalFailed)) * 100, 1) : 100.0,
                'campaigns_count' => $campaignsCount,
            ],
        ]);
    }

    public function sendCampaign(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:120',
            'body' => 'required|string|max:500',
            'audience_filter' => 'nullable|string|in:all,active_7d,has_balance',
            'target_screen' => 'nullable|string',
            'target_data' => 'nullable|array',
        ]);

        $adminId = (string) ($request->user()?->id ?? 'admin_console');

        $campaign = PushCampaign::create([
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'audience_filter' => $request->input('audience_filter', 'all'),
            'target_screen' => $request->input('target_screen', 'rewards'),
            'target_data' => $request->input('target_data', []),
            'status' => 'draft',
            'created_by' => $adminId,
        ]);

        $result = $this->notificationService->sendCampaign($campaign);

        AdminAuditLog::create([
            'admin_id' => $adminId,
            'action' => 'push_campaign_sent',
            'target_type' => 'push_campaign',
            'target_id' => (string) $campaign->id,
            'reason' => "Dispatched to {$result['sent']} devices: {$campaign->title}",
        ]);

        return response()->json([
            'success' => true,
            'message' => "Campaign dispatched successfully ({$result['sent']} sent, {$result['failed']} failed)",
            'data' => $campaign->fresh(),
        ]);
    }

    public function scheduleCampaign(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:120',
            'body' => 'required|string|max:500',
            'scheduled_at' => 'required|date',
            'audience_filter' => 'nullable|string',
            'target_screen' => 'nullable|string',
        ]);

        $adminId = (string) ($request->user()?->id ?? 'admin_console');

        $campaign = PushCampaign::create([
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'audience_filter' => $request->input('audience_filter', 'all'),
            'target_screen' => $request->input('target_screen', 'home'),
            'scheduled_at' => $request->input('scheduled_at'),
            'status' => 'scheduled',
            'created_by' => $adminId,
        ]);

        AdminAuditLog::create([
            'admin_id' => $adminId,
            'action' => 'push_campaign_scheduled',
            'target_type' => 'push_campaign',
            'target_id' => (string) $campaign->id,
            'reason' => "Scheduled for {$campaign->scheduled_at->toIso8601String()}: {$campaign->title}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Campaign scheduled successfully',
            'data' => $campaign,
        ]);
    }

    public function campaigns(Request $request): JsonResponse
    {
        $campaigns = PushCampaign::latest('id')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $campaigns,
        ]);
    }

    public function campaignDetail(int $id): JsonResponse
    {
        $campaign = PushCampaign::with(['deliveryLogs' => function ($q) {
            $q->latest('id')->take(50);
        }])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $campaign,
        ]);
    }

    public function cancelCampaign(Request $request, int $id): JsonResponse
    {
        $campaign = PushCampaign::findOrFail($id);
        if ($campaign->status === 'sent') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel an already dispatched campaign',
            ], 422);
        }

        $campaign->update(['status' => 'cancelled']);

        AdminAuditLog::create([
            'admin_id' => (string) ($request->user()?->id ?? 'admin_console'),
            'action' => 'push_campaign_cancelled',
            'target_type' => 'push_campaign',
            'target_id' => (string) $campaign->id,
            'reason' => 'Campaign cancelled before dispatch',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Campaign cancelled',
            'data' => $campaign,
        ]);
    }
}
