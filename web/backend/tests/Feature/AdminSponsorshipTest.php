<?php

namespace Tests\Feature;

use App\Models\AdminAuditLog;
use App\Models\SponsoredCampaign;
use App\Models\SponsorshipLead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminSponsorshipTest extends TestCase
{
    use RefreshDatabase;

    public function test_sponsorships_index_returns_seeded_data_and_kpis(): void
    {
        $response = $this->getJson('/api/v1/admin/sponsorships');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'kpi' => [
                        'total_leads',
                        'active_sponsors',
                        'pipeline_deal_value_inr',
                        'conversion_rate',
                    ],
                    'leads',
                    'campaigns',
                ],
            ]);

        $this->assertDatabaseHas('sponsorship_leads', [
            'brand_name' => 'Swiggy Instamart',
        ]);
        $this->assertDatabaseHas('sponsorship_leads', [
            'brand_name' => 'Zerodha Kite',
        ]);
        $this->assertDatabaseHas('sponsorship_leads', [
            'brand_name' => 'Dream11 Sports Tech',
        ]);
        $this->assertDatabaseHas('sponsored_campaigns', [
            'campaign_code' => 'CAMP-501',
        ]);
    }

    public function test_can_retrieve_single_lead_brief(): void
    {
        $this->getJson('/api/v1/admin/sponsorships'); // Seeds data

        $lead = SponsorshipLead::first();
        $response = $this->getJson("/api/v1/admin/sponsorships/leads/{$lead->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $lead->id,
                    'brand_name' => $lead->brand_name,
                ],
            ]);
    }

    public function test_can_update_lead_status_and_notes_with_audit_log(): void
    {
        $this->getJson('/api/v1/admin/sponsorships'); // Seeds data

        $lead = SponsorshipLead::where('status', 'New')->first();
        $this->assertNotNull($lead);

        $response = $this->postJson("/api/v1/admin/sponsorships/leads/{$lead->id}/status", [
            'status' => 'Contacted',
            'notes' => 'Discussed initial CPA model and schedule call with Ad Ops team.',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $lead->id,
                    'status' => 'Contacted',
                    'notes' => 'Discussed initial CPA model and schedule call with Ad Ops team.',
                ],
            ]);

        $this->assertDatabaseHas('sponsorship_leads', [
            'id' => $lead->id,
            'status' => 'Contacted',
        ]);

        $this->assertDatabaseHas('admin_audit_logs', [
            'action' => 'sponsorship_lead_status_updated',
            'target_id' => (string) $lead->id,
        ]);
    }

    public function test_can_create_sponsored_campaign(): void
    {
        $payload = [
            'brand_name' => 'Tata Neu Rewards',
            'campaign_type' => 'CPI App Installs',
            'total_coin_budget' => 2000000,
            'payout_per_action' => 80,
            'tracking_link' => 'https://tataneu.app/cpi/we',
            'target_audience' => 'Tier 1 & Tier 2 Smartphone Shoppers',
        ];

        $response = $this->postJson('/api/v1/admin/sponsorships/campaigns', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'brand_name' => 'Tata Neu Rewards',
                    'campaign_type' => 'CPI App Installs',
                    'total_coin_budget' => 2000000,
                    'payout_per_action' => 80,
                    'status' => 'Active',
                ],
            ]);

        $this->assertDatabaseHas('sponsored_campaigns', [
            'brand_name' => 'Tata Neu Rewards',
            'status' => 'Active',
        ]);

        $this->assertDatabaseHas('admin_audit_logs', [
            'action' => 'sponsored_campaign_created',
        ]);
    }

    public function test_can_update_campaign_status(): void
    {
        $this->getJson('/api/v1/admin/sponsorships');

        $campaign = SponsoredCampaign::first();

        $response = $this->postJson("/api/v1/admin/sponsorships/campaigns/{$campaign->id}/status", [
            'status' => 'Paused',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $campaign->id,
                    'status' => 'Paused',
                ],
            ]);

        $this->assertDatabaseHas('sponsored_campaigns', [
            'id' => $campaign->id,
            'status' => 'Paused',
        ]);
    }
}
