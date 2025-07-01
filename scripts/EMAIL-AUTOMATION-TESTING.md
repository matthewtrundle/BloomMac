# Email Automation Testing Guide

This guide explains how to test and verify the email automation system locally without running the full web server.

## Available Testing Scripts

### 1. **test-email-automation-locally.js**
Comprehensive testing tool that checks configuration, database, and can simulate the email automation process.

```bash
node scripts/test-email-automation-locally.js
```

Features:
- ✅ Checks all required environment variables
- ✅ Verifies database tables exist
- ✅ Shows active email sequences
- ✅ Counts valid subscribers
- ✅ Displays recent email logs
- ✅ Shows recent errors
- ✅ Can create test data
- ✅ Can run the email automation process

### 2. **trigger-email-automation.js**
Triggers the email automation via API endpoint (requires Next.js server running).

```bash
# First, start the Next.js server
npm run dev

# In another terminal, run:
node scripts/trigger-email-automation.js
```

### 3. **monitor-email-errors.js**
Monitors email system health and shows statistics.

```bash
node scripts/monitor-email-errors.js
```

Shows:
- Errors in last 24 hours
- Successful emails count
- Pending emails
- Active subscribers
- Active sequences
- Overall error rate

### 4. **test-email-automation-fix.js** (Archive)
Legacy script that runs the email automation process.

```bash
node archive/scripts/tests/test-email-automation-fix.js
```

## Required Environment Variables

Make sure these are set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-key
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CRON_SECRET=your-cron-secret (optional for local testing)
```

## Testing Workflow

### Quick Test (No Server Required)
1. Run the comprehensive test:
   ```bash
   node scripts/test-email-automation-locally.js
   ```

2. Follow the prompts to:
   - View current configuration
   - Check database status
   - Create test data if needed
   - Run the email automation process

3. Monitor results:
   ```bash
   node scripts/monitor-email-errors.js
   ```

### Full Test (With Server)
1. Start the Next.js development server:
   ```bash
   npm run dev
   ```

2. Test the email automation API:
   ```bash
   node scripts/trigger-email-automation.js
   ```

3. Send test emails:
   ```bash
   curl -X POST http://localhost:3000/api/test-email \
     -H "Content-Type: application/json" \
     -d '{"to": "your-email@example.com", "type": "welcome"}'
   ```

## Database Tables

The email automation system uses these tables:
- `email_sequences` - Defines email automation sequences
- `sequence_emails` - Individual emails within sequences
- `email_automation_logs` - Tracks sent emails
- `email_automation_errors` - Logs any errors
- `subscribers` - Recipients of automated emails

## Creating Test Data

The `test-email-automation-locally.js` script can create test data:
- A test email sequence with 2 emails
- A test subscriber

This allows you to test the full automation flow without real data.

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Check `.env.local` has all required keys
   - Run `node scripts/test-email-automation-locally.js` to verify

2. **Database Tables Missing**
   - Run `node scripts/create-email-automation-tables.js`
   - Check Supabase dashboard for table creation

3. **No Emails Being Sent**
   - Verify RESEND_API_KEY is valid
   - Check for active sequences and subscribers
   - Look for errors with monitoring script

4. **Invalid Email Addresses**
   - Run `node scripts/check-invalid-subscriber-emails.js`
   - Clean up with `node scripts/fix-invalid-subscriber-emails.js`

### Checking Logs

View recent automation logs in Supabase:
```sql
-- Recent sent emails
SELECT * FROM email_automation_logs 
WHERE status = 'sent' 
ORDER BY sent_at DESC 
LIMIT 10;

-- Recent errors
SELECT * FROM email_automation_errors 
ORDER BY created_at DESC 
LIMIT 10;
```

## API Endpoints

- `GET /api/process-email-automation` - Triggers automation (used by cron)
- `POST /api/test-email` - Send test emails
- `GET /api/email-analytics` - View email statistics
- `GET /api/track-email-open` - Email open tracking
- `GET /api/track-email-click` - Email click tracking