-- Enable RLS on Tables Migration
-- This script enables Row Level Security on tables that have policies defined but RLS disabled
-- It also adds missing policies for critical tables

-- 1. Enable RLS on tables that have policies but RLS is disabled
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;

-- 2. Enable RLS on other critical tables without policies
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_heatmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_automation_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequence_email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequence_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_access ENABLE ROW LEVEL SECURITY;

-- 3. Add missing policies for tables without any policies

-- achievements table
CREATE POLICY "Users can view their own achievements" 
ON achievements FOR SELECT 
TO public 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" 
ON achievements FOR INSERT 
TO public 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manages achievements" 
ON achievements FOR ALL 
TO public 
USING (auth.jwt() ->> 'role' = 'service_role');

-- admin_sessions table
CREATE POLICY "Admin sessions are admin only" 
ON admin_sessions FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
));

CREATE POLICY "Service role manages admin sessions" 
ON admin_sessions FOR ALL 
TO public 
USING (auth.jwt() ->> 'role' = 'service_role');

-- click_heatmap table
CREATE POLICY "Public can insert heatmap data" 
ON click_heatmap FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Admins can view heatmap data" 
ON click_heatmap FOR SELECT 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
));

-- course_purchases table
CREATE POLICY "Users can view their own purchases" 
ON course_purchases FOR SELECT 
TO public 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases" 
ON course_purchases FOR INSERT 
TO public 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases" 
ON course_purchases FOR SELECT 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
));

CREATE POLICY "Service role manages purchases" 
ON course_purchases FOR ALL 
TO public 
USING (auth.jwt() ->> 'role' = 'service_role');

-- email_automation_errors table
CREATE POLICY "Admins can view automation errors" 
ON email_automation_errors FOR SELECT 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
));

CREATE POLICY "Service role manages automation errors" 
ON email_automation_errors FOR ALL 
TO public 
USING (auth.jwt() ->> 'role' = 'service_role');

-- email_templates_history table
CREATE POLICY "Admins can view template history" 
ON email_templates_history FOR SELECT 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
));

CREATE POLICY "Service role manages template history" 
ON email_templates_history FOR ALL 
TO public 
USING (auth.jwt() ->> 'role' = 'service_role');

-- reminder_rules table
CREATE POLICY "Users can manage their own reminder rules" 
ON reminder_rules FOR ALL 
TO public 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manages all reminder rules" 
ON reminder_rules FOR ALL 
TO public 
USING (auth.jwt() ->> 'role' = 'service_role');

-- sequence_email_sends table
CREATE POLICY "Admins can view sequence email sends" 
ON sequence_email_sends FOR SELECT 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
));

CREATE POLICY "Service role manages sequence email sends" 
ON sequence_email_sends FOR ALL 
TO public 
USING (auth.jwt() ->> 'role' = 'service_role');

-- sequence_enrollments table
CREATE POLICY "Users can view their own enrollments" 
ON sequence_enrollments FOR SELECT 
TO public 
USING (
    subscriber_id IN (
        SELECT id FROM subscribers 
        WHERE email = auth.jwt() ->> 'email'
    )
);

CREATE POLICY "Admins can view all enrollments" 
ON sequence_enrollments FOR SELECT 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
));

CREATE POLICY "Service role manages enrollments" 
ON sequence_enrollments FOR ALL 
TO public 
USING (auth.jwt() ->> 'role' = 'service_role');

-- system_settings table
CREATE POLICY "Admins can manage system settings" 
ON system_settings FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
));

CREATE POLICY "Service role manages system settings" 
ON system_settings FOR ALL 
TO public 
USING (auth.jwt() ->> 'role' = 'service_role');

-- user_course_access table
CREATE POLICY "Users can view their own course access" 
ON user_course_access FOR SELECT 
TO public 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all course access" 
ON user_course_access FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
));

CREATE POLICY "Service role manages course access" 
ON user_course_access FOR ALL 
TO public 
USING (auth.jwt() ->> 'role' = 'service_role');

-- 4. Fix any public-facing tables that should allow anonymous access
-- These tables already have policies but might need adjustment

-- Ensure analytics_events allows public inserts (already has policy)
-- Ensure contact_submissions allows public inserts (already has policy)
-- Ensure blog_posts public viewing works (already has policy)
-- Ensure courses public viewing works (already has policy)

-- 5. Add service role bypass for critical operations
-- Note: Most tables already have service role policies, but let's ensure consistency

-- Add notification about completion
DO $$
BEGIN
    RAISE NOTICE 'RLS migration completed successfully!';
    RAISE NOTICE 'Tables with RLS enabled: %', (
        SELECT COUNT(*) 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND rowsecurity = true
    );
END $$;