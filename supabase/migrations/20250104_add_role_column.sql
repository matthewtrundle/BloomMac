-- Add role column to user_profiles table if it doesn't exist
-- This migration adds the role column with support for provider role

-- First, add the column if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student';

-- Now update the constraint to include 'provider' role
-- First drop the existing constraint if it exists
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- Add the new constraint with 'provider' included
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('student', 'instructor', 'admin', 'provider'));

-- Now you can update users to have the provider role
-- Example: UPDATE user_profiles SET role = 'provider' FROM auth.users WHERE user_profiles.id = auth.users.id AND auth.users.email = 'matthewtrundle@gmail.com';

-- Success message
SELECT 'Role column added/updated successfully! You can now set users as providers.' as result;