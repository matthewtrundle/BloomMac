-- Check Admin Tables Status Script
-- This script checks the current state of admin-related tables without making any changes

-- 1. Check if admin_users table exists and show its structure
SELECT '=== Checking admin_users table ===' as check_status;

SELECT 
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
    ) as admin_users_exists;

-- If admin_users exists, show its structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'admin_users'
ORDER BY ordinal_position;

-- 2. Check if admin_activity_log table exists and show its structure
SELECT '=== Checking admin_activity_log table ===' as check_status;

SELECT 
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_activity_log'
    ) as admin_activity_log_exists;

-- If admin_activity_log exists, show its structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'admin_activity_log'
ORDER BY ordinal_position;

-- 3. Count of existing admin users (if table exists)
SELECT '=== Count of admin users ===' as check_status;

-- This will only work if admin_users table exists
-- If it doesn't exist, this query will fail (which is informative)
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
    ) THEN
        RAISE NOTICE 'Admin users count: %', (SELECT COUNT(*) FROM public.admin_users);
    ELSE
        RAISE NOTICE 'admin_users table does not exist';
    END IF;
END $$;

-- 4. List all admin-related tables
SELECT '=== All admin-related tables ===' as check_status;

SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_name LIKE '%admin%'
AND table_schema NOT IN ('information_schema', 'pg_catalog')
ORDER BY table_schema, table_name;

-- 5. Check auth.users for potential admin users
SELECT '=== Checking auth.users for potential admins ===' as check_status;

-- Look for users that might be admins based on email patterns or metadata
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at,
    raw_app_meta_data->>'role' as metadata_role,
    raw_user_meta_data->>'full_name' as full_name,
    CASE 
        WHEN email LIKE '%admin%' THEN 'Email contains "admin"'
        WHEN email LIKE '%@bloom%' THEN 'Bloom domain email'
        WHEN raw_app_meta_data->>'role' = 'admin' THEN 'Has admin role in metadata'
        ELSE 'Regular user'
    END as admin_indicator
FROM auth.users
WHERE 
    email LIKE '%admin%' 
    OR email LIKE '%@bloom%'
    OR raw_app_meta_data->>'role' = 'admin'
    OR raw_app_meta_data->>'is_admin' = 'true'
ORDER BY created_at;

-- Also show total count of auth.users
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email LIKE '%admin%' THEN 1 END) as users_with_admin_in_email,
    COUNT(CASE WHEN raw_app_meta_data->>'role' = 'admin' THEN 1 END) as users_with_admin_role
FROM auth.users;

-- 6. Check for any RLS policies mentioning admin
SELECT '=== RLS policies mentioning admin ===' as check_status;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE 
    policyname LIKE '%admin%'
    OR qual::text LIKE '%admin%'
    OR with_check::text LIKE '%admin%'
ORDER BY schemaname, tablename, policyname;

-- 7. Check for any functions related to admin
SELECT '=== Functions related to admin ===' as check_status;

SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_function_result(p.oid) as result_type,
    pg_get_function_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE 
    p.proname LIKE '%admin%'
    AND n.nspname NOT IN ('pg_catalog', 'information_schema')
ORDER BY n.nspname, p.proname;

-- 8. Check if there's a user_roles or roles table
SELECT '=== Checking for roles tables ===' as check_status;

SELECT 
    table_schema,
    table_name
FROM information_schema.tables
WHERE 
    (table_name LIKE '%role%' OR table_name LIKE '%permission%')
    AND table_schema NOT IN ('information_schema', 'pg_catalog')
ORDER BY table_schema, table_name;

-- Summary
SELECT '=== Summary ===' as check_status;
SELECT 
    'Run this script in your production database to gather information about admin tables and users' as instructions,
    'No changes will be made - this is read-only' as safety_note;