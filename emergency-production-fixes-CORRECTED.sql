-- =====================================================
-- EMERGENCY PRODUCTION FIXES (CORRECTED)
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
        WHERE qual LIKE '%service_role%'
        AND qual LIKE '%auth.jwt()%'
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

-- 6. CHECK AND FIX CRITICAL MISSING COLUMNS
-- Based on your production schema, let's add any missing columns

-- Check if bio column exists in user_profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'bio'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN bio text;
    END IF;
END $$;

-- Check if theme_preference exists in user_preferences
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_preferences' 
        AND column_name = 'theme_preference'
    ) THEN
        ALTER TABLE public.user_preferences ADD COLUMN theme_preference text DEFAULT 'light';
    END IF;
END $$;

-- 7. QUICK DIAGNOSTICS
-- Show which tables have RLS enabled
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN 'ENABLED'
        ELSE 'DISABLED'
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'subscribers', 
    'contact_submissions', 
    'blog_posts', 
    'user_profiles',
    'courses',
    'email_templates'
)
ORDER BY tablename;

-- Show count of policies per table
SELECT 
    tablename,
    COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- 8. TEST QUERIES
-- These should work after the fixes

-- Test 1: Can we insert into subscribers?
-- (This is what newsletter signup does)
INSERT INTO public.subscribers (email, source, subscribed, created_at)
VALUES ('test-' || NOW()::text || '@example.com', 'test', true, NOW())
ON CONFLICT (email) DO NOTHING;

-- Test 2: Can we read blog posts?
SELECT COUNT(*) as blog_count FROM public.blog_posts;

-- Test 3: Can we read courses?
SELECT COUNT(*) as course_count FROM public.courses;

-- Clean up test subscriber
DELETE FROM public.subscribers WHERE email LIKE 'test-%@example.com';

-- Final message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Emergency fixes applied!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Test newsletter signup on your website';
    RAISE NOTICE '2. Test contact form submission';
    RAISE NOTICE '3. Check if blog posts are loading';
    RAISE NOTICE '4. Try user registration';
    RAISE NOTICE '';
    RAISE NOTICE 'If these work, we can proceed with re-enabling RLS properly.';
END $$;