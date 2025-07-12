🔍 Analyzing current database state and generating valid SQL...

-- ============================================
-- VERIFIED SQL SCRIPT FOR YOUR DATABASE
-- Generated after checking actual state
-- ============================================

-- Table email_logs exists
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Table email_analytics exists
ALTER TABLE public.email_analytics ENABLE ROW LEVEL SECURITY;

-- Table career_applications exists
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- Table system_settings exists
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Table user_achievements exists
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;


-- Add service role policies (ALWAYS drop first to avoid duplicates)
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

DROP POLICY IF EXISTS "cron_logs_service_role" ON public.cron_logs;
CREATE POLICY "cron_logs_service_role" ON public.cron_logs
    FOR ALL TO service_role USING (true) WITH CHECK (true);


-- Add specific policies
-- User achievements policies
DROP POLICY IF EXISTS "users_view_own_achievements" ON public.user_achievements;
CREATE POLICY "users_view_own_achievements" ON public.user_achievements
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert_own_achievements" ON public.user_achievements;
CREATE POLICY "users_insert_own_achievements" ON public.user_achievements
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Career applications - public can submit
DROP POLICY IF EXISTS "public_submit_applications" ON public.career_applications;
CREATE POLICY "public_submit_applications" ON public.career_applications
    FOR INSERT TO anon WITH CHECK (true);

-- Admin policies
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

DROP POLICY IF EXISTS "admins_select_cron_logs" ON public.cron_logs;
CREATE POLICY "admins_select_cron_logs" ON public.cron_logs
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));


-- Verify everything worked
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'email_logs',
    'email_analytics',
    'career_applications',
    'system_settings',
    'user_achievements',
    'cron_logs'
);
-- All should show rowsecurity = true
