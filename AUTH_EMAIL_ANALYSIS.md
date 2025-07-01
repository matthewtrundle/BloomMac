# Auth Email Analysis: Supabase vs Custom

## Current Setup

### 1. **Supabase Auth Emails** (Built-in)
- **Signup Confirmation**: Sent by Supabase automatically
- **Password Reset**: Sent by Supabase automatically  
- **Magic Link Login**: Sent by Supabase automatically
- **Email Change**: Sent by Supabase automatically

### 2. **Custom Email Handlers**
- **Course Welcome**: `/api/auth/send-welcome-email.ts` (with deduplication ✅)
- **Contact Form**: Uses email automation system
- **Newsletter**: Uses email automation system

### 3. **Multiple Webhook Endpoints** ⚠️
```
/app/api/webhooks/stripe/route.ts         (NEW - no email sending)
/pages/api/stripe/webhook-with-auth.ts    (OLD - sends welcome email)
/pages/api/stripe/webhook.ts              (OLD - basic, no auth)
```

## No Major Conflicts Found ✅

The auth email systems are actually well-separated:

1. **Supabase handles**: All authentication emails (verification, reset, etc.)
2. **Custom system handles**: Welcome emails after purchase, newsletters, contact forms
3. **Deduplication added**: Both course email endpoints now check for duplicates

## Recommendations

### 1. **Clean Up Webhooks**
You have 3 webhook endpoints but should only use ONE:
- Keep: `/app/api/webhooks/stripe/route.ts` (newest, has deduplication)
- Remove: Other webhook files or add clear comments they're deprecated

### 2. **Verify Stripe Dashboard**
Check which webhook URL is registered:
- Should be: `https://yourdomain.com/api/webhooks/stripe`
- Not: `/api/stripe/webhook` or `/api/stripe/webhook-with-auth`

### 3. **Auth Email Configuration**
If you want custom-styled auth emails:
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize the templates there
3. Or set up custom SMTP with Resend (see SUPABASE_EMAIL_CONFIGURATION.md)

### 4. **Monitor Email Logs**
```sql
-- Check for duplicate emails
SELECT recipient, type, COUNT(*) as count
FROM email_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY recipient, type
HAVING COUNT(*) > 1
ORDER BY count DESC;
```

## Summary

✅ **Auth emails**: Properly separated (Supabase vs custom)
✅ **Deduplication**: Added to prevent duplicate course emails
⚠️ **Cleanup needed**: Multiple webhook endpoints could cause confusion
✅ **No conflicts**: Systems are working independently as designed

The main action item is to verify which Stripe webhook endpoint is active and remove the unused ones.