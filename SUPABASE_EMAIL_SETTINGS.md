# Supabase Email Confirmation Settings

## Problem
Users are getting "Email link is invalid or has expired" errors when trying to confirm their email.

## Solutions

### Option 1: Disable Email Confirmation (Development)
1. Go to your Supabase Dashboard
2. Navigate to Authentication > Settings
3. Under "Email Auth" section, find "Confirm email"
4. Toggle it OFF to disable email confirmation requirement
5. Save changes

### Option 2: Fix Email Templates
1. Go to Authentication > Email Templates
2. Check the "Confirm signup" template
3. Ensure the redirect URL is correct:
   ```
   {{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup
   ```

### Option 3: Use Magic Links Instead
Update your signup flow to use magic links:
- After signup, send a magic link
- User clicks link to sign in (no password needed)
- This bypasses confirmation issues

### Option 4: Auto-Confirm Users (Admin API)
Use the admin API to create users with pre-confirmed emails:
```javascript
await supabase.auth.admin.createUser({
  email: email,
  password: password,
  email_confirm: true // Auto-confirms email
})
```

## Immediate Workaround
For testing, use the pre-created test user:
- Email: test@bloom.com
- Password: TestBloom123!

This user has email pre-confirmed and can login immediately.