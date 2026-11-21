# Watch & Earn — Default Dark Gaming UI

## Design decision

**Default appearance:** Original dark neon gaming theme (`Design_Boards/00_ORIGINAL_DARK_THEME_REFERENCE.png`).

The original reference image is the visual source of truth. Subsequent concept boards are explorations of more screens; if any layout, wording, navigation, or styling conflicts with the original reference, favor the original. The app should feel engaging as a mobile game while treating balances and payouts clearly, like a trustworthy fintech app.

## Theme guidelines

- Background: very deep navy / near black (starting token `#080B20`).
- Cards: navy/indigo surfaces (starting token `#151837`).
- Primary highlight: radiant purple (starting token `#9633F5`).
- Secondary highlight: electric cyan (starting token `#29CBFF`).
- Coins / rewards: warm gold (starting token `#FFC638`).
- Success: emerald green (starting token `#28D991`).
- Primary text: near white (`#F7F8FF`); secondary text: cool light gray (`#AAB4DB`).
- Use a consistent coin icon, header design, bottom navigation, pill chips, 16–24 px round corners, luminous CTA buttons, and subtle outlined cards.
- Maintain a **prominent circular center Watch button** where bottom navigation is present.
- No gambling, slot-machine, lottery or guaranteed-winnings metaphors. Gold chest and coins denote earned rewards, not chance-based payouts.
- Use the same structure when implementing optional light mode: change surfaces, text contrast and shadows, not the screen layout or features.

## Screens and suggested routes

| # | Screen | Suggested route | Key interactions |
|--:|---|---|---|
| 01 | Splash | /splash | Launch session |
| 02 | Onboarding: Watch Ads | /onboarding/ads | Continue / Skip |
| 03 | Onboarding: Tasks | /onboarding/tasks | Continue / Skip |
| 04 | Onboarding: UPI | /onboarding/withdraw | Get Started |
| 05 | Mobile Login | /auth/login | Send OTP |
| 06 | OTP Verification | /auth/verify | Verify OTP / Resend |
| 07 | Home Dashboard | /home | Watch / Wallet / Offers |
| 08 | Watch Ads List | /earn/ads | Select an available eligible ad |
| 09 | Ad Player | /earn/ads/player | Ad SDK-controlled playback |
| 10 | Reward Success | /earn/reward | View pending/verified reward |
| 11 | Earn Hub | /earn | Ads / Tasks / Surveys / Offers |
| 12 | Wallet | /wallet | Check pending, available balance, history |
| 13 | UPI Withdrawal | /wallet/withdraw | Enter UPI ID / Confirm withdrawal |
| 14 | Achievement Tasks | /achievements/tasks | Review progress |
| 15 | Transaction History | /wallet/history | Filter activity / See transaction detail |
| 16 | Refer & Earn | /refer | Copy referral code / Invite |
| 17 | Achievements & Levels | /achievements | See streaks and milestones |
| 18 | Profile | /profile | Edit profile / Navigate to settings |
| 19 | Help & Support | /support | FAQ / Missing reward / Payout issue |
| 20 | Settings | /settings | Notification, appearance, privacy |

## Core product rules

- **Fixed conversion:** 100 coins = ₹0.10; therefore 1,000 coins = ₹1.00.
- Correct display examples: 12,500 coins = ₹12.50; 10,000 coins = ₹10.00.
- Mockup numbers, reward amounts and labels are **illustrative**, not final business rules. Do not hardcode them from images.
- Ad rewards must be verified server-side. Show pending rewards until the ad provider approves; prevent duplicate grants; support reversals.
- Only integrate advertising providers that contractually permit rewards redeemable for money. Google AdMob rewarded ads cannot be used for cash-convertible currency.
- UPI payout requires eligibility checks, secure verification and an approved payout partner.
- Distinguish approved available balance from pending/unsettled coins and payout holds.
- The app is not a game of chance. Do not imply instant or guaranteed cash for every ad.

## Asset status

All images are **concept designs** generated as references; they are not production-quality isolated UI source files. The cropped previews are extracted from a composite image to help index screens. They are **not** intended as final exportable Android assets. Production UI should be recreated in Jetpack Compose with components, responsive layout, proper typography and accessibility.
