<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use App\Services\OtpService;
use App\Services\WalletService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class AuthController extends Controller
{
    public function __construct(
        protected OtpService $otpService,
        protected WalletService $walletService
    ) {}

    /**
     * Unified Google Authentication (Login or Sign Up).
     */
    public function googleAuth(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'google_id' => 'required|string',
            'name' => 'nullable|string',
            'avatar_url' => 'nullable|string',
            'age_confirmed' => 'nullable|boolean',
            'consent_version' => 'nullable|string',
        ]);

        try {
            $email = strtolower(trim($request->input('email')));
            $googleId = $request->input('google_id');
            $name = $request->input('name') ?? explode('@', $email)[0];
            $avatarUrl = $request->input('avatar_url');
            $ageConfirmed = $request->boolean('age_confirmed', true);
            $consentVersion = $request->input('consent_version', 'v1.0');

            // Find existing user by google_id or email
            $user = User::where('google_id', $googleId)
                ->orWhere('email', $email)
                ->first();

            if (!$user) {
                // New user registration via Google Sign Up
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'google_id' => $googleId,
                    'avatar_url' => $avatarUrl,
                    'status' => 'active',
                ]);
            } else {
                // Existing user login: update Google ID & avatar if missing
                $updates = [];
                if (empty($user->google_id)) {
                    $updates['google_id'] = $googleId;
                }
                if (empty($user->avatar_url) && !empty($avatarUrl)) {
                    $updates['avatar_url'] = $avatarUrl;
                }
                if (!empty($updates)) {
                    $user->update($updates);
                }
            }

            // Ensure profile exists
            UserProfile::updateOrCreate([
                'user_id' => $user->id,
            ], [
                'display_name' => $user->name,
                'country' => 'IN',
                'age_eligibility_status' => $ageConfirmed ? 'verified_18_plus' : 'unverified',
                'consent_version' => $consentVersion,
                'consent_given_at' => Carbon::now(),
            ]);

            // Ensure double-entry ledger wallet accounts exist
            $this->walletService->getOrCreateUserAccounts($user);

            // Generate Sanctum token
            $token = $user->createToken('google-auth')->plainTextToken;

            return response()->json([
                'success' => true,
                'data' => [
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'avatar_url' => $user->avatar_url,
                        'status' => $user->status,
                        'age_eligibility_status' => $ageConfirmed ? 'verified_18_plus' : 'unverified',
                    ],
                ],
                'message' => 'Authenticated successfully with Google',
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function requestOtp(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        try {
            $data = $this->otpService->requestOtp($request->input('phone'));
            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => 'OTP sent successfully',
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
            'code' => 'required|string|size:6',
            'age_confirmed' => 'required|boolean',
            'consent_version' => 'nullable|string',
        ]);

        try {
            $data = $this->otpService->verifyOtp(
                $request->input('phone'),
                $request->input('code'),
                $request->boolean('age_confirmed'),
                $request->input('consent_version', 'v1.0')
            );

            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => 'Authenticated successfully',
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 401);
        }
    }
}
