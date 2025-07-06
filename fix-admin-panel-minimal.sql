-- =====================================================
-- MINIMAL ADMIN PANEL FIX
-- Only creates what's missing, no bloat
-- =====================================================

-- First, run the check script to see current status
-- Then use this script to fix only what's needed

-- 1. Check current status
SELECT 
    'Current Admin Setup Status' as info,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_users') as admin_users_exists,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_activity_log') as activity_log_exists;

-- 2. Create tables ONLY if they don't exist
DO $$
BEGIN
    -- Create admin_users only if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = 'admin_users') THEN
        
        CREATE TABLE public.admin_users (
            id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email text UNIQUE NOT NULL,
            name text,
            role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
            is_active boolean DEFAULT true,
            last_login timestamp with time zone,
            created_at timestamp with time zone DEFAULT now(),
            updated_at timestamp with time zone DEFAULT now()
        );
        
        RAISE NOTICE '✅ Created admin_users table';
    ELSE
        RAISE NOTICE '⚠️  admin_users table already exists - skipping creation';
    END IF;

    -- Create admin_activity_log only if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = 'admin_activity_log') THEN
        
        CREATE TABLE public.admin_activity_log (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id uuid REFERENCES auth.users(id),
            action text NOT NULL,
            entity_type text,
            entity_id text,
            details jsonb DEFAULT '{}'::jsonb,
            created_at timestamp with time zone DEFAULT now()
        );
        
        -- Add index for performance
        CREATE INDEX idx_admin_activity_log_user_id ON public.admin_activity_log(user_id);
        CREATE INDEX idx_admin_activity_log_created_at ON public.admin_activity_log(created_at DESC);
        
        RAISE NOTICE '✅ Created admin_activity_log table';
    ELSE
        RAISE NOTICE '⚠️  admin_activity_log table already exists - skipping creation';
    END IF;
END $$;

-- 3. Check RLS status and fix if needed
DO $$
DECLARE
    v_rls_enabled boolean;
BEGIN
    -- Check RLS on admin_users
    SELECT rowsecurity INTO v_rls_enabled
    FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'admin_users';
    
    IF v_rls_enabled THEN
        ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE '✅ Disabled RLS on admin_users (admins need full access)';
    END IF;
    
    -- Check RLS on admin_activity_log
    SELECT rowsecurity INTO v_rls_enabled
    FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'admin_activity_log';
    
    IF v_rls_enabled THEN
        ALTER TABLE public.admin_activity_log DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE '✅ Disabled RLS on admin_activity_log';
    END IF;
END $$;

-- 4. Check if we need to create any admin users
DO $$
DECLARE
    v_admin_count integer;
    v_user_id uuid;
    v_email text;
BEGIN
    -- Count existing active admins
    SELECT COUNT(*) INTO v_admin_count 
    FROM public.admin_users 
    WHERE is_active = true;
    
    RAISE NOTICE 'Current active admin count: %', v_admin_count;
    
    IF v_admin_count = 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '⚠️  NO ACTIVE ADMINS FOUND!';
        RAISE NOTICE '';
        
        -- Check if any auth.users might be admins
        FOR v_user_id, v_email IN 
            SELECT id, email 
            FROM auth.users 
            WHERE email LIKE '%admin%' 
               OR email LIKE '%bloom%'
               OR email = 'mattrundle1@gmail.com' -- Add your email here
            ORDER BY created_at
            LIMIT 5
        LOOP
            RAISE NOTICE 'Potential admin found: % (%)', v_email, v_user_id;
        END LOOP;
        
        RAISE NOTICE '';
        RAISE NOTICE 'To make a user an admin, run:';
        RAISE NOTICE 'INSERT INTO public.admin_users (id, email, name, role, is_active)';
        RAISE NOTICE 'SELECT id, email, ''Admin'', ''admin'', true';
        RAISE NOTICE 'FROM auth.users';
        RAISE NOTICE 'WHERE email = ''your-email@example.com'';';
        
    ELSE
        -- List existing admins
        RAISE NOTICE '';
        RAISE NOTICE 'Existing admins:';
        FOR v_email IN 
            SELECT email FROM public.admin_users WHERE is_active = true
        LOOP
            RAISE NOTICE '  - %', v_email;
        END LOOP;
    END IF;
END $$;

-- 5. Quick verification
SELECT 
    'Admin System Status' as check_type,
    (SELECT COUNT(*) FROM public.admin_users WHERE is_active = true) as active_admins,
    (SELECT COUNT(*) FROM public.admin_activity_log) as activity_logs;

-- 6. Show next steps
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== NEXT STEPS ===';
    RAISE NOTICE '';
    RAISE NOTICE '1. If you need to make yourself an admin:';
    RAISE NOTICE '   INSERT INTO public.admin_users (id, email, name, role, is_active)';
    RAISE NOTICE '   SELECT id, email, ''Your Name'', ''admin'', true';
    RAISE NOTICE '   FROM auth.users WHERE email = ''your-email@example.com'';';
    RAISE NOTICE '';
    RAISE NOTICE '2. The admin panel expects these columns: id, email, name, role, is_active';
    RAISE NOTICE '   All are present in the table structure.';
    RAISE NOTICE '';
    RAISE NOTICE '3. Admin login URL: https://bloompsychologynorthaustin.com/admin/login';
END $$;