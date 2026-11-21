# Watch & Earn — Administrative Control Center & Operations Manual

## 1. Overview
The **Watch & Earn Administrative Control Center** (`web/admin`) is a specialized financial operations, compliance, and fraud monitoring console designed for compliance officers, risk analysts, and treasury controllers. It provides end-to-end administrative controls for managing partner offerwall integrations, auditing double-entry wallet liabilities, reviewing UPI withdrawal requests, inspecting fraud signals, and monitoring immutable audit trails.

---

## 2. Architecture & File Structure

```
web/admin/
├── index.html            # Main single-page admin application HUD
├── css/
│   └── admin.css         # Dark gaming theme design system & cyber components
├── js/
│   └── admin.js          # Operations engine, dual-mode store & state manager
├── images/
│   ├── brand_emblem.png  # High-definition cyber brand shield icon
│   └── brand_wordmark.png# High-definition horizontal brand logo
├── favicon.ico           # Web favicon
├── apple-touch-icon.png  # Apple touch icon
└── README.md             # Operations manual & runbook
```

---

## 3. Dual-Mode Operations Architecture

The Admin Panel features automatic environment detection and a real-time mode toggle:

1. **Live Laravel Backend Mode (`api`)**:
   - Automatically activates when served alongside the Laravel backend (`/api/v1/admin/*`).
   - Dispatches live REST API calls for withdrawal reviews, user status updates, partner listings, ledger streams, and double-entry audits.
2. **Interactive Simulation Mode (`mock`)**:
   - Automatically activates if the backend API is unreachable or if opened as a standalone static file (`file:///.../web/admin/index.html`).
   - Can be toggled manually at any time via the top header **Mode Switch Chip**.
   - Maintains a realistic in-memory ledger and state store with automated compensating ledger refunds on rejection, audit trail logging, and live webhook response simulations.

---

## 4. Key Functional Modules

### 4.1 Executive Overview HUD
- **Top Metrics**:
  - Registered Users (100% 18+ verified with DPDPA consent)
  - Verified Completions (Sponsored partner activities)
  - Total Outstanding Liabilities ($\text{Available} + \text{Pending} + \text{Reserved}$)
  - Total Settled Payouts (Realized UPI disbursements)
- **Google AdMob Policy Gate**:
  - Enforces Google Play and AdMob policies. Rewarded ad units are strictly isolated to non-cash virtual achievements.
  - Cash-redeemable coins originate 100% from cryptographically signed HMAC partner offerwalls.
- **Double-Entry Mathematical Invariant Checker**:
  - Real-time one-click mathematical audit verifying that total system liabilities equal the sum of available, pending, and reserved buckets with zero unallocated coins.

### 4.2 Withdrawal Queue & Review Workflow
- **Filter Tabs**: All Requests, Requested, Under Review, Approved, Paid, Rejected.
- **Search**: Search by UPI VPA (`@okhdfcbank`, `@paytm`, `@ybl`, etc.), User Name, Phone number, or Withdrawal ID.
- **Review Dialog**:
  - **Approve**: Advances withdrawal status to `approved` for payment processor batch submission.
  - **Reject**: Requires a mandatory operational reason. Atomically executes a compensating refund, unlocking the reserved coins and crediting them back to the user's `available` wallet account.
- **CSV Export**: One-click download of pending or completed withdrawals formatted for banking payout gateways.

### 4.3 Users & Risk Profiling
- Inspect player KYC status (18+ verified, DPDPA data retention consent).
- Real-time balances breakdown (`available`, `pending`, `reserved`, `paid`).
- Suspend or activate accounts with mandatory audit justifications.

### 4.4 Double-Entry Ledger Transactions
- Displays the immutable chronological transaction journal.
- Tracks credits and debits across `available`, `pending`, `reserved`, `paid`, and `settlement` accounts.
- Enforces the integer paise invariant:
  $$\text{paise} = \lfloor\text{coins} / 10\rfloor$$

### 4.5 Partner Integrations & Webhook Simulator
- Partner catalog: AdGate Media, OfferToro, Revenue Universe, CPAlead, Google AdMob (Isolated).
- **HMAC Postback Simulator**: Send simulated signed postbacks to test partner attribution, timestamp drift validation (<300s), and event deduplication.

### 4.6 Fraud & Velocity Controls
- Velocity limit enforcement: 1 withdrawal request per 24 hours per user.
- Daily earnings cap: 10 completions per user per day, 200 coins maximum.
- Device integrity signals: Root, emulator (BlueStacks/NOX), and proxy detection.

### 4.7 Support Disputes & Immutable Audit Trail
- Manage missing reward inquiries and payout delay tickets.
- Immutable log of all administrative actions (timestamp, admin ID, IP, target ID, action, and mandatory reason).

---

## 5. Local Development & Testing

### Running Standalone
Simply open `web/admin/index.html` in any modern web browser or serve with a static HTTP server:
```bash
cd watch-earn.app/web/admin
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

### Running with Laravel Backend
Start the Laravel development server:
```bash
cd watch-earn.app/web/backend
php artisan serve
# Open http://localhost:8000/admin in your browser
```
All API calls will automatically connect to `http://localhost:8000/api/v1/admin/*`.
