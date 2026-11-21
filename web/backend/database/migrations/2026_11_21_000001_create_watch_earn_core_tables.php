<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('display_name')->nullable();
            $table->string('country', 2)->default('IN');
            $table->string('age_eligibility_status', 32)->default('unverified'); // unverified, verified_18_plus, failed
            $table->string('consent_version')->default('v1.0');
            $table->timestamp('consent_given_at')->nullable();
            $table->timestamps();
        });

        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('device_fingerprint')->index();
            $table->string('platform', 32)->default('android');
            $table->string('integrity_status', 32)->default('passed'); // passed, flagged, failed
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamps();
        });

        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('secret_key');
            $table->string('status', 32)->default('active'); // active, paused
            $table->text('callback_config')->nullable();
            $table->timestamps();
        });

        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->constrained()->cascadeOnDelete();
            $table->string('external_offer_id')->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedInteger('reward_coins')->default(20);
            $table->unsignedInteger('daily_cap')->default(10);
            $table->text('terms')->nullable();
            $table->string('status', 32)->default('active'); // active, paused, expired
            $table->timestamps();
        });

        Schema::create('reward_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->constrained()->cascadeOnDelete();
            $table->string('external_event_id');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('offer_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('reward_coins');
            $table->string('status', 32)->default('pending'); // pending, settled, reversed, rejected
            $table->string('signature')->nullable();
            $table->text('raw_payload')->nullable();
            $table->timestamp('received_at')->useCurrent();
            $table->timestamps();

            $table->unique(['partner_id', 'external_event_id']);
        });

        Schema::create('wallet_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('account_type', 32); // available, pending, reserved, paid, system_liability
            $table->string('currency', 10)->default('COIN');
            $table->timestamps();

            $table->index(['user_id', 'account_type']);
        });

        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('kind', 32); // reward_pending, reward_release, withdrawal_reserve, withdrawal_payout, withdrawal_refund, reward_reversal
            $table->string('reference_type')->nullable();
            $table->string('reference_id')->nullable();
            $table->string('idempotency_key')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('ledger_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained('wallet_transactions')->cascadeOnDelete();
            $table->foreignId('account_id')->constrained('wallet_accounts')->cascadeOnDelete();
            $table->string('direction', 10); // debit, credit
            $table->unsignedInteger('coin_amount'); // non-negative integer
            $table->timestamps();
        });

        Schema::create('withdrawals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('coins'); // min 10,000, divisible by 10
            $table->unsignedInteger('amount_paise'); // coins / 10
            $table->string('upi_id');
            $table->string('status', 32)->default('requested'); // requested, under_review, approved, processing, paid, failed, cancelled
            $table->string('idempotency_key')->unique();
            $table->string('payout_id')->nullable()->index();
            $table->text('failure_reason')->nullable();
            $table->timestamps();
        });

        Schema::create('payout_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('provider_token_ref')->nullable();
            $table->string('upi_id');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });

        Schema::create('fraud_signals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('event_id')->nullable();
            $table->string('signal_type', 64); // duplicate_ip, velocity_exceeded, integrity_failed, postback_replay
            $table->string('severity', 16)->default('medium'); // low, medium, high, critical
            $table->text('details')->nullable();
            $table->timestamps();
        });

        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('category', 32); // missing_reward, withdrawal_issue, account_query, other
            $table->string('subject');
            $table->text('message');
            $table->string('status', 32)->default('open'); // open, in_progress, resolved, closed
            $table->timestamps();
        });

        Schema::create('admin_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('admin_id');
            $table->string('action');
            $table->string('target_type')->nullable();
            $table->string('target_id')->nullable();
            $table->text('reason');
            $table->text('details')->nullable();
            $table->timestamps();
        });

        Schema::create('otp_codes', function (Blueprint $table) {
            $table->id();
            $table->string('phone')->index();
            $table->string('code_hash');
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamp('expires_at');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('otp_codes');
        Schema::dropIfExists('admin_audit_logs');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('fraud_signals');
        Schema::dropIfExists('payout_methods');
        Schema::dropIfExists('withdrawals');
        Schema::dropIfExists('ledger_entries');
        Schema::dropIfExists('wallet_transactions');
        Schema::dropIfExists('wallet_accounts');
        Schema::dropIfExists('reward_events');
        Schema::dropIfExists('offers');
        Schema::dropIfExists('partners');
        Schema::dropIfExists('devices');
        Schema::dropIfExists('user_profiles');
    }
};
