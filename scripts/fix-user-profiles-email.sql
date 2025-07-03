-- First, let's check if there's an email column in user_profiles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'email';

-- If the above query returns a row, then email column exists and needs to be removed
-- IMPORTANT: Only run the ALTER TABLE command if email column exists!

-- Step 1: Backup any email data (just in case)
-- This will show any existing email data before removal
SELECT id, email 
FROM user_profiles 
WHERE email IS NOT NULL 
LIMIT 10;

-- Step 2: Remove the email column from user_profiles
-- UNCOMMENT AND RUN ONLY IF EMAIL COLUMN EXISTS:
-- ALTER TABLE user_profiles DROP COLUMN IF EXISTS email;

-- Step 3: Verify the column is gone
-- Run this after the ALTER TABLE to confirm
-- SELECT column_name 
-- FROM information_schema.columns 
-- WHERE table_name = 'user_profiles' 
-- ORDER BY ordinal_position;

-- Note: Email should ONLY exist in auth.users table, not in user_profiles
-- The user_profiles table should reference auth.users via the id column