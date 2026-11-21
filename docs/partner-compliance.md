# Partner & Regulatory Compliance Guide

## 1. Critical Policy Notice: Google AdMob
> [!WARNING]
> **DO NOT USE GOOGLE ADMOB REWARDED ADS FOR CASH OR CASH-CONVERTIBLE COINS.**
> Under Google AdMob Rewarded Ad policies:
> - Rewards must be non-monetary items within the app (e.g., in-game lives, virtual items, app features).
> - Directly or indirectly awarding cash, gift cards, cryptocurrencies, or coins that can be converted into fiat or gift cards violates AdMob terms and leads to immediate account termination.
> - **Permitted Partner Types:** Direct offerwall networks (e.g., Tapjoy, IronSource, Revlum, AdGate Media) or research survey providers that explicitly contractually permit cash-redeemable user incentives in their Terms of Service.

## 2. Google Play Developer Program Policies
- **Deceptive Behavior & Misleading Claims:** The app must not advertise guaranteed hourly or daily wages, employment equivalents, or exaggerated earnings (e.g., "Earn ₹50,000/month from home").
- **Financial Services & Real Money Gaming:** Watch & Earn is not a gambling application, fantasy sport, lottery, or banking app. No user deposit is ever accepted. Entry to all activities is 100% free.
- **Incentivized Traffic:** Ads or offers must never be clicked automatically, simulated, or forced upon users without clear voluntary initiation.

## 3. Indian Regulatory Framework
- **Information Technology Act, 2000 & Intermediary Guidelines (2021):** Clear terms of service, grievance officer contact, and prompt escalation mechanism.
- **Digital Personal Data Protection Act (DPDPA), 2023:**
  - Notice and consent at point of collection.
  - Processing limited to declared purposes (authentication, fraud prevention, payout settlement).
  - Data minimization: Never collect sensitive banking passwords, Aadhaar numbers, or biometric data.
  - Right to erasure: Full account and personal data deletion pipeline with retained anonymized financial logs for statutory tax/accounting compliance.
- **Consumer Protection (E-Commerce) Rules, 2020:** Transparent disclosures of conversion rates, fee schedules, customer support contact information, and grievance redressal officer.
- **Taxation (TDS on Winnings / Micro-Incentives):** Financial systems must maintain auditable gross payout ledgers for statutory reporting under Section 194R/194BA if applicable thresholds are met.

## 4. Integration Verification Checklist
- [ ] Contract with partner explicitly allows cash-redeemable reward points.
- [ ] Partner postbacks utilize cryptographic signatures (HMAC-SHA256).
- [ ] Partner callbacks are IP-whitelisted or time-stamped with replay expiration (maximum drift: 300 seconds).
- [ ] Webhook endpoints enforce duplicate detection and idempotent processing.
