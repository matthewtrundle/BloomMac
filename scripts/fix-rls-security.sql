-- ============================================
-- FIX RLS SECURITY ISSUES
-- Generated from Supabase Security Lints
-- ============================================

-- STEP 1: Enable RLS for tables that already have policies
-- These tables have security policies defined but RLS is not enabled!
-- This is CRITICAL - policies are not enforced without RLS enabled

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- STEP 2: Enable RLS and add basic policies for critical tables
-- These tables have no protection at all!

-- Email automation tables (should be service-role only)
ALTER TABLE public.sequence_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access to sequence_enrollments" ON public.sequence_enrollments
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

ALTER TABLE public.sequence_email_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access to sequence_email_sends" ON public.sequence_email_sends
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

ALTER TABLE public.email_automation_errors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access to email_automation_errors" ON public.email_automation_errors
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Course access tables (authenticated users only)
ALTER TABLE public.user_course_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own course access" ON public.user_course_access
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage course access" ON public.user_course_access
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

ALTER TABLE public.course_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own purchases" ON public.course_purchases
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage purchases" ON public.course_purchases
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own achievements" ON public.achievements
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage achievements" ON public.achievements
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Admin-only tables
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can access admin_sessions" ON public.admin_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view system_settings" ON public.system_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );
CREATE POLICY "Service role can manage system_settings" ON public.system_settings
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Analytics/tracking tables (insert-only for public, read for admins)
ALTER TABLE public.click_heatmap ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert click events" ON public.click_heatmap
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view click heatmap" ON public.click_heatmap
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- History/backup tables (admin-only)
ALTER TABLE public.email_templates_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can access email_templates_history" ON public.email_templates_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Reminder rules (authenticated users)
ALTER TABLE public.reminder_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own reminder rules" ON public.reminder_rules
  FOR ALL USING (auth.uid() = user_id);

-- STEP 3: Handle backup table (should probably be removed or moved to different schema)
-- For now, make it admin-only
ALTER TABLE public.profiles_backup_2025_01_06 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only service role can access backup" ON public.profiles_backup_2025_01_06
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- STEP 4: Verify all policies are enabled
-- Run this query to verify:
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND rowsecurity = false;

-- STEP 5: Review SECURITY DEFINER view
-- The heatmap_aggregated view uses SECURITY DEFINER which bypasses RLS
-- Consider if this is necessary or if it should be changed to SECURITY INVOKER
-- To change: ALTER VIEW public.heatmap_aggregated SECURITY INVOKER;