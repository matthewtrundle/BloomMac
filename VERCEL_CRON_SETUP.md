# Vercel Cron Job Setup for Email Automation

## ✅ What's Already Done:

1. **vercel.json** configured with cron schedule (runs every hour)
2. **CRON_SECRET** added to .env.local
3. **API endpoint** ready at `/api/process-email-automation`

## 🚀 Steps to Complete Setup:

### 1. Add Environment Variable to Vercel

Go to your Vercel project dashboard:
1. Navigate to **Settings** → **Environment Variables**
2. Add these variables:
   ```
   CRON_SECRET=bloom-cron-secret-2024-change-in-production
   NEXT_PUBLIC_BASE_URL=https://bloompsychologynorthaustin.com
   ```
3. Make sure to add them for **Production** environment

### 2. Deploy to Vercel

```bash
git add .
git commit -m "Add email automation cron job"
git push
```

Vercel will automatically:
- Detect the cron configuration in vercel.json
- Set up the scheduled job
- Run it every hour

### 3. Verify Cron Job

After deployment:
1. Go to Vercel Dashboard → **Functions** tab
2. Click on **Cron Jobs**
3. You should see:
   - Path: `/api/process-email-automation`
   - Schedule: `0 * * * *` (every hour)
   - Status: Active

### 4. Monitor Cron Execution

In Vercel Dashboard:
- **Functions** → View logs for `/api/process-email-automation`
- Check for successful executions every hour
- Monitor any errors

## 📊 What Happens Each Hour:

1. Vercel triggers `/api/process-email-automation`
2. System checks all active email sequences
3. Finds subscribers eligible for emails based on:
   - Trigger events (newsletter signup, etc.)
   - Delay settings (e.g., 3 days after signup)
4. Sends personalized emails with tracking
5. Logs results in database

## 🧪 Testing Before Deploy:

### Local Test:
```bash
# Test the endpoint locally
curl http://localhost:3003/api/process-email-automation
```

### Manual Test After Deploy:
In Vercel Dashboard:
1. Go to **Functions** → **Cron Jobs**
2. Click the three dots menu
3. Select **Trigger Manually**

## 📧 Email Tracking:

When emails are sent:
- Open tracking pixel: `/api/track-email-open`
- Click tracking: `/api/track-email-click`
- Results appear in Email Analytics dashboard

## 🔍 Troubleshooting:

### If cron isn't running:
1. Check Vercel Dashboard → Functions → Cron Jobs
2. Verify environment variables are set
3. Check function logs for errors

### If emails aren't sending:
1. Verify RESEND_API_KEY is set in Vercel
2. Check email_sequences table has active sequences
3. Ensure subscribers exist and match trigger conditions

## 📌 Important Notes:

- First run will happen 1 hour after deployment
- Only sends each email once per subscriber
- Respects delay settings (days/hours)
- Failed emails are logged for retry

## Current Email Sequences:

1. **Welcome Series** (Active)
   - Email 1: Immediate on newsletter signup
   - Email 2: After 3 days
   - Email 3: After 7 days

2. **New Mom Nurture** (Active)
   - Email 1: Immediate on program inquiry
   - Email 2: After 2 days

The cron job is ready to go - just deploy to Vercel!