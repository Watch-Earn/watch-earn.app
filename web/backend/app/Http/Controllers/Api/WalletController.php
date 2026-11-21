<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WalletTransaction;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function __construct(
        protected WalletService $walletService
    ) {}

    public function summary(Request $request): JsonResponse
    {
        $user = $request->user();
        $summary = $this->walletService->getBalanceSummary($user);

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }

    public function transactions(Request $request): JsonResponse
    {
        $user = $request->user();

        $transactions = WalletTransaction::with(['ledgerEntries.account'])
            ->where('user_id', $user->id)
            ->latest('id')
            ->paginate($request->integer('limit', 20));

        return response()->json([
            'success' => true,
            'data' => $transactions,
        ]);
    }
}
