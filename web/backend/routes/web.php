<?php

use App\Models\AdminAuditLog;
use App\Models\Partner;
use App\Models\RewardEvent;
use App\Models\User;
use App\Models\WalletAccount;
use App\Models\Withdrawal;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

$renderAdmin = function () {
    $totalUsers = User::count();
    $totalCompletions = RewardEvent::where('status', '!=', 'rejected')->count();

    $availableCoins = (int) WalletAccount::where('account_type', 'available')->get()->sum(fn($a) => $a->balance);
    $pendingCoins = (int) WalletAccount::where('account_type', 'pending')->get()->sum(fn($a) => $a->balance);
    $reservedCoins = (int) WalletAccount::where('account_type', 'reserved')->get()->sum(fn($a) => $a->balance);
    $paidCoins = (int) WalletAccount::where('account_type', 'paid')->get()->sum(fn($a) => $a->balance);

    $withdrawals = Withdrawal::with('user')->latest('id')->take(15)->get();
    $partners = Partner::all();
    $auditLogs = AdminAuditLog::latest('id')->take(10)->get();

    return view('admin.dashboard', compact(
        'totalUsers',
        'totalCompletions',
        'availableCoins',
        'pendingCoins',
        'reservedCoins',
        'paidCoins',
        'withdrawals',
        'partners',
        'auditLogs'
    ));
};

Route::get('/', $renderAdmin);
Route::get('/admin', $renderAdmin);

Route::post('/admin/withdrawals/{id}/review', function (Request $request, int $id, WalletService $walletService) {
    $request->validate([
        'action' => 'required|in:approve,reject',
        'reason' => 'required|string|max:500',
    ]);

    $withdrawal = Withdrawal::findOrFail($id);
    $action = $request->input('action');
    $reason = $request->input('reason');

    if ($action === 'approve') {
        $withdrawal->update(['status' => 'approved']);
        AdminAuditLog::create([
            'admin_id' => 'admin_console',
            'action' => 'withdrawal_approved',
            'target_type' => 'withdrawal',
            'target_id' => (string) $withdrawal->id,
            'reason' => $reason,
        ]);
    } else {
        $walletService->releaseReservedWithdrawal($withdrawal, $reason);
        AdminAuditLog::create([
            'admin_id' => 'admin_console',
            'action' => 'withdrawal_rejected',
            'target_type' => 'withdrawal',
            'target_id' => (string) $withdrawal->id,
            'reason' => $reason,
        ]);
    }

    return redirect('/admin');
});
