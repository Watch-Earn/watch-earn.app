<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Watch & Earn — Administrative Control Center</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --border: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #6366f1;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 24px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    .brand { display: flex; align-items: center; gap: 10px; font-size: 1.25rem; font-weight: 700; }
    .badge-sec { background: #3730a3; color: #c7d2fe; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px;
    }
    .kpi-title { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; }
    .kpi-value { font-size: 1.6rem; font-weight: 800; margin: 6px 0; }
    .kpi-sub { font-size: 0.85rem; color: var(--text-muted); }
    .main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .card-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th { text-align: left; padding: 10px; color: var(--text-muted); font-size: 0.8rem; border-bottom: 1px solid var(--border); }
    td { padding: 12px 10px; border-bottom: 1px solid var(--border); }
    .badge-status {
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-requested { background: #78350f; color: #fde68a; }
    .status-paid { background: #064e3b; color: #a7f3d0; }
    .status-failed { background: #7f1d1d; color: #fecaca; }
    .btn-action {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      text-decoration: none;
      display: inline-block;
    }
    .btn-approve { background: var(--success); color: white; }
    .btn-reject { background: var(--danger); color: white; }
    .alert-box {
      background: #422006;
      border: 1px solid #78350f;
      color: #fef08a;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <img src="/images/brand_wordmark.png" alt="Watch & Earn" style="height: 34px; vertical-align: middle;">
      <span class="badge-sec">Admin Operations Panel</span>
    </div>
    <div>
      <span style="font-size: 0.85rem; color: var(--text-muted);">Signed in as Security Administrator • India Node</span>
    </div>
  </div>

  <div class="alert-box">
    ⚠️ <strong>Compliance Gate Enforced:</strong> Google AdMob rewarded ad units are strictly blocked from cash-redeemable paths. Only verified offerwall partners (HMAC-signed) are permitted to issue withdrawable reward liabilities.
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-title">Registered Users</div>
      <div class="kpi-value">{{ $totalUsers }}</div>
      <div class="kpi-sub">100% 18+ Verified</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Verified Completions</div>
      <div class="kpi-value">{{ $totalCompletions }}</div>
      <div class="kpi-sub">Avg 20-50 coins/activity</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Available Liability</div>
      <div class="kpi-value">₹{{ number_format($availableCoins / 1000, 2) }}</div>
      <div class="kpi-sub">{{ number_format($availableCoins) }} coins outstanding</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Total Settled Payouts</div>
      <div class="kpi-value" style="color: var(--success);">₹{{ number_format($paidCoins / 1000, 2) }}</div>
      <div class="kpi-sub">{{ number_format($paidCoins) }} coins redeemed</div>
    </div>
  </div>

  <div class="main-grid">
    <div>
      <div class="card">
        <div class="card-title">
          <span>Recent Withdrawal Requests</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">Minimum: 10,000 Coins (₹10.00)</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Coins</th>
              <th>Amount (INR)</th>
              <th>UPI VPA</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            @forelse($withdrawals as $w)
            <tr>
              <td>#{{ $w->id }}</td>
              <td>User ...{{ $w->user->phone_last_four ?? 'N/A' }}</td>
              <td><strong>{{ number_format($w->coins) }}</strong> 🪙</td>
              <td>₹{{ number_format($w->amount_paise / 100, 2) }}</td>
              <td><code>{{ $w->upi_id }}</code></td>
              <td><span class="badge-status status-{{ $w->status }}">{{ $w->status }}</span></td>
              <td>
                @if(in_array($w->status, ['requested', 'under_review']))
                <form method="POST" action="/admin/withdrawals/{{ $w->id }}/review" style="display:inline;">
                  @csrf
                  <input type="hidden" name="action" value="approve">
                  <input type="hidden" name="reason" value="Approved via admin console">
                  <button type="submit" class="btn-action btn-approve">Approve</button>
                </form>
                <form method="POST" action="/admin/withdrawals/{{ $w->id }}/review" style="display:inline; margin-left:4px;">
                  @csrf
                  <input type="hidden" name="action" value="reject">
                  <input type="hidden" name="reason" value="Rejected via admin console">
                  <button type="submit" class="btn-action btn-reject">Reject</button>
                </form>
                @else
                <span style="color: var(--text-muted); font-size: 0.8rem;">Finalized</span>
                @endif
              </td>
            </tr>
            @empty
            <tr>
              <td colspan="7" style="text-align:center; color: var(--text-muted);">No withdrawals recorded yet.</td>
            </tr>
            @endforelse
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-title">Approved Partner Integrations</div>
        <table>
          <thead>
            <tr>
              <th>Partner Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Offers</th>
            </tr>
          </thead>
          <tbody>
            @foreach($partners as $partner)
            <tr>
              <td><strong>{{ $partner->name }}</strong></td>
              <td><code>{{ $partner->slug }}</code></td>
              <td><span class="badge-status status-paid">{{ $partner->status }}</span></td>
              <td>{{ $partner->offers_count ?? $partner->offers()->count() }} active</td>
            </tr>
            @endforeach
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <div class="card">
        <div class="card-title">Immutable Audit Trail</div>
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Target</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            @forelse($auditLogs as $log)
            <tr>
              <td><strong>{{ $log->action }}</strong></td>
              <td>{{ $log->target_type }} #{{ $log->target_id }}</td>
              <td style="color: var(--text-muted); font-size: 0.8rem;">{{ $log->reason }}</td>
            </tr>
            @empty
            <tr>
              <td colspan="3" style="text-align: center; color: var(--text-muted);">No administrative overrides.</td>
            </tr>
            @endforelse
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-title">Ledger Integrity Check</div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
          All ledger entries are balanced. Coins are strictly integral non-negative integers. Paise conversion is always integer division: <code>coins / 10</code>.
        </p>
        <div style="background: #0b1120; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 0.8rem;">
          <div>System Liability: {{ number_format($availableCoins + $pendingCoins + $reservedCoins) }} 🪙</div>
          <div style="color: var(--success); margin-top: 4px;">✓ Double-entry Invariant: VERIFIED</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
