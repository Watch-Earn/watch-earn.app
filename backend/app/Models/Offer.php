<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'partner_id',
        'external_offer_id',
        'title',
        'description',
        'reward_coins',
        'daily_cap',
        'terms',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'reward_coins' => 'integer',
            'daily_cap' => 'integer',
        ];
    }

    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }

    public function rewardEvents(): HasMany
    {
        return $this->hasMany(RewardEvent::class);
    }
}
