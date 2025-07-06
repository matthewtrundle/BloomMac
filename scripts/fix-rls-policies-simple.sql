-- Fix RLS Policies for user_profiles and user_achievements tables
-- Simplified version for psql command line

-- Fix user_profiles RLS policies
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for users to own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users to own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for users to own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable delete for users to own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Service role has full access" ON user_profiles;

CREATE POLICY "Enable read access for users to own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for users to own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for users to own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete for users to own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = id);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Fix user_achievements RLS policies (if table exists)
ALTER TABLE user_achievements DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for users to own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Enable insert for system to create achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON user_achievements;

CREATE POLICY "Enable read access for users to own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for system to create achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Show the results
SELECT 
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'user_achievements')
ORDER BY tablename, policyname;