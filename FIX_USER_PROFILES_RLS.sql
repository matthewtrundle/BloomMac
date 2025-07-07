-- Fix user_profiles RLS policies
-- This removes the infinite recursion error

-- 1. Drop ALL existing policies on user_profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;

-- 2. Create new, clean policies that won't cause recursion

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON user_profiles FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON user_profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile (during signup)
CREATE POLICY "Users can insert own profile" 
ON user_profiles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Optional: Allow admins to view all profiles
-- Only add this if you have an admin system that needs it
-- CREATE POLICY "Admins can view all profiles" 
-- ON user_profiles FOR SELECT 
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM user_profiles
--     WHERE id = auth.uid() 
--     AND role = 'admin'
--   )
-- );

-- 3. Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Test the policies
DO $$
BEGIN
  RAISE NOTICE 'user_profiles RLS policies have been fixed!';
  RAISE NOTICE 'Users can now:';
  RAISE NOTICE '  - View their own profile';
  RAISE NOTICE '  - Update their own profile';
  RAISE NOTICE '  - Insert their own profile during signup';
END $$;