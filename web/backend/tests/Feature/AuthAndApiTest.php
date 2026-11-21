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

    public function test_google_authentication_registers_and_logs_in_user(): void
    {
        // 1. Google Sign Up (First time user)
        $signUpRes = $this->postJson('/api/v1/auth/google', [
            'email' => 'rahul.sharma@gmail.com',
            'name' => 'Rahul Sharma',
            'google_id' => 'google-oauth-1092837482',
            'avatar_url' => 'https://lh3.googleusercontent.com/a/photo.jpg',
            'age_confirmed' => true,
            'consent_version' => 'v1.0',
        ]);

        $signUpRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Authenticated successfully with Google',
                'data' => [
                    'user' => [
                        'email' => 'rahul.sharma@gmail.com',
                        'name' => 'Rahul Sharma',
                        'status' => 'active',
                    ],
                ],
            ])
            ->assertJsonStructure(['data' => ['token', 'user']]);

        $token = $signUpRes->json('data.token');
        $this->assertNotEmpty($token);

        // Verify user exists in database
        $user = User::where('email', 'rahul.sharma@gmail.com')->first();
        $this->assertNotNull($user);
        $this->assertEquals('google-oauth-1092837482', $user->google_id);

        // 2. Access authenticated /me endpoint
        $meRes = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/me');

        $meRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'email' => 'rahul.sharma@gmail.com',
                    'name' => 'Rahul Sharma',
                ],
            ]);

        // 3. Subsequent Google Sign In (Returning user)
        $signInRes = $this->postJson('/api/v1/auth/google', [
            'email' => 'rahul.sharma@gmail.com',
            'google_id' => 'google-oauth-1092837482',
            'name' => 'Rahul Sharma Updated',
        ]);

        $signInRes->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => [
                        'email' => 'rahul.sharma@gmail.com',
                    ],
                ],
            ]);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $response = $this->getJson('/api/v1/me');
        $response->assertStatus(401);
    }
}
