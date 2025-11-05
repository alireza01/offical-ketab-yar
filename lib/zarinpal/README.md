# ZarinPal Integration Guide

## 🇮🇷 درگاه پرداخت زرین‌پال

Complete ZarinPal payment gateway integration for Ketab-Yar subscription system.

## 📋 Overview

ZarinPal is the leading payment gateway in Iran, supporting all Iranian bank cards and providing a secure, reliable payment infrastructure.

**Official Documentation**: https://docs.zarinpal.com/paymentGateway/

## 🔑 Setup

### 1. Get Merchant ID

1. Register at https://www.zarinpal.com/
2. Complete KYC verification
3. Get your Merchant ID from panel
4. Add to `.env.local`:

```env
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 2. Configure Callback URL

In ZarinPal panel, set your callback URL:
- **Development**: `http://localhost:3000/subscription/verify`
- **Production**: `https://ketabyar.ir/subscription/verify`

## 🔄 Payment Flow

```
1. User clicks "خرید اشتراک" button
   ↓
2. POST /api/subscription/create-checkout
   - Creates payment request with ZarinPal
   - Stores payment session in database
   - Returns payment URL
   ↓
3. User redirected to ZarinPal gateway
   - Enters card details
   - Completes payment
   ↓
4. ZarinPal redirects to /subscription/verify
   - With Authority and Status parameters
   ↓
5. GET /api/subscription/verify
   - Verifies payment with ZarinPal
   - Upgrades user subscription
   - Redirects to success page
```

## 📁 File Structure

```
lib/zarinpal/
├── zarinpal-client.ts       # Core ZarinPal API client
└── README.md                 # This file

app/api/subscription/
├── create-checkout/
│   └── route.ts             # Create payment request
└── verify/
    └── route.ts             # Verify payment callback

supabase/migrations/
└── 20250105_add_subscription_fields.sql  # Includes payment_sessions table
```

## 🔌 API Functions

### createPaymentRequest()

Creates a new payment request with ZarinPal.

```typescript
import { createPaymentRequest } from '@/lib/zarinpal/zarinpal-client'

const payment = await createPaymentRequest({
  userId: 'user-uuid',
  planId: 'quarterly',
  successUrl: 'https://ketabyar.ir/subscription/verify',
  cancelUrl: 'https://ketabyar.ir/subscription?cancelled=true',
})

// Returns:
// {
//   authority: 'A00000000000000000000000000123456789',
//   url: 'https://www.zarinpal.com/pg/StartPay/A00000...'
// }
```

### verifyPayment()

Verifies a payment after user returns from gateway.

```typescript
import { verifyPayment } from '@/lib/zarinpal/zarinpal-client'

const result = await verifyPayment(
  'A00000000000000000000000000123456789', // authority
  799000 // amount in Tomans
)

// Returns:
// {
//   success: true,
//   refId: '123456789' // ZarinPal reference ID
// }
```

### getPlanPrice()

Get price for a specific plan.

```typescript
import { getPlanPrice } from '@/lib/zarinpal/zarinpal-client'

const price = getPlanPrice('quarterly') // 799000
```

## 🗄️ Database Schema

### payment_sessions table

Stores temporary payment session data for verification.

```sql
CREATE TABLE payment_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  authority TEXT NOT NULL UNIQUE,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'completed', 'failed', 'cancelled'
  ref_id TEXT,
  verified_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🧪 Testing

### Mock Mode (Development)

When `ZARINPAL_MERCHANT_ID` is not set, the system runs in mock mode:

```typescript
// Returns mock data without calling ZarinPal API
{
  authority: 'mock_authority_1234567890',
  url: '/subscription/success'
}
```

### Test with Real Gateway

ZarinPal provides a sandbox environment:

1. Use sandbox merchant ID: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
2. Test card number: `6037-9971-0000-0001`
3. CVV2: Any 3-4 digits
4. Expiry: Any future date

## 🔒 Security

### RLS Policies

```sql
-- Users can only view their own payment sessions
CREATE POLICY "Users can view own payment sessions"
  ON payment_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can modify
CREATE POLICY "Service role can manage payment sessions"
  ON payment_sessions FOR ALL
  USING (auth.role() = 'service_role');
```

### Best Practices

1. ✅ Always verify payment on server-side
2. ✅ Store authority in database before redirecting
3. ✅ Check payment status before upgrading subscription
4. ✅ Handle duplicate verification (code 101)
5. ✅ Log all payment attempts for debugging
6. ❌ Never trust client-side payment status
7. ❌ Never expose merchant ID in client code

## 📊 Response Codes

### Payment Request

| Code | Description |
|------|-------------|
| 100  | Success |
| -1   | Information sent is incomplete |
| -2   | IP or Merchant ID is incorrect |
| -3   | Amount must be above 1,000 Tomans |
| -4   | Merchant level is below silver |
| -11  | Request not found |
| -12  | Unable to edit request |
| -21  | Financial operation not found |
| -22  | Transaction failed |
| -33  | Transaction amount does not match |
| -34  | Transaction limit exceeded |
| -40  | Access to method not allowed |
| -41  | Additional data related to information sent is invalid |
| -42  | Validity period of payment ID must be between 30 minutes and 45 days |
| -54  | Request archived |

### Payment Verification

| Code | Description |
|------|-------------|
| 100  | Payment verified successfully |
| 101  | Payment already verified |
| -21  | Financial operation not found |
| -22  | Transaction failed |
| -33  | Transaction amount does not match |
| -54  | Request archived |

## 🐛 Troubleshooting

### Issue: "Merchant ID is incorrect"
**Solution**: Verify your merchant ID in ZarinPal panel and `.env.local`

### Issue: "Callback URL not whitelisted"
**Solution**: Add your callback URL in ZarinPal panel settings

### Issue: "Amount does not match"
**Solution**: Ensure the amount sent to verify matches the original request

### Issue: Payment verified but subscription not upgraded
**Solution**: Check `/api/subscription/verify` logs for errors

## 📈 Monitoring

### Track Payment Success Rate

```sql
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM payment_sessions
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY status;
```

### Find Failed Payments

```sql
SELECT 
  ps.*,
  p.email
FROM payment_sessions ps
JOIN auth.users u ON ps.user_id = u.id
JOIN profiles p ON u.id = p.id
WHERE ps.status = 'failed'
ORDER BY ps.created_at DESC
LIMIT 50;
```

## 🚀 Production Checklist

- [ ] Merchant ID configured in production environment
- [ ] Callback URL whitelisted in ZarinPal panel
- [ ] SSL certificate installed (HTTPS required)
- [ ] Database migration applied
- [ ] RLS policies enabled
- [ ] Error logging configured
- [ ] Payment monitoring dashboard set up
- [ ] Test payment flow end-to-end
- [ ] Backup payment verification logs

## 📞 Support

- **ZarinPal Support**: https://www.zarinpal.com/contact
- **Documentation**: https://docs.zarinpal.com/
- **Status Page**: https://status.zarinpal.com/

---

**Last Updated**: 2025-01-05
**Version**: 1.0
**Status**: ✅ Production Ready
