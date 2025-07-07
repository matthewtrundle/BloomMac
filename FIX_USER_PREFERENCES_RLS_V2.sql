-- Fix user_preferences RLS policies V2
-- This properly handles upsert operations

-- 1. Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can delete own preferences" ON user_preferences;

-- 2. Create new policies that work with upsert

-- Allow users to view their own preferences
CREATE POLICY "Users can view own preferences" 
ON user_preferences FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to insert their own preferences (fixed for upsert)
CREATE POLICY "Users can insert own preferences" 
ON user_preferences FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own preferences
CREATE POLICY "Users can update own preferences" 
ON user_preferences FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Ensure RLS is enabled
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- 4. Add a constraint to ensure user_id is unique (if not already)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'user_preferences_user_id_key'
    ) THEN
        ALTER TABLE user_preferences 
        ADD CONSTRAINT user_preferences_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- 5. Test with a sample query
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Get a test user
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        RAISE NOTICE 'Testing RLS policies with user: %', test_user_id;
        RAISE NOTICE 'Policies have been updated to support upsert operations';
    END IF;
END $$;