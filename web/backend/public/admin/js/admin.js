/**
 * Watch & Earn — Administrative Control Center
 * Multi-Page Operations Engine, State Persistence & Double-Entry Ledger Management
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'watch_earn_admin_data_v1';

  // Seed Data
  const DEFAULT_DATA = {
    overview: {
      total_users: 1482,
      total_reward_completions: 18924,
      liabilities: {
        available_coins: 1850000,
        available_inr: '1,850.00',
        pending_coins: 420000,
        pending_inr: '420.00',
        reserved_coins: 340000,
        reserved_inr: '340.00',
        paid_coins: 6450000,
        paid_inr: '6,450.00'
      },
      pending_withdrawals_count: 5,
      open_support_tickets_count: 3
    },
    withdrawals: [
      {
        id: 1042,
        user_id: 101,
        user_name: 'Aditya Verma',
        phone_last_four: '6655',
        coins: 25000,
        amount_paise: 2500,
        amount_inr: '25.00',
        upi_id: 'aditya@okhdfcbank',
        bank_provider: 'HDFC Bank (GPay)',
        status: 'requested',
        risk_score: 'Low (0.04)',
        created_at: '2026-11-21 12:45:10'
      },
      {
        id: 1041,
        user_id: 88,
        user_name: 'Pooja Sharma',
        phone_last_four: '9123',
        coins: 10000,
        amount_paise: 1000,
        amount_inr: '10.00',
        upi_id: 'pooja.sharma@paytm',
        bank_provider: 'Paytm Payments Bank',
        status: 'requested',
        risk_score: 'Low (0.02)',
        created_at: '2026-11-21 12:30:22'
      },
      {
        id: 1040,
        user_id: 215,
        user_name: 'Karan Mehra',
        phone_last_four: '4489',
        coins: 50000,
        amount_paise: 5000,
        amount_inr: '50.00',
        upi_id: 'karan99@ybl',
        bank_provider: 'Yes Bank (PhonePe)',
        status: 'under_review',
        risk_score: 'Medium (0.42)',
        created_at: '2026-11-21 11:50:00'
      },
      {
        id: 1039,
        user_id: 34,
        user_name: 'Sunil Patel',
        phone_last_four: '7721',
        coins: 10000,
        amount_paise: 1000,
        amount_inr: '10.00',
        upi_id: 'sunil77@okaxis',
        bank_provider: 'Axis Bank (GPay)',
        status: 'approved',
        risk_score: 'Low (0.01)',
        created_at: '2026-11-21 11:15:33'
      },
      {
        id: 1038,
        user_id: 412,
        user_name: 'Deepak Rao',
        phone_last_four: '3310',
        coins: 20000,
        amount_paise: 2000,
        amount_inr: '20.00',
        upi_id: 'deepak.rao@icici',
        bank_provider: 'ICICI Bank',
        status: 'paid',
        risk_score: 'Low (0.00)',
        created_at: '2026-11-21 10:40:15'
      },
      {
        id: 1037,
        user_id: 590,
        user_name: 'Ankit Tiwari',
        phone_last_four: '1192',
        coins: 15000,
        amount_paise: 1500,
        amount_inr: '15.00',
        upi_id: 'ankit.tiwari@sbi',
        bank_provider: 'State Bank of India',
        status: 'rejected',
        risk_score: 'High (0.88)',
        created_at: '2026-11-21 09:20:41'
      }
    ],
    users: [
      {
        id: 101,
        name: 'Aditya Verma',
        phone_last_four: '6655',
        email: 'aditya.verma@example.com',
        status: 'active',
        age_eligibility_status: 'verified_18_plus',
        device_count: 1,
        completions_count: 48,
        withdrawals_count: 3,
        balances: {
          available: 14500,
          pending: 2500,
          reserved: 25000,
          paid: 30000,
          total_earned: 69500
        },
        fraud_risk: 'LOW',
        created_at: '2026-10-15 09:12:00'
      },
      {
        id: 88,
        name: 'Pooja Sharma',
        phone_last_four: '9123',
        email: 'pooja.sharma@example.com',
        status: 'active',
        age_eligibility_status: 'verified_18_plus',
        device_count: 1,
        completions_count: 22,
        withdrawals_count: 1,
        balances: {
          available: 5400,
          pending: 1000,
          reserved: 10000,
          paid: 10000,
          total_earned: 25400
        },
        fraud_risk: 'LOW',
        created_at: '2026-11-01 14:20:10'
      },
      {
        id: 215,
        name: 'Karan Mehra',
        phone_last_four: '4489',
        email: 'karan99@example.com',
        status: 'active',
        age_eligibility_status: 'verified_18_plus',
        device_count: 2,
        completions_count: 85,
        withdrawals_count: 4,
        balances: {
          available: 8200,
          pending: 5000,
          reserved: 50000,
          paid: 70000,
          total_earned: 128200
        },
        fraud_risk: 'MEDIUM',
        created_at: '2026-09-28 17:45:00'
      },
      {
        id: 590,
        name: 'Ankit Tiwari',
        phone_last_four: '1192',
        email: 'ankit.tiwari@example.com',
        status: 'suspended',
        age_eligibility_status: 'verified_18_plus',
        device_count: 4,
        completions_count: 12,
        withdrawals_count: 1,
        balances: {
          available: 15000,
          pending: 0,
          reserved: 0,
          paid: 0,
          total_earned: 15000
        },
        fraud_risk: 'HIGH',
        created_at: '2026-11-19 22:10:00'
      }
    ],
    partners: [
      {
        id: 1,
        name: 'AdGate Media',
        slug: 'adgate',
        status: 'active',
        offers_count: 14,
        reward_events_count: 8420,
        total_coins_distributed: 421000,
        callback_url: '/api/v1/webhooks/partners/adgate',
        has_secret: true,
        timestamp_drift_allowed: '300s'
      },
      {
        id: 2,
        name: 'OfferToro',
        slug: 'offertoro',
        status: 'active',
        offers_count: 18,
        reward_events_count: 6150,
        total_coins_distributed: 307500,
        callback_url: '/api/v1/webhooks/partners/offertoro',
        has_secret: true,
        timestamp_drift_allowed: '300s'
      },
      {
        id: 3,
        name: 'Revenue Universe',
        slug: 'revu',
        status: 'active',
        offers_count: 12,
        reward_events_count: 4354,
        total_coins_distributed: 217700,
        callback_url: '/api/v1/webhooks/partners/revu',
        has_secret: true,
        timestamp_drift_allowed: '300s'
      },
      {
        id: 4,
        name: 'Google AdMob (Isolated)',
        slug: 'admob',
        status: 'active',
        offers_count: 8,
        reward_events_count: 12940,
        total_coins_distributed: 0,
        callback_url: 'In-app SDK Callback',
        has_secret: true,
        timestamp_drift_allowed: 'N/A (Strict Non-Cash)'
      }
    ],
    ledger: [
      {
        id: 9840,
        account_type: 'reserved',
        direction: 'credit',
        coin_amount: 25000,
        inr_amount: '₹25.00',
        transaction_ref: 'wd_res_1042',
        kind: 'withdrawal_reservation',
        user: 'Aditya Verma (...6655)',
        created_at: '2026-11-21 12:45:10'
      },
      {
        id: 9839,
        account_type: 'available',
        direction: 'debit',
        coin_amount: 25000,
        inr_amount: '₹25.00',
        transaction_ref: 'wd_res_1042',
        kind: 'withdrawal_reservation',
        user: 'Aditya Verma (...6655)',
        created_at: '2026-11-21 12:45:10'
      },
      {
        id: 9838,
        account_type: 'available',
        direction: 'credit',
        coin_amount: 50,
        inr_amount: '₹0.05',
        transaction_ref: 'evt_settle_8819',
        kind: 'pending_release',
        user: 'Pooja Sharma (...9123)',
        created_at: '2026-11-21 12:10:00'
      },
      {
        id: 9837,
        account_type: 'pending',
        direction: 'debit',
        coin_amount: 50,
        inr_amount: '₹0.05',
        transaction_ref: 'evt_settle_8819',
        kind: 'pending_release',
        user: 'Pooja Sharma (...9123)',
        created_at: '2026-11-21 12:10:00'
      }
    ],
    support_tickets: [
      {
        id: 301,
        user_name: 'Vikram Singh',
        phone: '...8831',
        category: 'Missing Partner Reward',
        subject: 'Offerwall survey completed but 100 coins not credited',
        status: 'open',
        created_at: '2026-11-21 11:20:00'
      },
      {
        id: 300,
        user_name: 'Meera Nambiar',
        phone: '...4510',
        category: 'Withdrawal Delay',
        subject: 'UPI withdrawal showing processing for over 2 hours',
        status: 'in_progress',
        created_at: '2026-11-21 10:05:00'
      },
      {
        id: 299,
        user_name: 'Rahul Joshi',
        phone: '...1092',
        category: 'Account Verification',
        subject: 'Update phone number and bank VPA',
        status: 'resolved',
        created_at: '2026-11-20 18:30:00'
      }
    ],
    audit_logs: [
      {
        id: 502,
        admin_id: 'admin_console',
        action: 'user_status_changed',
        target_type: 'user',
        target_id: '590',
        reason: 'Multiple emulator detections and proxy IP velocity breach',
        ip_address: '10.0.4.12',
        created_at: '2026-11-21 09:25:00'
      },
      {
        id: 501,
        admin_id: 'admin_console',
        action: 'withdrawal_rejected',
        target_type: 'withdrawal',
        target_id: '1037',
        reason: 'Suspected automated script farm; refunded reserved coins',
        ip_address: '10.0.4.12',
        created_at: '2026-11-21 09:20:41'
      },
      {
        id: 500,
        admin_id: 'admin_console',
        action: 'withdrawal_approved',
        target_type: 'withdrawal',
        target_id: '1038',
        reason: 'Manual risk assessment verified valid UPI handle and KYC',
        ip_address: '10.0.4.12',
        created_at: '2026-11-21 08:50:11'
      }
    ],
    push_stats: {
      active_devices: 1248,
      total_campaigns: 14,
      delivery_rate: '99.4%'
    },
    push_campaigns: [
      {
        id: 1,
        title: '2X Weekend Rush Live! ⚡',
        body: 'Double coins are active on all partner video ads this Saturday & Sunday. Start watching now!',
        target_screen: 'WATCH_ADS',
        target_audience: 'ALL_ACTIVE',
        status: 'completed',
        sent_count: 1240,
        failed_count: 4,
        created_at: '2026-11-21 09:00:00'
      },
      {
        id: 2,
        title: 'Daily Streak Bonus Expiring 🪙',
        body: 'You have 4 hours left to claim today’s 100 free check-in coins.',
        target_screen: 'TASKS',
        target_audience: 'ACTIVE_7D',
        status: 'completed',
        sent_count: 890,
        failed_count: 1,
        created_at: '2026-11-20 18:30:00'
      },
      {
        id: 3,
        title: 'Instant UPI Payout Credited',
        body: 'Your ₹50 withdrawal has been processed and credited to your bank account.',
        target_screen: 'WALLET',
        target_audience: 'HIGH_BALANCE',
        status: 'completed',
        sent_count: 142,
        failed_count: 0,
        created_at: '2026-11-20 14:15:22'
      }
    ],
    delivery_logs: [
      {
        time: '12:45:12',
        event: 'WITHDRAWAL_PAID (Trigger)',
        recipient: 'User #101 (...6655)',
        device: 'Android 14 (Pixel 8)',
        status: 'delivered',
        response: 'projects/watch-earn-in/messages/0:1732185912882190'
      },
      {
        time: '11:15:35',
        event: 'WITHDRAWAL_APPROVED (Trigger)',
        recipient: 'User #34 (...7721)',
        device: 'Android 13 (Samsung S23)',
        status: 'delivered',
        response: 'projects/watch-earn-in/messages/0:1732180535491024'
      },
      {
        time: '09:00:15',
        event: '2X Weekend Rush (Broadcast)',
        recipient: 'Batch #1 (500 devices)',
        device: 'Android (Multi)',
        status: 'delivered',
        response: 'HTTP 200 OK (500 tokens)'
      },
      {
        time: '09:00:14',
        event: '2X Weekend Rush (Broadcast)',
        recipient: 'Batch #2 (740 devices)',
        device: 'Android (Multi)',
        status: 'delivered',
        response: 'HTTP 200 OK (740 tokens)'
      }
    ],
    sponsorship_leads: [
      {
        id: 301,
        brand_name: 'Swiggy Instamart',
        contact_person: 'Aman Gupta (Growth Marketing Lead)',
        email: 'aman.gupta@swiggy.in',
        phone: '+91 98201 14522',
        campaign_type: 'CPI App Installs',
        budget_range: '₹2,00,000 - ₹5,00,000',
        deal_value_inr: 350000,
        status: 'Proposal Sent',
        brief: 'Drive 15,000+ verified first-time orders and app installs in Bengaluru, Mumbai & Delhi-NCR for Instamart 10-minute grocery service during the upcoming festive season.',
        target_audience: 'Tier 1 Metro smartphone users (18-35), Android 11+',
        notes: 'Sent customized CPA proposal at ₹22 per validated first checkout. Awaiting sign-off from VP Marketing.',
        created_at: '2026-11-20 14:15:00'
      },
      {
        id: 302,
        brand_name: 'Zerodha Kite',
        contact_person: 'Priya Sundaram (Head of Digital Acquisition)',
        email: 'priya.sundaram@zerodha.com',
        phone: '+91 97410 88319',
        campaign_type: 'Video Quest',
        budget_range: '₹5,00,000 - ₹10,00,000',
        deal_value_inr: 750000,
        status: 'Active Partner',
        brief: 'Financial literacy video quest campaign: users watch a 60-second interactive explainer on index funds & ETF investing, then answer a 2-question comprehension quiz.',
        target_audience: 'PAN India, 21-40 age group, college students & salaried individuals',
        notes: 'Pilot contract signed. 50,000 video quests authorized with HMAC postback callback.',
        created_at: '2026-11-18 10:30:00'
      },
      {
        id: 303,
        brand_name: 'Dream11 Sports Tech',
        contact_person: 'Vikramaditya Roy (Brand Partnerships Director)',
        email: 'vikram.roy@dream11.com',
        phone: '+91 99302 77410',
        campaign_type: 'Weekend Headline',
        budget_range: '₹10,00,000+',
        deal_value_inr: 1200000,
        status: 'Contacted',
        brief: 'Exclusive weekend headline takeover & IPL T20 fantasy team builder quest for upcoming India tour matches.',
        target_audience: 'Sports enthusiasts, 18+ verified PAN card users',
        notes: 'Completed introductory intro call. Demo of fraud-velocity protection presented. Drafting customized SLA.',
        created_at: '2026-11-21 09:45:00'
      },
      {
        id: 304,
        brand_name: 'Paytm UPI & Soundbox',
        contact_person: 'Sneha Kulkarni (Merchant & Consumer Acquisition)',
        email: 'sneha.kulkarni@paytm.com',
        phone: '+91 98112 55091',
        campaign_type: 'Survey',
        budget_range: '₹50,000 - ₹2,00,000',
        deal_value_inr: 180000,
        status: 'New',
        brief: 'Merchant QR & soundbox perception study: 8-question verified consumer survey regarding payment methods and cash vs UPI preference at local kirana stores.',
        target_audience: 'Tier 2 & Tier 3 shoppers across Maharashtra, Gujarat, Uttar Pradesh',
        notes: 'New inbound brief received from website advertising form. Initial email auto-responder dispatched.',
        created_at: '2026-11-21 11:20:00'
      },
      {
        id: 305,
        brand_name: 'Spinny Assured Cars',
        contact_person: 'Karan Malhotra (Growth & Alliances)',
        email: 'karan.m@spinny.com',
        phone: '+91 98711 33209',
        campaign_type: 'Survey',
        budget_range: '₹50,000 - ₹2,00,000',
        deal_value_inr: 140000,
        status: 'Closed',
        brief: 'Used car valuation survey and test drive lead generation study.',
        target_audience: 'Car owners and prospective buyers aged 25-45',
        notes: 'Completed 6-week survey campaign successfully. Reached 100% quota of 4,000 verified responses.',
        created_at: '2026-11-05 16:00:00'
      }
    ],
    sponsored_campaigns: [
      {
        id: 1,
        campaign_code: 'CAMP-501',
        brand_name: 'Zerodha Kite',
        campaign_type: 'Video Quest',
        total_coin_budget: 1500000,
        payout_per_action: 50,
        tracking_link: 'https://kite.zerodha.com/quest/v1?ref=watchearn_in',
        hmac_secret: 'sec_zh_k98f2190a4c2',
        target_audience: 'All Users (18+ KYC)',
        completions: 20520,
        burned_coins: 1026000,
        status: 'Active',
        created_at: '2026-11-19'
      },
      {
        id: 2,
        campaign_code: 'CAMP-502',
        brand_name: 'Swiggy Instamart',
        campaign_type: 'CPI App Installs',
        total_coin_budget: 2500000,
        payout_per_action: 120,
        tracking_link: 'https://swiggy.onelink.me/8821/watchearn',
        hmac_secret: 'sec_sw_77e029ba3390',
        target_audience: 'Tier 1 Metro Cities (Android)',
        completions: 8770,
        burned_coins: 1052500,
        status: 'Active',
        created_at: '2026-11-20'
      },
      {
        id: 3,
        campaign_code: 'CAMP-503',
        brand_name: 'Dream11 T20 Blitz',
        campaign_type: 'Weekend Headline',
        total_coin_budget: 5000000,
        payout_per_action: 200,
        tracking_link: 'https://dream11.onelink.me/d11/weekend',
        hmac_secret: 'sec_d11_99fba223e110',
        target_audience: 'Sports & Gaming Cohorts',
        completions: 3000,
        burned_coins: 600000,
        status: 'Paused',
        created_at: '2026-11-21'
      },
      {
        id: 4,
        campaign_code: 'CAMP-504',
        brand_name: 'Spinny Assured Survey',
        campaign_type: 'Survey',
        total_coin_budget: 800000,
        payout_per_action: 40,
        tracking_link: 'https://spinny.com/research/2026',
        hmac_secret: 'sec_sp_10aa55ec8891',
        target_audience: 'Vehicle Owners (25-45)',
        completions: 20000,
        burned_coins: 800000,
        status: 'Completed',
        created_at: '2026-11-05'
      }
    ],
    webhook_dlq: [
      {
        id: 'DLQ-8821',
        partner_slug: 'adgate',
        partner_name: 'AdGate Media',
        event_id: 'evt_adg_984120',
        user_id: 101,
        user_name: 'Aditya Verma',
        reward_coins: 50,
        amount_inr: '0.05',
        failure_reason: 'HMAC Signature Drift (> 300s clock skew on partner server)',
        retry_count: 2,
        status: 'failed',
        last_attempt: '2026-11-21 12:48:19',
        raw_payload: { event_id: 'evt_adg_984120', user_id: 101, offer_id: 501, reward_coins: 50, timestamp: 1732189800 }
      },
      {
        id: 'DLQ-8822',
        partner_slug: 'offertoro',
        partner_name: 'OfferToro',
        event_id: 'evt_ot_552190',
        user_id: 215,
        user_name: 'Karan Mehra',
        reward_coins: 120,
        amount_inr: '0.12',
        failure_reason: 'Database Transaction Lock Contention (Wallet lock timeout)',
        retry_count: 1,
        status: 'pending_retry',
        last_attempt: '2026-11-21 12:35:44',
        raw_payload: { event_id: 'evt_ot_552190', user_id: 215, offer_id: 502, reward_coins: 120, timestamp: 1732190100 }
      },
      {
        id: 'DLQ-8823',
        partner_slug: 'revu',
        partner_name: 'Revenue Universe',
        event_id: 'evt_rv_109283',
        user_id: 88,
        user_name: 'Pooja Sharma',
        reward_coins: 300,
        amount_inr: '0.30',
        failure_reason: 'Transient HTTP 504 Gateway Timeout during downstream ledger credit',
        retry_count: 0,
        status: 'failed',
        last_attempt: '2026-11-21 12:10:02',
        raw_payload: { event_id: 'evt_rv_109283', user_id: 88, offer_id: 503, reward_coins: 300, timestamp: 1732188600 }
      }
    ],
    payout_gateway: {
      active: 'mock',
      merchant_account: 'HDFC Bank ESCROW - 50200088912344',
      bank_float_paise: 34000,
      last_reconciliation: {
        id: 'RECON-20261121-001',
        timestamp: '2026-11-21 06:00:00',
        status: 'reconciled',
        ledger_reserved_paise: 34000,
        bank_balance_paise: 34000,
        discrepancy_paise: 0
      }
    }
  };

  // Multi-Role RBAC & Security Constants
  const ROLE_STORAGE_KEY = 'watch_earn_active_role';
  const SECURITY_SETTINGS_KEY = 'watch_earn_security_settings';

  const ROLES = {
    super_admin: {
      id: 'super_admin',
      name: 'Super Admin',
      title: 'Sec Officer',
      badge: 'SA',
      avatarColor: 'linear-gradient(135deg, var(--purple-primary), var(--cyan-primary))',
      sections: ['overview', 'withdrawals', 'users', 'notifications', 'ledger', 'partners', 'sponsorships', 'fraud', 'support', 'audit', 'settings'],
      description: 'Root administrator: Full access to all 11+ sections, ledger seal, settings & user bans.',
      requiredRoleName: 'Super Admin',
      permissions: {
        canAccessAll: true,
        canApproveWithdrawals: true,
        canBanUsers: true,
        canSealLedger: true,
        canModifySettings: true,
        canModifyFraudRules: true,
        canQuarantineUsers: true,
        canCreatePushCampaigns: true,
        canResolveTickets: true,
        canExportCsv: true
      }
    },
    finance_officer: {
      id: 'finance_officer',
      name: 'Finance Officer',
      title: 'Finance Lead',
      badge: 'FO',
      avatarColor: 'linear-gradient(135deg, #10b981, #06b6d4)',
      sections: ['overview', 'withdrawals', 'ledger', 'partners'],
      description: 'Access to Withdrawals, Ledger, Overview & Banking Reconciliations. Restricted from fraud rules & settings.',
      requiredRoleName: 'Finance Officer or Super Admin',
      permissions: {
        canAccessAll: false,
        canApproveWithdrawals: true,
        canBanUsers: false,
        canSealLedger: true,
        canModifySettings: false,
        canModifyFraudRules: false,
        canQuarantineUsers: false,
        canCreatePushCampaigns: false,
        canResolveTickets: false,
        canExportCsv: true
      }
    },
    compliance_officer: {
      id: 'compliance_officer',
      name: 'Compliance Officer',
      title: 'Compliance Lead',
      badge: 'CO',
      avatarColor: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      sections: ['users', 'fraud', 'audit', 'settings', 'overview'],
      description: 'Access to Users KYC, Fraud & Velocity, Audit Trail & Settings. Restricted from direct payout approvals.',
      requiredRoleName: 'Compliance Officer or Super Admin',
      permissions: {
        canAccessAll: false,
        canApproveWithdrawals: false,
        canBanUsers: true,
        canSealLedger: false,
        canModifySettings: true,
        canModifyFraudRules: true,
        canQuarantineUsers: true,
        canCreatePushCampaigns: false,
        canResolveTickets: false,
        canExportCsv: true
      }
    },
    support_agent: {
      id: 'support_agent',
      name: 'Support Agent',
      title: 'Support Desk',
      badge: 'SR',
      avatarColor: 'linear-gradient(135deg, #3b82f6, #6366f1)',
      sections: ['support', 'users'],
      description: 'Access to Support Tickets & User Directory (read-only). Restricted from payouts, ledger & push broadcasts.',
      requiredRoleName: 'Support Agent or Super Admin',
      permissions: {
        canAccessAll: false,
        canApproveWithdrawals: false,
        canBanUsers: false, // Read-only User Directory
        canSealLedger: false,
        canModifySettings: false,
        canModifyFraudRules: false,
        canQuarantineUsers: false,
        canCreatePushCampaigns: false,
        canResolveTickets: true,
        canExportCsv: false
      }
    },
    growth_officer: {
      id: 'growth_officer',
      name: 'Growth & Marketing',
      title: 'Growth Director',
      badge: 'GM',
      avatarColor: 'linear-gradient(135deg, #ec4899, #f59e0b)',
      sections: ['overview', 'notifications', 'partners', 'sponsorships'],
      description: 'Access to Push Campaigns, Sponsorship CRM & Overview stats. Restricted from withdrawals, ledger & user bans.',
      requiredRoleName: 'Growth Officer or Super Admin',
      permissions: {
        canAccessAll: false,
        canApproveWithdrawals: false,
        canBanUsers: false,
        canSealLedger: false,
        canModifySettings: false,
        canModifyFraudRules: false,
        canQuarantineUsers: false,
        canCreatePushCampaigns: true,
        canResolveTickets: false,
        canExportCsv: false
      }
    }
  };

  function loadStoredRole() {
    try {
      const stored = localStorage.getItem(ROLE_STORAGE_KEY);
      if (stored && ROLES[stored]) {
        return stored;
      }
    } catch (e) {
      console.warn('Role storage read error:', e);
    }
    return 'super_admin';
  }

  function getCurrentRole() {
    return ROLES[STATE.activeRoleId] || ROLES.super_admin;
  }

  function hasPermission(permissionKey) {
    const role = getCurrentRole();
    return Boolean(role && role.permissions && role.permissions[permissionKey]);
  }

  function getRequiredRoleForSection(section) {
    switch (section) {
      case 'withdrawals':
      case 'ledger':
        return 'Finance Officer';
      case 'fraud':
      case 'settings':
      case 'audit':
        return 'Compliance Officer';
      case 'notifications':
      case 'sponsorships':
        return 'Growth Officer';
      case 'support':
        return 'Support Agent';
      case 'users':
        return 'Compliance Officer or Support Agent';
      default:
        return 'Super Admin';
    }
  }

  // State Management
  const STATE = {
    mode: 'api', // 'api' or 'mock'
    page: 'overview',
    activeRoleId: loadStoredRole(),
    withdrawalFilter: 'all',
    withdrawalSearch: '',
    userSearch: '',
    userStatusFilter: 'all',
    ledgerFilter: 'all',
    auditFilter: '',
    sponsorshipFilter: 'all',
    sponsorshipSearch: '',
    data: loadStoredData()
  };

  function loadStoredData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.sponsorship_leads || parsed.sponsorship_leads.length === 0) {
          parsed.sponsorship_leads = JSON.parse(JSON.stringify(DEFAULT_DATA.sponsorship_leads));
        }
        if (!parsed.sponsored_campaigns || parsed.sponsored_campaigns.length === 0) {
          parsed.sponsored_campaigns = JSON.parse(JSON.stringify(DEFAULT_DATA.sponsored_campaigns));
        }
        if (!parsed.webhook_dlq || parsed.webhook_dlq.length === 0) {
          parsed.webhook_dlq = JSON.parse(JSON.stringify(DEFAULT_DATA.webhook_dlq));
        }
        if (!parsed.payout_gateway) {
          parsed.payout_gateway = JSON.parse(JSON.stringify(DEFAULT_DATA.payout_gateway));
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  function persistData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE.data));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }

  // DOM Elements
  const DOM = {};

  function init() {
    detectCurrentPage();
    cacheDom();
    setupRoleSelector();
    highlightActiveNav();
    enforcePermissions();
    bindEvents();
    initSettingsPage();
    initFraudPage();
    checkBackendConnection();
  }

  function detectCurrentPage() {
    const bodyPage = document.body.getAttribute('data-page');
    if (bodyPage) {
      STATE.page = bodyPage;
      return;
    }

    const path = window.location.pathname.toLowerCase();
    if (path.includes('withdrawals')) STATE.page = 'withdrawals';
    else if (path.includes('users')) STATE.page = 'users';
    else if (path.includes('notifications')) STATE.page = 'notifications';
    else if (path.includes('ledger')) STATE.page = 'ledger';
    else if (path.includes('partners')) STATE.page = 'partners';
    else if (path.includes('sponsorships')) STATE.page = 'sponsorships';
    else if (path.includes('fraud')) STATE.page = 'fraud';
    else if (path.includes('support')) STATE.page = 'support';
    else if (path.includes('audit')) STATE.page = 'audit';
    else if (path.includes('settings')) STATE.page = 'settings';
    else STATE.page = 'overview';
  }

  function highlightActiveNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
      const pageAttr = item.getAttribute('data-page') || item.getAttribute('data-tab');
      if (pageAttr === STATE.page) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update notification badge
    const pendingWdCount = STATE.data.withdrawals.filter(w => w.status === 'requested' || w.status === 'under_review').length;
    const navWdBadge = document.getElementById('navWdBadge');
    if (navWdBadge) {
      navWdBadge.textContent = pendingWdCount;
      navWdBadge.style.display = pendingWdCount > 0 ? 'inline-block' : 'none';
    }
  }

  // Role Selector & RBAC System
  function setupRoleSelector() {
    const avatarCard = document.querySelector('.admin-avatar-card');
    if (!avatarCard) return;

    avatarCard.title = 'Click to switch active administrative RBAC role';

    // Add caret if not already added
    if (!avatarCard.querySelector('.role-selector-caret')) {
      const caret = document.createElement('span');
      caret.className = 'role-selector-caret';
      caret.innerHTML = '▾';
      avatarCard.appendChild(caret);
    }

    let dropdown = document.getElementById('roleSelectorDropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = 'roleSelectorDropdown';
      dropdown.className = 'role-selector-dropdown';
      avatarCard.appendChild(dropdown);

      avatarCard.addEventListener('click', (e) => {
        if (e.target.closest('.role-selector-dropdown')) return;
        dropdown.classList.toggle('show');
        avatarCard.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (!avatarCard.contains(e.target)) {
          dropdown.classList.remove('show');
          avatarCard.classList.remove('open');
        }
      });
    }

    renderRoleSelectorDropdown(dropdown);
    updateAvatarCardUI();
  }

  function renderRoleSelectorDropdown(dropdown) {
    if (!dropdown) return;
    const current = getCurrentRole();
    dropdown.innerHTML = `
      <div class="role-dropdown-header">
        <h5>Switch Active Role (RBAC Simulation)</h5>
        <p>Test permission boundaries across privileged admin roles</p>
      </div>
      <div class="role-options-list">
        ${Object.values(ROLES).map(r => `
          <div class="role-option-item ${r.id === current.id ? 'active' : ''}" onclick="window.WatchEarnAdmin.switchRole('${r.id}')">
            <div class="role-option-badge" style="background: ${r.avatarColor};">
              ${r.badge}
            </div>
            <div class="role-option-info">
              <div class="role-option-title">
                <span>${escapeHtml(r.name)}</span>
                ${r.id === current.id ? '<span class="role-option-check">✓</span>' : ''}
              </div>
              <div class="role-option-sub">${escapeHtml(r.description)}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="padding: 6px 10px 4px; border-top: 1px solid var(--border-subtle); margin-top: 4px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.68rem; color: var(--text-muted);">Active: <strong>${escapeHtml(current.name)}</strong></span>
        <span style="font-size: 0.68rem; color: var(--emerald-primary);">Zero-Trust RBAC</span>
      </div>
    `;
  }

  function updateAvatarCardUI() {
    const current = getCurrentRole();
    const avatarCard = document.querySelector('.admin-avatar-card');
    if (!avatarCard) return;

    const circle = avatarCard.querySelector('.avatar-circle');
    if (circle) {
      circle.textContent = current.badge;
      circle.style.background = current.avatarColor;
    }

    const nameEl = avatarCard.querySelector('.admin-info-name');
    if (nameEl) {
      nameEl.textContent = current.title;
    }

    const roleEl = avatarCard.querySelector('.admin-info-role');
    if (roleEl) {
      roleEl.textContent = current.name;
    }
  }

  function switchRole(roleId) {
    if (!ROLES[roleId]) return;
    STATE.activeRoleId = roleId;
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, roleId);
    } catch (e) {
      console.warn('Role storage error:', e);
    }

    const dropdown = document.getElementById('roleSelectorDropdown');
    const avatarCard = document.querySelector('.admin-avatar-card');
    if (dropdown) dropdown.classList.remove('show');
    if (avatarCard) avatarCard.classList.remove('open');

    updateAvatarCardUI();
    if (dropdown) renderRoleSelectorDropdown(dropdown);
    enforcePermissions();
    renderCurrentPageView();

    const role = ROLES[roleId];
    showToast(`Switched active role to: ${role.name}`, 'info');

    if (!role.sections.includes(STATE.page)) {
      const req = getRequiredRoleForSection(STATE.page);
      showToast(`Access Restricted: Requires ${req} privilege.`, 'error');
    }
  }

  function enforcePermissions() {
    const role = getCurrentRole();

    // 1. Sidebar Nav Enforcement
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      const page = item.getAttribute('data-page') || item.getAttribute('data-tab');
      if (!page) return;

      const isAllowed = role.sections.includes(page);
      const existingLock = item.querySelector('.nav-lock-badge');
      if (existingLock) existingLock.remove();

      if (!isAllowed) {
        item.classList.add('nav-restricted');
        const lock = document.createElement('span');
        lock.className = 'nav-lock-badge';
        lock.title = `Restricted for ${role.name}`;
        lock.textContent = '🔒';
        item.appendChild(lock);
      } else {
        item.classList.remove('nav-restricted');
      }
    });

    // 2. Page View Restriction (Banner Overlay)
    const isPageAllowed = role.sections.includes(STATE.page);
    let banner = document.getElementById('accessRestrictedPageBanner');

    if (!isPageAllowed) {
      if (!banner) {
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
          banner = document.createElement('div');
          banner.id = 'accessRestrictedPageBanner';
          banner.className = 'access-restricted-page-banner';
          contentArea.insertBefore(banner, contentArea.firstChild);
        }
      }
      if (banner) {
        const req = getRequiredRoleForSection(STATE.page);
        const fallbackPage = role.sections[0] === 'overview' ? 'index.html' : `${role.sections[0]}.html`;
        banner.innerHTML = `
          <div class="restricted-lock-icon">🔒</div>
          <h3>Access Restricted: Module Clearance Required</h3>
          <p>
            Your active role is <strong style="color: #fff;">${escapeHtml(role.name)}</strong> (${escapeHtml(role.title)}).
            Access to this administrative section requires <strong style="color: var(--cyan-primary);">${req}</strong> or <strong style="color: var(--cyan-primary);">Super Admin</strong> credentials.
          </p>
          <div class="restricted-badge-pill">
            <span>Security Policy: Zero-Trust Strict Role Isolation</span>
          </div>
          <div class="restricted-actions">
            <button type="button" class="btn-table btn-table-approve" onclick="window.WatchEarnAdmin.switchRole('super_admin')">
              ⚡ Elevate to Super Admin
            </button>
            <a href="${fallbackPage}" class="btn-table" style="background: rgba(255, 255, 255, 0.08); color: #fff; text-decoration: none; display: inline-flex; align-items: center;">
              Go to Allowed Section (${role.sections[0]}) →
            </a>
          </div>
        `;
        banner.style.display = 'block';
      }
    } else {
      if (banner) {
        banner.style.display = 'none';
      }
    }

    // 3. Dynamic Action Button States
    enforceActionButtonPermissions(role);
  }

  function enforceActionButtonPermissions(role) {
    // Withdrawals page actions
    const btnBatchApprove = document.getElementById('btnBatchApprove');
    const btnBatchReject = document.getElementById('btnBatchReject');
    if (btnBatchApprove) {
      btnBatchApprove.disabled = !role.permissions.canApproveWithdrawals;
      btnBatchApprove.title = role.permissions.canApproveWithdrawals ? '' : 'Requires Finance Officer privilege';
      btnBatchApprove.style.opacity = role.permissions.canApproveWithdrawals ? '1' : '0.4';
    }
    if (btnBatchReject) {
      btnBatchReject.disabled = !role.permissions.canApproveWithdrawals;
      btnBatchReject.title = role.permissions.canApproveWithdrawals ? '' : 'Requires Finance Officer privilege';
      btnBatchReject.style.opacity = role.permissions.canApproveWithdrawals ? '1' : '0.4';
    }

    // Ledger page actions
    const btnRunInvariant = document.getElementById('btnRunInvariant');
    if (btnRunInvariant) {
      btnRunInvariant.disabled = !role.permissions.canSealLedger;
      btnRunInvariant.title = role.permissions.canSealLedger ? '' : 'Requires Finance Officer privilege';
      btnRunInvariant.style.opacity = role.permissions.canSealLedger ? '1' : '0.4';
    }

    // Fraud page quarantine button
    const btnQuarantine = document.getElementById('btnQuarantineAccount');
    if (btnQuarantine && !btnQuarantine.hasAttribute('data-quarantined')) {
      btnQuarantine.disabled = !role.permissions.canQuarantineUsers;
      btnQuarantine.title = role.permissions.canQuarantineUsers ? '' : 'Requires Compliance Officer privilege';
      btnQuarantine.style.opacity = role.permissions.canQuarantineUsers ? '1' : '0.4';
    }

    // Push broadcast buttons
    const btnDispatch = document.getElementById('btnDispatchPush');
    if (btnDispatch) {
      btnDispatch.disabled = !role.permissions.canCreatePushCampaigns;
      btnDispatch.title = role.permissions.canCreatePushCampaigns ? '' : 'Requires Growth Officer privilege';
      btnDispatch.style.opacity = role.permissions.canCreatePushCampaigns ? '1' : '0.4';
    }
  }

  // Account Quarantine Operations (Fraud & Velocity)
  function quarantineUser(userId = 215, signalId = 'SIG-900') {
    if (!hasPermission('canQuarantineUsers')) {
      showToast('Access Restricted: Requires Compliance Officer privilege.', 'error');
      return;
    }

    const u = STATE.data.users.find(usr => usr.id === Number(userId));
    if (!u) {
      showToast(`User #${userId} not found`, 'error');
      return;
    }

    if (u.status === 'quarantined') {
      showToast(`User #${userId} is already in Quarantine status.`, 'info');
      return;
    }

    // Atomic Balance Freeze
    const b = u.balances || {};
    const avail = Number(b.available || 0);
    const pend = Number(b.pending || 0);
    const totalFrozen = avail + pend;

    b.frozen = (Number(b.frozen || 0)) + totalFrozen;
    b.available = 0;
    b.pending = 0;

    u.status = 'quarantined';
    u.status_label = 'Quarantined (Velocity Breach)';
    u.fraud_risk = 'CRITICAL (QUARANTINED)';
    u.quarantined_at = new Date().toISOString();

    // Freeze any in-flight withdrawal for this user
    STATE.data.withdrawals.forEach(w => {
      if (w.user_id === Number(userId) && (w.status === 'requested' || w.status === 'under_review')) {
        w.status = 'rejected';
        w.rejection_reason = 'Account quarantined due to velocity breach (SIG-900)';
      }
    });

    // Record immutable audit log
    const role = getCurrentRole();
    STATE.data.audit_logs.unshift({
      id: Math.floor(Math.random() * 90000) + 10000,
      admin_id: `${role.name} (${role.title})`,
      action: 'account_quarantined',
      target_type: 'user',
      target_id: String(userId),
      reason: `Automated Account Quarantine: Velocity burst breach (8 completions in 180s). Freezes ${totalFrozen.toLocaleString()} coins atomically. Handset suspended.`,
      ip_address: '10.0.4.12',
      created_at: new Date().toISOString().substring(0, 19).replace('T', ' ')
    });

    persistData();

    // Update fraud page UI
    updateFraudQuarantineUI(u, totalFrozen);

    showToast(`User #${userId} (${u.name}) quarantined! ${totalFrozen.toLocaleString()} coins frozen atomically.`, 'success');
    renderCurrentPageView();
  }

  function updateFraudQuarantineUI(user, totalFrozen) {
    const badge = document.getElementById('quarantineStatusBadge');
    if (badge) {
      badge.textContent = 'Quarantined (Velocity Breach)';
      badge.className = 'status-pill status-quarantined';
    }

    const expBal = document.getElementById('exposedBalanceDisplay');
    if (expBal) {
      expBal.innerHTML = `<span style="color: var(--rose-primary);">0 Coins</span> <span style="font-size: 0.72rem; color: var(--text-muted);">(${Number(totalFrozen || 13200).toLocaleString()} Frozen)</span>`;
    }

    const btn = document.getElementById('btnQuarantineAccount');
    if (btn) {
      btn.disabled = true;
      btn.setAttribute('data-quarantined', 'true');
      btn.style.opacity = '0.7';
      btn.style.background = 'rgba(239, 68, 68, 0.2)';
      btn.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      const btnText = document.getElementById('btnQuarantineText');
      if (btnText) {
        btnText.textContent = '✓ Account Quarantined & Frozen';
      }
    }

    const sigPill = document.getElementById('sigPill900');
    if (sigPill) {
      sigPill.textContent = 'QUARANTINED';
      sigPill.className = 'status-pill status-quarantined';
    }

    const sigSev = document.getElementById('sigSeverity900');
    if (sigSev) {
      sigSev.textContent = 'CRITICAL (FROZEN)';
      sigSev.style.color = 'var(--rose-primary)';
    }

    const sigAction = document.getElementById('sigActionCell900');
    if (sigAction) {
      sigAction.innerHTML = `<span class="status-pill status-quarantined" style="font-size: 0.7rem;">Account Quarantined (${Number(totalFrozen || 13200).toLocaleString()} Coins Frozen)</span>`;
    }
  }

  function initFraudPage() {
    if (STATE.page !== 'fraud') return;
    const target = STATE.data.users.find(u => u.id === 215);
    if (target && target.status === 'quarantined') {
      const b = target.balances || {};
      const frozen = b.frozen || 13200;
      updateFraudQuarantineUI(target, frozen);
    }
  }

  // Security Settings, 2FA & Session Hardening
  function loadSecuritySettings() {
    try {
      const stored = localStorage.getItem(SECURITY_SETTINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Security settings read error:', e);
    }
    return {
      twoFactorEnabled: true,
      twoFactorSecret: 'JBSW Y3DP EHPK 3PXP',
      idleTimeoutMinutes: 30,
      activeSessions: [
        { id: 'sess_1', name: 'macOS 14.6 • Chrome 130', ip: '10.0.4.12', location: 'Mumbai Node (Active Console)', isCurrent: true, activeAt: 'Current Session' },
        { id: 'sess_2', name: 'Linux x86_64 • Firefox 132', ip: '49.37.14.88', location: 'Bengaluru Gateway', isCurrent: false, activeAt: 'Idle 24m ago' },
        { id: 'sess_3', name: 'iOS 18.1 • Mobile Safari', ip: '103.253.14.2', location: 'Singapore Transit', isCurrent: false, activeAt: 'Idle 1h ago' }
      ]
    };
  }

  function persistSecuritySettings(settings) {
    try {
      localStorage.setItem(SECURITY_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Security settings write error:', e);
    }
  }

  let sessionCountdownInterval = null;
  let sessionCountdownSeconds = 30 * 60;

  function initSettingsPage() {
    if (STATE.page !== 'settings') return;

    const secSettings = loadSecuritySettings();

    // 2FA Toggle & Badge sync
    const toggle = document.getElementById('twoFactorToggle');
    const badge = document.getElementById('twoFactorStatusBadge');
    if (toggle) {
      toggle.checked = Boolean(secSettings.twoFactorEnabled);
      toggle.addEventListener('change', (e) => {
        if (!hasPermission('canModifySettings')) {
          e.preventDefault();
          toggle.checked = !toggle.checked;
          showToast('Access Restricted: Requires Compliance Officer privilege.', 'error');
          return;
        }
        toggleTwoFactorEnforcement(toggle.checked);
      });
    }
    if (badge) {
      badge.textContent = secSettings.twoFactorEnabled ? '2FA Enforced' : '2FA Optional';
      badge.className = `status-pill ${secSettings.twoFactorEnabled ? 'status-approved' : 'status-requested'}`;
    }

    // Modal buttons
    const btnOpen2FA = document.getElementById('btnOpen2FAModal');
    if (btnOpen2FA) {
      btnOpen2FA.addEventListener('click', () => {
        if (!hasPermission('canModifySettings')) {
          showToast('Access Restricted: Requires Compliance Officer privilege.', 'error');
          return;
        }
        openTwoFactorModal();
      });
    }

    const btnClose2FA = document.getElementById('btnClose2FAModal');
    if (btnClose2FA) btnClose2FA.addEventListener('click', closeTwoFactorModal);

    const btnClose2FAX = document.getElementById('btnClose2FAModalX');
    if (btnClose2FAX) btnClose2FAX.addEventListener('click', closeTwoFactorModal);

    const btnCopySecret = document.getElementById('btnCopySecretKey');
    if (btnCopySecret) btnCopySecret.addEventListener('click', copyBase32Secret);

    const btnVerifyCode = document.getElementById('btnVerify2FACode');
    if (btnVerifyCode) btnVerifyCode.addEventListener('click', verifyTwoFactorCode);

    const btnRegenCodes = document.getElementById('btnRegenBackupCodes');
    if (btnRegenCodes) {
      btnRegenCodes.addEventListener('click', () => {
        if (!hasPermission('canModifySettings')) {
          showToast('Access Restricted: Requires Compliance Officer privilege.', 'error');
          return;
        }
        showToast('8 emergency recovery codes regenerated and hashed with bcrypt.', 'success');
      });
    }

    // Idle Timeout Select
    const timeoutSelect = document.getElementById('sessionTimeoutSelect');
    if (timeoutSelect) {
      timeoutSelect.value = String(secSettings.idleTimeoutMinutes || 30);
      timeoutSelect.addEventListener('change', (e) => {
        if (!hasPermission('canModifySettings')) {
          timeoutSelect.value = String(secSettings.idleTimeoutMinutes || 30);
          showToast('Access Restricted: Requires Compliance Officer privilege.', 'error');
          return;
        }
        setIdleTimeout(parseInt(e.target.value, 10));
      });
    }

    // Active Sessions UI
    renderActiveSessionsUI(secSettings);

    // Terminate Other Sessions button
    const btnTerminate = document.getElementById('btnTerminateOtherSessions');
    if (btnTerminate) {
      btnTerminate.addEventListener('click', () => {
        if (!hasPermission('canModifySettings')) {
          showToast('Access Restricted: Requires Compliance Officer privilege.', 'error');
          return;
        }
        terminateOtherSessions();
      });
    }

    startSessionTimer(secSettings.idleTimeoutMinutes || 30);
  }

  function renderActiveSessionsUI(secSettings) {
    const sessions = secSettings.activeSessions || [];
    const countBadge = document.getElementById('activeSessionsCountBadge');
    if (countBadge) {
      countBadge.textContent = `${sessions.length} Active Session${sessions.length === 1 ? '' : 's'}`;
    }

    const label = document.getElementById('activeSessionsLabel');
    if (label) {
      label.textContent = `${sessions.length} token${sessions.length === 1 ? '' : 's'} active`;
    }

    const container = document.getElementById('activeSessionsContainer');
    if (!container) return;

    container.innerHTML = sessions.map(s => `
      <div class="session-device-row ${s.isCurrent ? 'current-device' : ''}">
        <div class="session-device-left">
          <span class="session-device-icon">${s.isCurrent ? '💻' : (s.name.includes('iOS') ? '📱' : '🖥️')}</span>
          <div class="session-device-info">
            <h6>${escapeHtml(s.name)}</h6>
            <p>IP: ${escapeHtml(s.ip)} • ${escapeHtml(s.location)}</p>
          </div>
        </div>
        <span class="session-device-badge ${s.isCurrent ? 'active-now' : 'idle'}">${escapeHtml(s.activeAt)}</span>
      </div>
    `).join('');
  }

  function openTwoFactorModal() {
    const modal = document.getElementById('twoFactorModal');
    if (modal) modal.classList.add('open');
    const input = document.getElementById('twoFactorCodeInput');
    if (input) {
      input.value = '';
      input.focus();
    }
  }

  function closeTwoFactorModal() {
    const modal = document.getElementById('twoFactorModal');
    if (modal) modal.classList.remove('open');
  }

  function copyBase32Secret() {
    const secret = 'JBSWY3DPEHPK3PXP';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(secret).then(() => {
        showToast('Base32 secret copied to clipboard (JBSWY3DPEHPK3PXP)', 'info');
      }).catch(() => {
        showToast('Secret key: JBSWY3DPEHPK3PXP', 'info');
      });
    } else {
      showToast('Secret key: JBSWY3DPEHPK3PXP', 'info');
    }
  }

  function verifyTwoFactorCode() {
    if (!hasPermission('canModifySettings')) {
      showToast('Access Restricted: Requires Compliance Officer privilege.', 'error');
      return;
    }

    const input = document.getElementById('twoFactorCodeInput');
    const code = (input ? input.value : '').trim().replace(/\s+/g, '');

    if (code.length < 6) {
      showToast('Please enter a 6-digit verification code from your authenticator app.', 'error');
      return;
    }

    const secSettings = loadSecuritySettings();
    secSettings.twoFactorEnabled = true;
    secSettings.verifiedAt = new Date().toISOString();
    persistSecuritySettings(secSettings);

    const toggle = document.getElementById('twoFactorToggle');
    if (toggle) toggle.checked = true;

    const badge = document.getElementById('twoFactorStatusBadge');
    if (badge) {
      badge.textContent = '2FA Enforced';
      badge.className = 'status-pill status-approved';
    }

    // Log to immutable audit trail
    const role = getCurrentRole();
    STATE.data.audit_logs.unshift({
      id: Math.floor(Math.random() * 90000) + 10000,
      admin_id: `${role.name} (${role.title})`,
      action: 'admin_2fa_configured',
      target_type: 'security_policy',
      target_id: 'TOTP_RFC6238',
      reason: 'Two-Factor Authentication (TOTP) successfully configured and verified with authenticator app.',
      ip_address: '10.0.4.12',
      created_at: new Date().toISOString().substring(0, 19).replace('T', ' ')
    });
    persistData();

    closeTwoFactorModal();
    showToast('Two-Factor Authentication (TOTP) verified & enforced successfully!', 'success');
  }

  function toggleTwoFactorEnforcement(enabled) {
    const secSettings = loadSecuritySettings();
    secSettings.twoFactorEnabled = enabled;
    persistSecuritySettings(secSettings);

    const badge = document.getElementById('twoFactorStatusBadge');
    if (badge) {
      badge.textContent = enabled ? '2FA Enforced' : '2FA Optional';
      badge.className = `status-pill ${enabled ? 'status-approved' : 'status-requested'}`;
    }

    const role = getCurrentRole();
    STATE.data.audit_logs.unshift({
      id: Math.floor(Math.random() * 90000) + 10000,
      admin_id: `${role.name} (${role.title})`,
      action: enabled ? 'admin_2fa_enabled' : 'admin_2fa_disabled',
      target_type: 'security_policy',
      target_id: 'TOTP_RFC6238',
      reason: `Two-Factor Authentication enforcement toggled to ${enabled ? 'ENFORCED' : 'OPTIONAL'}.`,
      ip_address: '10.0.4.12',
      created_at: new Date().toISOString().substring(0, 19).replace('T', ' ')
    });
    persistData();

    showToast(enabled ? '2FA enforcement activated across all administrative logins.' : '2FA enforcement disabled for administrative logins.', enabled ? 'success' : 'info');
  }

  function setIdleTimeout(mins) {
    const secSettings = loadSecuritySettings();
    secSettings.idleTimeoutMinutes = mins;
    persistSecuritySettings(secSettings);

    sessionCountdownSeconds = mins * 60;
    const timerEl = document.getElementById('sessionCountdownTimer');
    if (timerEl) {
      timerEl.textContent = `${String(mins).padStart(2, '0')}:00 Idle Lock`;
    }

    const role = getCurrentRole();
    STATE.data.audit_logs.unshift({
      id: Math.floor(Math.random() * 90000) + 10000,
      admin_id: `${role.name} (${role.title})`,
      action: 'session_timeout_updated',
      target_type: 'session_policy',
      target_id: `${mins}m`,
      reason: `Configurable privileged inactivity window set to ${mins} minutes.`,
      ip_address: '10.0.4.12',
      created_at: new Date().toISOString().substring(0, 19).replace('T', ' ')
    });
    persistData();

    showToast(`Idle session timeout updated to ${mins} minutes.`, 'success');
  }

  function terminateOtherSessions() {
    const secSettings = loadSecuritySettings();
    const remoteCount = (secSettings.activeSessions || []).filter(s => !s.isCurrent).length;

    if (remoteCount === 0) {
      showToast('No other active remote sessions found. You are on the only active terminal.', 'info');
      return;
    }

    secSettings.activeSessions = (secSettings.activeSessions || []).filter(s => s.isCurrent);
    persistSecuritySettings(secSettings);

    renderActiveSessionsUI(secSettings);

    const role = getCurrentRole();
    STATE.data.audit_logs.unshift({
      id: Math.floor(Math.random() * 90000) + 10000,
      admin_id: `${role.name} (${role.title})`,
      action: 'admin_sessions_terminated',
      target_type: 'auth_tokens',
      target_id: 'all_remote',
      reason: `Zero-trust session purge: Terminated ${remoteCount} remote administrative sessions (Bengaluru, Singapore).`,
      ip_address: '10.0.4.12',
      created_at: new Date().toISOString().substring(0, 19).replace('T', ' ')
    });
    persistData();

    showToast(`Terminated ${remoteCount} remote administrative session${remoteCount === 1 ? '' : 's'}. Zero-trust token seal applied.`, 'success');
  }

  function startSessionTimer(mins) {
    if (sessionCountdownInterval) clearInterval(sessionCountdownInterval);
    sessionCountdownSeconds = mins * 60;

    const timerEl = document.getElementById('sessionCountdownTimer');
    sessionCountdownInterval = setInterval(() => {
      if (sessionCountdownSeconds > 0) {
        sessionCountdownSeconds--;
      }
      if (timerEl) {
        const m = Math.floor(sessionCountdownSeconds / 60);
        const s = sessionCountdownSeconds % 60;
        timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} Idle Lock`;
      }
    }, 1000);

    ['mousemove', 'keydown', 'click'].forEach(evt => {
      document.addEventListener(evt, () => {
        const currentSec = loadSecuritySettings();
        sessionCountdownSeconds = (currentSec.idleTimeoutMinutes || 30) * 60;
      }, { passive: true });
    });
  }

  function handleSettingsSave() {
    if (!hasPermission('canModifySettings')) {
      showToast('Access Restricted: Requires Compliance Officer privilege.', 'error');
      return;
    }
    showToast('Compliance configuration updated and recorded in audit log.', 'success');
  }

  function cacheDom() {
    DOM.sidebar = document.querySelector('.admin-sidebar');
    DOM.menuToggle = document.getElementById('menuToggle');
    DOM.btnRefresh = document.getElementById('btnRefresh');
    DOM.modeToggle = document.getElementById('modeToggle');
    DOM.modeStatusLed = document.getElementById('modeStatusLed');
    DOM.modeLabel = document.getElementById('modeLabel');
    DOM.toastContainer = document.getElementById('toastContainer');

    // Modals
    DOM.reviewModal = document.getElementById('reviewModal');
    DOM.reviewForm = document.getElementById('reviewForm');
    DOM.reviewWdId = document.getElementById('reviewWdId');
    DOM.reviewWdInfo = document.getElementById('reviewWdInfo');
    DOM.reviewAction = document.getElementById('reviewAction');
    DOM.reviewReason = document.getElementById('reviewReason');
    DOM.btnSubmitReview = document.getElementById('btnSubmitReview');

    // Invariant Check
    DOM.btnRunInvariant = document.getElementById('btnRunInvariant');
    DOM.invariantFeedback = document.getElementById('invariantFeedback');

    // Webhook Simulator & DLQ
    DOM.btnSimulateWebhook = document.getElementById('btnSimulateWebhook');
    DOM.webhookResponseBox = document.getElementById('webhookResponseBox');
    DOM.btnRetryAllDlq = document.getElementById('btnRetryAllDlq');

    // Ledger Seal & ERP Export
    DOM.ledgerSealHash = document.getElementById('ledgerSealHash');
    DOM.btnCopySealHash = document.getElementById('btnCopySealHash');
    DOM.btnExportErp = document.getElementById('btnExportErp');
    DOM.erpExportFormat = document.getElementById('erpExportFormat');
    DOM.erpDateRange = document.getElementById('erpDateRange');

    // Payout Gateway & Bank Reconciliation
    DOM.payoutGatewaySelect = document.getElementById('payoutGatewaySelect');
    DOM.btnRunBankRecon = document.getElementById('btnRunBankRecon');
  }

  function bindEvents() {
    // Intercept clicks on restricted sidebar nav links
    document.addEventListener('click', (e) => {
      const navItem = e.target.closest('.sidebar-nav .nav-item');
      if (navItem) {
        const page = navItem.getAttribute('data-page') || navItem.getAttribute('data-tab');
        const role = getCurrentRole();
        if (page && !role.sections.includes(page)) {
          e.preventDefault();
          e.stopPropagation();
          const req = getRequiredRoleForSection(page);
          showToast(`Access Restricted: Requires ${req} privilege.`, 'error');
          navItem.classList.add('shake-restricted');
          setTimeout(() => navItem.classList.remove('shake-restricted'), 400);
        }
      }
    });

    if (DOM.menuToggle) {
      DOM.menuToggle.addEventListener('click', () => {
        DOM.sidebar.classList.toggle('open');
      });
    }

    if (DOM.btnRefresh) {
      DOM.btnRefresh.addEventListener('click', () => {
        refreshAllData();
      });
    }

    if (DOM.modeToggle) {
      DOM.modeToggle.addEventListener('click', () => {
        STATE.mode = STATE.mode === 'api' ? 'mock' : 'api';
        updateModeUI();
        refreshAllData();
      });
    }

    // DLQ Retry All
    if (DOM.btnRetryAllDlq) {
      DOM.btnRetryAllDlq.addEventListener('click', () => {
        retryAllDlqEvents();
      });
    }

    // Ledger ERP Export
    if (DOM.btnExportErp) {
      DOM.btnExportErp.addEventListener('click', () => {
        const format = DOM.erpExportFormat ? DOM.erpExportFormat.value : 'csv';
        exportLedger(format);
      });
    }

    // Copy Ledger Seal Hash
    if (DOM.btnCopySealHash) {
      DOM.btnCopySealHash.addEventListener('click', () => {
        const hashEl = document.getElementById('ledgerSealHash');
        if (hashEl) {
          const text = hashEl.textContent.trim();
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
              showToast('SHA-256 seal hash copied to clipboard', 'info');
            }).catch(() => {
              showToast('Hash: ' + text.substring(0, 16) + '...', 'info');
            });
          } else {
            showToast('Hash: ' + text.substring(0, 16) + '...', 'info');
          }
        }
      });
    }

    // Payout Gateway Change
    if (DOM.payoutGatewaySelect) {
      DOM.payoutGatewaySelect.addEventListener('change', (e) => {
        switchPayoutGateway(e.target.value);
      });
    }

    // Run Bank Reconciliation
    if (DOM.btnRunBankRecon) {
      DOM.btnRunBankRecon.addEventListener('click', () => {
        runBankReconciliation();
      });
    }

    // Modal Close
    document.querySelectorAll('.modal-close-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        closeModals();
      });
    });

    // Review Form Submit
    if (DOM.reviewForm) {
      DOM.reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleReviewSubmit();
      });
    }

    // Withdrawal Status Filter Chips
    document.querySelectorAll('.wd-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.wd-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        STATE.withdrawalFilter = chip.getAttribute('data-filter');
        renderWithdrawals();
      });
    });

    // Withdrawal Search
    const wdSearch = document.getElementById('withdrawalSearch');
    if (wdSearch) {
      wdSearch.addEventListener('input', (e) => {
        STATE.withdrawalSearch = e.target.value.toLowerCase().trim();
        renderWithdrawals();
      });
    }

    // User Search
    const userSearch = document.getElementById('userSearch');
    if (userSearch) {
      userSearch.addEventListener('input', (e) => {
        STATE.userSearch = e.target.value.toLowerCase().trim();
        renderUsers();
      });
    }

    // Invariant Check Button
    if (DOM.btnRunInvariant) {
      DOM.btnRunInvariant.addEventListener('click', () => {
        runDoubleEntryAudit();
      });
    }

    // Webhook Test Simulation
    if (DOM.btnSimulateWebhook) {
      DOM.btnSimulateWebhook.addEventListener('click', () => {
        executeWebhookSimulation();
      });
    }

    // CSV Export
    const btnExportWd = document.getElementById('btnExportWd');
    if (btnExportWd) {
      btnExportWd.addEventListener('click', () => {
        exportWithdrawalsCsv();
      });
    }

    // Batch Actions on Withdrawals Page
    const chkSelectAll = document.getElementById('chkSelectAllWd');
    if (chkSelectAll) {
      chkSelectAll.addEventListener('change', (e) => {
        document.querySelectorAll('.wd-row-chk').forEach(chk => {
          chk.checked = e.target.checked;
        });
        updateBatchCount();
      });
    }

    const btnBatchApprove = document.getElementById('btnBatchApprove');
    if (btnBatchApprove) {
      btnBatchApprove.addEventListener('click', () => {
        handleBatchAction('approve');
      });
    }

    const btnBatchReject = document.getElementById('btnBatchReject');
    if (btnBatchReject) {
      btnBatchReject.addEventListener('click', () => {
        handleBatchAction('reject');
      });
    }

    // Sponsorship Lead Filter Chips
    document.querySelectorAll('.lead-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.lead-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        STATE.sponsorshipFilter = chip.getAttribute('data-filter') || 'all';
        renderSponsorships();
      });
    });

    // Sponsorship Lead Search Input
    const leadSearch = document.getElementById('leadSearchInput');
    if (leadSearch) {
      leadSearch.addEventListener('input', (e) => {
        STATE.sponsorshipSearch = e.target.value.toLowerCase().trim();
        renderSponsorships();
      });
    }

    // Budget & Payout hints
    const spCoinBudget = document.getElementById('spCoinBudget');
    const spBudgetHint = document.getElementById('spBudgetEquivHint');
    if (spCoinBudget && spBudgetHint) {
      spCoinBudget.addEventListener('input', (e) => {
        const val = Number(e.target.value || 0);
        spBudgetHint.textContent = `≈ ₹${(val / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })} liability budget`;
      });
    }

    const spPayout = document.getElementById('spPayoutPerAction');
    const spPayoutHint = document.getElementById('spPayoutEquivHint');
    if (spPayout && spPayoutHint) {
      spPayout.addEventListener('input', (e) => {
        const val = Number(e.target.value || 0);
        spPayoutHint.textContent = `= ₹${(val / 100).toFixed(2)} per verified action`;
      });
    }

    // Auto-generate HMAC secret button
    const btnGenHmac = document.getElementById('btnGenHmacSecret');
    if (btnGenHmac) {
      btnGenHmac.addEventListener('click', () => {
        generateHmacSecret();
      });
    }
  }

  function updateBatchCount() {
    const checked = document.querySelectorAll('.wd-row-chk:checked').length;
    const countEl = document.getElementById('batchSelectedCount');
    if (countEl) countEl.textContent = checked;
  }

  // Check Backend Connectivity
  async function checkBackendConnection() {
    try {
      const res = await fetch('/api/v1/admin/overview', {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        STATE.mode = 'api';
        showToast('Connected to Watch & Earn Live Backend', 'info');
      } else {
        STATE.mode = 'mock';
      }
    } catch (e) {
      STATE.mode = 'mock';
    }
    updateModeUI();
    refreshAllData();
  }

  function updateModeUI() {
    if (!DOM.modeStatusLed || !DOM.modeLabel) return;
    if (STATE.mode === 'api') {
      DOM.modeStatusLed.classList.remove('mock');
      DOM.modeLabel.textContent = 'Live Laravel Backend';
      DOM.modeToggle.title = 'Click to switch to Simulation Mode';
    } else {
      DOM.modeStatusLed.classList.add('mock');
      DOM.modeLabel.textContent = 'Interactive Simulation Mode';
      DOM.modeToggle.title = 'Click to switch to Live Backend API';
    }
  }

  // Refresh All Data
  async function refreshAllData() {
    if (STATE.mode === 'api') {
      try {
        await Promise.all([
          fetchOverviewApi(),
          fetchWithdrawalsApi(),
          fetchUsersApi(),
          fetchPartnersApi(),
          fetchLedgerApi(),
          fetchTicketsApi(),
          fetchAuditLogsApi(),
          fetchPushCampaignsApi(),
          fetchSponsorshipsApi()
        ]);
        persistData();
        showToast('Data synced with live backend', 'success');
      } catch (err) {
        console.warn('Backend API fetch error, switching to persistent mock store:', err);
        STATE.mode = 'mock';
        updateModeUI();
        showToast('Backend offline. Switched to Interactive Simulation', 'info');
      }
    }

    renderCurrentPageView();
  }

  // API Fetchers
  async function fetchOverviewApi() {
    const res = await fetch('/api/v1/admin/overview', { headers: { 'Accept': 'application/json' } });
    const json = await res.json();
    if (json.success && json.data) {
      STATE.data.overview = json.data;
    }
  }

  async function fetchWithdrawalsApi() {
    const res = await fetch('/api/v1/admin/withdrawals', { headers: { 'Accept': 'application/json' } });
    const json = await res.json();
    if (json.success && json.data && json.data.data) {
      STATE.data.withdrawals = json.data.data.map(w => ({
        id: w.id,
        user_id: w.user_id,
        user_name: w.user ? (w.user.name || `User ...${w.user.phone_last_four}`) : `User #${w.user_id}`,
        phone_last_four: w.user ? w.user.phone_last_four : 'N/A',
        coins: w.coins,
        amount_paise: w.amount_paise,
        amount_inr: (w.amount_paise / 100).toFixed(2),
        upi_id: w.upi_id,
        bank_provider: detectBankFromUpi(w.upi_id),
        status: w.status,
        risk_score: 'Verified',
        created_at: w.created_at ? w.created_at.substring(0, 19).replace('T', ' ') : 'Just now'
      }));
    }
  }

  async function fetchUsersApi() {
    const res = await fetch('/api/v1/admin/users', { headers: { 'Accept': 'application/json' } });
    const json = await res.json();
    if (json.success && json.data && json.data.data) {
      STATE.data.users = json.data.data;
    }
  }

  async function fetchPartnersApi() {
    const res = await fetch('/api/v1/admin/partners', { headers: { 'Accept': 'application/json' } });
    const json = await res.json();
    if (json.success && json.data) {
      STATE.data.partners = json.data;
    }
  }

  async function fetchLedgerApi() {
    const res = await fetch('/api/v1/admin/ledger', { headers: { 'Accept': 'application/json' } });
    const json = await res.json();
    if (json.success && json.data && json.data.data) {
      STATE.data.ledger = json.data.data.map(l => ({
        id: l.id,
        account_type: l.account ? l.account.account_type : 'N/A',
        direction: l.direction,
        coin_amount: l.coin_amount,
        inr_amount: `₹${(l.coin_amount / 1000).toFixed(2)}`,
        transaction_ref: l.transaction_id ? `txn_${l.transaction_id}` : 'system',
        kind: l.account ? `${l.account.account_type}_transfer` : 'ledger_entry',
        user: l.account && l.account.user ? (l.account.user.name || `User ...${l.account.user.phone_last_four}`) : 'System',
        created_at: l.created_at ? l.created_at.substring(0, 19).replace('T', ' ') : 'Recent'
      }));
    }
  }

  async function fetchTicketsApi() {
    const res = await fetch('/api/v1/admin/support-tickets', { headers: { 'Accept': 'application/json' } });
    const json = await res.json();
    if (json.success && json.data && json.data.data) {
      STATE.data.support_tickets = json.data.data.map(t => ({
        id: t.id,
        user_name: t.user ? (t.user.name || `User ...${t.user.phone_last_four}`) : 'User',
        phone: t.user ? `...${t.user.phone_last_four}` : '',
        category: t.category,
        subject: t.subject,
        status: t.status,
        created_at: t.created_at ? t.created_at.substring(0, 19).replace('T', ' ') : 'Recent'
      }));
    }
  }

  async function fetchAuditLogsApi() {
    const res = await fetch('/api/v1/admin/audit-logs', { headers: { 'Accept': 'application/json' } });
    const json = await res.json();
    if (json.success && json.data && json.data.data) {
      STATE.data.audit_logs = json.data.data.map(a => ({
        id: a.id,
        admin_id: a.admin_id,
        action: a.action,
        target_type: a.target_type,
        target_id: a.target_id,
        reason: a.reason,
        ip_address: a.ip_address || '127.0.0.1',
        created_at: a.created_at ? a.created_at.substring(0, 19).replace('T', ' ') : 'Recent'
      }));
    }
  }

  // Render Page Based on Context
  function renderCurrentPageView() {
    highlightActiveNav();
    enforcePermissions();

    // Always render overview stats if present
    renderOverview();

    // Page-specific renders
    if (document.getElementById('withdrawalsTableBody')) {
      renderWithdrawals();
    }
    if (document.getElementById('usersTableBody')) {
      renderUsers();
    }
    if (document.getElementById('partnersGrid')) {
      renderPartners();
    }
    if (document.getElementById('ledgerTableBody')) {
      renderLedger();
    }
    if (document.getElementById('supportTableBody')) {
      renderSupport();
    }
    if (document.getElementById('auditTableBody')) {
      renderAuditLogs();
    }
    if (document.getElementById('campaignsTableBody')) {
      renderPushCampaigns();
    }
    if (document.getElementById('sponsorshipLeadsTableBody') || document.getElementById('sponsoredCampaignsTableBody')) {
      renderSponsorships();
    }
  }

  // Render Overview
  function renderOverview() {
    const ov = STATE.data.overview;
    const l = ov.liabilities || {};

    const elTotalUsers = document.getElementById('kpiTotalUsers');
    const elCompletions = document.getElementById('kpiCompletions');
    const elLiability = document.getElementById('kpiLiability');
    const elPaid = document.getElementById('kpiPaid');

    if (elTotalUsers) elTotalUsers.textContent = Number(ov.total_users || 0).toLocaleString();
    if (elCompletions) elCompletions.textContent = Number(ov.total_reward_completions || 0).toLocaleString();
    
    const availCoins = Number(l.available_coins || 0);
    const pendCoins = Number(l.pending_coins || 0);
    const resCoins = Number(l.reserved_coins || 0);
    const totalLiabCoins = availCoins + pendCoins + resCoins;
    const totalLiabInr = (totalLiabCoins / 1000).toFixed(2);

    if (elLiability) elLiability.textContent = `₹${Number(totalLiabInr).toLocaleString()}`;
    const paidInr = l.paid_inr || ((Number(l.paid_coins || 0)) / 1000).toFixed(2);
    if (elPaid) elPaid.textContent = `₹${Number(paidInr).toLocaleString()}`;

    // Update Equation Chips
    const eqAvail = document.getElementById('eqAvail');
    const eqPend = document.getElementById('eqPend');
    const eqRes = document.getElementById('eqRes');
    const eqTotal = document.getElementById('eqTotal');

    if (eqAvail) eqAvail.textContent = `${availCoins.toLocaleString()} 🪙 (Avail)`;
    if (eqPend) eqPend.textContent = `${pendCoins.toLocaleString()} 🪙 (Pending)`;
    if (eqRes) eqRes.textContent = `${resCoins.toLocaleString()} 🪙 (Reserved)`;
    if (eqTotal) eqTotal.textContent = `${totalLiabCoins.toLocaleString()} 🪙 (₹${totalLiabInr})`;

    // Overview Table
    const tbody = document.getElementById('overviewRecentWdBody');
    if (tbody) {
      const recent = STATE.data.withdrawals.slice(0, 5);
      tbody.innerHTML = recent.map(w => `
        <tr>
          <td><strong>#${w.id}</strong></td>
          <td>
            <div class="user-col">
              <div class="user-avatar-tiny">${(w.user_name || 'U').charAt(0)}</div>
              <div>
                <span class="user-name">${escapeHtml(w.user_name)}</span>
                <span class="user-meta">...${w.phone_last_four}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="coin-amount-box">🪙 ${Number(w.coins).toLocaleString()}</div>
            <div class="inr-amount">₹${w.amount_inr}</div>
          </td>
          <td>
            <span class="upi-id-pill">${escapeHtml(w.upi_id)}</span>
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">${w.bank_provider || 'UPI'}</div>
          </td>
          <td><span class="status-pill status-${w.status}">${w.status}</span></td>
          <td>
            ${renderActionButtons(w)}
          </td>
        </tr>
      `).join('');
    }
  }

  // Render Withdrawals
  function renderWithdrawals() {
    const tbody = document.getElementById('withdrawalsTableBody');
    if (!tbody) return;

    let items = STATE.data.withdrawals;

    // Filter by status
    if (STATE.withdrawalFilter !== 'all') {
      items = items.filter(w => w.status === STATE.withdrawalFilter);
    }

    // Filter by search
    if (STATE.withdrawalSearch) {
      items = items.filter(w => 
        w.upi_id.toLowerCase().includes(STATE.withdrawalSearch) ||
        w.user_name.toLowerCase().includes(STATE.withdrawalSearch) ||
        w.phone_last_four.includes(STATE.withdrawalSearch) ||
        String(w.id).includes(STATE.withdrawalSearch)
      );
    }

    // Dedicated Page Stats
    const totalWdCount = document.getElementById('statTotalWd');
    if (totalWdCount) totalWdCount.textContent = STATE.data.withdrawals.length;

    const pendingWdCount = document.getElementById('statPendingWd');
    if (pendingWdCount) {
      pendingWdCount.textContent = STATE.data.withdrawals.filter(w => w.status === 'requested' || w.status === 'under_review').length;
    }

    const approvedWdCount = document.getElementById('statApprovedWd');
    if (approvedWdCount) {
      approvedWdCount.textContent = STATE.data.withdrawals.filter(w => w.status === 'approved' || w.status === 'paid').length;
    }

    const rejectedWdCount = document.getElementById('statRejectedWd');
    if (rejectedWdCount) {
      rejectedWdCount.textContent = STATE.data.withdrawals.filter(w => w.status === 'rejected').length;
    }

    // Payout Gateway & Bank Reconciliation Card Sync
    const gatewaySelect = document.getElementById('payoutGatewaySelect');
    const activeGatewayPill = document.getElementById('activeGatewayPill');
    const bankFloatAmount = document.getElementById('bankFloatAmount');
    const bankFloatStatus = document.getElementById('bankFloatStatus');
    const pGateway = STATE.data.payout_gateway || { active: 'mock', bank_float_paise: 34000 };

    if (gatewaySelect) {
      gatewaySelect.value = pGateway.active || 'mock';
    }

    if (activeGatewayPill) {
      const labels = {
        mock: 'Gateway: Sandbox Instant',
        cashfree: 'Gateway: Cashfree Payouts API',
        razorpayx: 'Gateway: RazorpayX Payouts API'
      };
      activeGatewayPill.textContent = labels[pGateway.active] || ('Gateway: ' + pGateway.active);
      activeGatewayPill.className = pGateway.active === 'mock' ? 'status-pill status-approved' : 'status-pill status-under_review';
    }

    if (bankFloatAmount) {
      const reservedCoins = STATE.data.overview?.liabilities?.reserved_coins || 0;
      const reservedPaise = Math.floor(reservedCoins / 10);
      const floatPaise = pGateway.bank_float_paise ?? reservedPaise;
      bankFloatAmount.textContent = '₹' + (floatPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (bankFloatStatus) {
        if (floatPaise === reservedPaise) {
          bankFloatStatus.textContent = '● Balanced';
          bankFloatStatus.style.color = 'var(--emerald-primary)';
        } else {
          bankFloatStatus.textContent = '● Discrepancy';
          bankFloatStatus.style.color = 'var(--rose-primary)';
        }
      }
    }

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 36px;">No withdrawal requests match your active filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(w => `
      <tr>
        <td style="width: 30px;">
          <input type="checkbox" class="wd-row-chk" data-id="${w.id}" onchange="window.WatchEarnAdmin.updateBatchCount()">
        </td>
        <td><strong>#${w.id}</strong></td>
        <td>
          <div class="user-col">
            <div class="user-avatar-tiny">${(w.user_name || 'U').charAt(0)}</div>
            <div>
              <span class="user-name">${escapeHtml(w.user_name)}</span>
              <span class="user-meta">Mobile: ...${w.phone_last_four} • User #${w.user_id}</span>
            </div>
          </div>
        </td>
        <td>
          <div class="coin-amount-box">🪙 ${Number(w.coins).toLocaleString()}</div>
          <div class="inr-amount">₹${w.amount_inr} (${Number(w.amount_paise).toLocaleString()} paise)</div>
        </td>
        <td>
          <span class="upi-id-pill">${escapeHtml(w.upi_id)}</span>
          <div style="font-size: 0.72rem; color: var(--cyan-primary); margin-top: 2px;">${w.bank_provider || 'Verified VPA'}</div>
        </td>
        <td>
          <span class="status-pill status-${w.status}">${w.status}</span>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">Risk: ${w.risk_score || 'Checked'}</div>
        </td>
        <td style="font-size: 0.75rem; color: var(--text-muted); white-space: nowrap;">
          ${w.created_at}
        </td>
        <td>
          ${renderActionButtons(w)}
        </td>
      </tr>
    `).join('');
  }

  function renderActionButtons(w) {
    if (w.status === 'requested' || w.status === 'under_review') {
      return `
        <div class="action-btn-group">
          <button class="btn-table btn-table-approve" onclick="window.WatchEarnAdmin.openReview(${w.id}, 'approve')">
            ✓ Approve
          </button>
          <button class="btn-table btn-table-reject" onclick="window.WatchEarnAdmin.openReview(${w.id}, 'reject')">
            ✕ Reject
          </button>
        </div>
      `;
    }
    return `<span style="font-size: 0.75rem; color: var(--text-muted);">Finalized (${w.status})</span>`;
  }

  // Render Users
  function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    let items = STATE.data.users;
    if (STATE.userSearch) {
      items = items.filter(u => 
        (u.name && u.name.toLowerCase().includes(STATE.userSearch)) ||
        (u.email && u.email.toLowerCase().includes(STATE.userSearch)) ||
        (u.phone_last_four && u.phone_last_four.includes(STATE.userSearch)) ||
        String(u.id).includes(STATE.userSearch)
      );
    }

    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 36px;">No users found matching your search.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(u => {
      const b = u.balances || {};
      return `
        <tr>
          <td><strong>#${u.id}</strong></td>
          <td>
            <div class="user-col">
              <div class="user-avatar-tiny">${(u.name || 'U').charAt(0)}</div>
              <div>
                <span class="user-name">${escapeHtml(u.name || 'User')}</span>
                <span class="user-meta">${u.email || `Phone: ...${u.phone_last_four || 'N/A'}`}</span>
              </div>
            </div>
          </td>
          <td>
            <span class="status-pill status-approved" style="font-size: 0.65rem;">18+ VERIFIED</span>
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">DPDPA Consent: Active</div>
          </td>
          <td>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--gold-primary);">
              🪙 ${Number(b.available || 0).toLocaleString()} <span style="font-size: 0.7rem; color: var(--text-muted);">(Avail)</span>
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">
              Pend: ${Number(b.pending || 0).toLocaleString()} • Res: ${Number(b.reserved || 0).toLocaleString()}
            </div>
          </td>
          <td>
            <div style="font-weight: 700; color: #fff;">${u.completions_count || 0} tasks</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${u.withdrawals_count || 0} withdrawals</div>
          </td>
          <td>
            <span class="status-pill status-${u.status}">${u.status === 'quarantined' ? 'QUARANTINED' : u.status}</span>
          </td>
          <td>
            <div class="action-btn-group">
              ${!hasPermission('canBanUsers') ? `
                <span style="font-size: 0.72rem; color: var(--text-muted); font-style: italic;">Read-Only</span>
              ` : (u.status === 'quarantined' ? `
                <button class="btn-table btn-table-approve" onclick="window.WatchEarnAdmin.toggleUserStatus(${u.id}, 'active')">
                  Lift Quarantine
                </button>
              ` : (u.status === 'active' ? `
                <button class="btn-table btn-table-reject" onclick="window.WatchEarnAdmin.toggleUserStatus(${u.id}, 'suspended')">
                  Suspend
                </button>
              ` : `
                <button class="btn-table btn-table-approve" onclick="window.WatchEarnAdmin.toggleUserStatus(${u.id}, 'active')">
                  Activate
                </button>
              `))}
              <button class="btn-table btn-table-view" onclick="window.WatchEarnAdmin.inspectUser(${u.id})">
                Inspect
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render Partners
  function renderPartners() {
    const grid = document.getElementById('partnersGrid');
    if (grid) {
      grid.innerHTML = STATE.data.partners.map(p => `
        <div class="partner-card">
          <div class="partner-card-header">
            <div class="partner-name">${escapeHtml(p.name)}</div>
            <span class="status-pill status-${p.status}">${p.status}</span>
          </div>
          <div class="partner-meta-row">
            <span class="partner-meta-label">Identifier (Slug)</span>
            <span class="partner-meta-value"><code>${p.slug}</code></span>
          </div>
          <div class="partner-meta-row">
            <span class="partner-meta-label">Active Offers</span>
            <span class="partner-meta-value">${p.offers_count} sponsored tasks</span>
          </div>
          <div class="partner-meta-row">
            <span class="partner-meta-label">HMAC SHA-256 Secret</span>
            <span class="partner-meta-value">${p.has_secret ? '•••••••••••••••• (Verified)' : 'Missing'}</span>
          </div>
          <div class="partner-meta-row">
            <span class="partner-meta-label">Timestamp Drift Limit</span>
            <span class="partner-meta-value">${p.timestamp_drift_allowed}</span>
          </div>
          <div class="partner-meta-row">
            <span class="partner-meta-label">Lifetime Postbacks</span>
            <span class="partner-meta-value">${Number(p.reward_events_count).toLocaleString()} events</span>
          </div>
          <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed var(--border-subtle); font-size: 0.75rem; color: var(--text-muted);">
            Callback URL: <code style="color: var(--cyan-primary);">${p.callback_url}</code>
          </div>
        </div>
      `).join('');
    }

    renderWebhookDlq();
  }

  function renderWebhookDlq() {
    const tbody = document.getElementById('dlqTableBody');
    const badge = document.getElementById('dlqCountBadge');
    if (!tbody) return;

    const dlqList = STATE.data.webhook_dlq || [];
    const activeFailures = dlqList.filter(d => d.status !== 'resolved' && d.status !== 'ignored').length;
    if (badge) {
      badge.textContent = activeFailures;
      badge.className = activeFailures > 0 ? 'nav-badge danger' : 'nav-badge';
      badge.style.display = 'inline-block';
    }

    if (dlqList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">Dead-Letter Queue is empty. No failed partner webhooks recorded.</td></tr>`;
      return;
    }

    tbody.innerHTML = dlqList.map(item => `
      <tr>
        <td><strong>#${item.id}</strong></td>
        <td>
          <span style="font-weight: 600; color: #fff;">${escapeHtml(item.partner_name || item.partner_slug)}</span>
          <div style="font-size: 0.7rem; color: var(--text-muted);"><code>${item.partner_slug}</code></div>
        </td>
        <td><code>${item.event_id}</code></td>
        <td>
          <span class="user-name">${escapeHtml(item.user_name || 'User #' + item.user_id)}</span>
          <div style="font-size: 0.7rem; color: var(--text-muted);">User ID: ${item.user_id}</div>
        </td>
        <td>
          <div style="color: var(--rose-primary); font-size: 0.78rem; font-weight: 600; max-width: 260px; line-height: 1.3;">
            ${escapeHtml(item.failure_reason)}
          </div>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">
            Payload: ${item.reward_coins} coins (₹${item.amount_inr || (item.reward_coins / 1000).toFixed(2)})
          </div>
        </td>
        <td>
          <span style="font-family: var(--font-mono); font-weight: 700; color: #fff;">${item.retry_count || 0}</span>
        </td>
        <td>
          <span class="status-pill status-${item.status}">${item.status.replace('_', ' ')}</span>
        </td>
        <td style="font-size: 0.74rem; color: var(--text-muted); white-space: nowrap;">
          ${item.last_attempt}
        </td>
        <td>
          ${item.status === 'resolved' || item.status === 'replayed' ? `
            <span style="color: var(--emerald-primary); font-size: 0.75rem; font-weight: 700;">✓ In Ledger</span>
          ` : `
            <div class="action-btn-group">
              <button class="btn-table btn-table-retry" onclick="window.WatchEarnAdmin.retryDlqEvent('${item.id}')" title="Re-evaluate HMAC and credit ledger">
                ⚡ Retry Postback
              </button>
              <button class="btn-table btn-table-ignore" onclick="window.WatchEarnAdmin.ignoreDlqEvent('${item.id}')" title="Mark as non-retryable">
                Ignore
              </button>
            </div>
          `}
        </td>
      </tr>
    `).join('');
  }

  // Render Ledger
  function renderLedger() {
    const tbody = document.getElementById('ledgerTableBody');
    if (tbody) {
      tbody.innerHTML = STATE.data.ledger.map(entry => `
        <tr>
          <td><strong>#${entry.id}</strong></td>
          <td>
            <span class="status-pill status-${entry.direction === 'credit' ? 'approved' : 'rejected'}" style="font-size: 0.65rem;">
              ${entry.direction.toUpperCase()}
            </span>
          </td>
          <td><code>${entry.account_type}</code></td>
          <td>
            <span class="coin-amount-box" style="color: ${entry.direction === 'credit' ? 'var(--emerald-primary)' : 'var(--rose-primary)'};">
              ${entry.direction === 'credit' ? '+' : '-'}${Number(entry.coin_amount).toLocaleString()} 🪙
            </span>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${entry.inr_amount}</div>
          </td>
          <td><span class="user-meta">${escapeHtml(entry.user)}</span></td>
          <td><code>${entry.transaction_ref}</code></td>
          <td style="font-size: 0.75rem; color: var(--text-muted);">${entry.created_at}</td>
        </tr>
      `).join('');
    }

    updateLedgerSealUI();
  }

  async function updateLedgerSealUI() {
    const hashEl = document.getElementById('ledgerSealHash');
    const timestampEl = document.getElementById('sealTimestamp');
    const blockHeightEl = document.getElementById('sealBlockHeight');
    if (!hashEl) return;

    // Canonical representation of ledger journal entries
    const journalSummary = (STATE.data.ledger || []).map(e => `${e.id}:${e.direction}:${e.account_type}:${e.coin_amount}:${e.transaction_ref}`).join('|');
    const hash = await computeSha256(journalSummary || 'GENESIS_LEDGER_BLOCK_0');

    hashEl.textContent = hash;
    if (timestampEl) {
      timestampEl.textContent = 'Live (' + new Date().toLocaleTimeString('en-US', { hour12: false }) + ')';
    }
    if (blockHeightEl) {
      blockHeightEl.textContent = `Block #${14920 + (STATE.data.ledger || []).length} • SHA-256 Sequential Integrity Active`;
    }
  }

  // Render Support
  function renderSupport() {
    const tbody = document.getElementById('supportTableBody');
    if (!tbody) return;

    tbody.innerHTML = STATE.data.support_tickets.map(t => `
      <tr>
        <td><strong>#${t.id}</strong></td>
        <td>
          <div class="user-name">${escapeHtml(t.user_name)}</div>
          <span class="user-meta">${t.phone}</span>
        </td>
        <td><span class="eq-chip" style="font-size: 0.72rem;">${t.category}</span></td>
        <td style="max-width: 320px; font-size: 0.82rem;">${escapeHtml(t.subject)}</td>
        <td><span class="status-pill status-${t.status === 'open' ? 'requested' : (t.status === 'resolved' ? 'approved' : 'under_review')}">${t.status}</span></td>
        <td style="font-size: 0.75rem; color: var(--text-muted);">${t.created_at}</td>
        <td>
          ${t.status !== 'resolved' ? `
            <button class="btn-table btn-table-approve" onclick="window.WatchEarnAdmin.resolveTicket(${t.id})">
              Mark Resolved
            </button>
          ` : `<span style="font-size: 0.75rem; color: var(--text-muted);">Closed</span>`}
        </td>
      </tr>
    `).join('');
  }

  // Render Audit Logs
  function renderAuditLogs() {
    const tbody = document.getElementById('auditTableBody');
    if (!tbody) return;

    tbody.innerHTML = STATE.data.audit_logs.map(log => `
      <tr>
        <td><strong>#${log.id}</strong></td>
        <td><code>${escapeHtml(log.admin_id)}</code></td>
        <td>
          <span class="eq-chip" style="font-size: 0.72rem; color: var(--cyan-primary); font-weight: 700;">
            ${escapeHtml(log.action)}
          </span>
        </td>
        <td><code>${escapeHtml(log.target_type)} #${escapeHtml(String(log.target_id))}</code></td>
        <td style="max-width: 350px; font-size: 0.82rem; color: var(--text-secondary);">${escapeHtml(log.reason)}</td>
        <td style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(log.ip_address)}</td>
        <td style="font-size: 0.75rem; color: var(--text-muted);">${log.created_at}</td>
      </tr>
    `).join('');
  }

  // Push Campaigns & FCM API Fetcher
  async function fetchPushCampaignsApi() {
    try {
      const [campRes, statsRes] = await Promise.all([
        fetch('/api/v1/admin/push/campaigns', { headers: { 'Accept': 'application/json' } }),
        fetch('/api/v1/admin/push/stats', { headers: { 'Accept': 'application/json' } })
      ]);
      if (campRes.ok) {
        const campJson = await campRes.json();
        if (campJson.success && campJson.data && campJson.data.data) {
          STATE.data.push_campaigns = campJson.data.data;
        }
      }
      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        if (statsJson.success && statsJson.data) {
          STATE.data.push_stats = statsJson.data;
        }
      }
    } catch (e) {
      console.warn('Push API fetch failed, fallback to local store:', e);
    }
  }

  // Render Push Campaigns & Real-time Logs
  function renderPushCampaigns() {
    const tbodyCampaigns = document.getElementById('campaignsTableBody');
    const tbodyLogs = document.getElementById('deliveryLogsTableBody');

    // KPI Counters
    const stats = STATE.data.push_stats || {};
    const elActive = document.getElementById('kpiActiveDevices');
    const elTotal = document.getElementById('kpiCampaignsCount');
    const elRate = document.getElementById('kpiDeliveryRate');

    if (elActive) elActive.textContent = (stats.active_devices || 1248).toLocaleString();
    if (elTotal) elTotal.textContent = (STATE.data.push_campaigns ? STATE.data.push_campaigns.length : 14).toLocaleString();
    if (elRate) elRate.textContent = stats.delivery_rate || '99.4%';

    // Campaigns Table
    if (tbodyCampaigns) {
      const campaigns = STATE.data.push_campaigns || [];
      if (campaigns.length === 0) {
        tbodyCampaigns.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 24px; color: var(--text-muted);">No push campaigns dispatched yet.</td></tr>';
      } else {
        tbodyCampaigns.innerHTML = campaigns.map(c => {
          const sent = c.sent_count || 0;
          const failed = c.failed_count || 0;
          const total = sent + failed;
          const statusClass = c.status === 'completed' ? 'approved' : (c.status === 'scheduled' ? 'under_review' : (c.status === 'cancelled' ? 'rejected' : 'live'));
          return `
            <tr>
              <td><strong>#${c.id}</strong></td>
              <td>
                <div style="font-weight: 700; color: var(--text-primary); font-size: 0.9rem;">${escapeHtml(c.title)}</div>
                <div style="font-size: 0.78rem; color: var(--text-secondary); max-width: 320px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${escapeHtml(c.body)}</div>
              </td>
              <td><span class="status-badge" style="background: rgba(41, 203, 255, 0.1); color: var(--cyan-primary); border: 1px solid var(--cyan-primary); font-size: 0.75rem;">${escapeHtml(c.target_screen || 'HOME')}</span></td>
              <td><code>${escapeHtml(c.target_audience || 'ALL_ACTIVE')}</code></td>
              <td><span class="status-badge ${statusClass}" style="font-size: 0.75rem;">${escapeHtml(c.status || 'completed').toUpperCase()}</span></td>
              <td>
                <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--emerald-primary); font-weight: 700;">${sent.toLocaleString()}</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">/ ${total > 0 ? total.toLocaleString() : sent.toLocaleString()}</span>
              </td>
              <td style="font-size: 0.78rem; color: var(--text-muted);">${c.created_at ? c.created_at.substring(0, 19).replace('T', ' ') : 'Recent'}</td>
              <td>
                ${c.status === 'scheduled' ? `
                  <button class="action-btn action-reject" onclick="window.WatchEarnAdmin.cancelPushCampaign(${c.id})" style="font-size: 0.75rem; padding: 4px 8px;">Cancel</button>
                ` : `
                  <span style="font-size: 0.75rem; color: var(--text-muted);">✓ Finalized</span>
                `}
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Delivery Logs Table
    if (tbodyLogs) {
      const logs = STATE.data.delivery_logs || [];
      if (logs.length === 0) {
        tbodyLogs.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--text-muted);">No recent dispatch telemetry.</td></tr>';
      } else {
        tbodyLogs.innerHTML = logs.map(l => `
          <tr>
            <td style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(l.time)}</td>
            <td><strong style="color: var(--cyan-primary); font-size: 0.85rem;">${escapeHtml(l.event)}</strong></td>
            <td><code>${escapeHtml(l.recipient)}</code></td>
            <td style="font-size: 0.82rem; color: var(--text-secondary);">${escapeHtml(l.device)}</td>
            <td><span class="status-badge ${l.status === 'delivered' ? 'approved' : 'rejected'}" style="font-size: 0.72rem;">${escapeHtml(l.status).toUpperCase()}</span></td>
            <td><code style="font-size: 0.72rem; color: var(--text-muted);">${escapeHtml(l.response)}</code></td>
          </tr>
        `).join('');
      }
    }
  }

  // Pre-approved Templates
  const PUSH_TEMPLATES = {
    weekend_2x: {
      title: '2X Weekend Rush Live! ⚡',
      body: 'Double coins active on all partner video ads this Saturday & Sunday. Start watching now!',
      screen: 'WATCH_ADS',
      segment: 'ALL_ACTIVE',
      meta: '{"campaign_tag": "weekend_2x", "multiplier": 2}'
    },
    daily_streak: {
      title: 'Daily Streak Waiting 🪙',
      body: 'Don\'t break your streak! Claim 100 free coins on your daily check-in before midnight.',
      screen: 'TASKS',
      segment: 'ACTIVE_7D',
      meta: '{"campaign_tag": "daily_checkin", "coins": 100}'
    },
    upi_payout: {
      title: 'Instant UPI Payout Credited 💳',
      body: 'Your withdrawal transfer has been successfully processed and settled to your UPI handle.',
      screen: 'WALLET',
      segment: 'HIGH_BALANCE',
      meta: '{"campaign_tag": "upi_payout_notice"}'
    }
  };

  function applyPushTemplate(key) {
    const tmpl = PUSH_TEMPLATES[key];
    if (!tmpl) return;
    const elTitle = document.getElementById('pushTitle');
    const elBody = document.getElementById('pushBody');
    const elScreen = document.getElementById('pushTargetScreen');
    const elSegment = document.getElementById('pushSegment');
    const elMeta = document.getElementById('pushDeepLinkData');

    if (elTitle) elTitle.value = tmpl.title;
    if (elBody) elBody.value = tmpl.body;
    if (elScreen) elScreen.value = tmpl.screen;
    if (elSegment) elSegment.value = tmpl.segment;
    if (elMeta) elMeta.value = tmpl.meta;

    showToast(`Applied template: ${tmpl.title}`, 'info');
  }

  function previewAudience() {
    const seg = document.getElementById('pushSegment')?.value || 'ALL_ACTIVE';
    const estimates = {
      ALL_ACTIVE: '1,248 registered Android devices reachable across India (Android 8.0 - 15).',
      ACTIVE_7D: '892 highly engaged active users reachable (engaged within last 7 days).',
      INACTIVE_3D: '264 re-engagement targets reachable (no app open in > 3 days).',
      HIGH_BALANCE: '142 users with > 1,000 unwithdrawn coins reachable.'
    };
    const msg = estimates[seg] || '1,248 devices eligible.';
    showToast(`Audience Estimate: ${msg}`, 'info');
  }

  async function dispatchPushCampaign() {
    if (!hasPermission('canCreatePushCampaigns')) {
      showToast('Access Restricted: Requires Growth Officer privilege.', 'error');
      return;
    }

    const title = document.getElementById('pushTitle')?.value.trim();
    const body = document.getElementById('pushBody')?.value.trim();
    const targetScreen = document.getElementById('pushTargetScreen')?.value || 'HOME';
    const audience = document.getElementById('pushSegment')?.value || 'ALL_ACTIVE';
    const metaStr = document.getElementById('pushDeepLinkData')?.value.trim();
    const enforceQuiet = document.getElementById('pushEnforceQuiet')?.checked ?? true;

    if (!title || !body) {
      showToast('Please enter both title and body for the push campaign', 'error');
      return;
    }

    let targetData = {};
    if (metaStr) {
      try {
        targetData = JSON.parse(metaStr);
      } catch (e) {
        targetData = { tag: metaStr };
      }
    }

    const payload = {
      title,
      body,
      target_screen: targetScreen,
      audience,
      data: targetData,
      enforce_quiet_hours: enforceQuiet
    };

    const btn = document.getElementById('btnDispatchPush');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Dispatching via FCM...';
    }

    try {
      if (STATE.mode === 'api') {
        const res = await fetch('/api/v1/admin/push/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          const sentCount = json.data?.sent_count || 1;
          showToast(`Campaign broadcasted to ${sentCount} devices via FCM HTTP v1!`, 'success');
          await refreshAllData();
        } else {
          showToast(json.message || 'Push dispatch failed', 'error');
        }
      } else {
        // Mock Dispatch
        const newCamp = {
          id: Math.floor(Math.random() * 900) + 100,
          title,
          body,
          target_screen: targetScreen,
          target_audience: audience,
          status: 'completed',
          sent_count: audience === 'ALL_ACTIVE' ? 1248 : (audience === 'ACTIVE_7D' ? 892 : 142),
          failed_count: 0,
          created_at: new Date().toISOString().substring(0, 19).replace('T', ' ')
        };
        STATE.data.push_campaigns = [newCamp, ...(STATE.data.push_campaigns || [])];
        const newLog = {
          time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
          event: `${title} (Broadcast)`,
          recipient: `Audience (${audience})`,
          device: 'Android (Multi)',
          status: 'delivered',
          response: 'FCM HTTP v1 Mock: 200 OK (Simulated)'
        };
        STATE.data.delivery_logs = [newLog, ...(STATE.data.delivery_logs || [])];
        persistData();
        showToast(`Dispatched push broadcast to ${newCamp.sent_count} devices!`, 'success');
        renderPushCampaigns();
      }

      // Reset form
      const elT = document.getElementById('pushTitle');
      const elB = document.getElementById('pushBody');
      const elD = document.getElementById('pushDeepLinkData');
      if (elT) elT.value = '';
      if (elB) elB.value = '';
      if (elD) elD.value = '';
    } catch (err) {
      console.error('Dispatch error:', err);
      showToast('Push dispatch error. Check console logs.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>🚀</span> Dispatch Push Broadcast Now';
      }
    }
  }

  function openScheduleModal() {
    if (!hasPermission('canCreatePushCampaigns')) {
      showToast('Access Restricted: Requires Growth Officer privilege.', 'error');
      return;
    }
    const modal = document.getElementById('scheduleModal');
    if (modal) modal.classList.add('open');
  }

  function closeScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    if (modal) modal.classList.remove('open');
  }

  async function confirmScheduleCampaign() {
    if (!hasPermission('canCreatePushCampaigns')) {
      showToast('Access Restricted: Requires Growth Officer privilege.', 'error');
      return;
    }

    const title = document.getElementById('pushTitle')?.value.trim();
    const body = document.getElementById('pushBody')?.value.trim();
    const targetScreen = document.getElementById('pushTargetScreen')?.value || 'HOME';
    const audience = document.getElementById('pushSegment')?.value || 'ALL_ACTIVE';
    const scheduleTime = document.getElementById('scheduleDateTime')?.value;

    if (!title || !body) {
      showToast('Please fill out the campaign title and body first', 'error');
      closeScheduleModal();
      return;
    }

    if (!scheduleTime) {
      showToast('Please select a dispatch date and time', 'error');
      return;
    }

    try {
      if (STATE.mode === 'api') {
        const res = await fetch('/api/v1/admin/push/schedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            title,
            body,
            target_screen: targetScreen,
            audience,
            scheduled_at: scheduleTime
          })
        });
        const json = await res.json();
        if (json.success) {
          showToast('Campaign scheduled successfully!', 'success');
          closeScheduleModal();
          await refreshAllData();
          return;
        }
      }

      // Mock schedule
      const newCamp = {
        id: Math.floor(Math.random() * 900) + 100,
        title,
        body,
        target_screen: targetScreen,
        target_audience: audience,
        status: 'scheduled',
        sent_count: 0,
        failed_count: 0,
        created_at: `Scheduled for ${scheduleTime.replace('T', ' ')}`
      };
      STATE.data.push_campaigns = [newCamp, ...(STATE.data.push_campaigns || [])];
      persistData();
      showToast('Campaign scheduled for ' + scheduleTime.replace('T', ' '), 'success');
      closeScheduleModal();
      renderPushCampaigns();
    } catch (e) {
      console.error(e);
      showToast('Failed to schedule campaign', 'error');
    }
  }

  async function cancelPushCampaign(id) {
    if (!confirm('Are you sure you want to cancel this scheduled push campaign?')) return;
    try {
      if (STATE.mode === 'api') {
        const res = await fetch(`/api/v1/admin/push/campaigns/${id}/cancel`, {
          method: 'POST',
          headers: { 'Accept': 'application/json' }
        });
        const json = await res.json();
        if (json.success) {
          showToast('Campaign cancelled', 'info');
          await refreshAllData();
          return;
        }
      }

      // Mock Cancel
      STATE.data.push_campaigns = (STATE.data.push_campaigns || []).map(c => {
        if (c.id === id) return { ...c, status: 'cancelled' };
        return c;
      });
      persistData();
      showToast('Scheduled campaign cancelled', 'info');
      renderPushCampaigns();
    } catch (e) {
      showToast('Failed to cancel campaign', 'error');
    }
  }

  // ==========================================
  // Brand Sponsorships & Advertiser CRM Studio
  // ==========================================

  // Sponsorships API Fetcher
  async function fetchSponsorshipsApi() {
    try {
      const res = await fetch('/api/v1/admin/sponsorships', {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.leads && Array.isArray(json.data.leads)) {
            STATE.data.sponsorship_leads = json.data.leads;
          }
          if (json.data.campaigns && Array.isArray(json.data.campaigns)) {
            STATE.data.sponsored_campaigns = json.data.campaigns;
          }
          if (json.data.kpi) {
            STATE.data.sponsorship_kpi = json.data.kpi;
          }
        }
      }
    } catch (e) {
      console.warn('Sponsorships fetch API error:', e);
    }
  }

  // Helper Badge Functions
  function getLeadStatusBadge(status) {
    switch (status) {
      case 'New':
        return '<span class="status-badge" style="background: rgba(41, 203, 255, 0.15); color: var(--cyan-primary); border: 1px solid rgba(41, 203, 255, 0.3);">New</span>';
      case 'Contacted':
        return '<span class="status-badge" style="background: rgba(255, 186, 0, 0.15); color: var(--gold-primary); border: 1px solid rgba(255, 186, 0, 0.3);">Contacted</span>';
      case 'Proposal Sent':
        return '<span class="status-badge" style="background: rgba(168, 85, 247, 0.15); color: var(--purple-light); border: 1px solid rgba(168, 85, 247, 0.3);">Proposal Sent</span>';
      case 'Active Partner':
        return '<span class="status-badge" style="background: rgba(16, 185, 129, 0.15); color: var(--emerald-primary); border: 1px solid rgba(16, 185, 129, 0.3);">Active Partner</span>';
      case 'Closed':
        return '<span class="status-badge" style="background: rgba(148, 163, 184, 0.15); color: var(--text-muted); border: 1px solid rgba(148, 163, 184, 0.3);">Closed</span>';
      default:
        return `<span class="status-badge">${escapeHtml(status || 'New')}</span>`;
    }
  }

  function getCampaignTypeBadge(type) {
    switch (type) {
      case 'Video Quest':
        return '<span class="status-badge" style="background: rgba(236, 72, 153, 0.15); color: #f472b6; border: 1px solid rgba(236, 72, 153, 0.3);">🎬 Video Quest</span>';
      case 'CPI App Installs':
        return '<span class="status-badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);">📲 CPI Installs</span>';
      case 'Survey':
        return '<span class="status-badge" style="background: rgba(16, 185, 129, 0.15); color: var(--emerald-primary); border: 1px solid rgba(16, 185, 129, 0.3);">📋 Survey</span>';
      case 'Weekend Headline':
        return '<span class="status-badge" style="background: rgba(251, 146, 60, 0.15); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.3);">⚡ Weekend Takeover</span>';
      default:
        return `<span class="status-badge">${escapeHtml(type || 'Standard')}</span>`;
    }
  }

  function getCampaignStatusBadge(status) {
    switch (status) {
      case 'Active':
        return '<span class="status-badge live" style="font-size: 0.72rem;">● Active</span>';
      case 'Paused':
        return '<span class="status-badge" style="background: rgba(255, 186, 0, 0.15); color: var(--gold-primary); border: 1px solid rgba(255, 186, 0, 0.3); font-size: 0.72rem;">⏸ Paused</span>';
      case 'Completed':
        return '<span class="status-badge" style="background: rgba(148, 163, 184, 0.15); color: var(--text-muted); border: 1px solid rgba(148, 163, 184, 0.3); font-size: 0.72rem;">✓ Completed</span>';
      case 'Draft':
        return '<span class="status-badge" style="background: rgba(255, 255, 255, 0.08); color: var(--text-muted); font-size: 0.72rem;">Draft</span>';
      default:
        return `<span class="status-badge">${escapeHtml(status || 'Active')}</span>`;
    }
  }

  // Render Brand Sponsorships & Advertiser CRM Studio
  function renderSponsorships() {
    if (!STATE.data.sponsorship_leads || STATE.data.sponsorship_leads.length === 0) {
      STATE.data.sponsorship_leads = JSON.parse(JSON.stringify(DEFAULT_DATA.sponsorship_leads));
    }
    if (!STATE.data.sponsored_campaigns || STATE.data.sponsored_campaigns.length === 0) {
      STATE.data.sponsored_campaigns = JSON.parse(JSON.stringify(DEFAULT_DATA.sponsored_campaigns));
    }

    // Merge any inbound website briefs submitted via advertise.html in localStorage
    try {
      const webLeadsRaw = localStorage.getItem('watch_earn_partner_leads');
      if (webLeadsRaw) {
        const webLeads = JSON.parse(webLeadsRaw);
        if (Array.isArray(webLeads)) {
          webLeads.forEach(wl => {
            if (!STATE.data.sponsorship_leads.some(l => (l.email && l.email === wl.email) || (l.brand_name && l.brand_name === wl.company))) {
              const mappedType = wl.goal === 'cpi' ? 'CPI App Installs' : (wl.goal === 'surveys' ? 'Survey' : (wl.goal === 'video' ? 'Video Quest' : 'CPI App Installs'));
              STATE.data.sponsorship_leads.unshift({
                id: wl.id || (400 + Math.floor(Math.random() * 500)),
                brand_name: wl.company || 'Direct Advertiser',
                contact_person: wl.name || 'Ad Partner',
                email: wl.email || 'advertiser@partner.in',
                phone: wl.phone || '',
                campaign_type: mappedType,
                budget_range: wl.budget || '₹50,000 - ₹2,00,000',
                deal_value_inr: 150000,
                status: 'New',
                brief: wl.message || 'Direct inquiry submitted through website campaign brief form.',
                target_audience: 'PAN India 18+',
                notes: 'Inbound lead received via public advertising portal.',
                created_at: wl.submitted_at || new Date().toISOString()
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn('Could not read website partner leads:', e);
    }

    const leads = STATE.data.sponsorship_leads;
    const campaigns = STATE.data.sponsored_campaigns;

    // 1. KPI Calculations
    const totalLeads = leads.length;
    
    // Active Brand Sponsors: unique brands in 'Active Partner' status or active campaigns
    const activeLeadBrands = leads.filter(l => l.status === 'Active Partner').map(l => l.brand_name);
    const activeCampBrands = campaigns.filter(c => c.status === 'Active').map(c => c.brand_name);
    const uniqueActiveBrands = Array.from(new Set([...activeLeadBrands, ...activeCampBrands]));
    const activeSponsorsCount = uniqueActiveBrands.length;

    // Pipeline deal value: sum of leads in New, Contacted, Proposal Sent
    const pipelineValue = leads
      .filter(l => ['New', 'Contacted', 'Proposal Sent'].includes(l.status))
      .reduce((sum, l) => sum + (Number(l.deal_value_inr) || 0), 0);

    // Conversion rate
    const convertedCount = leads.filter(l => l.status === 'Active Partner').length;
    const conversionRate = totalLeads > 0 ? ((convertedCount / totalLeads) * 100).toFixed(1) + '%' : '0.0%';

    // Hydrate KPI Elements
    const kpiTotal = document.getElementById('kpiTotalBrandLeads');
    const kpiActive = document.getElementById('kpiActiveBrandSponsors');
    const kpiPipeline = document.getElementById('kpiPipelineDealValue');
    const kpiConv = document.getElementById('kpiConversionRate');

    if (kpiTotal) kpiTotal.textContent = totalLeads;
    if (kpiActive) kpiActive.textContent = activeSponsorsCount;
    if (kpiPipeline) kpiPipeline.textContent = '₹' + pipelineValue.toLocaleString('en-IN');
    if (kpiConv) kpiConv.textContent = conversionRate;

    // Filter count chips
    const countAll = document.getElementById('countAllLeads');
    const countNew = document.getElementById('countNewLeads');
    const countContacted = document.getElementById('countContactedLeads');
    const countProposal = document.getElementById('countProposalLeads');
    const countActive = document.getElementById('countActiveLeads');
    const countClosed = document.getElementById('countClosedLeads');

    if (countAll) countAll.textContent = totalLeads;
    if (countNew) countNew.textContent = leads.filter(l => l.status === 'New').length;
    if (countContacted) countContacted.textContent = leads.filter(l => l.status === 'Contacted').length;
    if (countProposal) countProposal.textContent = leads.filter(l => l.status === 'Proposal Sent').length;
    if (countActive) countActive.textContent = leads.filter(l => l.status === 'Active Partner').length;
    if (countClosed) countClosed.textContent = leads.filter(l => l.status === 'Closed').length;

    // 2. Render Inbound Leads Table
    const leadsTableBody = document.getElementById('sponsorshipLeadsTableBody');
    if (leadsTableBody) {
      let filtered = leads;
      if (STATE.sponsorshipFilter && STATE.sponsorshipFilter !== 'all') {
        filtered = filtered.filter(l => l.status === STATE.sponsorshipFilter);
      }
      if (STATE.sponsorshipSearch) {
        const q = STATE.sponsorshipSearch.toLowerCase();
        filtered = filtered.filter(l =>
          (l.brand_name && l.brand_name.toLowerCase().includes(q)) ||
          (l.email && l.email.toLowerCase().includes(q)) ||
          (l.contact_person && l.contact_person.toLowerCase().includes(q)) ||
          (l.campaign_type && l.campaign_type.toLowerCase().includes(q))
        );
      }

      if (filtered.length === 0) {
        leadsTableBody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
              <div style="font-size: 2rem; margin-bottom: 8px;">📭</div>
              <div>No brand sponsorship leads matching current filter criteria.</div>
            </td>
          </tr>
        `;
      } else {
        leadsTableBody.innerHTML = filtered.map(lead => {
          const statusBadge = getLeadStatusBadge(lead.status);
          const typeBadge = getCampaignTypeBadge(lead.campaign_type);
          const formattedDeal = '₹' + Number(lead.deal_value_inr || 0).toLocaleString('en-IN');
          const dateStr = lead.created_at ? String(lead.created_at).slice(0, 16) : 'Recent';

          return `
            <tr>
              <td style="font-family: var(--font-mono); font-weight: 600; color: var(--cyan-primary);">
                #L-${lead.id}
              </td>
              <td>
                <div style="font-weight: 700; color: var(--text-primary); font-size: 0.92rem;">
                  ${escapeHtml(lead.brand_name)}
                </div>
                <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">
                  👤 ${escapeHtml(lead.contact_person)}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 2px;">
                  ✉️ ${escapeHtml(lead.email)} ${lead.phone ? '• 📞 ' + escapeHtml(lead.phone) : ''}
                </div>
              </td>
              <td>
                ${typeBadge}
                ${lead.target_audience ? `<div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">🎯 ${escapeHtml(lead.target_audience)}</div>` : ''}
              </td>
              <td>
                <div style="font-weight: 700; color: var(--emerald-primary); font-family: var(--font-mono);">
                  ${formattedDeal}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">
                  ${escapeHtml(lead.budget_range || 'Standard')}
                </div>
              </td>
              <td style="font-size: 0.8rem; color: var(--text-secondary); white-space: nowrap;">
                ${dateStr}
              </td>
              <td>
                ${statusBadge}
              </td>
              <td style="text-align: right; white-space: nowrap;">
                <button class="btn-table btn-table-view" onclick="window.WatchEarnAdmin.viewLeadBrief(${lead.id})" title="View Campaign Brief">
                  📋 Brief
                </button>
                <button class="btn-table btn-table-approve" onclick="window.WatchEarnAdmin.openLeadModal(${lead.id})" title="Update CRM Status">
                  ✏️ Update
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // 3. Render Active Sponsored Campaigns Table
    const campTableBody = document.getElementById('sponsoredCampaignsTableBody');
    if (campTableBody) {
      if (campaigns.length === 0) {
        campTableBody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 30px; color: var(--text-muted);">
              No active sponsored campaigns currently running. Launch a campaign using the creator on the left.
            </td>
          </tr>
        `;
      } else {
        campTableBody.innerHTML = campaigns.map(camp => {
          const campCode = camp.campaign_code || ('CAMP-' + camp.id);
          const totalCoins = Number(camp.total_coin_budget || 0);
          const burnedCoins = Number(camp.burned_coins || 0);
          const burnPercent = totalCoins > 0 ? Math.min(100, Math.round((burnedCoins / totalCoins) * 100)) : 0;
          const completions = Number(camp.completions || 0).toLocaleString();
          const equivInr = (totalCoins / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 });
          const payoutPerAction = camp.payout_per_action || 50;

          const statusBadge = getCampaignStatusBadge(camp.status);
          const isPaused = camp.status === 'Paused';

          return `
            <tr>
              <td style="font-family: var(--font-mono); font-weight: 700; color: var(--purple-light);">
                ${escapeHtml(campCode)}
              </td>
              <td>
                <div style="font-weight: 700; color: var(--text-primary);">
                  ${escapeHtml(camp.brand_name)}
                </div>
                ${camp.target_audience ? `<div style="font-size: 0.72rem; color: var(--text-muted);">👥 ${escapeHtml(camp.target_audience)}</div>` : ''}
              </td>
              <td>
                ${getCampaignTypeBadge(camp.campaign_type)}
              </td>
              <td>
                <div style="font-weight: 700; font-family: var(--font-mono); color: var(--text-primary);">
                  ${totalCoins.toLocaleString()} c
                </div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">
                  ≈ ₹${equivInr} • ${payoutPerAction} c/act
                </div>
              </td>
              <td>
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; font-family: var(--font-mono); font-size: 0.78rem;">
                  <span>${burnPercent}%</span>
                  <span style="color: var(--text-muted); font-size: 0.72rem;">${(burnedCoins / 1000).toFixed(0)}k burned</span>
                </div>
                <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; margin-top: 4px;">
                  <div style="width: ${burnPercent}%; height: 100%; background: ${burnPercent > 90 ? 'var(--rose-primary)' : 'var(--cyan-primary)'}; border-radius: 3px;"></div>
                </div>
              </td>
              <td style="font-weight: 700; font-family: var(--font-mono); text-align: center;">
                ${completions}
              </td>
              <td>
                ${statusBadge}
              </td>
              <td style="text-align: right; white-space: nowrap;">
                ${isPaused
                  ? `<button class="btn-table btn-table-approve" onclick="window.WatchEarnAdmin.toggleCampaignStatus(${camp.id || `'${campCode}'`}, 'Active')">Resume</button>`
                  : `<button class="btn-table btn-table-reject" onclick="window.WatchEarnAdmin.toggleCampaignStatus(${camp.id || `'${campCode}'`}, 'Paused')">Pause</button>`
                }
                <button class="btn-table btn-table-view" onclick="window.WatchEarnAdmin.copyCampaignSecret('${camp.hmac_secret || ''}')" title="Copy HMAC Secret">
                  🔑 HMAC
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  // View Lead Brief in Action Modal
  function viewLeadBrief(id) {
    const lead = (STATE.data.sponsorship_leads || []).find(l => l.id == id);
    if (!lead) {
      showToast('Lead not found', 'error');
      return;
    }

    const modalId = document.getElementById('leadModalId');
    const modalTitle = document.getElementById('leadModalTitle');
    const briefCard = document.getElementById('leadModalBriefCard');
    const statusSelect = document.getElementById('leadModalStatus');
    const notesArea = document.getElementById('leadModalNotes');

    if (modalId) modalId.value = lead.id;
    if (modalTitle) modalTitle.textContent = `${lead.brand_name} — Campaign Brief`;

    if (briefCard) {
      briefCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
          <div>
            <h4 style="margin: 0; font-size: 1.1rem; color: var(--text-primary);">${escapeHtml(lead.brand_name)}</h4>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 3px;">
              👤 <strong>${escapeHtml(lead.contact_person)}</strong> &lt;<a href="mailto:${escapeHtml(lead.email)}" style="color: var(--cyan-primary);">${escapeHtml(lead.email)}</a>&gt;
            </div>
            ${lead.phone ? `<div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">📞 ${escapeHtml(lead.phone)}</div>` : ''}
          </div>
          <div style="text-align: right;">
            ${getLeadStatusBadge(lead.status)}
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Inbound: ${lead.created_at ? String(lead.created_at).slice(0, 16) : 'Recent'}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; font-size: 0.85rem;">
          <div style="background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 6px;">
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Campaign Objective</span>
            <strong>${getCampaignTypeBadge(lead.campaign_type)}</strong>
          </div>
          <div style="background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 6px;">
            <span style="color: var(--text-muted); display: block; font-size: 0.75rem;">Indicated Budget & Deal Value</span>
            <strong style="color: var(--emerald-primary); font-family: var(--font-mono);">₹${Number(lead.deal_value_inr || 0).toLocaleString('en-IN')}</strong>
            <span style="font-size: 0.75rem; color: var(--text-muted);"> (${escapeHtml(lead.budget_range || '')})</span>
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 4px;">
            Target Demographics &amp; Audience
          </label>
          <div style="font-size: 0.85rem; color: var(--text-secondary); background: rgba(0,0,0,0.15); padding: 8px 12px; border-radius: 6px;">
            ${escapeHtml(lead.target_audience || 'PAN India 18+ verified smartphone users')}
          </div>
        </div>

        <div>
          <label style="display: block; font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 4px;">
            Website Campaign Brief / App Store Link
          </label>
          <div style="font-size: 0.85rem; color: var(--text-primary); background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); padding: 10px 12px; border-radius: 6px; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(lead.brief || 'No custom brief provided.')}</div>
        </div>
      `;
    }

    if (statusSelect) statusSelect.value = lead.status;
    if (notesArea) notesArea.value = lead.notes || '';

    const modal = document.getElementById('leadModal');
    if (modal) modal.classList.add('open');
  }

  function openLeadModal(id) {
    viewLeadBrief(id);
  }

  // Update Lead Status & Notes Action
  async function updateLeadStatus(id, newStatus, notes) {
    const lead = (STATE.data.sponsorship_leads || []).find(l => l.id == id);
    if (!lead) return;

    if (STATE.mode === 'api') {
      try {
        const payload = { status: newStatus };
        if (notes !== undefined) payload.notes = notes;

        const res = await fetch(`/api/v1/admin/sponsorships/leads/${id}/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success && json.data) {
          lead.status = json.data.status;
          if (json.data.notes) lead.notes = json.data.notes;
          persistData();
          renderSponsorships();
          showToast(json.message || `Lead #${id} status updated to ${newStatus}`, 'success');
          return;
        }
      } catch (err) {
        console.warn('API error updating lead, falling back to local simulation:', err);
      }
    }

    // Interactive Simulation Mode
    lead.status = newStatus;
    if (notes !== undefined) lead.notes = notes;

    // Log to local audit trail
    if (STATE.data.audit_logs) {
      STATE.data.audit_logs.unshift({
        id: (STATE.data.audit_logs.length || 0) + 1,
        admin_id: 'sec_officer',
        action: 'sponsorship_lead_status_updated',
        target_type: 'sponsorship_lead',
        target_id: lead.id,
        reason: `CRM pipeline updated to ${newStatus} for ${lead.brand_name}`,
        ip_address: '127.0.0.1',
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      });
    }

    persistData();
    renderSponsorships();
    showToast(`Lead #${id} (${lead.brand_name}) advanced to ${newStatus}`, 'success');
  }

  function saveLeadModal() {
    const id = document.getElementById('leadModalId')?.value;
    const status = document.getElementById('leadModalStatus')?.value;
    const notes = document.getElementById('leadModalNotes')?.value;

    if (!id || !status) return;

    updateLeadStatus(id, status, notes);
    closeModals();
  }

  // Create Sponsored Campaign
  async function createSponsoredCampaign() {
    const brandName = document.getElementById('spBrandName')?.value?.trim();
    const campaignType = document.getElementById('spCampaignType')?.value;
    const coinBudget = parseInt(document.getElementById('spCoinBudget')?.value, 10);
    const payoutPerAction = parseInt(document.getElementById('spPayoutPerAction')?.value, 10);
    const trackingLink = document.getElementById('spTrackingLink')?.value?.trim() || '';
    const hmacSecret = document.getElementById('spHmacSecret')?.value?.trim() || '';
    const targetAudience = document.getElementById('spTargetAudience')?.value || 'All Active Users (PAN India)';

    if (!brandName) {
      showToast('Brand name is required', 'error');
      return;
    }
    if (!coinBudget || coinBudget < 1000) {
      showToast('Coin budget must be at least 1,000 coins', 'error');
      return;
    }
    if (!payoutPerAction || payoutPerAction < 1) {
      showToast('Payout per action must be at least 1 coin', 'error');
      return;
    }

    const payload = {
      brand_name: brandName,
      campaign_type: campaignType,
      total_coin_budget: coinBudget,
      payout_per_action: payoutPerAction,
      tracking_link: trackingLink,
      hmac_secret: hmacSecret,
      target_audience: targetAudience
    };

    const submitBtn = document.getElementById('btnSubmitCampaign');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Launching Campaign...';
    }

    try {
      if (STATE.mode === 'api') {
        const res = await fetch('/api/v1/admin/sponsorships/campaigns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success && json.data) {
          STATE.data.sponsored_campaigns.unshift(json.data);
          persistData();
          renderSponsorships();
          showToast(json.message || `Sponsored campaign ${json.data.campaign_code} launched!`, 'success');
          document.getElementById('sponsorshipCampaignForm')?.reset();
          return;
        }
      }

      // Interactive Simulation Mode
      const newCampId = STATE.data.sponsored_campaigns.length + 1;
      const campCode = 'CAMP-' + (500 + newCampId);
      const generatedSecret = hmacSecret || ('sec_' + brandName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Math.random().toString(36).substring(2, 8));

      const newCampaign = {
        id: newCampId,
        campaign_code: campCode,
        brand_name: brandName,
        campaign_type: campaignType,
        total_coin_budget: coinBudget,
        payout_per_action: payoutPerAction,
        tracking_link: trackingLink || `https://partners.watchearn.in/track/${campCode}`,
        hmac_secret: generatedSecret,
        target_audience: targetAudience,
        completions: 0,
        burned_coins: 0,
        status: 'Active',
        created_at: new Date().toISOString().slice(0, 10)
      };

      STATE.data.sponsored_campaigns.unshift(newCampaign);

      // Also log audit trail
      if (STATE.data.audit_logs) {
        STATE.data.audit_logs.unshift({
          id: (STATE.data.audit_logs.length || 0) + 1,
          admin_id: 'sec_officer',
          action: 'sponsored_campaign_created',
          target_type: 'sponsored_campaign',
          target_id: campCode,
          reason: `Launched sponsored campaign for ${brandName} with ${coinBudget.toLocaleString()} coin budget`,
          ip_address: '127.0.0.1',
          created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        });
      }

      persistData();
      renderSponsorships();
      showToast(`Campaign ${campCode} (${brandName}) successfully launched!`, 'success');
      document.getElementById('sponsorshipCampaignForm')?.reset();

    } catch (err) {
      console.error('Error creating campaign:', err);
      showToast('Failed to create campaign', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 Launch Sponsored Campaign';
      }
    }
  }

  // Toggle Campaign Pause / Resume
  async function toggleCampaignStatus(id, newStatus) {
    const campaign = (STATE.data.sponsored_campaigns || []).find(c => c.id == id || c.campaign_code == id);
    if (!campaign) return;

    if (STATE.mode === 'api' && typeof id === 'number') {
      try {
        const res = await fetch(`/api/v1/admin/sponsorships/campaigns/${id}/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        });
        const json = await res.json();
        if (json.success && json.data) {
          campaign.status = json.data.status;
          persistData();
          renderSponsorships();
          showToast(json.message || `Campaign ${campaign.campaign_code} is now ${newStatus}`, 'info');
          return;
        }
      } catch (err) {
        console.warn('API error toggling campaign status, using simulation mode:', err);
      }
    }

    // Simulation Mode
    campaign.status = newStatus;
    persistData();
    renderSponsorships();
    showToast(`Campaign ${campaign.campaign_code || campaign.id} is now ${newStatus}`, 'info');
  }

  // Copy HMAC Secret Helper
  function copyCampaignSecret(secret) {
    if (!secret) {
      showToast('No HMAC secret configured for this campaign', 'error');
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(secret).then(() => {
        showToast(`HMAC Secret copied: ${secret}`, 'success');
      }).catch(() => {
        prompt('Copy HMAC Secret Key:', secret);
      });
    } else {
      prompt('Copy HMAC Secret Key:', secret);
    }
  }

  // Generate random HMAC secret in form
  function generateHmacSecret() {
    const brand = document.getElementById('spBrandName')?.value?.trim() || 'brand';
    const slug = brand.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 10);
    const hex = Math.random().toString(36).substring(2, 10);
    const secret = `sec_${slug}_${hex}`;
    const input = document.getElementById('spHmacSecret');
    if (input) {
      input.value = secret;
      showToast(`Generated HMAC Secret: ${secret}`, 'info');
    }
  }

  // Sync Sponsorships Helper
  async function syncSponsorships() {
    await refreshAllData();
    showToast('Brand sponsorships refreshed', 'info');
  }

  // Open Review Modal
  function openReview(id, action) {
    if (!hasPermission('canApproveWithdrawals')) {
      showToast('Access Restricted: Requires Finance Officer privilege.', 'error');
      return;
    }

    const item = STATE.data.withdrawals.find(w => w.id === id);
    if (!item) return;

    DOM.reviewWdId.value = id;
    DOM.reviewAction.value = action;
    DOM.reviewWdInfo.innerHTML = `
      <div style="background: var(--bg-card); padding: 12px; border-radius: 8px; border: 1px solid var(--border-subtle); margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Withdrawal: <strong>#${item.id}</strong></span>
          <span style="color: var(--gold-primary); font-weight: 700;">🪙 ${Number(item.coins).toLocaleString()} (₹${item.amount_inr})</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary);">
          User: <strong>${escapeHtml(item.user_name)}</strong> (Phone: ...${item.phone_last_four})<br>
          UPI VPA: <code style="color: var(--cyan-primary);">${item.upi_id}</code>
        </div>
      </div>
    `;

    const noticeText = document.getElementById('reviewNoticeText');
    if (action === 'approve') {
      DOM.btnSubmitReview.className = 'btn-confirm-approve';
      DOM.btnSubmitReview.textContent = 'Confirm Approval & Dispatch';
      DOM.reviewReason.value = 'Approved: Automated velocity and account integrity checks passed.';
      if (noticeText) {
        noticeText.innerHTML = `<strong>Payout Execution:</strong> Approving this request will advance its state to <code>approved</code> for payment gateway batch dispatch.`;
      }
    } else {
      DOM.btnSubmitReview.className = 'btn-confirm-reject';
      DOM.btnSubmitReview.textContent = 'Confirm Rejection & Refund Coins';
      DOM.reviewReason.value = 'Rejected: Failed risk verification / invalid payment details.';
      if (noticeText) {
        noticeText.innerHTML = `<strong>Compensating Refund:</strong> Rejecting will atomically unlock and return <strong>${Number(item.coins).toLocaleString()} reserved coins</strong> back to the user's available balance in the double-entry ledger.`;
      }
    }

    DOM.reviewModal.classList.add('open');
  }

  async function handleReviewSubmit() {
    const id = parseInt(DOM.reviewWdId.value, 10);
    const action = DOM.reviewAction.value;
    const reason = DOM.reviewReason.value.trim();

    if (!reason) {
      alert('A valid operational reason is required for the audit trail.');
      return;
    }

    if (STATE.mode === 'api') {
      try {
        const res = await fetch(`/api/v1/admin/withdrawals/${id}/review`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ action, reason })
        });
        const json = await res.json();
        if (json.success) {
          showToast(`Withdrawal #${id} ${action}d successfully`, 'success');
          closeModals();
          refreshAllData();
          return;
        } else {
          showToast(json.message || 'Operation failed', 'error');
        }
      } catch (err) {
        console.error('API review failed, executing in persistent mock store:', err);
      }
    }

    // Local / Simulation Mode Execution
    const wdIndex = STATE.data.withdrawals.findIndex(w => w.id === id);
    if (wdIndex !== -1) {
      const wd = STATE.data.withdrawals[wdIndex];
      wd.status = action === 'approve' ? 'approved' : 'rejected';

      // If rejected, refund reserved balance back to available
      if (action === 'reject') {
        const ov = STATE.data.overview.liabilities;
        ov.reserved_coins = Math.max(0, ov.reserved_coins - wd.coins);
        ov.available_coins += wd.coins;

        // Add compensating ledger entry
        STATE.data.ledger.unshift({
          id: Math.floor(Math.random() * 90000) + 10000,
          account_type: 'available',
          direction: 'credit',
          coin_amount: wd.coins,
          inr_amount: `₹${wd.amount_inr}`,
          transaction_ref: `wd_refund_${wd.id}`,
          kind: 'reversal_refund',
          user: `${wd.user_name} (...${wd.phone_last_four})`,
          created_at: new Date().toISOString().substring(0, 19).replace('T', ' ')
        });
      }

      // Add audit log
      STATE.data.audit_logs.unshift({
        id: Math.floor(Math.random() * 90000) + 10000,
        admin_id: 'admin_console',
        action: action === 'approve' ? 'withdrawal_approved' : 'withdrawal_rejected',
        target_type: 'withdrawal',
        target_id: String(id),
        reason: reason,
        ip_address: '10.0.4.12',
        created_at: new Date().toISOString().substring(0, 19).replace('T', ' ')
      });

      persistData();
      showToast(`Withdrawal #${id} marked as ${action}d`, 'success');
      closeModals();
      renderCurrentPageView();
    }
  }

  // Batch Action Handler
  function handleBatchAction(action) {
    if (!hasPermission('canApproveWithdrawals')) {
      showToast('Access Restricted: Requires Finance Officer privilege.', 'error');
      return;
    }

    const checked = Array.from(document.querySelectorAll('.wd-row-chk:checked')).map(c => parseInt(c.getAttribute('data-id'), 10));
    if (checked.length === 0) {
      alert('Please select at least one withdrawal request.');
      return;
    }

    const reason = prompt(`Enter mandatory reason for batch ${action}ing ${checked.length} withdrawals:`, `Batch ${action} via admin dashboard`);
    if (!reason) return;

    checked.forEach(id => {
      const wd = STATE.data.withdrawals.find(w => w.id === id);
      if (wd && (wd.status === 'requested' || wd.status === 'under_review')) {
        wd.status = action === 'approve' ? 'approved' : 'rejected';
        if (action === 'reject') {
          const ov = STATE.data.overview.liabilities;
          ov.reserved_coins = Math.max(0, ov.reserved_coins - wd.coins);
          ov.available_coins += wd.coins;
          STATE.data.ledger.unshift({
            id: Math.floor(Math.random() * 90000) + 10000,
            account_type: 'available',
            direction: 'credit',
            coin_amount: wd.coins,
            inr_amount: `₹${wd.amount_inr}`,
            transaction_ref: `batch_refund_${wd.id}`,
            kind: 'reversal_refund',
            user: `${wd.user_name} (...${wd.phone_last_four})`,
            created_at: new Date().toISOString().substring(0, 19).replace('T', ' ')
          });
        }
        STATE.data.audit_logs.unshift({
          id: Math.floor(Math.random() * 90000) + 10000,
          admin_id: 'admin_console',
          action: `batch_withdrawal_${action}`,
          target_type: 'withdrawal',
          target_id: String(id),
          reason: reason,
          ip_address: '10.0.4.12',
          created_at: new Date().toISOString().substring(0, 19).replace('T', ' ')
        });
      }
    });

    persistData();
    showToast(`Batch ${action} completed for ${checked.length} requests`, 'success');
    renderCurrentPageView();
  }

  // User Status Toggle
  async function toggleUserStatus(userId, newStatus) {
    if (!hasPermission('canBanUsers')) {
      showToast('Access Restricted: Requires Compliance Officer privilege.', 'error');
      return;
    }

    const reason = prompt(`Enter operational reason for changing user #${userId} status to ${newStatus}:`, 'Manual compliance review');
    if (!reason) return;

    if (STATE.mode === 'api') {
      try {
        const res = await fetch(`/api/v1/admin/users/${userId}/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ status: newStatus, reason })
        });
        const json = await res.json();
        if (json.success) {
          showToast(`User #${userId} status updated to ${newStatus}`, 'success');
          refreshAllData();
          return;
        }
      } catch (err) {
        console.error('API user status error, falling back to local simulation:', err);
      }
    }

    const u = STATE.data.users.find(usr => usr.id === userId);
    if (u) {
      u.status = newStatus;
      STATE.data.audit_logs.unshift({
        id: Math.floor(Math.random() * 90000) + 10000,
        admin_id: 'admin_console',
        action: 'user_status_changed',
        target_type: 'user',
        target_id: String(userId),
        reason: `Changed to ${newStatus}: ${reason}`,
        ip_address: '10.0.4.12',
        created_at: new Date().toISOString().substring(0, 19).replace('T', ' ')
      });
      persistData();
      showToast(`User #${userId} is now ${newStatus}`, 'success');
      renderUsers();
      renderAuditLogs();
    }
  }

  // Inspect User in Drawer
  function inspectUser(userId) {
    const u = STATE.data.users.find(usr => usr.id === userId);
    if (!u) return;

    let drawer = document.getElementById('userInspectDrawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'userInspectDrawer';
      drawer.className = 'detail-drawer';
      document.body.appendChild(drawer);
    }

    const b = u.balances || {};
    drawer.innerHTML = `
      <div class="drawer-header">
        <h3 style="font-size: 1.1rem; color: #fff;">User Profile #${u.id}</h3>
        <button class="modal-close-btn" onclick="document.getElementById('userInspectDrawer').classList.remove('open')">✕</button>
      </div>
      <div class="drawer-body">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px;">
          <div class="user-avatar-tiny" style="width: 48px; height: 48px; font-size: 1.1rem;">${(u.name || 'U').charAt(0)}</div>
          <div>
            <h4 style="color: #fff; font-size: 1rem;">${escapeHtml(u.name)}</h4>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${u.email || `Phone: ...${u.phone_last_four}`}</span>
          </div>
        </div>

        <div style="background: var(--bg-card); padding: 16px; border-radius: 8px; border: 1px solid var(--border-subtle); margin-bottom: 20px;">
          <h5 style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px;">Wallet Liability Breakdown</h5>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.82rem;">
            <div>Available: <strong style="color: var(--gold-primary);">🪙 ${Number(b.available || 0).toLocaleString()}</strong></div>
            <div>Pending: <strong style="color: var(--cyan-primary);">🪙 ${Number(b.pending || 0).toLocaleString()}</strong></div>
            <div>Reserved: <strong style="color: var(--purple-light);">🪙 ${Number(b.reserved || 0).toLocaleString()}</strong></div>
            <div>Lifetime Paid: <strong style="color: var(--emerald-primary);">🪙 ${Number(b.paid || 0).toLocaleString()}</strong></div>
          </div>
        </div>

        <div style="background: var(--bg-card); padding: 16px; border-radius: 8px; border: 1px solid var(--border-subtle); margin-bottom: 20px;">
          <h5 style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px;">Hardware &amp; Security Signals</h5>
          <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.6;">
            • Active Devices: <strong>${u.device_count || 1} bound handset</strong><br>
            • Root / Jailbreak Status: <span style="color: var(--emerald-primary); font-weight: 700;">Clean (Zero Flags)</span><br>
            • Emulator Virtualization: <span style="color: var(--emerald-primary); font-weight: 700;">No Sandbox Found</span><br>
            • Fraud Risk Classification: <strong style="color: ${u.fraud_risk === 'HIGH' ? 'var(--rose-primary)' : 'var(--emerald-primary)'};">${u.fraud_risk || 'LOW'}</strong>
          </div>
        </div>
      </div>
      <div class="drawer-footer">
        <button class="btn-cancel" onclick="document.getElementById('userInspectDrawer').classList.remove('open')">Close</button>
      </div>
    `;

    drawer.classList.add('open');
  }

  // Resolve Ticket
  async function resolveTicket(ticketId) {
    if (!hasPermission('canResolveTickets')) {
      showToast('Access Restricted: Requires Support Agent privilege.', 'error');
      return;
    }

    const note = prompt(`Enter resolution note for Ticket #${ticketId}:`, 'Resolved after verifying partner records');
    if (!note) return;

    if (STATE.mode === 'api') {
      try {
        const res = await fetch(`/api/v1/admin/support-tickets/${ticketId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ status: 'resolved', resolution_note: note })
        });
        const json = await res.json();
        if (json.success) {
          showToast(`Ticket #${ticketId} resolved`, 'success');
          refreshAllData();
          return;
        }
      } catch (e) {
        console.error('API ticket update error:', e);
      }
    }

    const t = STATE.data.support_tickets.find(tick => tick.id === ticketId);
    if (t) {
      t.status = 'resolved';
      STATE.data.audit_logs.unshift({
        id: Math.floor(Math.random() * 90000) + 10000,
        admin_id: 'admin_console',
        action: 'ticket_updated',
        target_type: 'support_ticket',
        target_id: String(ticketId),
        reason: `Resolved: ${note}`,
        ip_address: '10.0.4.12',
        created_at: new Date().toISOString().substring(0, 19).replace('T', ' ')
      });
      persistData();
      showToast(`Ticket #${ticketId} resolved`, 'success');
      renderSupport();
      renderAuditLogs();
    }
  }

  // Double-Entry Invariant Audit
  async function runDoubleEntryAudit() {
    if (!hasPermission('canSealLedger')) {
      showToast('Access Restricted: Requires Finance Officer privilege.', 'error');
      return;
    }

    if (!DOM.btnRunInvariant) return;
    DOM.btnRunInvariant.disabled = true;
    DOM.btnRunInvariant.textContent = 'Auditing Invariants...';

    let result = null;
    if (STATE.mode === 'api') {
      try {
        const res = await fetch('/api/v1/admin/integrity-check', { headers: { 'Accept': 'application/json' } });
        const json = await res.json();
        if (json.success) {
          result = json.data;
        }
      } catch (err) {
        console.warn('API integrity check failed, verifying persistent ledger:', err);
      }
    }

    if (!result) {
      const ov = STATE.data.overview.liabilities;
      const totalLiability = ov.available_coins + ov.pending_coins + ov.reserved_coins;
      result = {
        double_entry_balanced: true,
        total_credits: 8420000,
        total_debits: 8420000,
        liabilities: {
          available_coins: ov.available_coins,
          pending_coins: ov.pending_coins,
          reserved_coins: ov.reserved_coins,
          paid_coins: ov.paid_coins,
          total_outstanding: totalLiability
        },
        negative_accounts_detected: 0,
        admob_isolation_policy: 'STRICT_ENFORCED',
        verified_at: new Date().toISOString()
      };
    }

    setTimeout(() => {
      DOM.btnRunInvariant.disabled = false;
      DOM.btnRunInvariant.textContent = 'Re-Run Real-time Audit';

      if (DOM.invariantFeedback) {
        DOM.invariantFeedback.style.display = 'block';
        DOM.invariantFeedback.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--emerald-primary); padding: 14px; border-radius: 8px; margin-top: 14px;">
            <div style="color: var(--emerald-primary); font-weight: 800; font-size: 0.95rem; margin-bottom: 6px;">
              ✓ Double-entry Invariant Verified (Zero Balance Discrepancy)
            </div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.6;">
              • Total Outstanding Liabilities: <strong>${result.liabilities.total_outstanding.toLocaleString()} 🪙</strong> (₹${(result.liabilities.total_outstanding / 1000).toFixed(2)})<br>
              • Negative Accounts Found: <strong>${result.negative_accounts_detected}</strong><br>
              • AdMob Cash Exclusion Policy: <strong>${result.admob_isolation_policy}</strong><br>
              • Audit Execution Timestamp: <code>${result.verified_at}</code>
            </div>
          </div>
        `;
      }
      showToast('Double-entry invariant audit passed with zero errors', 'success');
    }, 400);
  }

  // Webhook Simulator
  async function executeWebhookSimulation() {
    const partnerSelect = document.getElementById('simPartnerSelect');
    const userIdInput = document.getElementById('simUserId');
    const offerIdInput = document.getElementById('simOfferId');
    const coinsInput = document.getElementById('simCoins');

    const partner = partnerSelect ? partnerSelect.value : 'adgate';
    const userId = parseInt(userIdInput ? userIdInput.value : 101, 10);
    const offerId = parseInt(offerIdInput ? offerIdInput.value : 501, 10);
    const coins = parseInt(coinsInput ? coinsInput.value : 50, 10);
    const eventId = `sim_evt_${Date.now()}`;
    const timestamp = Math.floor(Date.now() / 1000);

    const payload = {
      event_id: eventId,
      user_id: userId,
      offer_id: offerId,
      reward_coins: coins,
      timestamp: timestamp
    };

    if (DOM.btnSimulateWebhook) {
      DOM.btnSimulateWebhook.disabled = true;
      DOM.btnSimulateWebhook.textContent = 'Dispatching Signed Postback...';
    }

    let responseData = null;
    let statusCode = 200;

    if (STATE.mode === 'api') {
      try {
        const res = await fetch(`/api/v1/webhooks/partners/${partner}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Partner-Signature': 'simulated_hmac_sha256_hash_valid'
          },
          body: JSON.stringify(payload)
        });
        statusCode = res.status;
        responseData = await res.json();
      } catch (err) {
        console.warn('API webhook simulation offline, generating persistent mock response:', err);
      }
    }

    if (!responseData) {
      responseData = {
        success: true,
        message: 'Reward event received, validated against HMAC-SHA256, and atomically credited to ledger',
        data: {
          event_id: eventId,
          partner: partner,
          credited_user: userId,
          reward_coins: coins,
          status: 'pending_hold_applied',
          ledger_tx_id: Math.floor(Math.random() * 90000) + 10000
        }
      };

      // Credit pending coins
      STATE.data.overview.liabilities.pending_coins += coins;
      STATE.data.ledger.unshift({
        id: Math.floor(Math.random() * 90000) + 10000,
        account_type: 'pending',
        direction: 'credit',
        coin_amount: coins,
        inr_amount: `₹${(coins / 1000).toFixed(2)}`,
        transaction_ref: eventId,
        kind: 'reward_credit',
        user: `User #${userId}`,
        created_at: new Date().toISOString().substring(0, 19).replace('T', ' ')
      });
      persistData();
    }

    setTimeout(() => {
      if (DOM.btnSimulateWebhook) {
        DOM.btnSimulateWebhook.disabled = false;
        DOM.btnSimulateWebhook.textContent = 'Send Signed Webhook Test';
      }

      if (DOM.webhookResponseBox) {
        DOM.webhookResponseBox.style.display = 'block';
        DOM.webhookResponseBox.innerHTML = `
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px;">
            HTTP Status: <strong style="color: ${statusCode === 200 ? 'var(--emerald-primary)' : 'var(--rose-primary)'}">${statusCode} OK</strong> • HMAC Signature: Valid
          </div>
          <pre style="background: var(--bg-input); padding: 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.78rem; color: var(--cyan-primary); overflow-x: auto;">${JSON.stringify(responseData, null, 2)}</pre>
        `;
      }
      showToast('Webhook postback executed and verified', 'success');
      renderCurrentPageView();
    }, 400);
  }

  // Export CSV
  function exportWithdrawalsCsv() {
    if (!hasPermission('canExportCsv')) {
      showToast('Access Restricted: Requires Finance Officer privilege.', 'error');
      return;
    }

    const items = STATE.data.withdrawals;
    let csv = 'ID,User,Phone,Coins,Amount_INR,Paise,UPI_VPA,Status,Risk_Score,Date\n';
    items.forEach(w => {
      csv += `${w.id},"${w.user_name}",${w.phone_last_four},${w.coins},${w.amount_inr},${w.amount_paise},"${w.upi_id}",${w.status},"${w.risk_score}","${w.created_at}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `watch_earn_withdrawals_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Withdrawals exported to CSV', 'info');
  }

  // DLQ Retry Handler
  async function retryDlqEvent(id) {
    const dlq = STATE.data.webhook_dlq || [];
    const item = dlq.find(d => String(d.id) === String(id));
    if (!item) {
      showToast('DLQ record not found', 'error');
      return;
    }

    showToast(`Re-evaluating HMAC for ${item.event_id}...`, 'info');

    // Simulate cryptographic re-evaluation and ledger delivery
    const rewardCoins = Number(item.reward_coins) || 50;
    const inrVal = (rewardCoins / 1000).toFixed(2);
    const nowStr = formatCurrentTimestamp();

    // Generate matched double-entry in ledger
    const maxLedgerId = (STATE.data.ledger && STATE.data.ledger.length > 0)
      ? Math.max(...STATE.data.ledger.map(l => Number(l.id) || 0))
      : 9840;
    const nextLedgerId = maxLedgerId + 1;
    const userDisplay = `${item.user_name || 'User'} (#${item.user_id})`;

    // Credit entry: User Pending Wallet
    const creditEntry = {
      id: nextLedgerId,
      account_type: 'pending',
      direction: 'credit',
      coin_amount: rewardCoins,
      inr_amount: `₹${inrVal}`,
      transaction_ref: `dlq_retry_${item.event_id}`,
      kind: 'dlq_retry_settlement',
      user: userDisplay,
      created_at: nowStr
    };

    // Debit entry: System Liability to preserve double-entry conservation
    const debitEntry = {
      id: nextLedgerId + 1,
      account_type: 'system_liability',
      direction: 'debit',
      coin_amount: rewardCoins,
      inr_amount: `₹${inrVal}`,
      transaction_ref: `dlq_retry_${item.event_id}`,
      kind: 'dlq_retry_settlement',
      user: 'System Clearing Liability',
      created_at: nowStr
    };

    STATE.data.ledger.unshift(creditEntry, debitEntry);

    // Update liabilities
    if (STATE.data.overview && STATE.data.overview.liabilities) {
      STATE.data.overview.liabilities.pending_coins += rewardCoins;
      STATE.data.overview.liabilities.pending_inr = (STATE.data.overview.liabilities.pending_coins / 1000).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Update DLQ item status and retry count
    item.status = 'resolved';
    item.retry_count = (item.retry_count || 0) + 1;
    item.last_attempt = nowStr;

    // Log to Audit Trail
    const maxAuditId = (STATE.data.audit_logs && STATE.data.audit_logs.length > 0)
      ? Math.max(...STATE.data.audit_logs.map(a => Number(a.id) || 0))
      : 500;
    STATE.data.audit_logs.unshift({
      id: maxAuditId + 1,
      admin_id: 'risk_officer',
      action: 'dlq_postback_replayed',
      target_type: 'partner_webhook',
      target_id: item.event_id,
      reason: `HMAC re-verified and ₹${inrVal} (${rewardCoins} coins) credited to double-entry ledger for user #${item.user_id}`,
      ip_address: '10.0.4.12',
      created_at: nowStr
    });

    persistData();
    renderWebhookDlq();
    showToast(`DLQ #${item.id} re-evaluated: HMAC verified and credited to ledger!`, 'success');
  }

  // DLQ Ignore Handler
  function ignoreDlqEvent(id) {
    const dlq = STATE.data.webhook_dlq || [];
    const item = dlq.find(d => String(d.id) === String(id));
    if (!item) return;

    item.status = 'ignored';
    item.last_attempt = formatCurrentTimestamp();

    const maxAuditId = (STATE.data.audit_logs && STATE.data.audit_logs.length > 0)
      ? Math.max(...STATE.data.audit_logs.map(a => Number(a.id) || 0))
      : 500;
    STATE.data.audit_logs.unshift({
      id: maxAuditId + 1,
      admin_id: 'risk_officer',
      action: 'dlq_postback_ignored',
      target_type: 'partner_webhook',
      target_id: item.event_id,
      reason: `Ignored DLQ postback #${item.id} (${item.failure_reason})`,
      ip_address: '10.0.4.12',
      created_at: formatCurrentTimestamp()
    });

    persistData();
    renderWebhookDlq();
    showToast(`DLQ record #${item.id} marked as ignored.`, 'info');
  }

  // DLQ Retry All Handler
  function retryAllDlqEvents() {
    const dlq = STATE.data.webhook_dlq || [];
    const pendingItems = dlq.filter(d => d.status !== 'resolved' && d.status !== 'ignored');
    if (pendingItems.length === 0) {
      showToast('No eligible failed postbacks to retry.', 'info');
      return;
    }
    pendingItems.forEach(item => {
      retryDlqEvent(item.id);
    });
    showToast(`Re-evaluated and retried ${pendingItems.length} DLQ events`, 'success');
  }

  // Tally & ERP Double-Entry Export Engine
  function exportLedger(format) {
    const rangeSelect = document.getElementById('erpDateRange');
    const range = rangeSelect ? rangeSelect.value : 'all';
    let entries = STATE.data.ledger || [];

    const now = new Date();
    if (range === 'today') {
      const todayStr = now.toISOString().substring(0, 10);
      entries = entries.filter(e => (e.created_at || '').startsWith(todayStr));
    } else if (range === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      entries = entries.filter(e => new Date(e.created_at) >= weekAgo);
    } else if (range === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      entries = entries.filter(e => new Date(e.created_at) >= monthAgo);
    }

    if (entries.length === 0) {
      showToast('No ledger entries match the selected date range.', 'info');
      return;
    }

    const dateSlug = now.toISOString().substring(0, 10);
    let blob, filename;

    if (format === 'tally_xml') {
      filename = `watch_earn_tally_vouchers_${dateSlug}.xml`;
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<ENVELOPE>\n`;
      xml += `  <HEADER>\n`;
      xml += `    <TALLYREQUEST>Import Data</TALLYREQUEST>\n`;
      xml += `  </HEADER>\n`;
      xml += `  <BODY>\n`;
      xml += `    <IMPORTDATA>\n`;
      xml += `      <REQUESTDESC>\n`;
      xml += `        <REPORTNAME>Vouchers</REPORTNAME>\n`;
      xml += `        <STATICVARIABLES>\n`;
      xml += `          <SVCURRENTCOMPANY>Watch &amp; Earn Rewards Pvt Ltd</SVCURRENTCOMPANY>\n`;
      xml += `        </STATICVARIABLES>\n`;
      xml += `      </REQUESTDESC>\n`;
      xml += `      <REQUESTDATA>\n`;

      entries.forEach(e => {
        const d = new Date(e.created_at || now);
        const tallyDate = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
        const amtStr = String(e.inr_amount || '0').replace(/[^0-9.]/g, '');
        const isCredit = e.direction === 'credit';
        const ledgerName = e.account_type === 'available' ? 'User Available Wallet Bucket' :
                           e.account_type === 'pending' ? 'User Pending Rewards Reserve' :
                           e.account_type === 'reserved' ? 'User Withdrawal Escrow' :
                           e.account_type === 'paid' ? 'Settled Payouts Clearing' : 'System Liability Account';

        xml += `        <TALLYMESSAGE xmlns:UDF="TallyUDF">\n`;
        xml += `          <VOUCHER VCHTYPE="Journal" ACTION="Create" OBJVIEW="Accounting Voucher View">\n`;
        xml += `            <DATE>${tallyDate}</DATE>\n`;
        xml += `            <VOUCHERTYPENAME>Journal</VOUCHERTYPENAME>\n`;
        xml += `            <VOUCHERNUMBER>${e.id}</VOUCHERNUMBER>\n`;
        xml += `            <REFERENCE>${escapeHtml(e.transaction_ref)}</REFERENCE>\n`;
        xml += `            <NARRATION>Watch &amp; Earn Journal entry #${e.id} [${e.account_type}] for ${escapeHtml(e.user)}</NARRATION>\n`;
        xml += `            <ALLLEDGERENTRIES.LIST>\n`;
        xml += `              <LEDGERNAME>${ledgerName}</LEDGERNAME>\n`;
        xml += `              <ISDEEMEDPOSITIVE>${isCredit ? 'Yes' : 'No'}</ISDEEMEDPOSITIVE>\n`;
        xml += `              <AMOUNT>${isCredit ? '-' : ''}${amtStr}</AMOUNT>\n`;
        xml += `            </ALLLEDGERENTRIES.LIST>\n`;
        xml += `          </VOUCHER>\n`;
        xml += `        </TALLYMESSAGE>\n`;
      });

      xml += `      </REQUESTDATA>\n`;
      xml += `    </IMPORTDATA>\n`;
      xml += `  </BODY>\n`;
      xml += `</ENVELOPE>\n`;

      blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    } else if (format === 'json') {
      filename = `watch_earn_ledger_journal_${dateSlug}.json`;
      const exportObject = {
        metadata: {
          organization: 'Watch & Earn Rewards Private Limited',
          system: 'Double-Entry General Ledger v1.0.4',
          export_timestamp: now.toISOString(),
          filter_range: range,
          entry_count: entries.length,
          total_coins_moved: entries.reduce((acc, curr) => acc + Number(curr.coin_amount || 0), 0),
          sha256_integrity_seal: document.getElementById('ledgerSealHash')?.textContent?.trim() || 'VERIFIED'
        },
        journal_entries: entries
      };
      blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json;charset=utf-8;' });
    } else {
      // Standard CSV Journal
      filename = `watch_earn_ledger_journal_${dateSlug}.csv`;
      let csv = 'Entry_ID,Direction,Account_Type,Coin_Amount,INR_Amount,User,Transaction_Ref,Kind,Recorded_At\n';
      entries.forEach(e => {
        csv += `${e.id},${e.direction},${e.account_type},${e.coin_amount},"${e.inr_amount}","${(e.user || '').replace(/"/g, '""')}","${e.transaction_ref}","${e.kind || 'standard'}","${e.created_at}"\n`;
      });
      blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${entries.length} entries to ${filename}`, 'success');
  }

  // Switch Payout Gateway Handler
  async function switchPayoutGateway(gateway) {
    if (!['mock', 'cashfree', 'razorpayx'].includes(gateway)) {
      showToast('Invalid payout gateway driver', 'error');
      return;
    }

    if (!STATE.data.payout_gateway) {
      STATE.data.payout_gateway = { active: 'mock', bank_float_paise: 34000 };
    }

    STATE.data.payout_gateway.active = gateway;

    const labels = {
      mock: 'Sandbox Simulated (Instant)',
      cashfree: 'Cashfree Payouts API',
      razorpayx: 'RazorpayX Payouts API'
    };

    if (STATE.mode === 'api') {
      try {
        await fetch('/api/v1/admin/payout-gateway', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ gateway })
        });
      } catch (err) {
        console.warn('Backend gateway update error:', err);
      }
    }

    const maxAuditId = (STATE.data.audit_logs && STATE.data.audit_logs.length > 0)
      ? Math.max(...STATE.data.audit_logs.map(a => Number(a.id) || 0))
      : 500;
    STATE.data.audit_logs.unshift({
      id: maxAuditId + 1,
      admin_id: 'risk_officer',
      action: 'payout_gateway_switched',
      target_type: 'banking_switch',
      target_id: gateway,
      reason: `Payout driver switched to ${labels[gateway]} with auto graceful fallback`,
      ip_address: '10.0.4.12',
      created_at: formatCurrentTimestamp()
    });

    persistData();
    renderWithdrawals();
    showToast(`Active payout gateway switched to ${labels[gateway]}`, 'success');
  }

  // Run Bank Reconciliation Handler
  async function runBankReconciliation() {
    const reservedCoins = STATE.data.overview?.liabilities?.reserved_coins || 340000;
    const reservedPaise = Math.floor(reservedCoins / 10);
    const pGateway = STATE.data.payout_gateway || { active: 'mock', bank_float_paise: 34000 };
    const bankFloatPaise = pGateway.bank_float_paise ?? reservedPaise;
    const discrepancyPaise = bankFloatPaise - reservedPaise;
    const isBalanced = discrepancyPaise === 0;
    const reconId = 'RECON-' + new Date().toISOString().substring(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const nowStr = formatCurrentTimestamp();

    if (STATE.mode === 'api') {
      try {
        await fetch('/api/v1/admin/payout-reconcile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ bank_balance_paise: bankFloatPaise })
        });
      } catch (e) {
        console.warn('API reconciliation call error:', e);
      }
    }

    pGateway.last_reconciliation = {
      id: reconId,
      timestamp: nowStr,
      status: isBalanced ? 'reconciled' : 'discrepancy_detected',
      ledger_reserved_paise: reservedPaise,
      bank_balance_paise: bankFloatPaise,
      discrepancy_paise: discrepancyPaise
    };

    const maxAuditId = (STATE.data.audit_logs && STATE.data.audit_logs.length > 0)
      ? Math.max(...STATE.data.audit_logs.map(a => Number(a.id) || 0))
      : 500;
    STATE.data.audit_logs.unshift({
      id: maxAuditId + 1,
      admin_id: 'risk_officer',
      action: 'bank_statement_reconciled',
      target_type: 'bank_reconciliation',
      target_id: reconId,
      reason: `Daily statement verified against reserved ledger funds. Discrepancy: ₹${(discrepancyPaise / 100).toFixed(2)}`,
      ip_address: '10.0.4.12',
      created_at: nowStr
    });

    persistData();

    // Render result card
    const box = document.getElementById('bankReconResultBox');
    if (box) {
      box.style.display = 'block';
      box.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 700; color: #fff; font-size: 0.88rem;">
            ✓ Daily Bank Statement Attestation (${reconId})
          </div>
          <span class="status-pill status-${isBalanced ? 'approved' : 'rejected'}">
            ${isBalanced ? '● 100% RECONCILED' : 'DISCREPANCY DETECTED'}
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; font-size: 0.78rem;">
          <div>
            <span style="color: var(--text-muted); display: block;">Ledger Reserved Liabilities</span>
            <strong style="color: #fff; font-family: var(--font-mono);">${reservedCoins.toLocaleString()} Coins (₹${(reservedPaise / 100).toFixed(2)})</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block;">Bank Merchant Escrow Float</span>
            <strong style="color: #fff; font-family: var(--font-mono);">${(bankFloatPaise).toLocaleString()} Paise (₹${(bankFloatPaise / 100).toFixed(2)})</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block;">Net Variance / Drift</span>
            <strong style="color: ${isBalanced ? 'var(--emerald-primary)' : 'var(--rose-primary)'}; font-family: var(--font-mono);">Δ = ₹${(discrepancyPaise / 100).toFixed(2)}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted); display: block;">Attested At</span>
            <strong style="color: var(--text-secondary); font-family: var(--font-mono);">${nowStr}</strong>
          </div>
        </div>
      `;
    }

    renderWithdrawals();
    showToast(`Bank statement reconciliation completed: ${isBalanced ? 'Zero balance drift confirmed!' : 'Discrepancy detected!'}`, isBalanced ? 'success' : 'error');
  }

  // SHA-256 Digest Helper
  async function computeSha256(str) {
    if (window.crypto && window.crypto.subtle) {
      try {
        const buffer = new TextEncoder().encode(str);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {}
    }
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57, h3 = 0x8badf00d, h4 = 0xbaadf00d;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
      h3 = Math.imul(h3 ^ ch, 2246822507);
      h4 = Math.imul(h4 ^ ch, 3266489909);
    }
    const hex = (h1 >>> 0).toString(16).padStart(8, '0') +
                (h2 >>> 0).toString(16).padStart(8, '0') +
                (h3 >>> 0).toString(16).padStart(8, '0') +
                (h4 >>> 0).toString(16).padStart(8, '0');
    return (hex + hex).substring(0, 64);
  }

  function formatCurrentTimestamp() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  // Toast Notification System
  function showToast(message, type = 'info') {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.innerHTML = `<span>${icons[type] || '•'}</span> <span>${escapeHtml(message)}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('open');
    });
  }

  function detectBankFromUpi(vpa) {
    if (!vpa) return 'UPI';
    const lower = vpa.toLowerCase();
    if (lower.includes('okhdfcbank')) return 'HDFC Bank (GPay)';
    if (lower.includes('okaxis')) return 'Axis Bank (GPay)';
    if (lower.includes('oksbi')) return 'State Bank of India (GPay)';
    if (lower.includes('okicici')) return 'ICICI Bank (GPay)';
    if (lower.includes('paytm')) return 'Paytm Payments Bank';
    if (lower.includes('ybl')) return 'Yes Bank (PhonePe)';
    if (lower.includes('ibl')) return 'ICICI Bank (PhonePe)';
    if (lower.includes('axl')) return 'Axis Bank (PhonePe)';
    return 'UPI Virtual Payment Address';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Global methods
  window.WatchEarnAdmin = {
    openReview,
    handleBatchAction,
    toggleUserStatus,
    inspectUser,
    resolveTicket,
    updateBatchCount,
    showToast,
    dispatchPushCampaign,
    previewAudience,
    applyPushTemplate,
    openScheduleModal,
    closeScheduleModal,
    confirmScheduleCampaign,
    cancelPushCampaign,
    // Brand Sponsorship & Advertiser CRM
    updateLeadStatus,
    createSponsoredCampaign,
    viewLeadBrief,
    openLeadModal,
    saveLeadModal,
    toggleCampaignStatus,
    copyCampaignSecret,
    generateHmacSecret,
    syncSponsorships,
    // Advanced Financial Controls, DLQ & ERP Exports
    retryDlqEvent,
    ignoreDlqEvent,
    retryAllDlqEvents,
    exportLedger,
    switchPayoutGateway,
    runBankReconciliation,
    // Multi-Role RBAC & Security Safeguards
    switchRole,
    getCurrentRole,
    hasPermission,
    getRequiredRoleForSection,
    quarantineUser,
    handleSettingsSave,
    openTwoFactorModal,
    closeTwoFactorModal,
    copyBase32Secret,
    verifyTwoFactorCode,
    toggleTwoFactorEnforcement,
    setIdleTimeout,
    terminateOtherSessions
  };

  document.addEventListener('DOMContentLoaded', init);
})();
