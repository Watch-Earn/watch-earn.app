<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. push_devices
        Schema::create('push_devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('token')->index();
            $table->string('platform', 32)->default('android'); // 'android', 'web', 'ios'
            $table->string('device_id', 128)->nullable();
            $table->boolean('active')->default(true)->index();
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'token']);
        });

        // 2. notifications (canonical alerts)
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type', 64)->default('GENERAL'); // DAILY_REWARD, WALLET_UPDATE, WITHDRAWAL_UPDATE, SECURITY_ALERT, ANNOUNCEMENT
            $table->string('title');
            $table->text('body');
            $table->string('target_screen')->nullable(); // 'rewards', 'wallet', 'withdraw', 'tasks'
            $table->json('target_data')->nullable();
            $table->timestamps();
        });

        // 3. notification_recipients (per-user inbox state)
        Schema::create('notification_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('read_at')->nullable()->index();
            $table->timestamp('opened_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });

        // 4. notification_preferences
        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->boolean('rewards_enabled')->default(true);
            $table->boolean('promotional_enabled')->default(true);
            $table->string('quiet_hours_start', 10)->nullable(); // e.g. "22:00"
            $table->string('quiet_hours_end', 10)->nullable();   // e.g. "08:00"
            $table->string('timezone', 64)->default('Asia/Kolkata');
            $table->timestamps();
        });

        // 5. push_campaigns (admin broadcasts / scheduled notifications)
        Schema::create('push_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('body');
            $table->string('audience_filter', 64)->default('all'); // 'all', 'active_7d', 'has_balance', 'unverified'
            $table->string('target_screen')->nullable();
            $table->json('target_data')->nullable();
            $table->timestamp('scheduled_at')->nullable()->index();
            $table->string('status', 32)->default('sent'); // 'draft', 'scheduled', 'sending', 'sent', 'cancelled'
            $table->string('created_by')->default('admin_console');
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });

        // 6. push_delivery_logs (audit and send diagnostics)
        Schema::create('push_delivery_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('notification_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('campaign_id')->nullable()->constrained('push_campaigns')->nullOnDelete();
            $table->foreignId('push_device_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('attempted_at')->useCurrent();
            $table->string('status', 32); // 'accepted', 'failed', 'unregistered', 'rate_limited'
            $table->string('error_code', 64)->nullable();
            $table->string('fcm_message_id', 128)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('push_delivery_logs');
        Schema::dropIfExists('push_campaigns');
        Schema::dropIfExists('notification_preferences');
        Schema::dropIfExists('notification_recipients');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('push_devices');
    }
};
