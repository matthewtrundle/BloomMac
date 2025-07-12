-- Rollback RLS Migration
-- This script can be used to disable RLS on tables if needed
-- It does NOT delete policies, only disables RLS

-- Disable RLS on tables that were enabled in the migration
ALTER TABLE analytics_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE click_heatmap DISABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_automation_errors DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_rules DISABLE ROW LEVEL SECURITY;
ALTER TABLE sequence_email_sends DISABLE ROW LEVEL SECURITY;
ALTER TABLE sequence_enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_access DISABLE ROW LEVEL SECURITY;

-- Note: This does NOT remove the policies, just disables RLS
-- To remove policies, you would need to DROP POLICY commands

DO $$
BEGIN
    RAISE NOTICE 'RLS rollback completed!';
    RAISE NOTICE 'RLS has been disabled on migrated tables.';
    RAISE NOTICE 'Policies remain in place but are not enforced.';
END $$;