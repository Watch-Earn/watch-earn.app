<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LedgerEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'account_id',
        'direction',
        'coin_amount',
    ];

    protected function casts(): array
    {
        return [
            'coin_amount' => 'integer',
        ];
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(WalletTransaction::class, 'transaction_id');
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(WalletAccount::class, 'account_id');
    }
}
