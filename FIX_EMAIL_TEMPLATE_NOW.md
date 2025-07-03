# 🚨 Fix Email Template in Supabase Dashboard NOW

## The Problem
Your confirmation emails have a broken URL with a space that causes `%20` to appear:
```
redirect_to=%20https://bloompsychologynorthaustin.com
```

## Quick Fix (Do This Now)

### 1. Login to Supabase Dashboard
Go to your project dashboard

### 2. Navigate to: Authentication → Email Templates

### 3. Click on "Confirm signup" template

### 4. Replace the template with this EXACT code:

```html
<h2>Welcome to Bloom Psychology!</h2>

<p>Thanks for signing up. Please confirm your email address by clicking the link below:</p>

<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup">Confirm your email</a></p>

<p>If the button doesn't work, copy and paste this link into your browser:</p>
<p>{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup</p>

<p>This link will expire in 1 hour.</p>

<p>Best regards,<br>The Bloom Psychology Team</p>
```

### 5. Save the template

### 6. Also update these settings:
- Go to Authentication → URL Configuration
- Make sure Site URL is: `https://bloompsychologynorthaustin.com` (no trailing slash)
- Add to Redirect URLs:
  ```
  https://bloompsychologynorthaustin.com/auth/callback
  https://bloompsychologynorthaustin.com/onboarding
  http://localhost:3000/auth/callback
  http://localhost:3001/auth/callback
  ```

## That's it! 

The email confirmation will now work properly. Users will:
1. Sign up
2. Get email with working link
3. Click link → goes to /auth/callback
4. Automatically redirect to /onboarding

## Test It
1. Sign up with a new email
2. Check email (including spam)
3. Click the link - it should work!

## If you want to customize the email more:
- Keep the `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup` format
- Don't add spaces after `=` signs
- Don't modify the token variables