-- COMPLETE CLEANUP of all RLS policies to fix infinite recursion
-- This removes ALL policies and creates only the necessary ones

-- Step 1: Disable RLS and drop ALL policies for user_profiles
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop every single policy on user_profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable access to own profile only" ON user_profiles;
DROP POLICY IF EXISTS "Enable delete for users to own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for users to own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for users to own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users to own profile" ON user_profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON user_profiles;
DROP POLICY IF EXISTS "Service role manages profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;

-- Create ONLY the essential policies (no duplicates!)
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = id);

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 2: Do the same for user_achievements
ALTER TABLE user_achievements DISABLE ROW LEVEL SECURITY;

-- Drop all policies
DROP POLICY IF EXISTS "Admins view all achievements" ON user_achievements;
DROP POLICY IF EXISTS "Enable insert for system to create achievements" ON user_achievements;
DROP POLICY IF EXISTS "Enable read access for users to own achievements" ON user_achievements;
DROP POLICY IF EXISTS "System can award achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;

-- Create only essential policies
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Re-enable RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Step 3: Verify clean policies
SELECT 
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'user_achievements')
ORDER BY tablename, policyname;