<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Services\RewardVerificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class PartnerWebhookController extends Controller
{
    public function __construct(
        protected RewardVerificationService $rewardVerificationService
    ) {}

    public function handle(Request $request, string $partnerSlug): JsonResponse
    {
        $partner = Partner::where('slug', $partnerSlug)->where('status', 'active')->first();
        if (!$partner) {
            return response()->json([
                'success' => false,
                'message' => "Partner '{$partnerSlug}' not found or inactive",
            ], 404);
        }

        $signature = $request->header('X-Partner-Signature') ?? $request->header('Signature');
        $payload = $request->all();

        try {
            $result = $this->rewardVerificationService->processRewardEvent($partner, $payload, $signature);

            $httpStatus = match ($result['status']) {
                'success' => 200,
                'duplicate' => 200, // Idempotent return
                'rejected' => 429,  // Daily cap reached
                default => 400,
            };

            return response()->json([
                'success' => in_array($result['status'], ['success', 'duplicate']),
                'status' => $result['status'],
                'message' => $result['message'],
                'data' => $result['event'] ?? null,
            ], $httpStatus);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
