<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use App\Services\WithdrawalService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class WithdrawalController extends Controller
{
    public function __construct(
        protected WithdrawalService $withdrawalService
    ) {}

    public function requestWithdrawal(Request $request): JsonResponse
    {
        $request->validate([
            'coins' => 'required|integer|min:10000',
            'upi_id' => 'required|string|max:255',
            'idempotency_key' => 'required|string|max:128',
        ]);

        try {
            $result = $this->withdrawalService->requestWithdrawal(
                $request->user(),
                $request->integer('coins'),
                $request->input('upi_id'),
                $request->input('idempotency_key')
            );

            return response()->json([
                'success' => true,
                'data' => $result['withdrawal'],
                'message' => $result['message'],
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function index(Request $request): JsonResponse
    {
        $withdrawals = Withdrawal::where('user_id', $request->user()->id)
            ->latest('id')
            ->paginate($request->integer('limit', 20));

        return response()->json([
            'success' => true,
            'data' => $withdrawals,
        ]);
    }
}
