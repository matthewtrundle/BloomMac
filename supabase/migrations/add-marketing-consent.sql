-- Add marketing_consent field to user_profiles table
-- This stores whether users opted in to receive marketing emails during onboarding

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT FALSE;

-- Add an index for querying users who have opted in
CREATE INDEX IF NOT EXISTS idx_user_profiles_marketing_consent 
ON user_profiles(marketing_consent) 
WHERE marketing_consent = TRUE;

-- Add comment explaining the field
COMMENT ON COLUMN user_profiles.marketing_consent IS 
'User consent for marketing communications collected during onboarding. When true, user is subscribed to newsletter.';