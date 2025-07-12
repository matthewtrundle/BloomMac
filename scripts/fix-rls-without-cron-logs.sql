-- ============================================
-- FIX RLS ON EXISTING TABLES (Without cron_logs)
-- Run this if you get "relation does not exist" for cron_logs
-- ============================================

-- 1. Enable RLS on confirmed existing tables (skip cron_logs for now)
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- 2. Try to handle cron_logs separately (it might be in different schema or have issues)
DO $$ 
BEGIN
    -- Check if cron_logs exists and enable RLS if it does
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cron_logs') THEN
        EXECUTE 'ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY';
        RAISE NOTICE 'Enabled RLS on cron_logs';
    ELSE
        RAISE NOTICE 'Table cron_logs not found, skipping';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not enable RLS on cron_logs: %', SQLERRM;
END $$;

-- 3. Create service role policies for main tables
DROP POLICY IF EXISTS "email_logs_service_role" ON public.email_logs;
CREATE POLICY "email_logs_service_role" ON public.email_logs
    FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "email_analytics_service_role" ON public.email_analytics;
CREATE POLICY "email_analytics_service_role" ON public.email_analytics
    FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "career_applications_service_role" ON public.career_applications;
CREATE POLICY "career_applications_service_role" ON public.career_applications
    FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "system_settings_service_role" ON public.system_settings;
CREATE POLICY "system_settings_service_role" ON public.system_settings
    FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "user_achievements_service_role" ON public.user_achievements;
CREATE POLICY "user_achievements_service_role" ON public.user_achievements
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 4. Try to add cron_logs service policy if table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cron_logs') THEN
        EXECUTE 'DROP POLICY IF EXISTS "cron_logs_service_role" ON public.cron_logs';
        EXECUTE 'CREATE POLICY "cron_logs_service_role" ON public.cron_logs FOR ALL TO service_role USING (true) WITH CHECK (true)';
        RAISE NOTICE 'Added service role policy to cron_logs';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not add policy to cron_logs: %', SQLERRM;
END $$;

-- 5. Add user-specific policies
DROP POLICY IF EXISTS "users_view_own_achievements" ON public.user_achievements;
CREATE POLICY "users_view_own_achievements" ON public.user_achievements
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_achievements" ON public.user_achievements;
CREATE POLICY "users_insert_own_achievements" ON public.user_achievements
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "public_submit_applications" ON public.career_applications;
CREATE POLICY "public_submit_applications" ON public.career_applications
    FOR INSERT TO anon WITH CHECK (true);

-- 6. Add admin policies
DROP POLICY IF EXISTS "admins_select_email_logs" ON public.email_logs;
CREATE POLICY "admins_select_email_logs" ON public.email_logs
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

DROP POLICY IF EXISTS "admins_select_email_analytics" ON public.email_analytics;
CREATE POLICY "admins_select_email_analytics" ON public.email_analytics
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

DROP POLICY IF EXISTS "admins_all_career_applications" ON public.career_applications;
CREATE POLICY "admins_all_career_applications" ON public.career_applications
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

DROP POLICY IF EXISTS "admins_all_system_settings" ON public.system_settings;
CREATE POLICY "admins_all_system_settings" ON public.system_settings
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

-- 7. Try to add admin policy for cron_logs if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cron_logs') THEN
        EXECUTE 'DROP POLICY IF EXISTS "admins_select_cron_logs" ON public.cron_logs';
        EXECUTE 'CREATE POLICY "admins_select_cron_logs" ON public.cron_logs
            FOR SELECT TO authenticated
            USING (EXISTS (
                SELECT 1 FROM user_profiles
                WHERE user_profiles.id = auth.uid()
                AND user_profiles.role = ''admin''
            ))';
        RAISE NOTICE 'Added admin policy to cron_logs';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not add admin policy to cron_logs: %', SQLERRM;
END $$;

-- 8. Verify RLS is enabled (excluding cron_logs if it's problematic)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'email_logs',
    'email_analytics',
    'career_applications',
    'system_settings',
    'user_achievements'
);
-- All should show rowsecurity = true

-- 9. Check cron_logs status separately
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cron_logs')
        THEN 'Table cron_logs exists'
        ELSE 'Table cron_logs does not exist'
    END as cron_logs_status;