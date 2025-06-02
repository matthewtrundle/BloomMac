# Calendly Webhook Setup Guide

This guide walks you through setting up Calendly webhooks to automatically send booking confirmation emails through your Bloom Psychology email system.

## Prerequisites

1. Calendly account with webhook access (requires Professional plan or higher)
2. Your website deployed to production
3. Access to your Calendly account settings

## Step 1: Create the Bookings Table

Run the SQL script to create the necessary database table:

```bash
psql $DATABASE_URL < supabase/create-bookings-table.sql
```

## Step 2: Get Your Webhook URL

Your webhook endpoint is:
```
https://www.bloompsychologynorthaustin.com/api/calendly-webhook
```

## Step 3: Configure Calendly Webhook

1. **Log in to Calendly** and go to your account settings

2. **Navigate to Integrations** → **Webhooks**

3. **Click "Create Webhook"**

4. **Configure the webhook:**
   - **Webhook URL**: `https://www.bloompsychologynorthaustin.com/api/calendly-webhook`
   - **Events to subscribe**:
     - ✅ invitee.created (when someone books)
     - ✅ invitee.canceled (when someone cancels)

5. **Test the webhook** using Calendly's test feature

## Step 4: Webhook Security (Optional but Recommended)

1. **In Calendly**, note the webhook signing key

2. **Add to your environment variables**:
   ```
   CALENDLY_WEBHOOK_SECRET=your_signing_key_here
   ```

3. **Update the webhook code** to verify signatures (TODO section in the code)

## What Happens When Someone Books

1. **Immediate Actions:**
   - Calendly sends booking data to your webhook
   - System sends confirmation email with appointment details
   - Booking is stored in your database
   - Reminder email is scheduled for 24 hours before

2. **Email Sequence:**
   - **Instantly**: Booking confirmation email
   - **24 hours before**: Appointment reminder
   - **48 hours after**: Follow-up email (if configured)

## Testing

1. **Make a test booking** through your Calendly link
2. **Check the following:**
   - Confirmation email is received
   - Booking appears in your database
   - Reminder is scheduled

## Troubleshooting

### Webhook not receiving events
- Verify the URL is correct
- Check that your site is deployed and accessible
- Look at webhook logs in Calendly

### Emails not sending
- Check your email service configuration
- Verify email templates exist
- Check server logs for errors

### Database errors
- Ensure the bookings table exists
- Check Supabase connection
- Verify environment variables

## Email Customization

To customize the booking emails, edit:
- `/lib/email-templates/enhanced-emails.ts`
- Look for the `bookingConfirmation` section

## Monitoring

View webhook activity:
1. **In Calendly**: Check webhook logs
2. **In your app**: Query the `bookings` table
3. **Email logs**: Check `email_automation_log` table

## Important Notes

- The webhook always returns 200 OK to prevent Calendly from retrying
- Failed emails are logged but don't block the webhook
- Reminder emails use your existing email automation queue system
- All booking data is stored for future reference