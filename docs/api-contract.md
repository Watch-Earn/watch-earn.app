# REST API Specification (v1)

Base URL: `https://api.watch-earn.app/api/v1`

All responses follow standard envelope formatting:
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

---

## 1. Authentication

### `POST /auth/otp/request`
Request an SMS OTP code.
- **Payload:**
  ```json
  { "phone": "+919876543210" }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "session_id": "otp_req_abc123",
      "expires_in": 300
    },
    "message": "OTP sent successfully"
  }
  ```

### `POST /auth/otp/verify`
Verify OTP, check 18+ declaration, and receive authorization token.
- **Payload:**
  ```json
  {
    "phone": "+919876543210",
    "code": "123456",
    "age_confirmed": true,
    "consent_version": "v1.0"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "token": "1|bearer_token_xyz...",
      "user": {
        "id": 1,
        "phone_masked": "+91*****43210",
        "status": "active"
      }
    }
  }
  ```

---

## 2. User & Profile

### `GET /me` (Auth Required)
Returns profile, balance overview, and daily activity limits.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "user_id": 1,
      "display_name": "Rohan",
      "country": "IN",
      "age_eligibility_status": "verified",
      "daily_completions_today": 2,
      "daily_cap": 10,
      "wallet": {
        "available_coins": 10500,
        "pending_coins": 40,
        "reserved_coins": 0,
        "paid_coins": 20000,
        "available_inr_paise": 1050,
        "available_inr_rupees": "10.50",
        "conversion_rate": "1000 coins = 100 paise (₹1.00)"
      }
    }
  }
  ```

---

## 3. Offers & Activities

### `GET /offers` (Auth Required)
Lists permitted offers from approved partners.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 101,
        "partner": "PartnerOne",
        "title": "Quick Survey on Mobile Usage",
        "reward_coins": 50,
        "estimated_minutes": 3,
        "terms": "Must complete all questions honestly.",
        "status": "available"
      }
    ]
  }
  ```

### `POST /offers/{id}/start` (Auth Required)
Creates an authenticated tracking token for starting an offer session.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "session_token": "sess_89f72b...",
      "launch_url": "https://partner.com/track?session=sess_89f72b..."
    }
  }
  ```

---

## 4. Wallet & Transactions

### `GET /wallet` (Auth Required)
- **Response (200 OK):** Detailed breakdown of balances, paise calculations, and minimum withdrawal rule.

### `GET /wallet/transactions` (Auth Required)
- **Query Params:** `?page=1&limit=20`
- **Response (200 OK):** Paginated ledger history with timestamps, reference IDs, and transaction kinds (`reward_credit`, `pending_release`, `withdrawal_reservation`, `withdrawal_paid`, `reversal`).

---

## 5. Withdrawals

### `POST /withdrawals` (Auth Required)
Initiates a UPI withdrawal request.
- **Payload:**
  ```json
  {
    "coins": 10000,
    "upi_id": "rohan@okhdfcbank",
    "idempotency_key": "wd_req_9921_1"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "withdrawal_id": 42,
      "coins": 10000,
      "amount_paise": 1000,
      "amount_inr": "10.00",
      "upi_id": "rohan@okhdfcbank",
      "status": "requested",
      "created_at": "2026-11-21T10:00:00Z"
    }
  }
  ```

### `GET /withdrawals` (Auth Required)
List user's withdrawal requests and statuses.

---

## 6. Webhooks (External Server-to-Server)

### `POST /webhooks/partners/{partner}`
Signed reward completion postback.
- **Headers:** `X-Partner-Signature: <hmac-sha256>`
- **Payload:**
  ```json
  {
    "event_id": "ext_evt_99812",
    "user_id": 1,
    "offer_id": 101,
    "reward_coins": 50,
    "timestamp": 1795240800
  }
  ```
- **Response (200 OK):**
  ```json
  { "success": true, "message": "Event processed" }
  ```

### `POST /webhooks/payouts/{provider}`
Signed payout status update from payment processor.
- **Headers:** `X-Payout-Signature: <hmac-sha256>`
- **Payload:**
  ```json
  {
    "payout_id": "payout_bank_45678",
    "withdrawal_id": 42,
    "status": "SUCCESS",
    "utr": "UTR67891011"
  }
  ```
