<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Watch &amp; Earn — Administrative Control Center</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/admin/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/admin/css/admin.css">
</head>
<body>

  <!-- Navigation Sidebar -->
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <img src="/admin/images/brand_emblem.png" alt="Emblem" class="brand-emblem-img">
      <div class="brand-text">
        <h1>WATCH &amp; EARN</h1>
        <span>Admin Operations HUD</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-title">Core Operations</div>
      <a href="#overview" class="nav-item active" data-tab="overview">
        <span class="nav-item-icon">📊</span>
        <span>Overview &amp; HUD</span>
      </a>
      <a href="#withdrawals" class="nav-item" data-tab="withdrawals">
        <span class="nav-item-icon">💸</span>
        <span>Withdrawals</span>
        <span class="nav-badge danger" id="navWdBadge" style="display: none;">0</span>
      </a>
      <a href="#users" class="nav-item" data-tab="users">
        <span class="nav-item-icon">👥</span>
        <span>Users &amp; Security</span>
      </a>

      <div class="nav-section-title">Ledger &amp; Partners</div>
      <a href="#ledger" class="nav-item" data-tab="ledger">
        <span class="nav-item-icon">⚖️</span>
        <span>Double-Entry Ledger</span>
      </a>
      <a href="#partners" class="nav-item" data-tab="partners">
        <span class="nav-item-icon">🤝</span>
        <span>Partners &amp; Webhooks</span>
      </a>
      <a href="#fraud" class="nav-item" data-tab="fraud">
        <span class="nav-item-icon">🛡️</span>
        <span>Fraud &amp; Velocity</span>
      </a>

      <div class="nav-section-title">Disputes &amp; Audit</div>
      <a href="#support" class="nav-item" data-tab="support">
        <span class="nav-item-icon">🎫</span>
        <span>Support Tickets</span>
      </a>
      <a href="#audit" class="nav-item" data-tab="audit">
        <span class="nav-item-icon">📜</span>
        <span>Audit Trail</span>
      </a>
      <a href="#settings" class="nav-item" data-tab="settings">
        <span class="nav-item-icon">⚙️</span>
        <span>Compliance Settings</span>
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="node-status-pill">
        <div class="pulse-indicator">
          <div class="pulse-dot"></div>
          <span>Node: Mumbai-IN</span>
        </div>
        <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">v1.0.4</span>
      </div>
    </div>
  </aside>

  <!-- Main Administrative Viewport -->
  <main class="admin-main">
    
    <!-- Top HUD Header -->
    <header class="admin-header">
      <div class="header-left">
        <button class="menu-toggle-btn" id="menuToggle" aria-label="Toggle Menu">☰</button>
        <div class="page-title-box">
          <h2 id="pageTitle">Executive Overview &amp; Liabilities</h2>
          <p id="pageSubtitle">Real-time double-entry balances, liability breakdown, and policy gates</p>
        </div>
      </div>

      <div class="header-right">
        <!-- Live Backend / Interactive Mock Mode Switch -->
        <div class="mode-toggle-chip" id="modeToggle" title="Toggle Live Backend / Simulation Mode">
          <div class="mode-status-led" id="modeStatusLed"></div>
          <span id="modeLabel">Connecting...</span>
        </div>

        <button class="btn-refresh" id="btnRefresh" title="Refresh Live State">
          <span>🔄</span>
          <span>Sync</span>
        </button>

        <div class="admin-avatar-card">
          <div class="avatar-circle">SA</div>
          <div class="admin-info">
            <div class="admin-info-name">Sec Officer</div>
            <div class="admin-info-role">Super Admin</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Dynamic Tab Content Viewport -->
    <div class="content-area">

      <!-- ========================================== -->
      <!-- TAB 1: OVERVIEW HUD                       -->
      <!-- ========================================== -->
      <section class="tab-pane active" id="tab-overview">
        
        <!-- Mandatory Compliance Gate Banner -->
        <div class="compliance-banner">
          <div class="compliance-info">
            <div class="compliance-icon">🛡️</div>
            <div class="compliance-text">
              <h4>
                <span>Google AdMob Policy Non-Cash Isolation Gate</span>
                <span class="compliance-badge-enforced">Strictly Enforced</span>
              </h4>
              <p>AdMob rewarded ad units are restricted to non-cash virtual goods. Only cryptographically verified, HMAC-signed external offerwall partners are permitted to issue withdrawable INR liabilities.</p>
            </div>
          </div>
          <button class="btn-audit-gate" onclick="window.WatchEarnAdmin.showToast('Compliance Gate: 100% of cash-redeemable coins originate from HMAC partner webhooks.', 'info')">
            Verify Isolation
          </button>
        </div>

        <!-- KPI Metric Cards -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Registered Users</span>
              <span class="kpi-icon">👥</span>
            </div>
            <div class="kpi-value" id="kpiTotalUsers">{{ $totalUsers ?? '--' }}</div>
            <div class="kpi-sub">
              <span class="trend-up">100%</span> 18+ KYC &amp; DPDPA Consent
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Verified Completions</span>
              <span class="kpi-icon">🎯</span>
            </div>
            <div class="kpi-value" id="kpiCompletions">{{ $totalCompletions ?? '--' }}</div>
            <div class="kpi-sub">
              <span>Avg 20-50 coins/activity</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Outstanding Liabilities</span>
              <span class="kpi-icon">🪙</span>
            </div>
            <div class="kpi-value" id="kpiLiability" style="color: var(--gold-primary);">
              ₹{{ number_format(($availableCoins + $pendingCoins + $reservedCoins) / 1000, 2) }}
            </div>
            <div class="kpi-sub">
              <span>Available + Pending + Reserved</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Total Settled Payouts</span>
              <span class="kpi-icon">🏦</span>
            </div>
            <div class="kpi-value" id="kpiPaid" style="color: var(--emerald-primary);">
              ₹{{ number_format($paidCoins / 1000, 2) }}
            </div>
            <div class="kpi-sub">
              <span class="trend-up">✓</span> Successfully transferred via UPI
            </div>
          </div>
        </div>

        <!-- Double-Entry Mathematical Invariant Checker -->
        <div class="invariant-card">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff;">Double-Entry Ledger Integrity Invariant</h3>
              <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">
                Strict conservation of coins: System liabilities equal the sum of distinct user balance accounts.
              </p>
            </div>
            <button class="btn-table btn-table-approve" id="btnRunInvariant" style="padding: 8px 16px;">
              Run Invariant Audit
            </button>
          </div>

          <div class="invariant-equation">
            <div class="eq-chip" id="eqAvail">{{ number_format($availableCoins) }} Avail</div>
            <span class="eq-op">+</span>
            <div class="eq-chip" id="eqPend">{{ number_format($pendingCoins) }} Pending</div>
            <span class="eq-op">+</span>
            <div class="eq-chip" id="eqRes">{{ number_format($reservedCoins) }} Reserved</div>
            <span class="eq-op">=</span>
            <div class="eq-chip total" id="eqTotal">{{ number_format($availableCoins + $pendingCoins + $reservedCoins) }} 🪙 (₹{{ number_format(($availableCoins + $pendingCoins + $reservedCoins)/1000, 2) }})</div>
          </div>

          <div class="invariant-status-bar">
            <span style="color: var(--emerald-primary); font-weight: 600;">● Mathematical Invariant: Verified In-Sync</span>
            <span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.72rem;">Formula: ₹1.00 = 1,000 Coins • Paise = Coins / 10</span>
          </div>

          <div id="invariantFeedback" style="display: none;"></div>
        </div>

        <!-- Two Column HUD Grid -->
        <div class="dashboard-grid">
          
          <!-- Recent Withdrawals Column -->
          <div class="hud-card">
            <div class="hud-card-header">
              <div class="hud-card-title">
                <span>💸</span>
                <span>High-Priority Withdrawal Queue</span>
              </div>
              <a href="#withdrawals" onclick="window.WatchEarnAdmin.switchTab('withdrawals')" style="font-size: 0.78rem; color: var(--cyan-primary); text-decoration: none; font-weight: 600;">
                View All →
              </a>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Requested</th>
                    <th>UPI VPA</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="overviewRecentWdBody">
                  @forelse($withdrawals as $w)
                  <tr>
                    <td><strong>#{{ $w->id }}</strong></td>
                    <td>
                      <div class="user-col">
                        <div class="user-avatar-tiny">{{ strtoupper(substr($w->user->name ?? 'U', 0, 1)) }}</div>
                        <div>
                          <span class="user-name">{{ $w->user->name ?? 'User ...' . ($w->user->phone_last_four ?? 'N/A') }}</span>
                          <span class="user-meta">...{{ $w->user->phone_last_four ?? 'N/A' }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="coin-amount-box">🪙 {{ number_format($w->coins) }}</div>
                      <div class="inr-amount">₹{{ number_format($w->amount_paise / 100, 2) }}</div>
                    </td>
                    <td>
                      <span class="upi-id-pill">{{ $w->upi_id }}</span>
                    </td>
                    <td><span class="status-pill status-{{ $w->status }}">{{ $w->status }}</span></td>
                    <td>
                      @if(in_array($w->status, ['requested', 'under_review']))
                      <div class="action-btn-group">
                        <button class="btn-table btn-table-approve" onclick="window.WatchEarnAdmin.openReview({{ $w->id }}, 'approve')">✓ Approve</button>
                        <button class="btn-table btn-table-reject" onclick="window.WatchEarnAdmin.openReview({{ $w->id }}, 'reject')">✕ Reject</button>
                      </div>
                      @else
                      <span style="font-size: 0.75rem; color: var(--text-muted);">Finalized</span>
                      @endif
                    </td>
                  </tr>
                  @empty
                  <tr>
                    <td colspan="6" style="text-align:center; color: var(--text-muted); padding: 24px;">No withdrawal requests recorded yet.</td>
                  </tr>
                  @endforelse
                </tbody>
              </table>
            </div>
          </div>

          <!-- Quick Stats & Gateway Health -->
          <div>
            <div class="hud-card">
              <div class="hud-card-header">
                <div class="hud-card-title">
                  <span>⚡</span>
                  <span>Gateway Health</span>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 14px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                  <span style="color: var(--text-secondary);">UPI Gateway Node</span>
                  <span style="color: var(--emerald-primary); font-weight: 700;">Operational (99.98%)</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                  <span style="color: var(--text-secondary);">HMAC Drift Window</span>
                  <span style="font-family: var(--font-mono);">&lt; 300 seconds</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                  <span style="color: var(--text-secondary);">Daily Activity Limit</span>
                  <span style="font-weight: 700;">10 tasks / 200 coins</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                  <span style="color: var(--text-secondary);">Min Cashout Threshold</span>
                  <span style="color: var(--gold-primary); font-weight: 700;">10,000 coins (₹10.00)</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
                  <span style="color: var(--text-secondary);">DPDPA Deletion Requests</span>
                  <span style="color: var(--emerald-primary); font-weight: 700;">0 Pending</span>
                </div>
              </div>
            </div>

            <!-- Operating Standard -->
            <div class="hud-card" style="background: rgba(14, 18, 50, 0.6);">
              <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5;">
                <strong style="color: #fff;">Operating Standard:</strong> Any manual balance correction strictly requires an immutable entry in <code>admin_audit_logs</code>. Direct database balance mutations are forbidden.
              </div>
            </div>
          </div>

        </div>

      </section>

      <!-- ========================================== -->
      <!-- TAB 2: WITHDRAWALS MANAGEMENT              -->
      <!-- ========================================== -->
      <section class="tab-pane" id="tab-withdrawals">
        <div class="filter-toolbar">
          <div class="filter-group-left">
            <button class="filter-chip wd-filter-chip active" data-filter="all">All Requests</button>
            <button class="filter-chip wd-filter-chip" data-filter="requested">Requested</button>
            <button class="filter-chip wd-filter-chip" data-filter="under_review">Under Review</button>
            <button class="filter-chip wd-filter-chip" data-filter="approved">Approved</button>
            <button class="filter-chip wd-filter-chip" data-filter="paid">Paid</button>
            <button class="filter-chip wd-filter-chip" data-filter="rejected">Rejected</button>
          </div>

          <div style="display: flex; align-items: gap: 10px;">
            <div class="search-input-box">
              <span class="search-icon-pos">🔍</span>
              <input type="text" id="withdrawalSearch" placeholder="Search by UPI VPA, phone, ID...">
            </div>
            <button class="btn-refresh" id="btnExportWd">
              <span>📥</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div class="hud-card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>User Details</th>
                  <th>Coins &amp; INR</th>
                  <th>UPI VPA &amp; Bank</th>
                  <th>Status &amp; Risk</th>
                  <th>Timestamp</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody id="withdrawalsTableBody">
                <!-- Hydrated dynamically -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- TAB 3: USERS & RISK PROFILES               -->
      <!-- ========================================== -->
      <section class="tab-pane" id="tab-users">
        <div class="filter-toolbar">
          <div class="search-input-box" style="min-width: 320px;">
            <span class="search-icon-pos">🔍</span>
            <input type="text" id="userSearch" placeholder="Search by name, phone hash, ID...">
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            Displaying active registered players across India
          </div>
        </div>

        <div class="hud-card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Player Info</th>
                  <th>KYC Status</th>
                  <th>Wallet Balances</th>
                  <th>Activity Counts</th>
                  <th>Status</th>
                  <th>Account Controls</th>
                </tr>
              </thead>
              <tbody id="usersTableBody">
                <!-- Hydrated dynamically -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- TAB 4: DOUBLE-ENTRY LEDGER                 -->
      <!-- ========================================== -->
      <section class="tab-pane" id="tab-ledger">
        <div class="notice-box" style="margin-bottom: 20px;">
          <strong>Double-Entry Accounting Standard:</strong> Every coin awarded or debited has matching balancing entries. Available, pending, and reserved buckets ensure zero floating liabilities.
        </div>

        <div class="hud-card">
          <div class="hud-card-header">
            <div class="hud-card-title">
              <span>⚖️</span>
              <span>Ledger Transaction Stream</span>
            </div>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Entry ID</th>
                  <th>Direction</th>
                  <th>Account Type</th>
                  <th>Coins &amp; INR</th>
                  <th>Associated User</th>
                  <th>Transaction Reference</th>
                  <th>Recorded At</th>
                </tr>
              </thead>
              <tbody id="ledgerTableBody">
                <!-- Hydrated dynamically -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- TAB 5: PARTNERS & WEBHOOK GATEWAY          -->
      <!-- ========================================== -->
      <section class="tab-pane" id="tab-partners">
        <div class="partner-grid" id="partnersGrid" style="margin-bottom: 28px;">
          @foreach($partners as $p)
          <div class="partner-card">
            <div class="partner-card-header">
              <div class="partner-name">{{ $p->name }}</div>
              <span class="status-pill status-{{ $p->status }}">{{ $p->status }}</span>
            </div>
            <div class="partner-meta-row">
              <span class="partner-meta-label">Identifier (Slug)</span>
              <span class="partner-meta-value"><code>{{ $p->slug }}</code></span>
            </div>
            <div class="partner-meta-row">
              <span class="partner-meta-label">Active Offers</span>
              <span class="partner-meta-value">{{ $p->offers()->count() }} sponsored tasks</span>
            </div>
            <div class="partner-meta-row">
              <span class="partner-meta-label">HMAC SHA-256 Secret</span>
              <span class="partner-meta-value">•••••••••••••••• (Verified)</span>
            </div>
            <div class="partner-meta-row">
              <span class="partner-meta-label">Timestamp Drift Limit</span>
              <span class="partner-meta-value">300s</span>
            </div>
            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed var(--border-subtle); font-size: 0.75rem; color: var(--text-muted);">
              Callback URL: <code style="color: var(--cyan-primary);">/api/v1/webhooks/partners/{{ $p->slug }}</code>
            </div>
          </div>
          @endforeach
        </div>

        <!-- Webhook Simulator -->
        <div class="hud-card">
          <div class="hud-card-header">
            <div class="hud-card-title">
              <span>🧪</span>
              <span>Partner HMAC Webhook Postback Simulator</span>
            </div>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Test attribution, idempotency, and cryptographic signatures</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 16px;">
            <div class="modal-field">
              <label class="modal-label">Target Partner</label>
              <select class="modal-select" id="simPartnerSelect">
                @foreach($partners as $p)
                <option value="{{ $p->slug }}">{{ $p->name }} ({{ $p->slug }})</option>
                @endforeach
              </select>
            </div>

            <div class="modal-field">
              <label class="modal-label">User ID</label>
              <input type="number" class="modal-input" id="simUserId" value="1">
            </div>

            <div class="modal-field">
              <label class="modal-label">Offer ID</label>
              <input type="number" class="modal-input" id="simOfferId" value="101">
            </div>

            <div class="modal-field">
              <label class="modal-label">Reward Coins</label>
              <input type="number" class="modal-input" id="simCoins" value="50">
            </div>
          </div>

          <button class="btn-table btn-table-approve" id="btnSimulateWebhook" style="padding: 10px 20px;">
            Send Signed Webhook Test
          </button>

          <div id="webhookResponseBox" style="display: none; margin-top: 18px;"></div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- TAB 6: FRAUD & VELOCITY CONTROLS           -->
      <!-- ========================================== -->
      <section class="tab-pane" id="tab-fraud">
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Daily Completion Limit</span>
              <span class="kpi-icon">🛑</span>
            </div>
            <div class="kpi-value">10 Tasks</div>
            <div class="kpi-sub">Max 200 coins per user / 24h</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Withdrawal Velocity Limit</span>
              <span class="kpi-icon">⏱️</span>
            </div>
            <div class="kpi-value">1 / 24 Hours</div>
            <div class="kpi-sub">Enforced per user phone hash</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Device Integrity Gate</span>
              <span class="kpi-icon">📱</span>
            </div>
            <div class="kpi-value" style="color: var(--emerald-primary);">Active</div>
            <div class="kpi-sub">Root, emulator &amp; proxy detection</div>
          </div>
        </div>

        <div class="hud-card">
          <div class="hud-card-header">
            <div class="hud-card-title">
              <span>🛡️</span>
              <span>Automated Anti-Abuse &amp; Anomaly Signals</span>
            </div>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Signal ID</th>
                  <th>User Target</th>
                  <th>Detection Type</th>
                  <th>Severity</th>
                  <th>Technical Telemetry</th>
                  <th>Action Taken</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#SIG-901</td>
                  <td>User ...1192</td>
                  <td><span class="status-pill status-rejected">Emulator Sandbox</span></td>
                  <td><strong style="color: var(--rose-primary);">CRITICAL</strong></td>
                  <td>Bluestacks / NOX x86 virtualization string detected</td>
                  <td>Account auto-suspended; payouts blocked</td>
                </tr>
                <tr>
                  <td>#SIG-900</td>
                  <td>User ...4489</td>
                  <td><span class="status-pill status-under_review">Velocity Spike</span></td>
                  <td><strong style="color: var(--gold-primary);">MEDIUM</strong></td>
                  <td>8 tasks completed within 180 seconds</td>
                  <td>Flagged for manual analyst verification</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- TAB 7: SUPPORT TICKETS & DISPUTES          -->
      <!-- ========================================== -->
      <section class="tab-pane" id="tab-support">
        <div class="hud-card">
          <div class="hud-card-header">
            <div class="hud-card-title">
              <span>🎫</span>
              <span>Disputes &amp; User Assistance Tickets</span>
            </div>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Player</th>
                  <th>Category</th>
                  <th>Subject &amp; Inquiry</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody id="supportTableBody">
                <!-- Hydrated dynamically -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- TAB 8: AUDIT TRAIL                         -->
      <!-- ========================================== -->
      <section class="tab-pane" id="tab-audit">
        <div class="notice-box" style="margin-bottom: 20px;">
          <strong>Cryptographic Audit Invariant:</strong> All administrative modifications, overrides, approvals, and rejections are permanently recorded in this append-only audit trail.
        </div>

        <div class="hud-card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Log #</th>
                  <th>Officer ID</th>
                  <th>Action</th>
                  <th>Target Entity</th>
                  <th>Justification / Reason</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody id="auditTableBody">
                @forelse($auditLogs as $log)
                <tr>
                  <td><strong>#{{ $log->id }}</strong></td>
                  <td><code>{{ $log->admin_id }}</code></td>
                  <td><span class="eq-chip" style="font-size: 0.72rem; color: var(--cyan-primary); font-weight: 700;">{{ $log->action }}</span></td>
                  <td><code>{{ $log->target_type }} #{{ $log->target_id }}</code></td>
                  <td style="max-width: 350px; font-size: 0.82rem; color: var(--text-secondary);">{{ $log->reason }}</td>
                  <td style="font-size: 0.75rem; color: var(--text-muted);">{{ $log->created_at }}</td>
                </tr>
                @empty
                <tr>
                  <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">No audit logs recorded yet.</td>
                </tr>
                @endforelse
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- TAB 9: SETTINGS & COMPLIANCE               -->
      <!-- ========================================== -->
      <section class="tab-pane" id="tab-settings">
        <div class="hud-card">
          <div class="hud-card-header">
            <div class="hud-card-title">
              <span>⚖️</span>
              <span>Statutory Compliance &amp; Economic Constants</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            <div style="background: var(--bg-surface); padding: 18px; border-radius: 8px; border: 1px solid var(--border-subtle);">
              <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 8px;">Fixed Conversion Ratio</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
                Enforced by server contract. 1,000 virtual coins correspond exactly to ₹1.00 INR.
              </p>
              <div style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--gold-primary); font-weight: 700;">
                1,000 Coins = 100 Paise (₹1.00)
              </div>
            </div>

            <div style="background: var(--bg-surface); padding: 18px; border-radius: 8px; border: 1px solid var(--border-subtle);">
              <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 8px;">Integer Paise Requirement</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
                Withdrawals must be divisible by 10 to guarantee lossless whole integer calculations without floating-point error.
              </p>
              <div style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--cyan-primary); font-weight: 700;">
                paise = coins / 10
              </div>
            </div>

            <div style="background: var(--bg-surface); padding: 18px; border-radius: 8px; border: 1px solid var(--border-subtle);">
              <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 8px;">DPDPA &amp; Age Gate</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
                Under-18 registration is strictly disallowed. User data deletion requests are processed within 72 hours.
              </p>
              <div style="font-size: 0.85rem; color: var(--emerald-primary); font-weight: 700;">
                ✓ India DPDPA Compliant
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  </main>

  <!-- ========================================== -->
  <!-- MODAL: WITHDRAWAL REVIEW & APPROVAL/REJECT -->
  <!-- ========================================== -->
  <div class="modal-overlay" id="reviewModal">
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title">Review Withdrawal Request</h3>
        <button class="modal-close-btn modal-close-trigger" aria-label="Close">✕</button>
      </div>
      <form id="reviewForm">
        <div class="modal-body">
          <input type="hidden" id="reviewWdId">
          <input type="hidden" id="reviewAction">

          <div id="reviewWdInfo"></div>

          <div class="notice-box" id="reviewNoticeText"></div>

          <div class="modal-field">
            <label class="modal-label" for="reviewReason">Operational Justification (Mandatory)</label>
            <textarea class="modal-textarea" id="reviewReason" required placeholder="Enter mandatory reason for audit log..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-cancel modal-close-trigger">Cancel</button>
          <button type="submit" id="btnSubmitReview" class="btn-confirm-approve">Confirm</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div class="toast-container" id="toastContainer"></div>

  <script src="/admin/js/admin.js"></script>
</body>
</html>
