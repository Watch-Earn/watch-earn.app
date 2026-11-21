<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\Partner;
use App\Models\RewardEvent;
use App\Models\SupportTicket;
use App\Models\User;
use App\Models\WalletAccount;
use App\Models\Withdrawal;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct(
        protected WalletService $walletService
    ) {}

    public function overview(): JsonResponse
    {
        $totalUsers = User::count();
        $totalCompletions = RewardEvent::where('status', '!=', 'rejected')->count();

        // Liabilities from ledger
        $availableCoins = (int) WalletAccount::where('account_type', 'available')->get()->sum(fn($a) => $a->balance);
        $pendingCoins = (int) WalletAccount::where('account_type', 'pending')->get()->sum(fn($a) => $a->balance);
        $reservedCoins = (int) WalletAccount::where('account_type', 'reserved')->get()->sum(fn($a) => $a->balance);
        $paidCoins = (int) WalletAccount::where('account_type', 'paid')->get()->sum(fn($a) => $a->balance);

        $pendingWithdrawals = Withdrawal::whereIn('status', ['requested', 'under_review'])->count();
        $openSupportTickets = SupportTicket::where('status', 'open')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'total_reward_completions' => $totalCompletions,
                'liabilities' => [
                    'available_coins' => $availableCoins,
                    'available_inr' => number_format($availableCoins / 1000, 2),
                    'pending_coins' => $pendingCoins,
                    'pending_inr' => number_format($pendingCoins / 1000, 2),
                    'reserved_coins' => $reservedCoins,
                    'reserved_inr' => number_format($reservedCoins / 1000, 2),
                    'paid_coins' => $paidCoins,
                    'paid_inr' => number_format($paidCoins / 1000, 2),
                ],
                'pending_withdrawals_count' => $pendingWithdrawals,
                'open_support_tickets_count' => $openSupportTickets,
            ],
        ]);
    }

    public function withdrawals(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $query = Withdrawal::with('user:id,name,phone_last_four');

        if ($status) {
            $query->where('status', $status);
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest('id')->paginate(20),
        ]);
    }

    public function reviewWithdrawal(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'reason' => 'required|string|max:500',
        ]);

        $withdrawal = Withdrawal::findOrFail($id);
        $action = $request->input('action');
        $reason = $request->input('reason');
        $adminId = (string) ($request->user()?->id ?? 'admin');

        if ($action === 'approve') {
            $withdrawal->update(['status' => 'approved']);
            // Record audit
            AdminAuditLog::create([
                'admin_id' => $adminId,
                'action' => 'withdrawal_approved',
                'target_type' => 'withdrawal',
                'target_id' => (string) $withdrawal->id,
                'reason' => $reason,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Withdrawal approved for processing',
                'data' => $withdrawal,
            ]);
        }

        // Action is reject: release reserved coins
        $this->walletService->releaseReservedWithdrawal($withdrawal, $reason);

        AdminAuditLog::create([
            'admin_id' => $adminId,
            'action' => 'withdrawal_rejected',
            'target_type' => 'withdrawal',
            'target_id' => (string) $withdrawal->id,
            'reason' => $reason,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Withdrawal rejected and reserved coins refunded to user',
            'data' => $withdrawal->fresh(),
        ]);
    }

    public function auditLogs(Request $request): JsonResponse
    {
        $logs = AdminAuditLog::latest('id')->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }
}
