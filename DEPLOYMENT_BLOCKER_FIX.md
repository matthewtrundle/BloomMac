# 🚨 DEPLOYMENT BLOCKER - Critical Fix Required

## The Problem

1. **Current System**: Admin login uses `admin_users` table
2. **Our Secure Routes**: Expect `user_profiles` table with `role` column
3. **Result**: If deployed, admin login will be COMPLETELY BROKEN

## Immediate Fix Options

### Option 1: Update Secure Routes to Use admin_users (RECOMMENDED)
Keep the existing authentication flow working by updating our secure routes.

### Option 2: Migrate admin_users to user_profiles
More complex, requires frontend changes.

## Fix SQL Migration (Run This First)

```sql
-- Option 1: Make secure routes work with existing admin_users table
-- This preserves the current working system

-- 1. Create a view to unify admin_users with user_profiles
CREATE OR REPLACE VIEW unified_users AS
SELECT 
  au.id,
  au.email,
  au.name,
  au.role,
  'admin' as user_type,
  au.is_active,
  au.last_login as last_login_at
FROM admin_users au
WHERE au.is_active = true
UNION ALL
SELECT 
  up.id,
  up.email,
  up.full_name as name,
  COALESCE(up.role, 'user') as role,
  'user' as user_type,
  true as is_active,
  up.last_login_at
FROM user_profiles up;

-- 2. Update the checkUserRole function to check both tables
CREATE OR REPLACE FUNCTION check_user_role_unified(
  user_id UUID,
  required_role TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check admin_users first (existing system)
  IF EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id 
    AND role = required_role 
    AND is_active = true
  ) THEN
    RETURN true;
  END IF;
  
  -- Then check user_profiles (new system)
  IF EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id 
    AND role = required_role
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant permissions
GRANT EXECUTE ON FUNCTION check_user_role_unified TO anon;
GRANT EXECUTE ON FUNCTION check_user_role_unified TO authenticated;
```

## Update Secure Route Helper

```typescript
// lib/supabase-server.ts - UPDATE THIS FUNCTION
export async function checkUserRole(
  supabase: SupabaseClient,
  userId: string,
  requiredRole: string
): Promise<boolean> {
  // Use the unified function that checks both tables
  const { data, error } = await supabase
    .rpc('check_user_role_unified', {
      user_id: userId,
      required_role: requiredRole
    });
  
  return data === true;
}
```

## Testing Before Deployment

1. **Test Admin Login**:
   ```bash
   # In a test environment, verify admin can still login
   curl -X POST http://localhost:3000/api/admin/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@test.com","password":"testpass"}'
   ```

2. **Test Secure Routes**:
   ```bash
   # Test that admin routes work with the cookie
   curl http://localhost:3000/api/admin/contacts \
     -H "Cookie: adminToken=..."
   ```

## Safe Deployment Steps

1. **Run the SQL migration above** (creates unified view)
2. **Update the checkUserRole function** in lib/supabase-server.ts
3. **Deploy code WITH BOTH old and new routes** (transition period)
4. **Test thoroughly** before removing old routes
5. **Monitor logs** for any auth failures

## What NOT to Do

- ❌ DON'T delete admin_users table
- ❌ DON'T force migration to user_profiles yet
- ❌ DON'T deploy secure routes without this fix
- ❌ DON'T change frontend auth flow

## Long-term Plan (Phase 2)

After confirming everything works:
1. Gradually migrate admin_users data to user_profiles
2. Update frontend to use unified auth
3. Eventually deprecate admin_users table
4. Consolidate to single user management system

But for now, **we need to keep the existing system working!**