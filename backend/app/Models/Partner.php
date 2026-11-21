<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Partner extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'secret_key',
        'status',
        'callback_config',
    ];

    protected $hidden = [
        'secret_key',
    ];

    protected function casts(): array
    {
        return [
            'callback_config' => 'array',
        ];
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class);
    }

    public function rewardEvents(): HasMany
    {
        return $this->hasMany(RewardEvent::class);
    }
}
