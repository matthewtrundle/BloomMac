-- Add missing fields to user_profiles table for complete profile management

-- Add emergency contact fields
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;

-- Add insurance information fields
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS insurance_provider TEXT,
ADD COLUMN IF NOT EXISTS insurance_member_id TEXT,
ADD COLUMN IF NOT EXISTS insurance_group_number TEXT;

-- Add profile photo URL (for future use)
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;

-- Add bio/about field
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Success message
SELECT 'Profile fields added successfully!' as result;