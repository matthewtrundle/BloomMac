-- Verify where user emails are stored
-- Run this in Supabase SQL Editor

-- 1. Check if user_profiles has email column
SELECT 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'email';

-- 2. Show all columns in user_profiles
SELECT 
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 3. Check a sample user to see where email is stored
-- First get a user ID from user_profiles
WITH sample_user AS (
    SELECT id FROM user_profiles LIMIT 1
)
SELECT 
    'user_profiles' as source,
    up.id,
    up.first_name,
    up.last_name,
    NULL as email
FROM user_profiles up
JOIN sample_user su ON up.id = su.id

UNION ALL

SELECT 
    'auth.users' as source,
    au.id,
    au.raw_user_meta_data->>'first_name' as first_name,
    au.raw_user_meta_data->>'last_name' as last_name,
    au.email
FROM auth.users au
JOIN sample_user su ON au.id = su.id;

-- 4. Count users in each table
SELECT 
    'user_profiles' as table_name,
    COUNT(*) as user_count
FROM user_profiles
UNION ALL
SELECT 
    'auth.users' as table_name,
    COUNT(*) as user_count
FROM auth.users;