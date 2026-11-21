<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PushCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'body',
        'audience_filter',
        'target_screen',
        'target_data',
        'scheduled_at',
        'status',
        'created_by',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'target_data' => 'array',
            'scheduled_at' => 'datetime',
            'sent_at' => 'datetime',
        ];
    }

    public function deliveryLogs(): HasMany
    {
        return $this->hasMany(PushDeliveryLog::class, 'campaign_id');
    }
}
