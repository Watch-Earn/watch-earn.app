# Threat Model & Fraud Prevention Architecture

## 1. Threat Taxonomy

| Threat Category | Attack Vector | Mitigation in Architecture |
|---|---|---|
| **Postback Forgery** | Attacker calls `/webhooks/partners/x` directly with fake credits. | Mandatory HMAC-SHA256 signature check using high-entropy partner secret; IP allowlisting where possible; timestamp expiration within 300s. |
| **Replay Attacks** | Capturing and resending valid past callbacks. | Strict uniqueness on `(partner_id, external_event_id)` at database level; atomic transactions discard duplicate keys without granting double coins. |
| **App-Side Tampering** | Modifying client APK to send "offer finished" or bypass ad view. | The client app never awards coins. Only backend-to-backend partner callbacks have authority to credit. Client-side state is strictly display-only. |
| **Concurrent Double-Spend** | Submitting two simultaneous withdrawal requests before balance update. | Database row-locking (`SELECT ... FOR UPDATE`) during withdrawal reservation; unique idempotency key per withdrawal transaction. |
| **Emulator / Device Farms** | Automated script running dozens of virtual devices on server farm. | Android Play Integrity API verification on login and withdrawal; hardware-backed keystore tokens; velocity limit of 1 withdrawal / 24 hours. |
| **Sybil Account Creation** | Generating thousands of disposable phone numbers for sign-up bonuses. | Rate-limited OTP requests; strict cooldown period; zero upfront signup bonus; payout account (UPI ID) uniqueness monitoring. |
| **Partner Reversals** | User cancels survey or partner marks transaction invalid post-facto. | System executes compensating ledger entries debiting available coins; if available balance becomes negative, account is flagged for risk review. |
