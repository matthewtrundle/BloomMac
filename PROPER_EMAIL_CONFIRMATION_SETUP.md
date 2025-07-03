# Proper Email Confirmation Setup (Keep It Enabled!)

## Why Email Confirmation is Important
- Verifies users own the email address
- Prevents spam/fake accounts  
- Required for password reset functionality
- Professional and secure

## Fix the Email Template in Supabase

### 1. Go to Supabase Dashboard
Navigate to **Authentication → Email Templates**

### 2. Update "Confirm signup" Template

**Current (BROKEN):**
```
redirect_to= https://bloompsychologynorthaustin.com
```
(Note the space after = which causes `%20` in the URL)

**Change to (CORRECT):**
```html
<h2>Confirm your email</h2>

<p>Follow this link to confirm your email:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup&next=/auth/callback">Confirm your email address</a></p>

<p>Or use this link:</p>
<p><a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a></p>
```

### 3. Update Email Settings
In **Authentication → Settings → Email Auth**:
- **Confirm email**: Keep ON ✓
- **Secure email change**: Keep ON ✓
- **Email OTP expiry**: 3600 (1 hour)

### 4. Set Redirect URLs
In **Authentication → URL Configuration**:
- **Site URL**: `https://bloompsychologynorthaustin.com`
- **Redirect URLs**: Add these:
  ```
  https://bloompsychologynorthaustin.com/auth/callback
  https://bloompsychologynorthaustin.com/auth/confirm
  https://bloompsychologynorthaustin.com/onboarding
  http://localhost:3000/auth/callback
  http://localhost:3001/auth/callback
  ```

## The Proper Flow

1. **User Signs Up** → Receives confirmation email
2. **Shows "Check Email" Page** → Clear instructions
3. **User Clicks Email Link** → Confirms email
4. **Redirects to /auth/callback** → Session created
5. **Redirects to /onboarding** → Complete profile

## Testing the Flow

1. Sign up with a real email
2. Check email (including spam)
3. Click confirmation link
4. Should redirect to onboarding

## If Links Still Expire

This might be due to:
- Email delivered late (check spam filters)
- User clicking old links
- Time zone issues

Solutions:
- Increase token expiry to 24 hours
- Add "Resend confirmation" button
- Show clear error messages