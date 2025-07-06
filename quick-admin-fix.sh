#!/bin/bash

echo "🚀 Quick Admin Fix - Disabling RLS on Admin Tables"
echo "=================================================="

psql "postgresql://postgres.utetcmirepwdxbtrcczv:F13aUlrMdMFDpSkg@aws-0-us-east-2.pooler.supabase.com:5432/postgres" << 'EOF'
-- Disable RLS on tables that admin needs to access
ALTER TABLE public.analytics_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Verify the changes
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN '❌ RLS Still Enabled'
        ELSE '✅ RLS Disabled'
    END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'analytics_events',
    'career_applications', 
    'courses',
    'email_queue',
    'email_templates'
);

-- Quick count to verify access
SELECT 
    'Data Access Test:' as info,
    (SELECT COUNT(*) FROM analytics_events) as analytics_count,
    (SELECT COUNT(*) FROM courses) as courses_count,
    (SELECT COUNT(*) FROM email_templates) as templates_count;
EOF

echo ""
echo "✅ RLS fixes applied! Admin should now be able to access:"
echo "   - Analytics data"
echo "   - Career applications"
echo "   - Courses"
echo "   - Email queue"
echo "   - Email templates"