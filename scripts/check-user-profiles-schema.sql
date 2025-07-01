-- Check the actual structure of user_profiles table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

-- Also show any existing user_profiles records to understand the structure
SELECT * FROM user_profiles LIMIT 3;