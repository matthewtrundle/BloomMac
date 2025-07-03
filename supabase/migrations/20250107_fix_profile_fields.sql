-- Fix user_profiles table to ensure all fields needed by profile edit page exist
-- This migration adds any missing fields without affecting existing data

-- Add baby_due_date field if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS baby_due_date DATE;

-- Add timezone field if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'America/Chicago';

-- Add avatar field if it doesn't exist (from another migration)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Ensure all fields allow NULL values except the required ones (first_name, last_name)
-- This prevents "not-null constraint" errors when saving partial data
ALTER TABLE user_profiles 
ALTER COLUMN phone DROP NOT NULL,
ALTER COLUMN postpartum_date DROP NOT NULL,
ALTER COLUMN baby_due_date DROP NOT NULL,
ALTER COLUMN number_of_children DROP NOT NULL,
ALTER COLUMN emergency_contact_name DROP NOT NULL,
ALTER COLUMN emergency_contact_phone DROP NOT NULL,
ALTER COLUMN emergency_contact_relationship DROP NOT NULL,
ALTER COLUMN timezone DROP NOT NULL;

-- Set default values for numeric fields to prevent null issues
ALTER TABLE user_profiles 
ALTER COLUMN number_of_children SET DEFAULT 0;

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_postpartum_date ON user_profiles(postpartum_date) WHERE postpartum_date IS NOT NULL;

-- Success message
SELECT 'Profile fields fixed successfully! All fields are now nullable except first_name and last_name.' as result;