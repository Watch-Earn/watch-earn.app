<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
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
    });

    // Administrative Portal Routes
    Route::prefix('admin')->group(function () {
        Route::get('/overview', [AdminController::class, 'overview']);
        Route::get('/withdrawals', [AdminController::class, 'withdrawals']);
        Route::post('/withdrawals/{id}/review', [AdminController::class, 'reviewWithdrawal']);
        Route::get('/audit-logs', [AdminController::class, 'auditLogs']);
    });
});
