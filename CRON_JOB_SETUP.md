# Email Automation Cron Job Setup

## Option 1: Vercel Cron Jobs (Recommended for Vercel hosting)

### Setup:
1. The `vercel.json` file has been created with cron configuration
2. Add this environment variable in Vercel dashboard:
   ```
   CRON_SECRET=your-secret-key-here
   ```
3. Deploy to Vercel - cron will run automatically every hour

### How it works:
- Runs every hour (0 * * * *)
- Processes all scheduled emails
- Sends emails based on delay settings

## Option 2: Supabase Scheduled Functions

### Setup:
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Deploy the function:
   ```bash
   cd /Users/mattrundle/Documents/Bloom
   supabase functions deploy process-email-automation
   ```

3. Create a scheduled job in Supabase Dashboard:
   - Go to Database → Extensions
   - Enable pg_cron
   - Run this SQL:
   ```sql
   SELECT cron.schedule(
     'process-email-automation',
     '0 * * * *', -- Every hour
     $$
     SELECT net.http_post(
       url := 'https://your-project.supabase.co/functions/v1/process-email-automation',
       headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'))
     );
     $$
   );
   ```

## Option 3: External Cron Services (Works anywhere)

### Using Cron-job.org (Free):
1. Sign up at https://cron-job.org
2. Create a new cron job:
   - URL: `https://bloompsychologynorthaustin.com/api/process-email-automation`
   - Schedule: Every hour
   - Method: GET or POST
   - Headers: `Authorization: Bearer your-secret-key`

### Using EasyCron (Paid, more reliable):
1. Sign up at https://www.easycron.com
2. Add cron job with same settings as above

### Using GitHub Actions (Free):
Create `.github/workflows/email-automation.yml`:
```yaml
name: Process Email Automation
on:
  schedule:
    - cron: '0 * * * *' # Every hour
  workflow_dispatch: # Allow manual trigger

jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger email automation
        run: |
          curl -X POST https://bloompsychologynorthaustin.com/api/process-email-automation \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## Testing the Cron Job

### Manual Test:
```bash
curl -X POST http://localhost:3000/api/process-email-automation
```

### Production Test:
```bash
curl -X POST https://bloompsychologynorthaustin.com/api/process-email-automation \
  -H "Authorization: Bearer your-secret-key"
```

## Monitoring

The cron job will:
1. Run every hour
2. Check for emails that need to be sent
3. Send emails based on sequence delays
4. Track opens and clicks
5. Update the dashboard with real metrics

## Important Notes:
- Emails are only sent once per subscriber per sequence
- The system checks trigger conditions (newsletter signup, etc.)
- Delays are calculated from the trigger event
- Failed emails are logged and can be retried