-- Fix user_profiles RLS policies

-- Check current policies
\echo 'Current user_profiles policies:'
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'user_profiles';

-- Add missing CRUD policies for users on their own profiles
DO $$
BEGIN
    -- Users should be able to INSERT their own profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' 
        AND policyname = 'Users can insert own profile'
    ) THEN
        CREATE POLICY "Users can insert own profile" ON user_profiles
            FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
    
    -- Users should be able to SELECT their own profile  
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' 
        AND policyname = 'Users can view own profile'
    ) THEN
        CREATE POLICY "Users can view own profile" ON user_profiles
            FOR SELECT USING (auth.uid() = id);
    END IF;
    
    -- Service role should have full access
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_profiles' 
        AND policyname = 'Service role manages profiles'
    ) THEN
        CREATE POLICY "Service role manages profiles" ON user_profiles
            FOR ALL USING (auth.jwt()->>'role' = 'service_role');
    END IF;
END $$;

-- Grant necessary permissions
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_profiles TO service_role;