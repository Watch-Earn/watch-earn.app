<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Watch & Earn Coin and INR Rules
    |--------------------------------------------------------------------------
    | 100 coins   = ₹0.10 (10 paise)
    | 1,000 coins = ₹1.00 (100 paise)
    | 10,000 coins = ₹10.00 (1,000 paise)
    |
    | Formulae:
    | paise = coins / 10
    | INR = coins / 1,000
    */
    'coins_per_inr' => (int) env('COINS_PER_INR', 1000),
    'paise_per_coin_divisor' => (int) env('PAISE_PER_COIN_DIVISOR', 10),

    // Standard eligible completed ad reward (default example 20 coins = ₹0.02)
    'standard_reward_coins' => (int) env('STANDARD_REWARD_COINS', 20),

    // Standard ad completion cap per user per day
    'standard_daily_limit' => (int) env('STANDARD_DAILY_LIMIT', 10),

    // Maximum standard ad coins per day (10 * 20 = 200 coins)
    'max_daily_standard_coins' => (int) env('MAX_DAILY_STANDARD_COINS', 200),

    // Minimum withdrawal in coins (10,000 coins = ₹10.00 = 1,000 paise)
    'min_withdrawal_coins' => (int) env('MIN_WITHDRAWAL_COINS', 10000),

    // Reward hold period in hours before release from pending to available
    'reward_hold_hours' => (int) env('REWARD_HOLD_HOURS', 24),

    // Integration Modes: 'mock', 'sandbox', 'production'
    'rewards_provider_mode' => env('REWARDS_PROVIDER_MODE', 'mock'),
    'payout_provider_mode' => env('PAYOUT_PROVIDER_MODE', 'sandbox'),
    'payout_driver' => env('PAYOUT_DRIVER', 'mock'),
    'otp_provider_mode' => env('OTP_PROVIDER_MODE', 'mock'),
];
