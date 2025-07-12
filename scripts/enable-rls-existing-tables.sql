-- ============================================
-- ENABLE RLS ON EXISTING TABLES
-- All tables exist but need RLS enabled
-- ============================================

-- 1. Enable RLS on all tables
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY;

-- 2. Create service role bypass policies (essential for app to work)
-- These ensure your backend can always access the tables

-- Email logs
CREATE POLICY "email_logs_service_role" ON public.email_logs
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Email analytics  
CREATE POLICY "email_analytics_service_role" ON public.email_analytics
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Career applications
CREATE POLICY "career_applications_service_role" ON public.career_applications
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- System settings
CREATE POLICY "system_settings_service_role" ON public.system_settings
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- User achievements
CREATE POLICY "user_achievements_service_role" ON public.user_achievements
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Cron logs
CREATE POLICY "cron_logs_service_role" ON public.cron_logs
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 3. Add user-specific policies

-- Users can view their own achievements
CREATE POLICY "users_view_own_achievements" ON public.user_achievements
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Users can insert their own achievements  
CREATE POLICY "users_insert_own_achievements" ON public.user_achievements
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Public can submit career applications
CREATE POLICY "public_submit_applications" ON public.career_applications
    FOR INSERT TO anon WITH CHECK (true);

-- 4. Add admin policies

-- Admins can view email logs
CREATE POLICY "admins_view_email_logs" ON public.email_logs
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

-- Admins can view email analytics
CREATE POLICY "admins_view_email_analytics" ON public.email_analytics
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

-- Admins can manage career applications
CREATE POLICY "admins_manage_applications" ON public.career_applications
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

-- Admins can manage system settings
CREATE POLICY "admins_manage_settings" ON public.system_settings
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

-- Admins can view cron logs
CREATE POLICY "admins_view_cron_logs" ON public.cron_logs
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

-- 5. Verify RLS is enabled
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
-- All should show true