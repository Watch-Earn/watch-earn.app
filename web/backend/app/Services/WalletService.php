<?php

namespace App\Services;

use App\Models\LedgerEntry;
use App\Models\User;
use App\Models\WalletAccount;
use App\Models\WalletTransaction;
use App\Models\Withdrawal;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;
use RuntimeException;

class WalletService
{
    /**
     * Ensure standard wallet accounts exist for the user.
     * Types: available, pending, reserved, paid.
     */
    public function getOrCreateUserAccounts(User $user): array
    {
        $types = ['available', 'pending', 'reserved', 'paid'];
        $accounts = [];

        foreach ($types as $type) {
            $accounts[$type] = WalletAccount::firstOrCreate([
                'user_id' => $user->id,
                'account_type' => $type,
            ], [
                'currency' => 'COIN',
            ]);
        }

        return $accounts;
    }

    /**
     * System liability account (user_id = null).
     */
    public function getSystemLiabilityAccount(): WalletAccount
    {
        return WalletAccount::firstOrCreate([
            'user_id' => null,
            'account_type' => 'system_liability',
        ], [
            'currency' => 'COIN',
        ]);
    }

    /**
     * Compute current balances for all buckets and INR equivalents.
     */
    public function getBalanceSummary(User $user): array
    {
        $accounts = $this->getOrCreateUserAccounts($user);

        $available = $accounts['available']->balance;
        $pending = $accounts['pending']->balance;
        $reserved = $accounts['reserved']->balance;
        $paid = $accounts['paid']->balance;

        $coinsPerInr = (int) config('rewards.coins_per_inr', 1000);
        $minWithdrawal = (int) config('rewards.min_withdrawal_coins', 10000);

        // paise = coins / 10 (integer)
        $availablePaise = intdiv($available, 10);
        $availableRupees = number_format($available / $coinsPerInr, 2, '.', '');

        return [
            'available_coins' => $available,
            'pending_coins' => $pending,
            'reserved_coins' => $reserved,
            'paid_coins' => $paid,
            'available_inr_paise' => $availablePaise,
            'available_inr_rupees' => $availableRupees,
            'minimum_withdrawal_coins' => $minWithdrawal,
            'coin_rate' => [
                'coins' => $coinsPerInr,
                'inr_paise' => 100,
            ],
            'is_withdrawal_eligible' => ($available >= $minWithdrawal && ($available % 10 === 0)),
        ];
    }

    /**
     * Credit pending reward coins from verified activity callback.
     */
    public function creditPendingReward(
        User $user,
        int $coins,
        string $referenceId,
        string $idempotencyKey,
        string $description = 'Verified Partner Reward'
    ): WalletTransaction {
        if ($coins <= 0) {
            throw new InvalidArgumentException("Reward coins must be positive integer: {$coins}");
        }

        return DB::transaction(function () use ($user, $coins, $referenceId, $idempotencyKey, $description) {
            $accounts = $this->getOrCreateUserAccounts($user);
            $pendingAccount = $accounts['pending'];
            $systemAccount = $this->getSystemLiabilityAccount();

            $existingTx = WalletTransaction::where('idempotency_key', $idempotencyKey)->first();
            if ($existingTx) {
                return $existingTx;
            }

            $tx = WalletTransaction::create([
                'user_id' => $user->id,
                'kind' => 'reward_pending',
                'reference_type' => 'reward_event',
                'reference_id' => $referenceId,
                'idempotency_key' => $idempotencyKey,
                'description' => $description,
            ]);

            // Double entry: Credit user pending, Debit system liability
            LedgerEntry::create([
                'transaction_id' => $tx->id,
                'account_id' => $pendingAccount->id,
                'direction' => 'credit',
                'coin_amount' => $coins,
            ]);

            LedgerEntry::create([
                'transaction_id' => $tx->id,
                'account_id' => $systemAccount->id,
                'direction' => 'debit',
                'coin_amount' => $coins,
            ]);

            return $tx;
        });
    }

