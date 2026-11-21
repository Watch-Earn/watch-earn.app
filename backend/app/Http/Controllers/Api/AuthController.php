<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class AuthController extends Controller
{
    public function __construct(
        protected OtpService $otpService
    ) {}

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
