<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SponsorshipLead extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_name',
        'contact_person',
        'email',
        'phone',
        'campaign_type',
        'budget_range',
        'deal_value_inr',
        'status',
        'brief',
        'target_audience',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'deal_value_inr' => 'integer',
        ];
    }
}
