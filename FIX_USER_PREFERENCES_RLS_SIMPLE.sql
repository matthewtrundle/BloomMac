-- Simple RLS fix for user_preferences
-- This creates the most basic working policies

-- 1. First check current state
SELECT 
    schemaname,
    tablename,
    policyname,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_preferences';

-- 2. Drop all existing policies (clean slate)
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can delete own preferences" ON user_preferences;

-- 3. Enable RLS (in case it's disabled)
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- 4. Create simple, working policies
-- View own preferences
CREATE POLICY "allow_select_own" 
ON user_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

-- Insert own preferences
CREATE POLICY "allow_insert_own" 
ON user_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update own preferences  
CREATE POLICY "allow_update_own"
ON user_preferences
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Delete own preferences (optional)
CREATE POLICY "allow_delete_own"
ON user_preferences
FOR DELETE
USING (auth.uid() = user_id);

-- 5. Grant table permissions to authenticated users
GRANT ALL ON user_preferences TO authenticated;

-- 6. Verify policies were created
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'user_preferences'
ORDER BY policyname;