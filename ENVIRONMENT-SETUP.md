# 🔧 Environment Variables Setup Guide

## Required Environment Variables

### Core Supabase Variables ✅
```env
NEXT_PUBLIC_SUPABASE_URL=https://utetcmirepwdxbtrcczv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Payment Processing (Stripe) ❌ MISSING
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Appointment System (Calendly) ❌ MISSING
```env
CALENDLY_API_KEY=your_calendly_api_key
CALENDLY_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-organization
```

### Email System (Resend) ✅ 
```env
RESEND_API_KEY=re_VZWWPpP2_QApkX8qQnA86PDZPrYyVRce3
```

### SMS Notifications (Twilio) ❌ MISSING
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Admin System ✅
```env
ADMIN_PASSWORD=bloom-admin-2024
ADMIN_API_KEY=bloom-api-key-2024
NEXT_PUBLIC_ADMIN_API_KEY=bloom-api-key-2024
```

### Other Settings ✅
```env
NEXT_PUBLIC_BASE_URL=https://bloompsychologynorthaustin.com
NEXT_PUBLIC_SITE_URL=https://bloompsychologynorthaustin.com
CRON_SECRET=bloom-cron-secret-2024-change-in-production
```

## Setup Instructions

### 1. Stripe Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your test keys:
   - Secret key → `STRIPE_SECRET_KEY`
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Set up webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.failed`, `checkout.session.completed`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`

### 2. Calendly Setup
1. Go to [Calendly API](https://calendly.com/integrations/api_webhooks)
2. Generate Personal Access Token → `CALENDLY_API_KEY`
3. Set up webhook subscription:
   - URL: `https://your-domain.com/api/webhooks/calendly`
   - Events: `invitee.created`, `invitee.canceled`
   - Copy signing key → `CALENDLY_WEBHOOK_SECRET`

### 3. Twilio Setup (Optional for SMS)
1. Go to [Twilio Console](https://console.twilio.com)
2. Copy credentials:
   - Account SID → `TWILIO_ACCOUNT_SID`
   - Auth Token → `TWILIO_AUTH_TOKEN`
3. Get a phone number → `TWILIO_PHONE_NUMBER`

## Vercel Deployment Variables

Add these to your Vercel project settings:

```bash
# Required for production
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
CALENDLY_API_KEY
CALENDLY_WEBHOOK_SECRET

# Optional
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER
```

## Local Development

Create `.env.local` with all variables:

```bash
# Copy .env.local.example to .env.local
cp .env.local.example .env.local

# Edit with your values
code .env.local
```

## Security Notes

⚠️ **Never commit `.env.local` to git**
⚠️ **Keep `SUPABASE_SERVICE_ROLE_KEY` secret**
⚠️ **Rotate keys if exposed**
⚠️ **Use test keys for development**