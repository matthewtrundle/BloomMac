# 🔍 Phase 1 Audit - Issues Found

## 🚨 Critical Issues to Fix

### 1. **User Profiles Table Structure Mismatch**
- **Issue**: `user_profiles` has NO email column, but several secure routes assume it does
- **Impact**: User-related routes that try to access `user_profiles.email` will fail
- **Found in**: 
  - `/app/api/profile/save/route-secure.ts`
  - `/app/api/profile/update/route-secure.ts`
  - User newsletter preference routes
- **Fix**: Routes must JOIN with `auth.users` to get email

### 2. **Career Applications Table is Empty**
- **Issue**: We created routes for career applications but table has 0 rows
- **Impact**: Admin career management routes exist but no data to manage
- **Routes affected**:
  - `/app/api/admin/careers/route-secure.ts`
  - `/app/api/admin/careers/[id]/route-secure.ts`
  - `/app/api/careers/apply/route-secure.ts`
- **Question**: Is this feature actually used? Frontend might use different system

### 3. **Multiple Email Systems Confusion**
- **Current state**:
  - `email_queue` (0 rows) - Original system?
  - `email_sends` (0 rows) - We created this
  - `email_logs` (1 row) - Has some data
  - `email_templates` (3 rows) - Has templates
- **Issue**: Unclear which table the app actually uses for email
- **Impact**: Email analytics and tracking routes might be looking at wrong tables

### 4. **Admin Activity Log Missing user_id**
- **Issue**: `admin_activity_log` doesn't have `user_id` column populated (shows in query but might be NULL)
- **Impact**: Can't track which admin performed actions
- **Check needed**: Verify if user_id is being set in new secure routes

## ⚠️ Routes That Need Review

### 1. **Profile Management Routes**
```typescript
// These assume user_profiles has email
/app/api/profile/save/route-secure.ts
/app/api/profile/update/route-secure.ts
```
**Fix**: Need to JOIN with auth.users or remove email references

### 2. **Career Application Routes**
```typescript
/app/api/admin/careers/route-secure.ts
/app/api/admin/careers/[id]/route-secure.ts
/app/api/careers/apply/route-secure.ts
```
**Question**: Are these actually used? Table is empty

### 3. **Email Analytics Routes**
```typescript
/pages/api/email-analytics-secure.ts
/pages/api/track-email-open-secure.ts
/pages/api/track-email-click-secure.ts
```
**Issue**: Which email table should these use?

### 4. **Newsletter Admin Route**
```typescript
/pages/api/newsletter-admin-secure.ts
```
**Check**: Does it correctly handle subscriber table structure?

## ✅ Routes That Should Work

### 1. **Admin Authentication** (Fixed with unified auth)
- `/app/api/admin/auth/login/route-secure.ts`
- `/app/api/admin/auth/logout/route-secure.ts`
- `/app/api/admin/auth/session/route-secure.ts`

### 2. **Contact Submissions** (Table has correct data)
- `/app/api/contact/submit/route-secure.ts`
- `/app/api/admin/contacts/route-secure.ts`
- `/app/api/admin/contacts/[id]/route-secure.ts`

### 3. **Analytics Tracking** (Table actively used)
- `/pages/api/track-event-secure.ts`
- `/pages/api/analytics-secure.ts`

### 4. **Newsletter Signup** (Subscribers table has data)
- `/pages/api/newsletter-signup-secure.ts`
- `/app/api/unsubscribe/route-secure.ts`

## 🔧 Required Fixes

### 1. Fix User Profile Routes
```sql
-- Add function to get user with email
CREATE OR REPLACE FUNCTION get_user_with_email(user_id UUID)
RETURNS TABLE(
  id UUID,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  role TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    au.email,
    up.first_name,
    up.last_name,
    CONCAT(up.first_name, ' ', up.last_name) as full_name,
    COALESCE(up.role, 'user') as role,
    up.created_at
  FROM user_profiles up
  JOIN auth.users au ON au.id = up.id
  WHERE up.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Check Career Applications Usage
- Search frontend for career application forms
- Check if this feature is actually implemented
- Consider removing if unused

### 3. Clarify Email System
- Check which email table the frontend actually uses
- Consolidate to single email tracking system
- Update routes to use correct table

### 4. Test Each Secure Route
Create test script to verify each endpoint works correctly

## 📊 Database State Summary

| Feature | Table | Rows | Status |
|---------|-------|------|--------|
| Admin Auth | admin_users | 2 | ✅ Working |
| User Profiles | user_profiles | 2 | ⚠️ No email column |
| Contacts | contact_submissions | 6 | ✅ Working |
| Careers | career_applications | 0 | ❓ Unused? |
| Newsletter | subscribers | 19 | ✅ Working |
| Analytics | analytics_events | 3875 | ✅ Working |
| Email Queue | email_queue | 0 | ❓ Which to use? |
| Email Sends | email_sends | 0 | ❓ Which to use? |
| Email Logs | email_logs | 1 | ❓ Which to use? |

## 🚀 Next Steps

1. **Fix user profile email issue** in all profile-related routes
2. **Determine which email table to use** and update routes
3. **Verify career applications** are actually used
4. **Test each secure route** with actual data
5. **Remove or fix unused features**