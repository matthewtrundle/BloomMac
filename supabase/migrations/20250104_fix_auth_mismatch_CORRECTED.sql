-- Fix Authentication Mismatch - CORRECTED VERSION
-- This fixes the email column issue

-- 1. Create a view to unify admin_users with user_profiles
DROP VIEW IF EXISTS unified_users CASCADE;
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
  auth_user.email, -- Get email from auth.users table!
  CONCAT(up.first_name, ' ', up.last_name) as name,
  COALESCE(up.role, 'user') as role,
  'user' as user_type,
  true as is_active,
  up.last_login_at
FROM user_profiles up
JOIN auth.users auth_user ON auth_user.id = up.id; -- Join to get email

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
  
  -- Also check if admin_users has 'admin' or 'super_admin' role for any admin check
  IF required_role IN ('admin', 'super_admin') THEN
    IF EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = user_id 
      AND role IN ('admin', 'super_admin')
      AND is_active = true
    ) THEN
      RETURN true;
    END IF;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create helper function to get user info from either table
CREATE OR REPLACE FUNCTION get_user_info(user_id UUID)
RETURNS TABLE(
  id UUID,
  email TEXT,
  name TEXT,
  role TEXT,
  user_type TEXT
) AS $$
BEGIN
  -- First check admin_users
  IF EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = user_id) THEN
    RETURN QUERY
    SELECT 
      au.id,
      au.email,
      au.name,
      au.role,
      'admin'::TEXT as user_type
    FROM admin_users au
    WHERE au.id = user_id;
  ELSE
    -- Then check user_profiles (join with auth.users for email)
    RETURN QUERY
    SELECT 
      up.id,
      auth_user.email,
      CONCAT(up.first_name, ' ', up.last_name) as name,
      COALESCE(up.role, 'user') as role,
      'user'::TEXT as user_type
    FROM user_profiles up
    JOIN auth.users auth_user ON auth_user.id = up.id
    WHERE up.id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Grant permissions
GRANT EXECUTE ON FUNCTION check_user_role_unified TO anon;
GRANT EXECUTE ON FUNCTION check_user_role_unified TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_info TO anon;
GRANT EXECUTE ON FUNCTION get_user_info TO authenticated;
GRANT SELECT ON unified_users TO authenticated;

-- 5. Update RLS policies to work with both tables
-- For admin_activity_log
DROP POLICY IF EXISTS "Admins can view activity log" ON admin_activity_log;
CREATE POLICY "Admins can view activity log" ON admin_activity_log
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM admin_users WHERE role IN ('admin', 'super_admin') AND is_active = true
      UNION
      SELECT id FROM user_profiles WHERE role IN ('admin', 'super_admin')
    )
  );

-- For conversion_events
DROP POLICY IF EXISTS "Admins can view conversion events" ON conversion_events;
CREATE POLICY "Admins can view conversion events" ON conversion_events
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM admin_users WHERE role IN ('admin', 'super_admin') AND is_active = true
      UNION
      SELECT id FROM user_profiles WHERE role IN ('admin', 'super_admin')
    )
  );

-- For newsletter_sends
DROP POLICY IF EXISTS "Admins can manage newsletter sends" ON newsletter_sends;
CREATE POLICY "Admins can manage newsletter sends" ON newsletter_sends
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM admin_users WHERE role IN ('admin', 'super_admin') AND is_active = true
      UNION
      SELECT id FROM user_profiles WHERE role IN ('admin', 'super_admin')
    )
  );

-- For chatbot_interactions
DROP POLICY IF EXISTS "Admins can view chatbot interactions" ON chatbot_interactions;
CREATE POLICY "Admins can view chatbot interactions" ON chatbot_interactions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM admin_users WHERE role IN ('admin', 'super_admin') AND is_active = true
      UNION
      SELECT id FROM user_profiles WHERE role IN ('admin', 'super_admin')
    )
  );

-- For email_sends
DROP POLICY IF EXISTS "System can manage email sends" ON email_sends;
DROP POLICY IF EXISTS "Admins can manage email sends" ON email_sends;
CREATE POLICY "Admins can manage email sends" ON email_sends
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM admin_users WHERE role IN ('admin', 'super_admin') AND is_active = true
      UNION
      SELECT id FROM user_profiles WHERE role IN ('admin', 'super_admin')
    )
  );

-- Success message
DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Auth Mismatch Fix Applied Successfully!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'FIXED: user_profiles email issue';
  RAISE NOTICE '  - Now joins with auth.users to get email';
  RAISE NOTICE '  - Uses CONCAT for full name';
  RAISE NOTICE '';
  RAISE NOTICE 'The system now works with BOTH:';
  RAISE NOTICE '  - admin_users (has email column)';
  RAISE NOTICE '  - user_profiles (gets email from auth.users)';
  RAISE NOTICE '==============================================';
END $$;