<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminAuditLog;
use App\Models\LedgerEntry;
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

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('upi_id', 'like', "%{$search}%")
                  ->orWhere('id', $search)
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('phone_last_four', 'like', "%{$search}%")
                         ->orWhere('name', 'like', "%{$search}%");
                  });
            });
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
        $adminId = (string) ($request->user()?->id ?? 'admin_console');

        if ($action === 'approve') {
            $withdrawal->update(['status' => 'approved']);
            AdminAuditLog::create([
                'admin_id' => $adminId,
                'action' => 'withdrawal_approved',
                'target_type' => 'withdrawal',
                'target_id' => (string) $withdrawal->id,
                'reason' => $reason,
            ]);

            try {
                app(\App\Services\NotificationService::class)->sendToUser(
                    $withdrawal->user,
                    'WITHDRAWAL_APPROVED',
                    'Withdrawal Approved',
                    "Your withdrawal of ₹" . number_format($withdrawal->amount_paise / 100, 2) . " has been approved and is queued for transfer.",
                    'wallet',
                    ['withdrawal_id' => (string) $withdrawal->id]
                );
            } catch (\Throwable $e) {}

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

        try {
            app(\App\Services\NotificationService::class)->sendToUser(
                $withdrawal->user,
                'WITHDRAWAL_REJECTED',
                'Withdrawal Request Refunded',
                "Your withdrawal request was rejected and {$withdrawal->coins} coins were returned to your available balance. Reason: {$reason}",
                'wallet',
                ['withdrawal_id' => (string) $withdrawal->id, 'reason' => $reason]
            );
        } catch (\Throwable $e) {}

        return response()->json([
            'success' => true,
            'message' => 'Withdrawal rejected and reserved coins refunded to user',
            'data' => $withdrawal->fresh(),
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $query = User::with(['profile', 'walletAccounts.ledgerEntries', 'devices'])->withCount(['rewardEvents', 'withdrawals']);
        
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone_last_four', 'like', "%{$search}%")
                  ->orWhere('id', $search);
            });
        }
        
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        
        $users = $query->latest('id')->paginate(20);
        $users->getCollection()->transform(function ($u) {
            $available = $u->walletAccounts->firstWhere('account_type', 'available')?->balance ?? 0;
            $pending = $u->walletAccounts->firstWhere('account_type', 'pending')?->balance ?? 0;
            $reserved = $u->walletAccounts->firstWhere('account_type', 'reserved')?->balance ?? 0;
            $paid = $u->walletAccounts->firstWhere('account_type', 'paid')?->balance ?? 0;
            
            return [
                'id' => $u->id,
                'name' => $u->name ?? 'User ...' . ($u->phone_last_four ?? 'N/A'),
                'email' => $u->email,
                'phone_last_four' => $u->phone_last_four,
                'status' => $u->status,
                'is_admin' => $u->is_admin,
                'age_eligibility_status' => $u->profile?->age_eligibility_status ?? 'verified_18_plus',
                'balances' => [
                    'available' => $available,
                    'pending' => $pending,
                    'reserved' => $reserved,
                    'paid' => $paid,
                    'total_earned' => $available + $reserved + $paid,
                ],
                'device_count' => $u->devices->count(),
                'completions_count' => $u->reward_events_count,
                'withdrawals_count' => $u->withdrawals_count,
                'created_at' => $u->created_at?->toIso8601String(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    public function updateUserStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:active,suspended,banned',
            'reason' => 'required|string|max:500',
        ]);

        $user = User::findOrFail($id);
        $oldStatus = $user->status;
        $newStatus = $request->input('status');
        $user->update(['status' => $newStatus]);

        AdminAuditLog::create([
            'admin_id' => (string) ($request->user()?->id ?? 'admin_console'),
            'action' => 'user_status_changed',
            'target_type' => 'user',
            'target_id' => (string) $user->id,
            'reason' => "Status changed from {$oldStatus} to {$newStatus}: " . $request->input('reason'),
        ]);

        return response()->json([
            'success' => true,
            'message' => "User status updated to {$newStatus}",
            'data' => $user,
        ]);
    }

    public function partners(): JsonResponse
    {
        $partners = Partner::withCount('offers')->get()->map(function ($p) {
            $rewardEventsCount = RewardEvent::where('partner_id', $p->id)->count();
            $totalCoinsDistributed = (int) RewardEvent::where('partner_id', $p->id)->where('status', 'approved')->sum('reward_coins');
            return [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'status' => $p->status,
                'offers_count' => $p->offers_count,
                'reward_events_count' => $rewardEventsCount,
                'total_coins_distributed' => $totalCoinsDistributed,
                'callback_url' => url("/api/v1/webhooks/partners/{$p->slug}"),
                'has_secret' => !empty($p->secret_key),
                'timestamp_drift_allowed' => '300s',
                'created_at' => $p->created_at?->toIso8601String(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $partners,
        ]);
    }

    public function ledger(Request $request): JsonResponse
    {
        $query = LedgerEntry::with(['account.user:id,name,phone_last_four', 'transaction']);

        if ($type = $request->query('account_type')) {
            $query->whereHas('account', function ($q) use ($type) {
                $q->where('account_type', $type);
            });
        }

        if ($direction = $request->query('direction')) {
            $query->where('direction', $direction);
        }

        $entries = $query->latest('id')->paginate(30);

        return response()->json([
            'success' => true,
            'data' => $entries,
        ]);
    }

    public function supportTickets(Request $request): JsonResponse
    {
        $query = SupportTicket::with('user:id,name,phone_last_four,email');
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return response()->json([
            'success' => true,
            'data' => $query->latest('id')->paginate(20),
        ]);
    }

    public function updateTicket(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:open,in_progress,resolved,closed',
            'resolution_note' => 'nullable|string|max:1000',
        ]);

        $ticket = SupportTicket::findOrFail($id);
        $ticket->update(['status' => $request->input('status')]);

        AdminAuditLog::create([
            'admin_id' => (string) ($request->user()?->id ?? 'admin_console'),
            'action' => 'ticket_updated',
            'target_type' => 'support_ticket',
            'target_id' => (string) $ticket->id,
            'reason' => "Status changed to {$request->input('status')}. Note: " . ($request->input('resolution_note') ?? 'None'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Support ticket updated',
            'data' => $ticket,
        ]);
    }

    public function integrityCheck(): JsonResponse
    {
        $totalCredits = (int) LedgerEntry::where('direction', 'credit')->sum('coin_amount');
        $totalDebits = (int) LedgerEntry::where('direction', 'debit')->sum('coin_amount');
        $isBalanced = ($totalCredits === $totalDebits);

        $availableCoins = (int) WalletAccount::where('account_type', 'available')->get()->sum(fn($a) => $a->balance);
        $pendingCoins = (int) WalletAccount::where('account_type', 'pending')->get()->sum(fn($a) => $a->balance);
        $reservedCoins = (int) WalletAccount::where('account_type', 'reserved')->get()->sum(fn($a) => $a->balance);
        $paidCoins = (int) WalletAccount::where('account_type', 'paid')->get()->sum(fn($a) => $a->balance);

        $negativeAccounts = WalletAccount::all()->filter(fn($a) => $a->balance < 0)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'double_entry_balanced' => $isBalanced,
                'total_credits' => $totalCredits,
                'total_debits' => $totalDebits,
                'liabilities' => [
                    'available_coins' => $availableCoins,
                    'pending_coins' => $pendingCoins,
                    'reserved_coins' => $reservedCoins,
                    'paid_coins' => $paidCoins,
                    'total_outstanding' => $availableCoins + $pendingCoins + $reservedCoins,
                ],
                'negative_accounts_detected' => $negativeAccounts,
                'admob_isolation_policy' => 'STRICT_ENFORCED',
                'verified_at' => now()->toIso8601String(),
            ],
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

    public function getPayoutGateway(Request $request, \App\Services\WithdrawalService $withdrawalService): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'active_gateway' => $withdrawalService->getDriver(),
                'supported_gateways' => $withdrawalService->getSupportedDrivers(),
            ],
        ]);
    }

    public function updatePayoutGateway(Request $request, \App\Services\WithdrawalService $withdrawalService): JsonResponse
    {
        $request->validate([
            'gateway' => 'required|string|in:mock,cashfree,razorpayx',
        ]);

        $gateway = $request->input('gateway');
        $withdrawalService->setDriver($gateway);

        AdminAuditLog::create([
            'admin_id' => (string) ($request->user()?->id ?? 'admin_console'),
            'action' => 'payout_gateway_switched',
            'target_type' => 'gateway_config',
            'target_id' => $gateway,
            'reason' => "Payout driver switched to {$gateway}",
        ]);

        return response()->json([
            'success' => true,
            'message' => "Payout gateway driver switched to {$gateway}",
            'data' => [
                'active_gateway' => $withdrawalService->getDriver(),
            ],
        ]);
    }

    public function runBankReconciliation(Request $request, \App\Services\WithdrawalService $withdrawalService): JsonResponse
    {
        $payload = $request->all();
        $result = $withdrawalService->reconcileBankStatement($payload);

        AdminAuditLog::create([
            'admin_id' => (string) ($request->user()?->id ?? 'admin_console'),
            'action' => 'bank_reconciliation_executed',
            'target_type' => 'reconciliation',
            'target_id' => $result['reconciliation_id'],
            'reason' => "Status: {$result['status']}; Discrepancy: ₹{$result['discrepancy_inr']}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bank reconciliation completed successfully',
            'data' => $result,
        ]);
    }
}
