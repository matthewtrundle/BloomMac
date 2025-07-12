-- ============================================
-- STEP 2: ENABLE RLS AND ADD POLICIES
-- Run this after tables are created
-- ============================================

-- 1. Enable RLS on all new tables
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY;

-- 2. Add policies for email_logs
DROP POLICY IF EXISTS "Service role manages email logs" ON public.email_logs;
CREATE POLICY "Service role manages email logs" ON public.email_logs
    FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view email logs" ON public.email_logs;
CREATE POLICY "Admins can view email logs" ON public.email_logs
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

-- 3. Add policies for email_analytics
DROP POLICY IF EXISTS "Service role manages email analytics" ON public.email_analytics;
CREATE POLICY "Service role manages email analytics" ON public.email_analytics
    FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view email analytics" ON public.email_analytics;
CREATE POLICY "Admins can view email analytics" ON public.email_analytics
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

-- 4. Add policies for career_applications
DROP POLICY IF EXISTS "Admins can manage career applications" ON public.career_applications;
CREATE POLICY "Admins can manage career applications" ON public.career_applications
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

DROP POLICY IF EXISTS "Public can submit career applications" ON public.career_applications;
CREATE POLICY "Public can submit career applications" ON public.career_applications
    FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Service role has full access to career applications" ON public.career_applications;
CREATE POLICY "Service role has full access to career applications" ON public.career_applications
    FOR ALL TO public USING (auth.role() = 'service_role');

-- 5. Add policies for system_settings
DROP POLICY IF EXISTS "Admins can manage system settings" ON public.system_settings;
CREATE POLICY "Admins can manage system settings" ON public.system_settings
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

DROP POLICY IF EXISTS "Service role manages system settings" ON public.system_settings;
CREATE POLICY "Service role manages system settings" ON public.system_settings
    FOR ALL TO public USING (auth.jwt() ->> 'role' = 'service_role');

-- 6. Add policies for user_achievements
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
    FOR SELECT TO public USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements
    FOR INSERT TO public WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role manages achievements" ON public.user_achievements;
CREATE POLICY "Service role manages achievements" ON public.user_achievements
    FOR ALL TO public USING (auth.jwt() ->> 'role' = 'service_role');

-- 7. Add policies for cron_logs
DROP POLICY IF EXISTS "Service role manages cron logs" ON public.cron_logs;
CREATE POLICY "Service role manages cron logs" ON public.cron_logs
    FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view cron logs" ON public.cron_logs;
CREATE POLICY "Admins can view cron logs" ON public.cron_logs
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

-- Verify RLS is enabled
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
-- All should show true for rowsecurity