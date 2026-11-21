<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PushDeliveryLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'notification_id',
        'campaign_id',
        'push_device_id',
        'user_id',
        'attempted_at',
        'status',
        'error_code',
        'fcm_message_id',
    ];

    protected function casts(): array
    {
        return [
            'attempted_at' => 'datetime',
        ];
    }

    public function notification(): BelongsTo
    {
        return $this->belongsTo(AppNotification::class, 'notification_id');
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(PushCampaign::class, 'campaign_id');
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(PushDevice::class, 'push_device_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
