# Product Requirements Document (PRD) — Watch & Earn

## 1. Executive Summary
Watch & Earn is an Android and web-based rewards platform engineered specifically for the Indian market (18+). The platform enables users to voluntarily participate in eligible, verified advertiser-sponsored activities (such as sponsored offers, surveys, and partner tasks) to earn virtual coins. Coins can be converted to Indian Rupees (INR) at a fixed, server-enforced rate and withdrawn via supported payment partners (e.g., UPI) once minimum thresholds and hold periods are satisfied.

## 2. Core Value Proposition & Principles
1. **Absolute Transparency:** Clear exchange rates ($1,000\text{ coins} = ₹1.00$) and integer paise calculations ($paise = coins / 10$).
2. **Zero Income Guarantees:** Strict compliance with advertising and distribution policies; rewards are explicitly framed as discretionary micro-incentives for verified user activities.
3. **Provable Invariants:** The client app never awards coins. Only cryptographically verified, idempotent server-to-server callbacks from approved partners can credit user accounts.
4. **Append-Only Accounting:** Double-entry ledger prevents balance drift, double-spends, and unauthorized balance mutations.

## 3. User Personas
- **Registered User (18+, India):** Engages in sponsored activities during leisure, tracks balances in real time, requests withdrawals via UPI.
- **Support / Risk Analyst:** Reviews flagged accounts, monitors fraud scores, investigates missing reward claims, and oversees manual disputes.
- **System Administrator:** Configures partner keys, monitors wallet liabilities vs. cash reserves, and audits withdrawal batches.

## 4. Functional Specifications

### 4.1 Authentication & Profile
- Mobile phone number verification via OTP with exponential backoff and IP rate limiting.
- Mandatory 18+ age declaration, Terms of Service, and Privacy Policy consent.
- Profile management with account deletion requests compliant with Indian Digital Personal Data Protection Act (DPDPA).

### 4.2 Sponsored Activities (Earn)
- Retrieval of active, eligible offers from partner integrations.
- Enforced daily activity cap (default: 10 completions per user per day, 200 coins max).
- Server-signed session initiation prevents external spoofing.
- Explicit status tracking: `available`, `started`, `pending`, `approved`, `rejected`, `reversed`.

### 4.3 Wallet & Accounting
- Strict separation of balance buckets:
  - **Available:** Fully settled and withdrawable coins.
  - **Pending:** Earned coins in holding period (e.g., 24-72 hours) awaiting final settlement or fraud clearance.
  - **Reserved:** Coins locked during an active withdrawal request.
  - **Paid:** Lifetime coins redeemed for payouts.
  - **Reversed:** Compensating negative entries applied if partner disallows an event.

### 4.4 Withdrawals
- Minimum threshold: 10,000 coins (₹10.00 / 1,000 paise).
- Divisibility constraint: Coin withdrawal amount must be divisible by 10 to guarantee integral paise.
- Valid UPI ID format verification (`username@bank` / `username@upi`).
- State machine: `requested` $\rightarrow$ `under_review` $\rightarrow$ `approved` $\rightarrow$ `processing` $\rightarrow$ `paid` (or `failed` / `cancelled`).
- Reservation refund on failure: If a payout fails permanently, the reserved coins are atomically returned to available balance.

### 4.5 Risk & Abuse Controls
- Device fingerprinting and session integrity checks.
- Event deduplication on `(partner_id, external_event_id)`.
- Velocity limits: Maximum 1 withdrawal request per 24 hours per user.
