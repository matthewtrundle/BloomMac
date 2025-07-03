# Email Template Update Instructions

## What Changed

The beautiful template design is preserved, but I fixed the critical URL issues:

### 1. **Main CTA Button** (Line 35)
**OLD:** 
```html
<a href="{{ .ConfirmationURL }}" ...>
```

**NEW:**
```html
<a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup" ...>
```

### 2. **Fallback Link Section** (Lines 68-76)
Added a proper visible fallback link section that users can copy/paste if the button doesn't work.

### 3. **Added Expiry Notice** (Line 87)
Added "This link will expire in 1 hour for security reasons" to set expectations.

### 4. **Updated "What happens next"** (Line 45)
Changed first item to "Complete your wellness profile" to match the actual flow.

## How to Update in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication → Email Templates**
3. Click on **"Confirm signup"** template
4. **Delete everything** in the template editor
5. **Copy the entire contents** of `FIXED_PROFESSIONAL_EMAIL_TEMPLATE.html`
6. **Paste** into the template editor
7. Click **Save**

## Why This Fix Works

- `{{ .SiteURL }}` = Your site URL (https://bloompsychologynorthaustin.com)
- `/auth/callback` = Your callback endpoint
- `?token_hash={{ .TokenHash }}&type=signup` = Required parameters for confirmation
- No spaces after `=` signs
- Proper URL encoding

## Testing

After updating:
1. Sign up with a new email
2. Check email (including spam folder)
3. Click "Confirm My Email" button
4. Should redirect to your site and complete confirmation
5. Then redirect to onboarding

The beautiful design remains intact while fixing the technical issue!