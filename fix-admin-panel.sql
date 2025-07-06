-- =====================================================
-- FIX ADMIN PANEL
-- This script ensures the admin panel works properly
-- =====================================================

-- 1. First, let's check if admin tables exist
DO $$
BEGIN
    -- Create admin_users table if it doesn't exist
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
    END IF;

    -- Create admin_activity_log table if it doesn't exist
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
    END IF;
END $$;

-- 2. Add any missing columns to admin_users
DO $$
BEGIN
    -- Add password_hash if missing (for backward compatibility)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'admin_users' 
                   AND column_name = 'password_hash') THEN
        ALTER TABLE public.admin_users ADD COLUMN password_hash text;
    END IF;
    
    -- Add permissions if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'admin_users' 
                   AND column_name = 'permissions') THEN
        ALTER TABLE public.admin_users ADD COLUMN permissions jsonb DEFAULT '[]'::jsonb;
    END IF;
END $$;

-- 3. Disable RLS on admin tables (admins need full access)
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log DISABLE ROW LEVEL SECURITY;

-- 4. Create or fix your admin user
-- First, check if you already have an admin account
DO $$
DECLARE
    v_user_id uuid;
    v_admin_email text := 'admin@bloompsychologynorthaustin.com';
BEGIN
    -- Check if admin user exists in auth.users
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = v_admin_email
    LIMIT 1;
    
    IF v_user_id IS NULL THEN
        -- Create new admin user in auth.users
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            aud,
            role
        ) VALUES (
            gen_random_uuid(),
            '00000000-0000-0000-0000-000000000000',
            v_admin_email,
            crypt('AdminPassword123!', gen_salt('bf')), -- CHANGE THIS PASSWORD!
            now(),
            now(),
            now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{}'::jsonb,
            'authenticated',
            'authenticated'
        ) RETURNING id INTO v_user_id;
        
        RAISE NOTICE 'Created new admin auth user with email: %', v_admin_email;
    END IF;
    
    -- Ensure admin_users record exists
    INSERT INTO public.admin_users (id, email, name, role, is_active)
    VALUES (v_user_id, v_admin_email, 'Admin', 'admin', true)
    ON CONFLICT (id) DO UPDATE
    SET is_active = true,
        role = 'admin',
        updated_at = now();
    
    RAISE NOTICE 'Admin user ready: %', v_admin_email;
END $$;

-- 5. Create a secondary admin (optional - uncomment if needed)
-- DO $$
-- DECLARE
--     v_user_id uuid;
--     v_admin_email text := 'matt@bloompsychologynorthaustin.com'; -- Change this
-- BEGIN
--     SELECT id INTO v_user_id
--     FROM auth.users
--     WHERE email = v_admin_email
--     LIMIT 1;
--     
--     IF v_user_id IS NOT NULL THEN
--         -- User exists, make them admin
--         INSERT INTO public.admin_users (id, email, name, role, is_active)
--         VALUES (v_user_id, v_admin_email, 'Matt', 'admin', true)
--         ON CONFLICT (id) DO UPDATE
--         SET is_active = true,
--             role = 'admin';
--         
--         RAISE NOTICE 'Made existing user an admin: %', v_admin_email;
--     END IF;
-- END $$;

-- 6. Grant necessary permissions
GRANT ALL ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_activity_log TO authenticated;

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_user_id ON public.admin_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON public.admin_activity_log(created_at DESC);

-- 8. Test queries to verify admin access
SELECT 
    'Admin Users' as table_name,
    COUNT(*) as count
FROM public.admin_users
WHERE is_active = true

UNION ALL

SELECT 
    'Contact Submissions' as table_name,
    COUNT(*) as count
FROM public.contact_submissions

UNION ALL

SELECT 
    'Subscribers' as table_name,
    COUNT(*) as count
FROM public.subscribers;

-- 9. Show admin credentials
SELECT 
    email,
    role,
    is_active,
    CASE 
        WHEN last_login IS NULL THEN 'Never logged in'
        ELSE 'Last login: ' || last_login::text
    END as login_status
FROM public.admin_users
ORDER BY created_at;

-- Final message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Admin panel fixes applied!';
    RAISE NOTICE '';
    RAISE NOTICE 'Default admin credentials:';
    RAISE NOTICE 'Email: admin@bloompsychologynorthaustin.com';
    RAISE NOTICE 'Password: AdminPassword123!';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Change this password immediately after logging in!';
    RAISE NOTICE '';
    RAISE NOTICE 'To make an existing user an admin:';
    RAISE NOTICE '1. Uncomment section 5 in this script';
    RAISE NOTICE '2. Change the email to the user you want';
    RAISE NOTICE '3. Run the script again';
END $$;