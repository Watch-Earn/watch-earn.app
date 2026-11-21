document.addEventListener('DOMContentLoaded', () => {
  // Calculator Logic
  const coinInput = document.getElementById('coinInput');
  const coinSlider = document.getElementById('coinSlider');
  const inrValue = document.getElementById('inrValue');
  const paiseValue = document.getElementById('paiseValue');
  const statusTag = document.getElementById('statusTag');

  function updateCalculator(coins) {
    let val = parseInt(coins, 10);
    if (isNaN(val) || val < 0) val = 0;

    // Fixed formula:
    // paise = coins / 10
    // inr = coins / 1000
    const paise = Math.floor(val / 10);
    const inr = (val / 1000).toFixed(2);

    if (inrValue) inrValue.textContent = `₹${inr}`;
    if (paiseValue) paiseValue.textContent = `${paise.toLocaleString('en-IN')} paise`;

    // Minimum withdrawal is 10,000 coins (₹10.00)
    if (statusTag) {
      if (val >= 10000) {
        statusTag.textContent = 'Eligible for Payout (≥ 10,000 Coins)';
        statusTag.className = 'res-value status-tag';
      } else {
        const remaining = 10000 - val;
        statusTag.textContent = `Need ${remaining.toLocaleString('en-IN')} more coins`;
        statusTag.className = 'res-value status-tag ineligible';
      }
    }
  }

  if (coinInput && coinSlider) {
    coinInput.addEventListener('input', (e) => {
      let val = e.target.value;
      coinSlider.value = val;
      updateCalculator(val);
    });

    coinSlider.addEventListener('input', (e) => {
      let val = e.target.value;
      coinInput.value = val;
      updateCalculator(val);
    });

    updateCalculator(coinInput.value);
  }

  // Showcase Tabs Switching Logic
  const tabData = {
    home: {
      img: 'images/screen_tab_home.png',
      tag: 'FEATURE 01 • OVERVIEW',
      title: 'Home Dashboard & Balances',
      desc: 'Get instant visibility into your available coins, pending hold balance, daily activity completions, and live rupee valuation computed to the exact paise.',
      bullets: [
        'Available vs. Pending hold balances updated in real time.',
        'Fixed conversion rate: 1,000 Coins = ₹1.00 always visible.',
        'Daily completions counter to encourage responsible, healthy usage.'
      ],
      statVal: '₹10.00 Min Payout',
      statSub: '10,000 Coins Threshold'
    },
    tasks: {
      img: 'images/screen_tab_tasks.png',
      tag: 'FEATURE 02 • ACTIVITIES',
      title: 'Sponsored Partner Tasks',
      desc: 'Browse advertiser-sponsored surveys, feedback questionnaires, and brand tasks with fully disclosed duration and reward amounts prior to starting.',
      bullets: [
        'Clear expectations: exact coin value shown before starting.',
        'Strictly excludes non-compliant ad units for monetary compensation.',
        'Daily standard cap of 10 completions to safeguard engagement.'
      ],
      statVal: '20 Coins / Task',
      statSub: 'Verified Partner Offerwalls'
    },
    earn: {
      img: 'images/screen_tab_earn.png',
      tag: 'FEATURE 03 • SECURITY',
      title: 'Cryptographic Verification',
      desc: 'Completions are authenticated via HMAC SHA-256 partner postbacks. Coins are placed into a temporary hold before being released to available balance.',
      bullets: [
        'Immutable double-entry ledger entry generated for every credit.',
        'Automatic hold period ensures traffic integrity and prevents bot abuse.',
        'Compensating refunds applied automatically if an advertiser revokes a lead.'
      ],
      statVal: '24h Hold Period',
      statSub: 'Fraud Protection Window'
    },
    upi: {
      img: 'images/screen_tab_upi.png',
      tag: 'FEATURE 04 • WITHDRAWALS',
      title: 'Direct UPI Bank Transfers',
      desc: 'Once you accumulate 10,000 coins (₹10.00), submit your Indian UPI ID for automated, transparent payout processing straight to your bank account.',
      bullets: [
        'Supported on Google Pay, PhonePe, Paytm, BHIM, and all bank UPI apps.',
        'Coins are reserved atomically to prevent duplicate payout attempts.',
        'Detailed immutable audit logs maintain full financial compliance.'
      ],
      statVal: '100% Payout Rate',
      statSub: 'Verified Indian UPI'
    }
  };

  const tabButtons = document.querySelectorAll('.tab-btn');
  const screenImg = document.getElementById('showcaseScreenImg');
  const stageTag = document.getElementById('showcaseTag');
  const stageTitle = document.getElementById('showcaseTitle');
  const stageDesc = document.getElementById('showcaseDesc');
  const stageBullets = document.getElementById('showcaseBullets');
  const stageStatVal = document.getElementById('showcaseStatVal');
  const stageStatSub = document.getElementById('showcaseStatSub');

  if (tabButtons && screenImg) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-tab');
        const data = tabData[key];
        if (!data) return;

        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Smooth transition
        screenImg.style.opacity = '0';
        setTimeout(() => {
          screenImg.src = data.img;
          screenImg.style.opacity = '1';
        }, 150);

        if (stageTag) stageTag.textContent = data.tag;
        if (stageTitle) stageTitle.textContent = data.title;
        if (stageDesc) stageDesc.textContent = data.desc;
        if (stageStatVal) stageStatVal.textContent = data.statVal;
        if (stageStatSub) stageStatSub.textContent = data.statSub;

        if (stageBullets) {
          stageBullets.innerHTML = data.bullets.map(b => `
            <li>
              <span class="check-icon">✓</span>
              <span>${b}</span>
            </li>
          `).join('');
        }
      });
    });
  }
});
