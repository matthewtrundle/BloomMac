-- 🚨 URGENT FIX: Remove incorrectly added email column from user_profiles
-- 
-- The error "Required field missing: email" indicates someone added an email
-- column to user_profiles. This is WRONG - email should only be in auth.users
--
-- Run this SQL in your Supabase SQL Editor to fix the issue:

-- 1. First verify the problem exists:
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'email';

-- If the above returns a row, then proceed with the fix:

-- 2. Remove the incorrect email column:
ALTER TABLE user_profiles DROP COLUMN IF EXISTS email;

-- 3. Verify the fix worked:
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- The above should NOT show an email column anymore.
-- Email is correctly stored in auth.users and accessed via:
-- auth.users.email (using the id relationship)