    /**
     * Release pending coins to available balance after hold period and fraud clearance.
     */
    public function releasePendingReward(
        User $user,
        int $coins,
        string $referenceId,
        string $description = 'Reward hold period completed'
    ): WalletTransaction {
        if ($coins <= 0) {
            throw new InvalidArgumentException("Coins must be positive: {$coins}");
        }

        return DB::transaction(function () use ($user, $coins, $referenceId, $description) {
            $accounts = $this->getOrCreateUserAccounts($user);
            $pendingAccount = $accounts['pending'];
            $availableAccount = $accounts['available'];

            if ($pendingAccount->balance < $coins) {
                throw new RuntimeException("Insufficient pending balance ({$pendingAccount->balance}) to release {$coins}");
            }

            $txKey = "release_{$referenceId}_{$coins}";
            $existingTx = WalletTransaction::where('idempotency_key', $txKey)->first();
            if ($existingTx) {
                return $existingTx;
            }

            $tx = WalletTransaction::create([
                'user_id' => $user->id,
                'kind' => 'reward_release',
                'reference_type' => 'reward_event',
                'reference_id' => $referenceId,
                'idempotency_key' => $txKey,
                'description' => $description,
            ]);

            // Move from pending to available
            LedgerEntry::create([
                'transaction_id' => $tx->id,
                'account_id' => $pendingAccount->id,
                'direction' => 'debit',
                'coin_amount' => $coins,
            ]);

            LedgerEntry::create([
                'transaction_id' => $tx->id,
                'account_id' => $availableAccount->id,
                'direction' => 'credit',
                'coin_amount' => $coins,
            ]);

            return $tx;
        });
    }

    /**
     * Reserve coins for withdrawal request atomically.
     */
    public function reserveForWithdrawal(User $user, int $coins, Withdrawal $withdrawal): WalletTransaction
    {
        if ($coins < (int) config('rewards.min_withdrawal_coins', 10000)) {
            throw new InvalidArgumentException("Minimum withdrawal is " . config('rewards.min_withdrawal_coins') . " coins.");
        }

        if ($coins % 10 !== 0) {
            throw new InvalidArgumentException("Withdrawal coin amount must be divisible by 10 for integral paise.");
        }

        return DB::transaction(function () use ($user, $coins, $withdrawal) {
            $accounts = $this->getOrCreateUserAccounts($user);
            $availableAccount = $accounts['available'];
            $reservedAccount = $accounts['reserved'];

            // Concurrency protection: lock accounts
            WalletAccount::whereIn('id', [$availableAccount->id, $reservedAccount->id])
                ->lockForUpdate()
                ->get();

            if ($availableAccount->balance < $coins) {
                throw new RuntimeException("Insufficient available balance ({$availableAccount->balance}) for {$coins} coins withdrawal.");
            }

            $txKey = "reserve_wd_{$withdrawal->id}_{$withdrawal->idempotency_key}";
            $existingTx = WalletTransaction::where('idempotency_key', $txKey)->first();
            if ($existingTx) {
                return $existingTx;
            }

            $tx = WalletTransaction::create([
                'user_id' => $user->id,
                'kind' => 'withdrawal_reserve',
                'reference_type' => 'withdrawal',
                'reference_id' => (string) $withdrawal->id,
                'idempotency_key' => $txKey,
                'description' => "Withdrawal reservation for {$withdrawal->upi_id}",
            ]);

            // Debit available, credit reserved
            LedgerEntry::create([
                'transaction_id' => $tx->id,
                'account_id' => $availableAccount->id,
                'direction' => 'debit',
                'coin_amount' => $coins,
            ]);

            LedgerEntry::create([
                'transaction_id' => $tx->id,
                'account_id' => $reservedAccount->id,
                'direction' => 'credit',
                'coin_amount' => $coins,
            ]);

            return $tx;
        });
    }

