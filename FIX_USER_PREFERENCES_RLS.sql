-- Fix user_preferences RLS policies
-- Remove duplicate and incorrect policies

-- 1. Drop ALL existing policies
DROP POLICY IF EXISTS "Admins view all preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can modify their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can view their own preferences" ON user_preferences;

-- 2. Create clean policies for authenticated users

-- Users can view their own preferences
CREATE POLICY "Users can view own preferences" 
ON user_preferences FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences" 
ON user_preferences FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences" 
ON user_preferences FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own preferences (optional)
CREATE POLICY "Users can delete own preferences" 
ON user_preferences FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- 3. Ensure RLS is enabled
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- 4. Create a helper function to upsert preferences
CREATE OR REPLACE FUNCTION upsert_user_preferences(
  p_user_id UUID,
  p_preferences JSONB
)
RETURNS user_preferences AS $$
DECLARE
  v_result user_preferences;
BEGIN
  INSERT INTO user_preferences (
    user_id,
    privacy_settings,
    notification_preferences,
    communication_preferences,
    reminder_settings,
    theme_preference,
    updated_at
  )
  VALUES (
    p_user_id,
    COALESCE(p_preferences->>'privacy_settings', '{}')::jsonb,
    COALESCE(p_preferences->>'notification_preferences', '{}')::jsonb,
    COALESCE(p_preferences->>'communication_preferences', '{}')::jsonb,
    COALESCE(p_preferences->>'reminder_settings', '{}')::jsonb,
    COALESCE(p_preferences->>'theme_preference', 'light'),
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    privacy_settings = EXCLUDED.privacy_settings,
    notification_preferences = EXCLUDED.notification_preferences,
    communication_preferences = EXCLUDED.communication_preferences,
    reminder_settings = EXCLUDED.reminder_settings,
    theme_preference = EXCLUDED.theme_preference,
    updated_at = NOW()
  RETURNING * INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION upsert_user_preferences(UUID, JSONB) TO authenticated;

-- Test message
DO $$
BEGIN
  RAISE NOTICE 'user_preferences RLS policies have been fixed!';
  RAISE NOTICE 'Authenticated users can now manage their preferences';
END $$;