# Email "to" Argument Error - Comprehensive Fix Plan

## Error Analysis
**Error**: `TypeError: The "to" argument must be of type string. Received undefined`

## Root Cause
The error occurs in the email automation system when trying to send emails to subscribers with invalid or missing email addresses. This happens during the automated cron job that runs every hour.

## Immediate Actions

### 1. Fix Email Automation Validation
Add email validation before sending in `lib/email-automation.ts`:

```typescript
// Around line 209, before calling sendAutomatedEmail
if (!subscriber.email || typeof subscriber.email !== 'string' || !subscriber.email.includes('@')) {
  console.error(`Invalid email for subscriber ${subscriber.id}: ${subscriber.email}`);
  continue;
}
```

### 2. Check Database for Invalid Emails
Run this query to find problematic subscriber records:

```sql
-- Find subscribers with invalid emails
SELECT id, email, source, created_at 
FROM subscribers 
WHERE email IS NULL 
   OR email = '' 
   OR email NOT LIKE '%@%'
   OR LENGTH(email) < 5;
```

### 3. Add Global Email Validation
Create a utility function for email validation:

```typescript
// lib/utils/email-validation.ts
export function isValidEmail(email: any): email is string {
  return typeof email === 'string' 
    && email.length > 0 
    && email.includes('@')
    && email.includes('.');
}
```

## Comprehensive Fix Implementation

### Step 1: Fix the Email Automation
```typescript
// lib/email-automation.ts - Update the processSequenceEmail function
async function processSequenceEmail(sequence: any, email: any, subscriber: any) {
  // Validate subscriber email first
  if (!subscriber.email || typeof subscriber.email !== 'string' || !subscriber.email.includes('@')) {
    console.error(`Skipping email for subscriber ${subscriber.id} - invalid email: ${subscriber.email}`);
    
    // Log the error to the database
    await supabaseAdmin
      .from('email_automation_errors')
      .insert({
        subscriber_id: subscriber.id,
        sequence_id: sequence.id,
        email_id: email.id,
        error: 'Invalid or missing email address',
        error_details: { email: subscriber.email },
        created_at: new Date().toISOString()
      });
    
    return;
  }

  // Rest of the function continues...
}
```

### Step 2: Add Validation to All Email Functions
Update these files with email validation:
- `lib/email/auth-emails.ts` - All send functions
- `pages/api/send-email.ts`
- `pages/api/newsletter-signup.ts`
- `pages/api/careers-application.ts`

### Step 3: Create Error Logging Table
```sql
CREATE TABLE IF NOT EXISTS email_automation_errors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID REFERENCES subscribers(id),
  sequence_id UUID REFERENCES email_sequences(id),
  email_id UUID REFERENCES email_templates(id),
  error TEXT NOT NULL,
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Step 4: Add Monitoring
Create a monitoring endpoint to check for email errors:

```typescript
// pages/api/admin/email-errors.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data: errors } = await supabase
    .from('email_automation_errors')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
    
  return res.json({ errors });
}
```

## Testing Plan

1. **Test Email Validation**
   - Create test subscribers with invalid emails
   - Verify they're skipped without crashing
   - Check error logs are created

2. **Test Cron Job**
   - Manually trigger the email automation
   - Verify it completes without errors
   - Check that valid emails are still sent

3. **Test New Signups**
   - Test newsletter signup with invalid emails
   - Test course purchase flow
   - Verify proper error handling

## Rollback Plan
If issues persist:
1. Disable the cron job temporarily in `vercel.json`
2. Fix any remaining issues
3. Re-enable after thorough testing

## Long-term Improvements

1. **Add Email Validation at Entry Points**
   - Newsletter signup forms
   - Course registration
   - Contact forms

2. **Create Email Health Dashboard**
   - Track failed emails
   - Monitor bounce rates
   - Alert on high failure rates

3. **Implement Retry Logic**
   - Retry failed emails with exponential backoff
   - Mark permanently failed emails

## Timeline
- **Immediate** (0-1 hour): Apply email validation fix
- **Short-term** (1-4 hours): Database cleanup and monitoring
- **Long-term** (1-2 days): Comprehensive validation and dashboard