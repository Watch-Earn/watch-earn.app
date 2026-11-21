<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthAndApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_otp_request_and_verification_flow(): void
    {
        // 1. Request OTP
        $resReq = $this->postJson('/api/v1/auth/otp/request', [
            'phone' => '+919876543210',
        ]);

        $resReq->assertStatus(200)
            ->assertJson(['success' => true]);

        // 2. Verify OTP with 18+ declaration
        $resVerify = $this->postJson('/api/v1/auth/otp/verify', [
            'phone' => '+919876543210',
            'code' => '123456',
            'age_confirmed' => true,
        ]);

        $resVerify->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure(['data' => ['token', 'user']]);

        $token = $resVerify->json('data.token');

        // 3. Authenticated /me endpoint
        $resMe = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/me');

        $resMe->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'phone_masked' => '+91*****3210',
                    'age_eligibility_status' => 'verified_18_plus',
                ],
            ]);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $response = $this->getJson('/api/v1/me');
        $response->assertStatus(401);
    }
}
