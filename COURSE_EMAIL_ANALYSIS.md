# Course Purchase Email Flow Analysis

## Current Email Sending Points

### 1. **Direct Course Purchase** (`/pages/api/course-purchase.ts`)
- Sends email via `sendEmail()` from email-automation
- Uses template: `course-welcome`
- Includes temp password in email
- **Status: ACTIVE** (could cause duplicates)

### 2. **Stripe Webhook - Old** (`/pages/api/stripe/webhook-with-auth.ts`)
- Sends email via API call to `/api/auth/send-welcome-email`
- Creates Supabase auth user
- Sends magic link instead of password
- **Status: POTENTIALLY ACTIVE** (check Stripe dashboard)

### 3. **Stripe Webhook - New** (`/app/api/webhooks/stripe/route.ts`)
- Does NOT send any emails
- Only creates notifications and updates database
- Has duplicate prevention for webhook events
- **Status: ACTIVE** (but no email sending)

## Duplicate Email Risk Assessment

### HIGH RISK Scenarios:
1. **Multiple Webhook Endpoints**: If both webhook endpoints are registered in Stripe
2. **Direct Purchase + Webhook**: If `/course-purchase` is used AND webhooks are active
3. **No Deduplication**: Email logs exist but aren't checked before sending

### Current Protection:
- ✅ New webhook has event deduplication
- ✅ Email logs table exists for tracking
- ❌ No check before sending emails
- ❌ Multiple systems can send same email

## Recommendations

### Immediate Actions:

1. **Check Stripe Dashboard**
   - Log into Stripe
   - Go to Developers → Webhooks
   - Verify which endpoints are registered
   - Should only have ONE active endpoint

2. **Disable Redundant Systems**
   - If using Stripe webhooks, disable direct email in `/course-purchase`
   - If not using webhooks, ensure they're not registered in Stripe

3. **Add Email Deduplication**
   ```typescript
   // Before sending any course welcome email
   const { data: existingEmail } = await supabase
     .from('email_logs')
     .select('id')
     .eq('recipient', email)
     .eq('type', 'welcome_course')
     .gte('created_at', new Date(Date.now() - 24*60*60*1000).toISOString())
     .single();
   
   if (existingEmail) {
     console.log('Welcome email already sent in last 24 hours');
     return;
   }
   ```

### Recommended Architecture:

```
Stripe Checkout
    ↓
Stripe Webhook (single endpoint)
    ↓
Check email_logs for duplicates
    ↓
Send welcome email
    ↓
Log to email_logs
```

## Testing Steps

1. **Verify Active Systems**:
   ```bash
   # Check if course-purchase endpoint is used
   grep -r "course-purchase" --include="*.ts" --include="*.tsx"
   ```

2. **Test Purchase Flow**:
   - Make a test purchase
   - Check email_logs table
   - Verify only ONE email sent

3. **Monitor Email Logs**:
   ```sql
   SELECT * FROM email_logs 
   WHERE type = 'welcome_course' 
   ORDER BY created_at DESC 
   LIMIT 20;
   ```

## Quick Fix

Add this to both email sending locations:

```typescript
// Prevent duplicate emails
const recentEmailCheck = await supabase
  .from('email_logs')
  .select('id')
  .eq('recipient', email)
  .eq('type', 'welcome_course')
  .eq('status', 'sent')
  .gte('created_at', new Date(Date.now() - 60*60*1000).toISOString()); // 1 hour

if (recentEmailCheck.data && recentEmailCheck.data.length > 0) {
  console.log('Welcome email recently sent, skipping duplicate');
  return;
}
```

## Summary

- **Primary Risk**: Multiple webhook endpoints or mixed direct/webhook email sending
- **Solution**: Use single webhook endpoint + email deduplication
- **Quick Win**: Add duplicate check before sending any course emails