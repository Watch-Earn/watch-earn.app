<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\SponsoredCampaign;
use App\Models\SponsorshipLead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminSponsorshipController extends Controller
{
    /**
     * Display KPI overview, inbound leads pipeline, and active sponsored campaigns.
     */
    public function index(Request $request): JsonResponse
    {
        $this->ensureSeedDataExists();

        $leadsQuery = SponsorshipLead::query()->orderBy('created_at', 'desc');
        if ($request->filled('status') && $request->input('status') !== 'all') {
            $leadsQuery->where('status', $request->input('status'));
        }
        if ($request->filled('search')) {
            $term = '%' . $request->input('search') . '%';
            $leadsQuery->where(function ($q) use ($term) {
                $q->where('brand_name', 'like', $term)
                  ->orWhere('email', 'like', $term)
                  ->orWhere('contact_person', 'like', $term);
            });
        }
        $leads = $leadsQuery->get();

        $campaignsQuery = SponsoredCampaign::query()->orderBy('created_at', 'desc');
        if ($request->filled('campaign_status') && $request->input('campaign_status') !== 'all') {
            $campaignsQuery->where('status', $request->input('campaign_status'));
        }
        $campaigns = $campaignsQuery->get();

        // Calculate KPI Metrics
        $allLeads = SponsorshipLead::all();
        $totalLeads = $allLeads->count();
        $activeSponsorsCount = $allLeads->where('status', 'Active Partner')->count() +
            SponsoredCampaign::where('status', 'Active')->distinct('brand_name')->count('brand_name');
        // Deduplicate count if brand is in both
        $activeSponsorBrands = array_unique(array_merge(
            $allLeads->where('status', 'Active Partner')->pluck('brand_name')->toArray(),
            SponsoredCampaign::where('status', 'Active')->pluck('brand_name')->toArray()
        ));
        $activeSponsors = count($activeSponsorBrands);

        $pipelineDealValue = $allLeads->whereIn('status', ['New', 'Contacted', 'Proposal Sent'])->sum('deal_value_inr');
        $convertedCount = $allLeads->where('status', 'Active Partner')->count();
        $conversionRate = $totalLeads > 0 ? round(($convertedCount / $totalLeads) * 100, 1) : 0.0;

        return response()->json([
            'success' => true,
            'data' => [
                'kpi' => [
                    'total_leads' => $totalLeads,
                    'active_sponsors' => $activeSponsors,
                    'pipeline_deal_value_inr' => number_format($pipelineDealValue, 2),
                    'pipeline_deal_value_raw' => $pipelineDealValue,
                    'conversion_rate' => $conversionRate . '%',
                    'conversion_rate_raw' => $conversionRate,
                ],
                'leads' => $leads,
                'campaigns' => $campaigns,
            ],
        ]);
    }

    /**
     * Retrieve single lead details and website brief.
     */
    public function showLead(int $id): JsonResponse
    {
        $lead = SponsorshipLead::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $lead,
        ]);
    }

    /**
     * Update lead pipeline status and internal notes.
     */
    public function updateLeadStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|string|in:New,Contacted,Proposal Sent,Active Partner,Closed',
            'notes' => 'nullable|string|max:2000',
        ]);

        $lead = SponsorshipLead::findOrFail($id);
        $oldStatus = $lead->status;
        $newStatus = $request->input('status');

        $lead->status = $newStatus;
        if ($request->has('notes')) {
            $lead->notes = $request->input('notes');
        }
        $lead->save();

        AdminAuditLog::create([
            'admin_id' => (string) ($request->user()?->id ?? 'admin_console'),
            'action' => 'sponsorship_lead_status_updated',
            'target_type' => 'sponsorship_lead',
            'target_id' => (string) $lead->id,
            'reason' => 'Advertiser CRM pipeline progression',
            'details' => [
                'brand_name' => $lead->brand_name,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'notes' => $lead->notes,
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => "Lead #{$lead->id} ({$lead->brand_name}) status updated to {$newStatus}.",
            'data' => $lead,
        ]);
    }

    /**
     * Launch / register a sponsored campaign.
     */
    public function createCampaign(Request $request): JsonResponse
    {
        $request->validate([
            'brand_name' => 'required|string|max:100',
            'campaign_type' => 'required|string|in:Video Quest,CPI App Installs,Survey,Weekend Headline',
            'total_coin_budget' => 'required|integer|min:1000',
            'payout_per_action' => 'required|integer|min:1',
            'tracking_link' => 'nullable|string|max:500',
            'hmac_secret' => 'nullable|string|max:120',
            'target_audience' => 'nullable|string|max:150',
        ]);

        $hmacSecret = $request->filled('hmac_secret')
            ? $request->input('hmac_secret')
            : 'sec_' . strtolower(Str::slug($request->input('brand_name'), '_')) . '_' . bin2hex(random_bytes(6));

        $campaign = SponsoredCampaign::create([
            'campaign_code' => 'CAMP-' . (100 + SponsoredCampaign::count() + 1),
            'brand_name' => $request->input('brand_name'),
            'campaign_type' => $request->input('campaign_type'),
            'total_coin_budget' => $request->input('total_coin_budget'),
            'payout_per_action' => $request->input('payout_per_action'),
            'tracking_link' => $request->input('tracking_link'),
            'hmac_secret' => $hmacSecret,
            'target_audience' => $request->input('target_audience', 'PAN India 18+'),
            'completions' => 0,
            'burned_coins' => 0,
            'status' => 'Active',
        ]);

        AdminAuditLog::create([
            'admin_id' => (string) ($request->user()?->id ?? 'admin_console'),
            'action' => 'sponsored_campaign_created',
            'target_type' => 'sponsored_campaign',
            'target_id' => (string) $campaign->id,
            'reason' => 'New direct brand sponsorship launched',
            'details' => [
                'campaign_code' => $campaign->campaign_code,
                'brand_name' => $campaign->brand_name,
                'type' => $campaign->campaign_type,
                'budget_coins' => $campaign->total_coin_budget,
                'payout_per_action' => $campaign->payout_per_action,
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => "Campaign {$campaign->campaign_code} for {$campaign->brand_name} launched successfully.",
            'data' => $campaign,
        ], 201);
    }

    /**
     * Update campaign status (e.g. Pause, Resume, Complete).
     */
    public function updateCampaignStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|string|in:Active,Paused,Completed,Draft',
        ]);

        $campaign = SponsoredCampaign::findOrFail($id);
        $oldStatus = $campaign->status;
        $campaign->status = $request->input('status');
        $campaign->save();

        AdminAuditLog::create([
            'admin_id' => (string) ($request->user()?->id ?? 'admin_console'),
            'action' => 'sponsored_campaign_status_updated',
            'target_type' => 'sponsored_campaign',
            'target_id' => (string) $campaign->id,
            'reason' => 'Campaign status toggled by operator',
            'details' => [
                'campaign_code' => $campaign->campaign_code,
                'brand_name' => $campaign->brand_name,
                'old_status' => $oldStatus,
                'new_status' => $campaign->status,
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => "Campaign {$campaign->campaign_code} is now {$campaign->status}.",
            'data' => $campaign,
        ]);
    }

    /**
     * Seeds realistic Indian brand sponsorship inquiries and active campaigns if tables are empty.
     */
    protected function ensureSeedDataExists(): void
    {
        if (SponsorshipLead::count() === 0) {
            SponsorshipLead::insert([
                [
                    'brand_name' => 'Swiggy Instamart',
                    'contact_person' => 'Aman Gupta (Growth Marketing Lead)',
                    'email' => 'aman.gupta@swiggy.in',
                    'phone' => '+91 98201 14522',
                    'campaign_type' => 'CPI App Installs',
                    'budget_range' => '₹2,00,000 - ₹5,00,000',
                    'deal_value_inr' => 350000,
                    'status' => 'Proposal Sent',
                    'brief' => 'Drive 15,000+ verified first-time orders and app installs in Bengaluru, Mumbai & Delhi-NCR for Instamart 10-minute grocery service during the upcoming festive season.',
                    'target_audience' => 'Tier 1 Metro smartphone users (18-35), Android 11+',
                    'notes' => 'Sent customized CPA proposal at ₹22 per validated first checkout. Awaiting sign-off from VP Marketing.',
                    'created_at' => now()->subDays(1),
                    'updated_at' => now()->subDays(1),
                ],
                [
                    'brand_name' => 'Zerodha Kite',
                    'contact_person' => 'Priya Sundaram (Head of Digital Acquisition)',
                    'email' => 'priya.sundaram@zerodha.com',
                    'phone' => '+91 97410 88319',
                    'campaign_type' => 'Video Quest',
                    'budget_range' => '₹5,00,000 - ₹10,00,000',
                    'deal_value_inr' => 750000,
                    'status' => 'Active Partner',
                    'brief' => 'Financial literacy video quest campaign: users watch a 60-second interactive explainer on index funds & ETF investing, then answer a 2-question comprehension quiz.',
                    'target_audience' => 'PAN India, 21-40 age group, college students & salaried individuals',
                    'notes' => 'Pilot contract signed. 50,000 video quests authorized with HMAC postback callback.',
                    'created_at' => now()->subDays(3),
                    'updated_at' => now()->subDays(3),
                ],
                [
                    'brand_name' => 'Dream11 Sports Tech',
                    'contact_person' => 'Vikramaditya Roy (Brand Partnerships Director)',
                    'email' => 'vikram.roy@dream11.com',
                    'phone' => '+91 99302 77410',
                    'campaign_type' => 'Weekend Headline',
                    'budget_range' => '₹10,00,000+',
                    'deal_value_inr' => 1200000,
                    'status' => 'Contacted',
                    'brief' => 'Exclusive weekend headline takeover & IPL T20 fantasy team builder quest for upcoming India tour matches.',
                    'target_audience' => 'Sports enthusiasts, 18+ verified PAN card users',
                    'notes' => 'Completed introductory intro call. Demo of fraud-velocity protection presented. Drafting customized SLA.',
                    'created_at' => now()->subHours(8),
                    'updated_at' => now()->subHours(8),
                ],
                [
                    'brand_name' => 'Paytm UPI & Soundbox',
                    'contact_person' => 'Sneha Kulkarni (Merchant & Consumer Acquisition)',
                    'email' => 'sneha.kulkarni@paytm.com',
                    'phone' => '+91 98112 55091',
                    'campaign_type' => 'Survey',
                    'budget_range' => '₹50,000 - ₹2,00,000',
                    'deal_value_inr' => 180000,
                    'status' => 'New',
                    'brief' => 'Merchant QR & soundbox perception study: 8-question verified consumer survey regarding payment methods and cash vs UPI preference at local kirana stores.',
                    'target_audience' => 'Tier 2 & Tier 3 shoppers across Maharashtra, Gujarat, Uttar Pradesh',
                    'notes' => 'New inbound brief received from website advertising form. Initial email auto-responder dispatched.',
                    'created_at' => now()->subHours(2),
                    'updated_at' => now()->subHours(2),
                ],
                [
                    'brand_name' => 'Spinny Assured Cars',
                    'contact_person' => 'Karan Malhotra (Growth & Alliances)',
                    'email' => 'karan.m@spinny.com',
                    'phone' => '+91 98711 33209',
                    'campaign_type' => 'Survey',
                    'budget_range' => '₹50,000 - ₹2,00,000',
                    'deal_value_inr' => 140000,
                    'status' => 'Closed',
                    'brief' => 'Used car valuation survey and test drive lead generation study.',
                    'target_audience' => 'Car owners and prospective buyers aged 25-45',
                    'notes' => 'Completed 6-week survey campaign successfully. Reached 100% quota of 4,000 verified responses.',
                    'created_at' => now()->subDays(16),
                    'updated_at' => now()->subDays(16),
                ],
            ]);
        }

        if (SponsoredCampaign::count() === 0) {
            SponsoredCampaign::insert([
                [
                    'campaign_code' => 'CAMP-501',
                    'brand_name' => 'Zerodha Kite',
                    'campaign_type' => 'Video Quest',
                    'total_coin_budget' => 1500000,
                    'payout_per_action' => 50,
                    'tracking_link' => 'https://kite.zerodha.com/quest/v1?ref=watchearn_in',
                    'hmac_secret' => 'sec_zh_k98f2190a4c2',
                    'target_audience' => 'All Users (18+ KYC)',
                    'completions' => 20520,
                    'burned_coins' => 1026000,
                    'status' => 'Active',
                    'created_at' => now()->subDays(2),
                    'updated_at' => now()->subDays(2),
                ],
                [
                    'campaign_code' => 'CAMP-502',
                    'brand_name' => 'Swiggy Instamart',
                    'campaign_type' => 'CPI App Installs',
                    'total_coin_budget' => 2500000,
                    'payout_per_action' => 120,
                    'tracking_link' => 'https://swiggy.onelink.me/8821/watchearn',
                    'hmac_secret' => 'sec_sw_77e029ba3390',
                    'target_audience' => 'Tier 1 Metro Cities (Android)',
                    'completions' => 8770,
                    'burned_coins' => 1052500,
                    'status' => 'Active',
                    'created_at' => now()->subDays(1),
                    'updated_at' => now()->subDays(1),
                ],
                [
                    'campaign_code' => 'CAMP-503',
                    'brand_name' => 'Dream11 T20 Blitz',
                    'campaign_type' => 'Weekend Headline',
                    'total_coin_budget' => 5000000,
                    'payout_per_action' => 200,
                    'tracking_link' => 'https://dream11.onelink.me/d11/weekend',
                    'hmac_secret' => 'sec_d11_99fba223e110',
                    'target_audience' => 'Sports & Gaming Cohorts',
                    'completions' => 3000,
                    'burned_coins' => 600000,
                    'status' => 'Paused',
                    'created_at' => now()->subHours(6),
                    'updated_at' => now()->subHours(6),
                ],
                [
                    'campaign_code' => 'CAMP-504',
                    'brand_name' => 'Spinny Assured Survey',
                    'campaign_type' => 'Survey',
                    'total_coin_budget' => 800000,
                    'payout_per_action' => 40,
                    'tracking_link' => 'https://spinny.com/research/2026',
                    'hmac_secret' => 'sec_sp_10aa55ec8891',
                    'target_audience' => 'Vehicle Owners (25-45)',
                    'completions' => 20000,
                    'burned_coins' => 800000,
                    'status' => 'Completed',
                    'created_at' => now()->subDays(15),
                    'updated_at' => now()->subDays(15),
                ],
            ]);
        }
    }
}
