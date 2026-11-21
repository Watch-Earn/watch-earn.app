# Deployment & Infrastructure Guide

## 1. Production Architecture Overview
- **Compute:** Laravel REST API on PHP 8.3+ FPM behind Nginx / Cloudflare CDN.
- **Database:** Managed PostgreSQL 15+ with read replica and automated point-in-time recovery (PITR).
- **Cache & Queue:** Redis cluster for session cache, rate-limiting counters, and asynchronous queue workers.
- **Admin Portal:** Web-based control panel restricted by IP and multi-factor authentication.
- **Android App:** ProGuard / R8-obfuscated APK / AAB distributed via Google Play (subject to policy review) or signed direct distribution.
- **Landing Site:** Static HTML5 / CSS3 / JS hosted on high-performance CDN / Cloudflare Pages / AWS S3.

## 2. Environment Variables Configuration
```dotenv
APP_NAME="Watch & Earn"
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://api.watch-earn.app

DB_CONNECTION=pgsql
DB_HOST=postgres.internal
DB_PORT=5432
DB_DATABASE=watch_earn_prod
DB_USERNAME=watch_earn_user
DB_PASSWORD=secret

QUEUE_CONNECTION=redis
CACHE_STORE=redis
REDIS_HOST=redis.internal

# Business Economics Configuration
COINS_PER_INR=1000
PAISE_PER_COIN_DIVISOR=10
STANDARD_REWARD_COINS=20
STANDARD_DAILY_LIMIT=10
MIN_WITHDRAWAL_COINS=10000

# Security & Verification
REWARDS_PROVIDER_MODE=production
PAYOUT_PROVIDER_MODE=production
OTP_PROVIDER_MODE=production
```

## 3. Disaster Recovery & Reconciliation
- Nightly ledger reconciliation cron job computes:
  $$\sum \text{available\_coins} + \sum \text{pending\_coins} + \sum \text{reserved\_coins} \stackrel{?}{=} \sum \text{system\_liability}$$
- If a discrepancy is detected, the payout pipeline enters automated pause mode and alerts on-call engineering.
