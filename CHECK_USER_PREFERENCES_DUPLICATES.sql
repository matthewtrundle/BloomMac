-- Check for duplicate user_preferences
SELECT 
    user_id, 
    COUNT(*) as count
FROM user_preferences
GROUP BY user_id
HAVING COUNT(*) > 1;

-- Check current user's preferences
SELECT * FROM user_preferences 
WHERE user_id = '2a6835a5-6041-463f-b6bb-f6c5d38bea59';

-- Check constraints on the table
SELECT
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'user_preferences'::regclass;