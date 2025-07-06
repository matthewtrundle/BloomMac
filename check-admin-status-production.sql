-- =====================================================
-- CHECK ADMIN STATUS - PRODUCTION
-- This script checks existing admin setup without making changes
-- =====================================================

-- 1. Check if admin tables exist
SELECT 
    'admin_users' as table_name,
    EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
    ) as exists
UNION ALL
SELECT 
    'admin_activity_log' as table_name,
    EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_activity_log'
    ) as exists;

-- 2. If admin_users exists, show its structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'admin_users'
ORDER BY ordinal_position;

-- 3. Count existing admin users (safe - won't error if table doesn't exist)
DO $$
DECLARE
    v_count integer;
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'admin_users') THEN
        SELECT COUNT(*) INTO v_count FROM public.admin_users;
        RAISE NOTICE 'Existing admin users: %', v_count;
        
        -- List admin emails
        FOR v_count IN 
            SELECT email, is_active, last_login 
            FROM public.admin_users 
            ORDER BY created_at
        LOOP
            RAISE NOTICE 'Admin: % (Active: %, Last Login: %)', 
                v_count.email, v_count.is_active, v_count.last_login;
        END LOOP;
    ELSE
        RAISE NOTICE 'admin_users table does not exist';
    END IF;
END $$;

-- 4. Check auth.users for potential admins
SELECT 
    'Potential admins in auth.users' as check_type,
    COUNT(*) as count
FROM auth.users
WHERE email LIKE '%admin%'
   OR email LIKE '%bloom%'
   OR raw_user_meta_data->>'role' = 'admin'
   OR raw_app_meta_data->>'role' = 'admin';

-- 5. List specific users that might need admin access
SELECT 
    id,
    email,
    created_at,
    CASE 
        WHEN raw_user_meta_data->>'role' = 'admin' THEN 'Has admin in metadata'
        WHEN email LIKE '%admin%' THEN 'Has admin in email'
        WHEN email LIKE '%bloom%' THEN 'Bloom domain email'
        ELSE 'Other'
    END as reason
FROM auth.users
WHERE email LIKE '%admin%'
   OR email LIKE '%bloom%'
   OR raw_user_meta_data->>'role' = 'admin'
   OR raw_app_meta_data->>'role' = 'admin'
ORDER BY created_at;

-- 6. Check RLS status on admin tables
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('admin_users', 'admin_activity_log');

-- 7. Check if there are any orphaned admin records
-- (admin_users records without matching auth.users)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'admin_users') THEN
        PERFORM 1 FROM public.admin_users a
        LEFT JOIN auth.users u ON a.id = u.id
        WHERE u.id IS NULL;
        
        IF FOUND THEN
            RAISE NOTICE 'WARNING: Found admin_users records without matching auth.users records';
        END IF;
    END IF;
END $$;

-- 8. Summary
SELECT 
    '=== ADMIN STATUS SUMMARY ===' as info;

-- Show what needs to be done
DO $$
DECLARE
    v_admin_users_exists boolean;
    v_admin_activity_log_exists boolean;
    v_admin_count integer := 0;
BEGIN
    -- Check tables
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'admin_users'
    ) INTO v_admin_users_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'admin_activity_log'
    ) INTO v_admin_activity_log_exists;
    
    -- Count admins if table exists
    IF v_admin_users_exists THEN
        SELECT COUNT(*) INTO v_admin_count FROM public.admin_users WHERE is_active = true;
    END IF;
    
    -- Report findings
    RAISE NOTICE '';
    RAISE NOTICE '=== FINDINGS ===';
    RAISE NOTICE 'admin_users table exists: %', v_admin_users_exists;
    RAISE NOTICE 'admin_activity_log table exists: %', v_admin_activity_log_exists;
    RAISE NOTICE 'Active admin users: %', v_admin_count;
    RAISE NOTICE '';
    
    -- Recommendations
    RAISE NOTICE '=== RECOMMENDATIONS ===';
    
    IF NOT v_admin_users_exists THEN
        RAISE NOTICE '✅ Need to CREATE admin_users table';
    ELSE
        RAISE NOTICE '⚠️  admin_users table already exists - no need to create';
    END IF;
    
    IF NOT v_admin_activity_log_exists THEN
        RAISE NOTICE '✅ Need to CREATE admin_activity_log table';
    ELSE
        RAISE NOTICE '⚠️  admin_activity_log table already exists - no need to create';
    END IF;
    
    IF v_admin_count = 0 AND v_admin_users_exists THEN
        RAISE NOTICE '✅ Need to INSERT admin user records';
    ELSIF v_admin_count > 0 THEN
        RAISE NOTICE '⚠️  Already have % active admin(s) - check if you need more', v_admin_count;
    END IF;
END $$;