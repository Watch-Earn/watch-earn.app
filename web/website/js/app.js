document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Interactive Coin & Rupee Calculator ---
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

  // --- 2. Interactive Swipeable App Showcase ---
  const showcaseData = [
    {
      key: 'home',
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
    {
      key: 'tasks',
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
    {
      key: 'earn',
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
    {
      key: 'upi',
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
  ];

  let currentSlide = 0;
  const totalSlides = showcaseData.length;

  const phoneTrack = document.getElementById('phoneTrack');
  const phoneMockup = document.getElementById('phoneShowcaseMockup');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const stageDots = document.querySelectorAll('.stage-dot');
  const prevBtn = document.getElementById('phonePrevBtn');
  const nextBtn = document.getElementById('phoneNextBtn');

  const stageTag = document.getElementById('showcaseTag');
  const stageTitle = document.getElementById('showcaseTitle');
  const stageDesc = document.getElementById('showcaseDesc');
  const stageBullets = document.getElementById('showcaseBullets');
  const stageStatVal = document.getElementById('showcaseStatVal');
  const stageStatSub = document.getElementById('showcaseStatSub');

  function updateInfo(index) {
    const data = showcaseData[index];
    if (!data) return;

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
  }

  function goToSlide(index, animate = true) {
    // Clamp
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    currentSlide = index;

    // Update track position
    if (phoneTrack) {
      if (animate) {
        phoneTrack.classList.remove('is-dragging');
      } else {
        phoneTrack.classList.add('is-dragging');
      }
      phoneTrack.style.transform = `translateX(-${currentSlide * 25}%)`;
    }

    // Update Tabs
    tabButtons.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentSlide);
    });

    // Update Dots
    stageDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });

    // Update Text Details
    updateInfo(currentSlide);
  }

  // Tab button click handlers
  tabButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => goToSlide(idx));
  });

  // Dots click handlers
  stageDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => goToSlide(idx));
  });

  // Prev / Next button click handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) goToSlide(currentSlide - 1);
      else goToSlide(totalSlides - 1); // loop
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
      else goToSlide(0); // loop
    });
  }

  // --- SWIPE & DRAG GESTURE HANDLERS ---
  if (phoneMockup && phoneTrack) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDragging = false;
    let isTouch = false;

    // Helper: start drag
    function startDrag(clientX, clientY, touch = false) {
      isDragging = true;
      isTouch = touch;
      startX = clientX;
      startY = clientY;
      currentX = clientX;
      phoneTrack.classList.add('is-dragging');
      phoneMockup.classList.add('is-dragging');
    }

    // Helper: move drag
    function moveDrag(clientX, clientY, event) {
      if (!isDragging) return;
      currentX = clientX;
      const diffX = currentX - startX;
      const diffY = clientY - startY;

      // If vertical scroll is dominant on touch, allow browser to scroll
      if (isTouch && Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffX) < 10) {
        return;
      }

      if (event && event.cancelable) {
        event.preventDefault();
      }

      const mockupWidth = phoneMockup.offsetWidth || 260;
      const percentOffset = (diffX / mockupWidth) * 25; // 25% is one slide
      const basePercent = -(currentSlide * 25);
      phoneTrack.style.transform = `translateX(${basePercent + percentOffset}%)`;
    }

    // Helper: end drag
    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      phoneTrack.classList.remove('is-dragging');
      phoneMockup.classList.remove('is-dragging');

      const diffX = currentX - startX;
      const threshold = 40; // min 40px drag to switch

      if (diffX < -threshold && currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
      } else if (diffX > threshold && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      } else {
        // Snap back
        goToSlide(currentSlide);
      }
    }

    // Touch events
    phoneMockup.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    }, { passive: true });

    phoneMockup.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        moveDrag(e.touches[0].clientX, e.touches[0].clientY, e);
      }
    }, { passive: false });

    phoneMockup.addEventListener('touchend', endDrag);
    phoneMockup.addEventListener('touchcancel', endDrag);

    // Mouse drag events
    phoneMockup.addEventListener('mousedown', (e) => {
      startDrag(e.clientX, e.clientY, false);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging && !isTouch) {
        moveDrag(e.clientX, e.clientY, e);
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging && !isTouch) {
        endDrag();
      }
    });

    // Keyboard navigation (Left / Right arrow keys)
    window.addEventListener('keydown', (e) => {
      // Check if showcase is in viewport or active
      const rect = phoneMockup.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        if (e.key === 'ArrowLeft') {
          if (currentSlide > 0) goToSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight') {
          if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
        }
      }
    });
  }
});
