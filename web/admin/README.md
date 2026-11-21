# Watch & Earn — Administrative Operations Manual & Runbook

## 1. Overview
The Watch & Earn Administration system is designed for compliance officers, risk analysts, and financial controllers. It provides administrative controls for managing partner integrations, inspecting wallet liabilities, reviewing withdrawal requests, handling fraud signals, and reconciling ledgers.

## 2. Core Operational Procedures

### 2.1 Withdrawal Review & Approval
1. Navigate to **Withdrawals** in the admin dashboard (`/admin` or `GET /api/v1/admin/withdrawals`).
2. Identify requests in `requested` or `under_review` state.
3. Review associated user risk signals (velocity, device integrity, completion rate).
4. **Approve:** Submits withdrawal to the payout gateway queue (`POST /api/v1/admin/withdrawals/{id}/review` with `action="approve"`).
5. **Reject:** Mandatory reason required. The system atomically executes a compensating ledger refund, returning reserved coins to the user's available balance (`action="reject"`).

### 2.2 Ledger Reconciliation
- The ledger operates on double-entry accounting principles:
  $$\text{Total User Liabilities} = \text{Available} + \text{Pending} + \text{Reserved}$$
- Any manual balance intervention strictly requires an immutable entry in `admin_audit_logs`. Direct database `UPDATE` on balances or ledger entries is prohibited.

### 2.3 Partner Webhook Diagnostics
- Check partner HMAC secret validity in `partners` table.
- Verify that timestamp drift remains under 300 seconds.
- Ensure only partner-approved activities are mapped. AdMob rewarded ads are strictly blocked from cash-redeemable paths.
