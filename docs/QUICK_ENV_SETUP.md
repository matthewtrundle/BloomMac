# Quick Environment Variable Setup for Vercel

## Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Click on your "bloom" project
3. Go to "Settings" tab
4. Click on "Environment Variables" in the left sidebar

## Step 2: Add These Variables

Copy and paste each of these, one at a time:

### 1. CRON_SECRET (Auto-generated)
- Vercel will generate this automatically when you deploy with cron jobs
- You don't need to set this manually

### 2. INTERNAL_API_KEY
```
Name: INTERNAL_API_KEY
Value: [Generate a secure random string, e.g., use: https://generate-secret.now.sh/32]
Environment: Production, Preview, Development
```

### 3. STRIPE_SECRET_KEY (if using Stripe)
```
Name: STRIPE_SECRET_KEY
Value: [Your Stripe secret key from https://dashboard.stripe.com/apikeys]
Environment: Production
```

### 4. Email Service (Choose ONE)

**Option A - Resend (Recommended)**
```
Name: RESEND_API_KEY
Value: [Your API key from https://resend.com/api-keys]
Environment: Production, Preview, Development
```

**Option B - SendGrid**
```
Name: SENDGRID_API_KEY
Value: [Your API key from SendGrid dashboard]
Environment: Production, Preview, Development
```

## Step 3: Verify Existing Variables

Make sure these are already set (they should be from initial setup):
- DATABASE_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

## Step 4: Deploy

After adding all variables:
1. Click "Save" for each variable
2. Go back to your project overview
3. The next deployment will include these variables

## Testing Cron Jobs

Once deployed, you can monitor cron jobs:
1. Go to your Vercel project dashboard
2. Click on "Functions" tab
3. Look for logs from:
   - `/api/cron/send-reminders`
   - `/api/cron/capture-payments`
   - `/api/cron/process-no-shows`

Cron jobs will start running automatically according to their schedules:
- **Send Reminders**: Every hour
- **Capture Payments**: Every hour  
- **Process No-Shows**: Every 30 minutes

## Need Help?

If cron jobs aren't running:
1. Check the Functions logs for errors
2. Verify all environment variables are set
3. Make sure the latest deployment includes the `vercel.json` file