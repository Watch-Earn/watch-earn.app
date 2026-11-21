<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WalletAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'account_type',
        'currency',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ledgerEntries(): HasMany
    {
        return $this->hasMany(LedgerEntry::class, 'account_id');
    }

    /**
     * Compute current balance from ledger entries.
     * Credit adds to user accounts, Debit subtracts.
     */
    public function getBalanceAttribute(): int
    {
        $credits = (int) $this->ledgerEntries()->where('direction', 'credit')->sum('coin_amount');
        $debits = (int) $this->ledgerEntries()->where('direction', 'debit')->sum('coin_amount');
        return $credits - $debits;
    }
}
