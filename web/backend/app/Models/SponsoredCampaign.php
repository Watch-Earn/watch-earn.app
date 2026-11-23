<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SponsoredCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_code',
        'brand_name',
        'campaign_type',
        'total_coin_budget',
        'payout_per_action',
        'tracking_link',
        'hmac_secret',
        'target_audience',
        'completions',
        'burned_coins',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'total_coin_budget' => 'integer',
            'payout_per_action' => 'integer',
            'completions' => 'integer',
            'burned_coins' => 'integer',
        ];
    }
}
