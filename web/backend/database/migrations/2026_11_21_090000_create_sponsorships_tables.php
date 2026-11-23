<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Inbound Sponsorship Leads CRM Pipeline
        Schema::create('sponsorship_leads', function (Blueprint $table) {
            $table->id();
            $table->string('brand_name');
            $table->string('contact_person');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('campaign_type')->default('CPI App Installs'); // 'Video Quest', 'CPI App Installs', 'Survey', 'Weekend Headline'
            $table->string('budget_range')->default('₹50,000 - ₹2,00,000');
            $table->unsignedBigInteger('deal_value_inr')->default(100000);
            $table->string('status', 32)->default('New'); // 'New', 'Contacted', 'Proposal Sent', 'Active Partner', 'Closed'
            $table->text('brief')->nullable();
            $table->string('target_audience')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('brand_name');
        });

        // 2. Active Sponsored Campaigns
        Schema::create('sponsored_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('campaign_code')->unique()->nullable();
            $table->string('brand_name');
            $table->string('campaign_type'); // 'Video Quest', 'CPI App Installs', 'Survey', 'Weekend Headline'
            $table->unsignedBigInteger('total_coin_budget');
            $table->unsignedInteger('payout_per_action');
            $table->string('tracking_link')->nullable();
            $table->string('hmac_secret')->nullable();
            $table->string('target_audience')->nullable();
            $table->unsignedBigInteger('completions')->default(0);
            $table->unsignedBigInteger('burned_coins')->default(0);
            $table->string('status', 32)->default('Active'); // 'Active', 'Paused', 'Completed', 'Draft'
            $table->timestamps();

            $table->index('status');
            $table->index('brand_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sponsored_campaigns');
        Schema::dropIfExists('sponsorship_leads');
    }
};