    /**
     * Finalize payout when partner confirms success.
     */
    public function finalizePaidWithdrawal(Withdrawal $withdrawal, string $payoutId): WalletTransaction
    {
        return DB::transaction(function () use ($withdrawal, $payoutId) {
            $user = $withdrawal->user;
            $accounts = $this->getOrCreateUserAccounts($user);
            $reservedAccount = $accounts['reserved'];
            $paidAccount = $accounts['paid'];

            $txKey = "paid_wd_{$withdrawal->id}_{$payoutId}";
            $existingTx = WalletTransaction::where('idempotency_key', $txKey)->first();
            if ($existingTx) {
                return $existingTx;
            }

            $tx = WalletTransaction::create([
                'user_id' => $user->id,
                'kind' => 'withdrawal_payout',
                'reference_type' => 'withdrawal',
                'reference_id' => (string) $withdrawal->id,
                'idempotency_key' => $txKey,
                'description' => "UPI Payout settled (Ref: {$payoutId})",
            ]);

            // Debit reserved, credit paid
            LedgerEntry::create([
                'transaction_id' => $tx->id,
                'account_id' => $reservedAccount->id,
                'direction' => 'debit',
                'coin_amount' => $withdrawal->coins,
            ]);

            LedgerEntry::create([
                'transaction_id' => $tx->id,
                'account_id' => $paidAccount->id,
                'direction' => 'credit',
                'coin_amount' => $withdrawal->coins,
            ]);

            $withdrawal->update([
                'status' => 'paid',
                'payout_id' => $payoutId,
            ]);

            return $tx;
        });
    }

    /**
     * Release reserved coins back to available if payout permanently fails or is cancelled.
     */
    public function releaseReservedWithdrawal(Withdrawal $withdrawal, string $reason): WalletTransaction
    {
        return DB::transaction(function () use ($withdrawal, $reason) {
            $user = $withdrawal->user;
            $accounts = $this->getOrCreateUserAccounts($user);
            $reservedAccount = $accounts['reserved'];
            $availableAccount = $accounts['available'];

            $txKey = "refund_wd_{$withdrawal->id}";
            $existingTx = WalletTransaction::where('idempotency_key', $txKey)->first();
            if ($existingTx) {
                return $existingTx;
            }

            $tx = WalletTransaction::create([
                'user_id' => $user->id,
                'kind' => 'withdrawal_refund',
                'reference_type' => 'withdrawal',
                'reference_id' => (string) $withdrawal->id,
                'idempotency_key' => $txKey,
                'description' => "Withdrawal failed/cancelled: {$reason}",
            ]);

            // Debit reserved, credit available
            LedgerEntry::create([
                'transaction_id' => $tx->id,
                'account_id' => $reservedAccount->id,
                'direction' => 'debit',
                'coin_amount' => $withdrawal->coins,
            ]);

            LedgerEntry::create([
                'transaction_id' => $tx->id,
                'account_id' => $availableAccount->id,
                'direction' => 'credit',
                'coin_amount' => $withdrawal->coins,
            ]);

            $withdrawal->update([
                'status' => 'failed',
                'failure_reason' => $reason,
            ]);

            return $tx;
        });
    }

    /**
     * Compensating reversal entry if partner disallows an event post-facto.
     */
    public function reverseReward(User $user, int $coins, string $referenceId, string $reason): WalletTransaction
    {
        return DB::transaction(function () use ($user, $coins, $referenceId, $reason) {
            $accounts = $this->getOrCreateUserAccounts($user);
            $availableAccount = $accounts['available'];
            $pendingAccount = $accounts['pending'];
            $systemAccount = $this->getSystemLiabilityAccount();

            // Try to debit pending first if available, else available
            $targetAccount = $pendingAccount->balance >= $coins ? $pendingAccount : $availableAccount;

            $txKey = "reversal_{$referenceId}_{$coins}";
            $existingTx = WalletTransaction::where('idempotency_key', $txKey)->first();
            if ($existingTx) {
                return $existingTx;
            }

            $tx = WalletTransaction::create([
                'user_id' => $user->id,
                'kind' => 'reward_reversal',
                'reference_type' => 'reward_event',
                'reference_id' => $referenceId,
                'idempotency_key' => $txKey,
                'description' => "Compensating reversal: {$reason}",
            ]);

            LedgerEntry::create([
                'transaction_id' => $tx->id,
                'account_id' => $targetAccount->id,
                'direction' => 'debit',
                'coin_amount' => $coins,
            ]);

            LedgerEntry::create([
                'transaction_id' => $tx->id,
                'account_id' => $systemAccount->id,
                'direction' => 'credit',
                'coin_amount' => $coins,
            ]);

            return $tx;
        });
    }
}
