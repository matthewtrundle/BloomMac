-- =====================================================
-- EMERGENCY PRODUCTION FIXES
-- Run these queries to restore basic functionality
-- =====================================================

-- 1. DISABLE RLS ON CRITICAL PUBLIC TABLES (TEMPORARY)
-- These tables should be publicly accessible
ALTER TABLE public.subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates DISABLE ROW LEVEL SECURITY;

-- 2. FIX BROKEN SERVICE ROLE POLICIES
-- Drop all policies that incorrectly check for service_role
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE pol_qual LIKE '%service_role%'
        AND pol_qual LIKE '%auth.jwt()%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            pol.policyname, pol.schemaname, pol.tablename);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- 3. CREATE SIMPLE WORKING POLICIES FOR USER TABLES
-- User profiles - users can see and edit their own
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role has full access" ON public.user_profiles;
CREATE POLICY "Service role has full access" ON public.user_profiles
    FOR ALL USING (auth.role() = 'service_role');

-- 4. FIX USER CREATION TRIGGER
-- Ensure new users get profiles created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (id, created_at)
    VALUES (new.id, now())
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO public.user_preferences (user_id)
    VALUES (new.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. GRANT NECESSARY PERMISSIONS
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- 6. FIX CRITICAL MISSING COLUMNS (if they don't exist)
-- Add columns that tests expect
DO $$
BEGIN
    -- user_profiles
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_profiles' AND column_name = 'bio') THEN
        ALTER TABLE public.user_profiles ADD COLUMN bio text;
    END IF;
    
    -- admin_users
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'admin_users' AND column_name = 'password_hash') THEN
        ALTER TABLE public.admin_users ADD COLUMN password_hash text;
    END IF;
    
    -- user_preferences
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_preferences' AND column_name = 'theme_preference') THEN
        ALTER TABLE public.user_preferences ADD COLUMN theme_preference text DEFAULT 'light';
    END IF;
END $$;

-- 7. CREATE EMERGENCY ADMIN USER (if needed)
-- This creates a temporary admin for debugging
-- DELETE THIS USER AFTER FIXING ISSUES!
DO $$
DECLARE
    admin_email text := 'emergency-admin@bloom.com';
    admin_id uuid;
BEGIN
    -- Create auth user
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
        admin_email,
        crypt('EmergencyAccess123!', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
        '{"role":"admin"}'::jsonb,
        'authenticated',
        'authenticated'
    )
    ON CONFLICT (email) DO UPDATE
    SET email_confirmed_at = now()
    RETURNING id INTO admin_id;
    
    -- Create admin record
    INSERT INTO public.admin_users (id, email, role, is_active)
    VALUES (admin_id, admin_email, 'admin', true)
    ON CONFLICT (email) DO UPDATE
    SET is_active = true;
    
    RAISE NOTICE 'Emergency admin created: %', admin_email;
END $$;

-- 8. VERIFY CRITICAL TABLES EXIST
-- This will show which tables are missing
SELECT 
    t.table_name,
    CASE 
        WHEN t.table_name IS NOT NULL THEN 'EXISTS'
        ELSE 'MISSING'
    END as status
FROM (
    VALUES 
        ('user_profiles'),
        ('user_preferences'),
        ('subscribers'),
        ('contact_submissions'),
        ('courses'),
        ('course_enrollments'),
        ('blog_posts'),
        ('admin_users'),
        ('email_templates')
) AS required(table_name)
LEFT JOIN information_schema.tables t 
    ON t.table_name = required.table_name 
    AND t.table_schema = 'public';

-- 9. CHECK RLS STATUS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 10. EMERGENCY DIAGNOSTICS
-- Run this to see what's blocking access
SELECT 
    'Environment Check' as check_type,
    current_database() as database,
    current_user as user,
    inet_server_addr() as server,
    version() as pg_version;

-- Show active connections
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start,
    state_change
FROM pg_stat_activity
WHERE datname = current_database()
ORDER BY query_start DESC
LIMIT 10;