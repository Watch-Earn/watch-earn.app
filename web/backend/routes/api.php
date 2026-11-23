<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AdminNotificationController;
use App\Http\Controllers\Api\AdminSponsorshipController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\PartnerWebhookController;
use App\Http\Controllers\Api\PayoutWebhookController;
use App\Http\Controllers\Api\SupportController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\WithdrawalController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Watch & Earn v1 REST API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Public Authentication Endpoints
    Route::prefix('auth')->group(function () {
        Route::post('/google', [AuthController::class, 'googleAuth']);
        Route::post('/otp/request', [AuthController::class, 'requestOtp']);
        Route::post('/otp/verify', [AuthController::class, 'verifyOtp']);
    });

    // Public / External Signed Webhooks
    Route::post('/webhooks/partners/{partner}', [PartnerWebhookController::class, 'handle']);
    Route::post('/webhooks/payouts/{provider}', [PayoutWebhookController::class, 'handle']);

    // Authenticated User Endpoints
    Route::middleware('auth:sanctum')->group(function () {
        // User Profile & Status
        Route::get('/me', [UserController::class, 'me']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
        Route::delete('/me', [UserController::class, 'requestDeletion']);

        // Offers & Activity
        Route::get('/offers', [OfferController::class, 'index']);
        Route::post('/offers/{id}/start', [OfferController::class, 'start']);
        Route::get('/activities', [OfferController::class, 'activities']);

        // Wallet Ledger
        Route::get('/wallet', [WalletController::class, 'summary']);
        Route::get('/wallet/transactions', [WalletController::class, 'transactions']);

        // Withdrawals
        Route::post('/withdrawals', [WithdrawalController::class, 'requestWithdrawal']);
        Route::get('/withdrawals', [WithdrawalController::class, 'index']);

        // Support & Disputes
        Route::post('/support/tickets', [SupportController::class, 'createTicket']);
        Route::get('/support/tickets', [SupportController::class, 'index']);

        // Push Notification Devices & Inbox
        Route::post('/push/devices', [NotificationController::class, 'registerDevice']);
        Route::delete('/push/devices', [NotificationController::class, 'revokeDevice']);
        Route::get('/notifications', [NotificationController::class, 'inbox']);
        Route::patch('/notifications/{id}/read', [NotificationController::class, 'markRead']);
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
        Route::get('/notifications/preferences', [NotificationController::class, 'getPreferences']);
        Route::put('/notifications/preferences', [NotificationController::class, 'updatePreferences']);
    });

    // Administrative Portal Routes
    Route::prefix('admin')->group(function () {
        Route::get('/overview', [AdminController::class, 'overview']);
        Route::get('/withdrawals', [AdminController::class, 'withdrawals']);
        Route::post('/withdrawals/{id}/review', [AdminController::class, 'reviewWithdrawal']);
        Route::get('/audit-logs', [AdminController::class, 'auditLogs']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users/{id}/status', [AdminController::class, 'updateUserStatus']);
        Route::get('/partners', [AdminController::class, 'partners']);
        Route::get('/ledger', [AdminController::class, 'ledger']);
        Route::get('/support-tickets', [AdminController::class, 'supportTickets']);
        Route::post('/support-tickets/{id}', [AdminController::class, 'updateTicket']);
        Route::get('/integrity-check', [AdminController::class, 'integrityCheck']);
        Route::get('/payout-gateway', [AdminController::class, 'getPayoutGateway']);
        Route::post('/payout-gateway', [AdminController::class, 'updatePayoutGateway']);
        Route::post('/payout-reconcile', [AdminController::class, 'runBankReconciliation']);

        // Push Campaigns & Notification Controls
        Route::get('/push/stats', [AdminNotificationController::class, 'stats']);
        Route::post('/push/send', [AdminNotificationController::class, 'sendCampaign']);
        Route::post('/push/schedule', [AdminNotificationController::class, 'scheduleCampaign']);
        Route::get('/push/campaigns', [AdminNotificationController::class, 'campaigns']);
        Route::get('/push/campaigns/{id}', [AdminNotificationController::class, 'campaignDetail']);
        Route::post('/push/campaigns/{id}/cancel', [AdminNotificationController::class, 'cancelCampaign']);

        // Brand Sponsorships & Advertiser CRM Studio
        Route::get('/sponsorships', [AdminSponsorshipController::class, 'index']);
        Route::get('/sponsorships/leads/{id}', [AdminSponsorshipController::class, 'showLead']);
        Route::post('/sponsorships/leads/{id}/status', [AdminSponsorshipController::class, 'updateLeadStatus']);
        Route::post('/sponsorships/campaigns', [AdminSponsorshipController::class, 'createCampaign']);
        Route::post('/sponsorships/campaigns/{id}/status', [AdminSponsorshipController::class, 'updateCampaignStatus']);
    });
});
