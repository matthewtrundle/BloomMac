-- Fix RLS Policies for user_profiles and user_achievements tables
-- This fixes the infinite recursion error causing 500 errors

-- IMPORTANT: Run this in your Supabase SQL Editor

-- Step 1: Fix user_profiles RLS policies
BEGIN;

-- Temporarily disable RLS to fix policies
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (including any we don't know about)
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_profiles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_profiles', pol.policyname);
    END LOOP;
END $$;

-- Create new, simple policies that won't cause recursion
CREATE POLICY "Enable read access for users to own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for users to own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for users to own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete for users to own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = id);

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

COMMIT;

-- Step 2: Fix user_achievements RLS policies
BEGIN;

-- Check if table exists first
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_achievements') THEN
        -- Disable RLS
        EXECUTE 'ALTER TABLE user_achievements DISABLE ROW LEVEL SECURITY';
        
        -- Drop all policies
        FOR pol IN 
            SELECT policyname 
            FROM pg_policies 
            WHERE tablename = 'user_achievements' AND schemaname = 'public'
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON user_achievements', pol.policyname);
        END LOOP;
        
        -- Create simple policies
        EXECUTE 'CREATE POLICY "Enable read access for users to own achievements" ON user_achievements
            FOR SELECT USING (auth.uid() = user_id)';
            
        EXECUTE 'CREATE POLICY "Enable insert for system to create achievements" ON user_achievements
            FOR INSERT WITH CHECK (auth.uid() = user_id)';
        
        -- Re-enable RLS
        EXECUTE 'ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY';
    END IF;
END $$;

COMMIT;

-- Step 3: Verify the policies are fixed
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'user_achievements')
ORDER BY tablename, policyname;