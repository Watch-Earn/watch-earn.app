<?php

namespace Database\Seeders;

use App\Models\Offer;
use App\Models\Partner;
use App\Models\User;
use App\Models\UserProfile;
use App\Services\WalletService;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Mock Partner
        $partner = Partner::firstOrCreate([
            'slug' => 'mock-network',
        ], [
            'name' => 'Mock Reward Network (Sandbox)',
            'secret_key' => 'mock_secret_key_12345',
            'status' => 'active',
            'callback_config' => [
                'webhook_url' => 'http://localhost:8000/api/v1/webhooks/partners/mock-network',
                'signature_algo' => 'sha256',
            ],
        ]);

        // 2. Create Sample Approved Offers
        Offer::firstOrCreate([
            'partner_id' => $partner->id,
            'external_offer_id' => 'offer_survey_tech_01',
        ], [
            'title' => 'Mobile App Usage Survey',
            'description' => 'Answer 5 quick multiple choice questions regarding your smartphone usage habits.',
            'reward_coins' => 20,
            'daily_cap' => 10,
            'terms' => 'Must provide honest, unhurried responses. One completion per day per user.',
            'status' => 'active',
        ]);

        Offer::firstOrCreate([
            'partner_id' => $partner->id,
            'external_offer_id' => 'offer_brand_feedback_02',
        ], [
            'title' => 'Consumer Brand Awareness Study',
            'description' => 'Participate in a 3-minute verified consumer research study for Indian e-commerce shoppers.',
            'reward_coins' => 50,
            'daily_cap' => 5,
            'terms' => 'Age 18+ only. Verified completion postback required.',
            'status' => 'active',
        ]);

        Offer::firstOrCreate([
            'partner_id' => $partner->id,
            'external_offer_id' => 'offer_product_opinion_03',
        ], [
            'title' => 'Daily Sponsored Engagement Activity',
            'description' => 'Review sponsored educational infographic and answer a 1-question verification prompt.',
            'reward_coins' => 20,
            'daily_cap' => 10,
            'terms' => 'No automated interaction. Strictly voluntary participation.',
            'status' => 'active',
        ]);

        // 3. Create Default Test User
        $testPhone = '+919876543210';
        $user = User::firstOrCreate([
            'phone_hash' => hash('sha256', $testPhone),
        ], [
            'name' => 'Test User',
            'phone_last_four' => '3210',
            'status' => 'active',
            'is_admin' => false,
        ]);

        UserProfile::firstOrCreate([
            'user_id' => $user->id,
        ], [
            'display_name' => 'Rohan Sharma',
            'country' => 'IN',
            'age_eligibility_status' => 'verified_18_plus',
            'consent_version' => 'v1.0',
            'consent_given_at' => now(),
        ]);

        // Initialize wallet accounts for test user
        $walletService = app(WalletService::class);
        $walletService->getOrCreateUserAccounts($user);

        // 4. Create Admin User
        $adminPhone = '+919999999999';
        $admin = User::firstOrCreate([
            'phone_hash' => hash('sha256', $adminPhone),
        ], [
            'name' => 'Super Administrator',
            'phone_last_four' => '9999',
            'status' => 'active',
            'is_admin' => true,
        ]);
        UserProfile::firstOrCreate([
            'user_id' => $admin->id,
        ], [
            'display_name' => 'Admin User',
            'country' => 'IN',
            'age_eligibility_status' => 'verified_18_plus',
        ]);
    }
}
