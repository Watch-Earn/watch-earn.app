document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Interactive Coin & Rupee Calculator (High-Tech FinTech Engine) ---
  const coinInput = document.getElementById('coinInput');
  const coinSlider = document.getElementById('coinSlider');
  const inrValue = document.getElementById('inrValue');
  const paiseValue = document.getElementById('paiseValue');
  const statusTag = document.getElementById('statusTag');
  const cardStatusPill = document.getElementById('cardStatusPill');
  const calcProgressBar = document.getElementById('calcProgressBar');
  const calcProgressPercent = document.getElementById('calcProgressPercent');
  const calcProgressHint = document.getElementById('calcProgressHint');
  const presetButtons = document.querySelectorAll('.preset-btn');

  function updateCalculator(coins) {
    let val = parseInt(coins, 10);
    if (isNaN(val) || val < 0) val = 0;

    // Fixed formula:
    // paise = coins / 10
    // inr = coins / 1000
    const paise = Math.floor(val / 10);
    const inr = (val / 1000).toFixed(2);

    if (inrValue) inrValue.textContent = inr;
    if (paiseValue) paiseValue.textContent = `Integral: ${paise.toLocaleString('en-IN')} paise`;

    // Calculate progress towards minimum 10,000 threshold
    const percent = Math.min(100, Math.floor((val / 10000) * 100));
    if (calcProgressBar) calcProgressBar.style.width = `${percent}%`;
    if (calcProgressPercent) calcProgressPercent.textContent = `${percent}%`;

    // Minimum withdrawal threshold is 10,000 coins (₹10.00)
    if (val >= 10000) {
      if (statusTag) statusTag.textContent = 'Eligible for Payout';
      if (cardStatusPill) {
        cardStatusPill.className = 'upi-status-pill eligible';
      }
      if (calcProgressHint) {
        calcProgressHint.textContent = '✓ Payout threshold reached! Unlocked for instant UPI transfer.';
        calcProgressHint.className = 'progress-hint';
      }
    } else {
      const remaining = 10000 - val;
      if (statusTag) statusTag.textContent = `Need ${remaining.toLocaleString('en-IN')} Coins`;
      if (cardStatusPill) {
        cardStatusPill.className = 'upi-status-pill ineligible';
      }
      if (calcProgressHint) {
        calcProgressHint.textContent = `Need ${remaining.toLocaleString('en-IN')} more coins to reach ₹10.00 threshold.`;
        calcProgressHint.className = 'progress-hint ineligible';
      }
    }

    // Active preset button sync
    if (presetButtons) {
      presetButtons.forEach(btn => {
        const btnVal = parseInt(btn.getAttribute('data-value'), 10);
        if (btnVal === val) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
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

    if (presetButtons) {
      presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.getAttribute('data-value');
          coinInput.value = val;
          coinSlider.value = val;
          updateCalculator(val);
        });
      });
    }

    updateCalculator(coinInput.value);
  }

  // --- 1.5. Interactive Hero Section (3D Parallax, Screen Dock & Reward Simulator) ---
  const heroSection = document.getElementById('heroSection');
  const heroSpotlight = document.getElementById('heroSpotlight');
  const heroPhoneWrapper = document.getElementById('heroPhoneWrapper');
  const heroPhoneDevice = document.getElementById('heroPhoneDevice');
  const heroPhoneScreenImg = document.getElementById('heroPhoneScreenImg');
  const heroBadgeTop = document.getElementById('heroBadgeTop');
  const heroBadgeBottom = document.getElementById('heroBadgeBottom');
  const heroTopBadgeTitle = document.getElementById('heroTopBadgeTitle');
  const heroTopBadgeSub = document.getElementById('heroTopBadgeSub');
  const heroBottomBadgeTitle = document.getElementById('heroBottomBadgeTitle');
  const heroBottomBadgeSub = document.getElementById('heroBottomBadgeSub');
  const heroSimulateBtn = document.getElementById('heroSimulateBtn');
  const dockButtons = document.querySelectorAll('.dock-btn');

  // Ambient Spotlight tracking on Hero Section
  if (heroSection && heroSpotlight) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroSpotlight.style.left = `${x}px`;
      heroSpotlight.style.top = `${y}px`;
      heroSpotlight.style.opacity = '1';
    });
    heroSection.addEventListener('mouseleave', () => {
      heroSpotlight.style.opacity = '0';
    });
  }

  // 3D Parallax Tilt on Smartphone Mockup
  if (heroPhoneWrapper && heroPhoneDevice) {
    heroPhoneWrapper.addEventListener('mousemove', (e) => {
      const rect = heroPhoneWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -14;
      const rotateY = ((x - centerX) / centerX) * 14;

      heroPhoneDevice.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      if (heroBadgeTop) {
        heroBadgeTop.style.transform = `translateY(${rotateX * 0.8}px) translateX(${rotateY * 0.8}px) translateZ(40px)`;
      }
      if (heroBadgeBottom) {
        heroBadgeBottom.style.transform = `translateY(${rotateX * 1.1}px) translateX(${rotateY * 1.1}px) translateZ(50px)`;
      }
    });

    heroPhoneWrapper.addEventListener('mouseleave', () => {
      heroPhoneDevice.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (heroBadgeTop) {
        heroBadgeTop.style.transform = '';
      }
      if (heroBadgeBottom) {
        heroBadgeBottom.style.transform = '';
      }
    });
  }

  // Interactive Screen Dock Switcher
  const screenMap = {
    home: {
      img: 'images/screen_tab_home.png',
      topTitle: '+20 Coins Verified',
      topSub: 'Partner Postback Received',
      bottomTitle: '₹12.50 Ready',
      bottomSub: 'Direct to UPI VPA'
    },
    tasks: {
      img: 'images/screen_tab_tasks.png',
      topTitle: '🎯 20 Coins / Survey',
      topSub: 'Commercial Offerwall Tasks',
      bottomTitle: '8/10 Tasks Left',
      bottomSub: 'Daily Cap Protection'
    },
    reward: {
      img: 'images/screen_tab_earn.png',
      topTitle: '✨ Cryptographic Verification',
      topSub: 'HMAC SHA-256 Validated',
      bottomTitle: 'Double-Entry Sealed',
      bottomSub: 'Paise Integer Guard'
    },
    wallet: {
      img: 'images/screen_tab_upi.png',
      topTitle: '💳 Instant UPI Payout',
      topSub: 'GPay, PhonePe, Paytm, BHIM',
      bottomTitle: '₹10.00 Min Payout',
      bottomSub: 'Zero Withdrawal Fees'
    }
  };

  if (dockButtons && heroPhoneScreenImg) {
    dockButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const screenKey = btn.getAttribute('data-screen');
        const screenData = screenMap[screenKey];
        if (!screenData) return;

        dockButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Crossfade screen image
        heroPhoneScreenImg.style.opacity = '0.3';
        setTimeout(() => {
          heroPhoneScreenImg.src = screenData.img;
          heroPhoneScreenImg.style.opacity = '1';

          if (heroTopBadgeTitle) heroTopBadgeTitle.textContent = screenData.topTitle;
          if (heroTopBadgeSub) heroTopBadgeSub.textContent = screenData.topSub;
          if (heroBottomBadgeTitle) heroBottomBadgeTitle.textContent = screenData.bottomTitle;
          if (heroBottomBadgeSub) heroBottomBadgeSub.textContent = screenData.bottomSub;
        }, 150);
      });
    });
  }

  // Interactive Reward Simulation Trigger
  let simulatedBalance = 12500;
  if (heroSimulateBtn) {
    heroSimulateBtn.addEventListener('click', () => {
      simulatedBalance += 20;
      const inr = (simulatedBalance / 1000).toFixed(2);

      // Flying coin particle animation
      const coin = document.createElement('div');
      coin.className = 'flying-coin-particle';
      coin.textContent = '🪙';
      document.body.appendChild(coin);

      const btnRect = heroSimulateBtn.getBoundingClientRect();
      const phoneRect = heroPhoneDevice ? heroPhoneDevice.getBoundingClientRect() : btnRect;

      coin.style.left = `${btnRect.left + btnRect.width / 2}px`;
      coin.style.top = `${btnRect.top}px`;

      requestAnimationFrame(() => {
        coin.style.left = `${phoneRect.left + phoneRect.width / 2}px`;
        coin.style.top = `${phoneRect.top + phoneRect.height / 3}px`;
        coin.style.transform = 'scale(1.5) rotate(360deg)';
        coin.style.opacity = '0';
      });

      setTimeout(() => {
        coin.remove();

        // Flash badge feedback
        if (heroTopBadgeTitle) {
          heroTopBadgeTitle.textContent = '+20 Coins Verified! 🎉';
          heroTopBadgeTitle.style.color = 'var(--coin-gold)';
        }
        if (heroTopBadgeSub) {
          heroTopBadgeSub.textContent = `Balance: ${simulatedBalance.toLocaleString('en-IN')} Coins`;
        }
        if (heroBottomBadgeTitle) {
          heroBottomBadgeTitle.textContent = `₹${inr} Ready`;
        }

        setTimeout(() => {
          if (heroTopBadgeTitle) heroTopBadgeTitle.style.color = '';
        }, 1200);
      }, 700);
    });
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

  // --- 3. Advertiser & Brand Business Lead Form ---
  const advForm = document.getElementById('advertiserLeadForm');
  const advFormHeader = document.getElementById('advFormHeader');
  const advSuccessState = document.getElementById('advSuccessState');
  const advSuccessMsg = document.getElementById('advSuccessMsg');
  const advResetBtn = document.getElementById('advResetBtn');
  const advSubmitBtn = document.getElementById('advSubmitBtn');

  if (advForm && advSuccessState) {
    advForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('advName')?.value?.trim() || 'Partner';
      const company = document.getElementById('advCompany')?.value?.trim() || 'Your Company';
      const email = document.getElementById('advEmail')?.value?.trim() || 'your email';
      const phone = document.getElementById('advPhone')?.value?.trim() || '';
      const goal = document.getElementById('advGoal')?.value || 'General Promotion';
      const budget = document.getElementById('advBudget')?.value || 'Growth';
      const message = document.getElementById('advMessage')?.value?.trim() || '';

      if (advSubmitBtn) {
        advSubmitBtn.disabled = true;
        advSubmitBtn.textContent = 'Submitting Proposal Request...';
      }

      // Simulate network submission and save to localStorage
      setTimeout(() => {
        try {
          const lead = {
            id: 'lead_' + Date.now(),
            name,
            company,
            email,
            phone,
            goal,
            budget,
            message,
            submittedAt: new Date().toISOString()
          };

          const existing = JSON.parse(localStorage.getItem('watch_earn_partner_leads') || '[]');
          existing.unshift(lead);
          localStorage.setItem('watch_earn_partner_leads', JSON.stringify(existing));
        } catch (err) {
          console.warn('LocalStorage unavailable for lead persistence:', err);
        }

        // Show customized success screen
        if (advFormHeader) advFormHeader.style.display = 'none';
        advForm.style.display = 'none';
        advSuccessState.style.display = 'block';

        if (advSuccessMsg) {
          advSuccessMsg.innerHTML = `Thank you, <strong>${name}</strong>! We received your promotion inquiry for <strong>${company}</strong>. Our Partnerships team will review your objectives and email our Media Kit & customized CPA proposal to <strong>${email}</strong> within 24 business hours.`;
        }

        if (advSubmitBtn) {
          advSubmitBtn.disabled = false;
          advSubmitBtn.textContent = 'Submit Promotion Request 🚀';
        }
      }, 400);
    });

    if (advResetBtn) {
      advResetBtn.addEventListener('click', () => {
        advForm.reset();
        advSuccessState.style.display = 'none';
        if (advFormHeader) advFormHeader.style.display = 'block';
        advForm.style.display = 'block';
      });
    }
  }

  // --- 4. Interactive Campaign ROI & Reach Estimator (advertise.html) ---
  const roiGoalTabs = document.getElementById('roiGoalTabs');
  const roiBudgetSlider = document.getElementById('roiBudgetSlider');
  const roiBudgetDisplay = document.getElementById('roiBudgetDisplay');
  const roiOutputCompletions = document.getElementById('roiOutputCompletions');
  const roiOutputLabel = document.getElementById('roiOutputLabel');
  const roiOutputCpa = document.getElementById('roiOutputCpa');
  const roiApplyBtn = document.getElementById('roiApplyBtn');

  if (roiBudgetSlider && roiOutputCompletions) {
    let currentCpa = 4.50;
    let currentLabel = 'Verified App Installs (CPI)';
    let currentGoalKey = 'app_installs';

    function updateRoiEstimates() {
      const budget = parseInt(roiBudgetSlider.value, 10) || 100000;
      if (roiBudgetDisplay) {
        roiBudgetDisplay.textContent = `₹${budget.toLocaleString('en-IN')}`;
      }

      const completions = Math.floor(budget / currentCpa);
      if (roiOutputCompletions) {
        roiOutputCompletions.textContent = completions.toLocaleString('en-IN');
      }
      if (roiOutputLabel) {
        roiOutputLabel.textContent = currentLabel;
      }
      if (roiOutputCpa) {
        roiOutputCpa.textContent = `₹${currentCpa.toFixed(2)}`;
      }
    }

    if (roiGoalTabs) {
      const tabBtns = roiGoalTabs.querySelectorAll('.goal-tab-btn');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          currentCpa = parseFloat(btn.getAttribute('data-cpa')) || 4.50;
          currentLabel = btn.getAttribute('data-label') || 'Verified App Installs (CPI)';

          const goal = btn.getAttribute('data-goal');
          if (goal === 'cpi') currentGoalKey = 'app_installs';
          else if (goal === 'surveys') currentGoalKey = 'market_surveys';
          else if (goal === 'video') currentGoalKey = 'brand_video';
          else if (goal === 'cpl') currentGoalKey = 'lead_gen';

          updateRoiEstimates();
        });
      });
    }

    roiBudgetSlider.addEventListener('input', updateRoiEstimates);
    updateRoiEstimates();

    if (roiApplyBtn) {
      roiApplyBtn.addEventListener('click', () => {
        const budgetVal = parseInt(roiBudgetSlider.value, 10);
        const advGoalSelect = document.getElementById('advGoal');
        const advBudgetSelect = document.getElementById('advBudget');

        if (advGoalSelect) advGoalSelect.value = currentGoalKey;

        let budgetKey = 'growth';
        if (budgetVal <= 50000) budgetKey = 'starter';
        else if (budgetVal <= 200000) budgetKey = 'growth';
        else if (budgetVal <= 1000000) budgetKey = 'scale';
        else budgetKey = 'enterprise';

        if (advBudgetSelect) advBudgetSelect.value = budgetKey;

        // Sync visual chips in the Ad Ops studio
        const goalChips = document.querySelectorAll('#advGoalChips .form-chip');
        goalChips.forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-val') === currentGoalKey);
        });

        const budgetChips = document.querySelectorAll('#advBudgetChips .form-chip');
        budgetChips.forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-val') === budgetKey);
        });

        const leadSection = document.getElementById('inquire');
        if (leadSection) {
          leadSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  // --- Form Chip Selectors for Ad Ops Studio ---
  const advGoalChips = document.getElementById('advGoalChips');
  const advBudgetChips = document.getElementById('advBudgetChips');
  const advGoalSelect = document.getElementById('advGoal');
  const advBudgetSelect = document.getElementById('advBudget');

  if (advGoalChips && advGoalSelect) {
    const chips = advGoalChips.querySelectorAll('.form-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const val = chip.getAttribute('data-val');
        if (val) advGoalSelect.value = val;
      });
    });
  }

  if (advBudgetChips && advBudgetSelect) {
    const chips = advBudgetChips.querySelectorAll('.form-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const val = chip.getAttribute('data-val');
        if (val) advBudgetSelect.value = val;
      });
    });
  }

  // Sponsorship & Partnership Inquiry Submission Handler
  window.handleSponsorshipSubmit = function () {
    const brandInput = document.getElementById('sponsorBrand');
    const emailInput = document.getElementById('sponsorEmail');
    const typeInput = document.getElementById('sponsorType');
    const budgetInput = document.getElementById('sponsorBudget');
    const form = document.getElementById('sponsorshipInquiryForm');
    const successMsg = document.getElementById('sponsorSuccessMsg');
    const btn = document.getElementById('btnSubmitSponsor');

    if (!brandInput || !emailInput) return;

    const brand = brandInput.value.trim();
    const contact = emailInput.value.trim();
    const type = typeInput ? typeInput.value : 'video';
    const budget = budgetInput ? budgetInput.value : '50k-2L';

    if (!brand || !contact) {
      alert('Please provide your brand name and work email or WhatsApp.');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>⏳</span> Processing...';
    }

    const inquiry = {
      brand: brand,
      contact: contact,
      type: type,
      budget: budget,
      submitted_at: new Date().toISOString()
    };

    try {
      const stored = JSON.parse(localStorage.getItem('watch_earn_sponsorship_leads') || '[]');
      stored.push(inquiry);
      localStorage.setItem('watch_earn_sponsorship_leads', JSON.stringify(stored));
    } catch (e) {
      console.warn('Storage fallback', e);
    }

    setTimeout(function () {
      if (form) form.style.display = 'none';
      if (successMsg) successMsg.style.display = 'block';
    }, 450);
  };
});
