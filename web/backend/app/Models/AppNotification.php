<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AppNotification extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    protected $fillable = [
        'type',
        'title',
        'body',
        'target_screen',
        'target_data',
    ];

    protected function casts(): array
    {
        return [
            'target_data' => 'array',
        ];
    }

    public function recipients(): HasMany
    {
        return $this->hasMany(NotificationRecipient::class, 'notification_id');
    }

    public function deliveryLogs(): HasMany
    {
        return $this->hasMany(PushDeliveryLog::class, 'notification_id');
    }
}
