<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WithdrawalService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class PayoutWebhookController extends Controller
{
    public function __construct(
        protected WithdrawalService $withdrawalService
    ) {}

    public function handle(Request $request, string $provider): JsonResponse
    {
        $signature = $request->header('X-Payout-Signature');
        $payload = $request->all();

        try {
            $result = $this->withdrawalService->processPayoutWebhook($provider, $payload, $signature);

            return response()->json([
                'success' => true,
                'status' => $result['status'],
                'message' => $result['message'],
                'data' => $result['withdrawal'],
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
