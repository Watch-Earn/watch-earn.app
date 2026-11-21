<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Withdrawal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'coins',
        'amount_paise',
        'upi_id',
        'status',
        'idempotency_key',
        'payout_id',
        'failure_reason',
    ];

    protected function casts(): array
    {
        return [
            'coins' => 'integer',
            'amount_paise' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
