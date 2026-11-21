<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RewardEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'partner_id',
        'external_event_id',
        'user_id',
        'offer_id',
        'reward_coins',
        'status',
        'signature',
        'raw_payload',
        'received_at',
    ];

    protected function casts(): array
    {
        return [
            'reward_coins' => 'integer',
            'raw_payload' => 'array',
            'received_at' => 'datetime',
        ];
    }

    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class);
    }
}
