<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RewardEvent;
use App\Services\WalletService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        protected WalletService $walletService
    ) {}

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->profile;

        $balanceSummary = $this->walletService->getBalanceSummary($user);

        $todayCompletions = RewardEvent::where('user_id', $user->id)
            ->where('status', '!=', 'rejected')
            ->where('received_at', '>=', Carbon::today())
            ->count();

        $dailyLimit = (int) config('rewards.standard_daily_limit', 10);

        return response()->json([
            'success' => true,
            'data' => [
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'phone_masked' => $user->phone_last_four ? ('+91*****' . $user->phone_last_four) : null,
                'status' => $user->status,
                'country' => $profile?->country ?? 'IN',
                'age_eligibility_status' => $profile?->age_eligibility_status ?? 'unverified',
                'daily_completions_today' => $todayCompletions,
                'daily_cap' => $dailyLimit,
                'wallet' => $balanceSummary,
            ],
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'nullable|string|max:100',
        ]);

        $user = $request->user();
        if ($request->has('name')) {
            $user->update(['name' => $request->input('name')]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => [
                'name' => $user->name,
            ],
        ]);
    }

    public function requestDeletion(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->update(['status' => 'suspended']);

        // Invalidate all tokens
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Account deletion requested. Your account has been deactivated and scheduled for full erasure compliant with DPDPA.',
        ]);
    }
}
