#!/bin/bash

echo "🧪 Testing All Admin Features"
echo "============================="
echo ""

# Database connection
PROD_DB="postgresql://postgres.utetcmirepwdxbtrcczv:F13aUlrMdMFDpSkg@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

# Test each admin feature's database requirements
psql "$PROD_DB" << 'EOF'
-- =====================================================
-- ADMIN FEATURES DATABASE CHECK
-- =====================================================

\echo '\n📊 DASHBOARD/ANALYTICS CHECK'
\echo '----------------------------'
SELECT 
    'analytics_events' as feature,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics_events') as table_exists,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics_events')
         THEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'analytics_events')
         ELSE NULL
    END as rls_enabled,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics_events')
         THEN (SELECT COUNT(*) FROM analytics_events)
         ELSE 0
    END as record_count;

\echo '\n📬 CONTACT SUBMISSIONS CHECK'
\echo '----------------------------'
SELECT 
    'contact_submissions' as feature,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contact_submissions') as table_exists,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contact_submissions')
         THEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'contact_submissions')
         ELSE NULL
    END as rls_enabled,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contact_submissions')
         THEN (SELECT COUNT(*) FROM contact_submissions)
         ELSE 0
    END as record_count;

\echo '\n📧 EMAIL MANAGEMENT CHECK'
\echo '------------------------'
-- Email templates
SELECT 
    'email_templates' as feature,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_templates') as table_exists,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_templates')
         THEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'email_templates')
         ELSE NULL
    END as rls_enabled,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_templates')
         THEN (SELECT COUNT(*) FROM email_templates)
         ELSE 0
    END as record_count;

-- Email queue
SELECT 
    'email_queue' as feature,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_queue') as table_exists,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_queue')
         THEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'email_queue')
         ELSE NULL
    END as rls_enabled,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_queue')
         THEN (SELECT COUNT(*) FROM email_queue)
         ELSE 0
    END as record_count;

\echo '\n📰 NEWSLETTER CHECK'
\echo '------------------'
SELECT 
    'subscribers' as feature,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscribers') as table_exists,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscribers')
         THEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'subscribers')
         ELSE NULL
    END as rls_enabled,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscribers')
         THEN (SELECT COUNT(*) FROM subscribers)
         ELSE 0
    END as record_count;

\echo '\n📚 COURSES CHECK'
\echo '---------------'
SELECT 
    'courses' as feature,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'courses') as table_exists,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'courses')
         THEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'courses')
         ELSE NULL
    END as rls_enabled,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'courses')
         THEN (SELECT COUNT(*) FROM courses)
         ELSE 0
    END as record_count;

-- Course enrollments
SELECT 
    'course_enrollments' as feature,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'course_enrollments') as table_exists,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'course_enrollments')
         THEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'course_enrollments')
         ELSE NULL
    END as rls_enabled,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'course_enrollments')
         THEN (SELECT COUNT(*) FROM course_enrollments)
         ELSE 0
    END as record_count;

\echo '\n💼 CAREER APPLICATIONS CHECK'
\echo '----------------------------'
SELECT 
    'career_applications' as feature,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'career_applications') as table_exists,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'career_applications')
         THEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'career_applications')
         ELSE NULL
    END as rls_enabled,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'career_applications')
         THEN (SELECT COUNT(*) FROM career_applications)
         ELSE 0
    END as record_count;

\echo '\n👥 USER PROFILES CHECK'
\echo '---------------------'
SELECT 
    'user_profiles' as feature,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') as table_exists,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles')
         THEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'user_profiles')
         ELSE NULL
    END as rls_enabled,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles')
         THEN (SELECT COUNT(*) FROM user_profiles)
         ELSE 0
    END as record_count;

\echo '\n📋 ACTIVITY LOGS CHECK'
\echo '---------------------'
SELECT 
    'admin_activity_log' as feature,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_activity_log') as table_exists,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_activity_log')
         THEN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'admin_activity_log')
         ELSE NULL
    END as rls_enabled,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_activity_log')
         THEN (SELECT COUNT(*) FROM admin_activity_log)
         ELSE 0
    END as record_count;

\echo '\n🔍 SUMMARY OF ISSUES'
\echo '-------------------'
-- Find tables that might need RLS disabled for admin access
SELECT 
    tablename as "Table with RLS Enabled",
    'ALTER TABLE public.' || tablename || ' DISABLE ROW LEVEL SECURITY;' as "Fix Command"
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true
AND tablename IN (
    'contact_submissions',
    'subscribers',
    'email_templates',
    'email_queue',
    'courses',
    'career_applications',
    'analytics_events'
);

\echo '\n✅ RECOMMENDED FIXES'
\echo '-------------------'
EOF

echo ""
echo "Test complete! Check the output above for any issues."
echo ""
echo "Common issues to look for:"
echo "- Tables with RLS enabled (should be disabled for admin access)"
echo "- Missing tables (table_exists = false)"
echo "- Empty tables that should have data"