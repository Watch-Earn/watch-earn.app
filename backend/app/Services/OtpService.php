<?php

namespace App\Services;

use App\Models\OtpCode;
use App\Models\User;
use App\Models\UserProfile;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use InvalidArgumentException;
use RuntimeException;

class OtpService
{
    public function __construct(
        protected WalletService $walletService
    ) {}

    /**
     * Normalize Indian phone number to +91XXXXXXXXXX.
     */
    public function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/\D/', '', $phone);
        if (strlen($digits) === 10) {
            return '+91' . $digits;
        }
        if (strlen($digits) === 12 && str_starts_with($digits, '91')) {
            return '+' . $digits;
        }
        throw new InvalidArgumentException("Invalid Indian mobile number. Must be 10 digits.");
    }

    /**
     * Request OTP with rate limit checks.
     */
    public function requestOtp(string $rawPhone): array
    {
        $phone = $this->normalizePhone($rawPhone);

        // Rate limit: max 3 requests per 10 minutes
        $recentRequests = OtpCode::where('phone', $phone)
            ->where('created_at', '>=', Carbon::now()->subMinutes(10))
            ->count();

        if ($recentRequests >= 3) {
            throw new RuntimeException("Too many OTP requests. Please wait 10 minutes.");
        }

        // In mock mode or dev, use deterministic code 123456
        $code = config('rewards.otp_provider_mode') === 'mock' ? '123456' : (string) random_int(100000, 999999);

        OtpCode::create([
            'phone' => $phone,
            'code_hash' => Hash::make($code),
            'expires_at' => Carbon::now()->addMinutes(5),
            'attempts' => 0,
        ]);

        return [
            'phone' => $phone,
            'expires_in' => 300,
            'mode' => config('rewards.otp_provider_mode'),
            // Only expose mock code in local/mock testing
            'mock_code' => config('rewards.otp_provider_mode') === 'mock' ? $code : null,
        ];
    }

    /**
     * Verify OTP and authenticate or register user.
     */
    public function verifyOtp(string $rawPhone, string $code, bool $ageConfirmed = true, string $consentVersion = 'v1.0'): array
    {
        $phone = $this->normalizePhone($rawPhone);

        $otpRecord = OtpCode::where('phone', $phone)
            ->whereNull('verified_at')
            ->where('expires_at', '>', Carbon::now())
            ->latest()
            ->first();

        if (!$otpRecord) {
            throw new InvalidArgumentException("No active OTP request found or OTP has expired.");
        }

        if ($otpRecord->attempts >= 5) {
            throw new RuntimeException("Maximum OTP attempts exceeded.");
        }

        $otpRecord->increment('attempts');

        if (!Hash::check($code, $otpRecord->code_hash)) {
            throw new InvalidArgumentException("Incorrect OTP code.");
        }

        $otpRecord->update(['verified_at' => Carbon::now()]);

        // Find or create User by SHA-256 phone hash
        $phoneHash = hash('sha256', $phone);
        $phoneLastFour = substr($phone, -4);

        $user = User::firstOrCreate([
            'phone_hash' => $phoneHash,
        ], [
            'name' => 'User ' . $phoneLastFour,
            'phone_last_four' => $phoneLastFour,
            'status' => 'active',
        ]);

        // Upsert UserProfile
        UserProfile::updateOrCreate([
            'user_id' => $user->id,
        ], [
            'country' => 'IN',
            'age_eligibility_status' => $ageConfirmed ? 'verified_18_plus' : 'unverified',
            'consent_version' => $consentVersion,
            'consent_given_at' => Carbon::now(),
        ]);

        // Ensure wallet accounts exist
        $this->walletService->getOrCreateUserAccounts($user);

        // Generate Sanctum token
        $token = $user->createToken('mobile-app')->plainTextToken;

        return [
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone_masked' => '+91*****' . $phoneLastFour,
                'status' => $user->status,
                'age_eligibility_status' => $ageConfirmed ? 'verified_18_plus' : 'unverified',
            ],
        ];
    }
}
