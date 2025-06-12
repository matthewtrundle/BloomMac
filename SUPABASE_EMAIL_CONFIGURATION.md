# Supabase Email Configuration Guide

## Overview
This guide documents how to configure Supabase to work with your email provider for authentication emails.

## Current Email Setup

We're using **Resend** for transactional emails with the following configuration:

- **API Key**: Set in environment variable `RESEND_API_KEY`
- **From Addresses**:
  - Course emails: `courses@bloompsychologynorthaustin.com`
  - System emails: `noreply@bloompsychologynorthaustin.com`

## Supabase Configuration Steps

### 1. Configure Custom SMTP in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Auth**
3. Scroll to **SMTP Settings**
4. Enable "Custom SMTP"
5. Enter the following settings:

```
Host: smtp.resend.com
Port: 465
Username: resend
Password: [Your RESEND_API_KEY]
Sender email: noreply@bloompsychologynorthaustin.com
Sender name: Bloom Psychology
```

### 2. Configure Email Templates

In the same Auth settings page, customize the email templates:

#### Confirmation Email (Sign Up)
```
Subject: Verify your email - Bloom Psychology 🌸
```

#### Magic Link Email
```
Subject: Your login link - Bloom Psychology 🌸
```

#### Password Reset Email
```
Subject: Reset your password - Bloom Psychology 🌸
```

### 3. Configure Redirect URLs

In **Auth** → **URL Configuration**, set:

```
Site URL: https://www.bloompsychologynorthaustin.com
Redirect URLs:
- https://www.bloompsychologynorthaustin.com/auth/callback
- https://www.bloompsychologynorthaustin.com/my-courses
- https://www.bloompsychologynorthaustin.com/auth/reset-password
```

### 4. Email Rate Limits

Default Supabase limits:
- 4 emails per hour per user
- Custom SMTP removes most limits

## Environment Variables Required

Add these to your `.env.local`:

```bash
# Resend API Key for email sending
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Site URL for email links
NEXT_PUBLIC_SITE_URL=https://www.bloompsychologynorthaustin.com
```

## Testing Email Configuration

1. **Test Magic Link**:
   ```bash
   # Use the login page and select "Use magic link"
   # Check email delivery and link functionality
   ```

2. **Test Password Reset**:
   ```bash
   # Use the forgot password page
   # Verify email arrives with correct branding
   ```

3. **Test Welcome Email**:
   ```bash
   # Make a test purchase or use the test checkout
   # Confirm welcome email is sent with course access
   ```

## Alternative Email Providers

If you prefer to use a different email provider:

### SendGrid
```
Host: smtp.sendgrid.net
Port: 465
Username: apikey
Password: [Your SendGrid API Key]
```

### AWS SES
```
Host: email-smtp.[region].amazonaws.com
Port: 465
Username: [Your AWS SMTP Username]
Password: [Your AWS SMTP Password]
```

### Postmark
```
Host: smtp.postmarkapp.com
Port: 587
Username: [Your Postmark API Token]
Password: [Your Postmark API Token]
```

## Troubleshooting

### Emails not sending
1. Check Supabase logs: Dashboard → Logs → Auth
2. Verify SMTP credentials
3. Check spam folders
4. Ensure sender domain is verified with your email provider

### Links not working
1. Verify Site URL in Supabase settings
2. Check redirect URLs are properly configured
3. Ensure `/auth/callback` route exists and works

### Rate limiting
- Implement exponential backoff for bulk emails
- Use custom SMTP to avoid Supabase limits
- Consider email queuing for large batches

## Production Checklist

- [ ] Configure custom domain emails (not @gmail.com)
- [ ] Set up SPF, DKIM, and DMARC records
- [ ] Verify sender domain with email provider
- [ ] Test all email flows in production
- [ ] Monitor email delivery rates
- [ ] Set up email bounce handling
- [ ] Configure email analytics/tracking