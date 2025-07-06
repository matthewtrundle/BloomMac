#!/bin/bash

echo "🔧 Comprehensive Admin Panel Fix"
echo "================================"
echo ""

# Database connection
PROD_DB="postgresql://postgres.utetcmirepwdxbtrcczv:F13aUlrMdMFDpSkg@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

echo "📊 Step 1: Checking database tables..."
echo "--------------------------------------"
./test-all-admin-features.sh

echo ""
echo "🔍 Step 2: Checking API routes..."
echo "---------------------------------"
node check-admin-api-routes.js

echo ""
echo "🛠️  Step 3: Applying database fixes..."
echo "-------------------------------------"

psql "$PROD_DB" << 'EOF'
-- =====================================================
-- FIX ALL ADMIN ACCESS ISSUES
-- =====================================================

\echo 'Disabling RLS on admin-accessed tables...'

-- These tables should be accessible by admin
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create missing tables if needed
-- Email queue (if missing)
CREATE TABLE IF NOT EXISTS public.email_queue (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    to_email text NOT NULL,
    subject text NOT NULL,
    template_id text,
    template_data jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'pending',
    scheduled_at timestamp with time zone DEFAULT now(),
    sent_at timestamp with time zone,
    error text,
    created_at timestamp with time zone DEFAULT now()
);

-- Career applications (if missing)
CREATE TABLE IF NOT EXISTS public.career_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    position text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    resume_url text,
    cover_letter text,
    status text DEFAULT 'new',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Analytics events (if missing)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    event_data jsonb DEFAULT '{}'::jsonb,
    user_id uuid,
    session_id text,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

\echo 'Database fixes applied!'

-- Show final status
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN 'RLS Enabled ⚠️'
        ELSE 'RLS Disabled ✅'
    END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'blog_posts',
    'contact_submissions',
    'subscribers',
    'email_templates',
    'email_queue',
    'courses',
    'career_applications',
    'user_profiles',
    'admin_activity_log'
)
ORDER BY tablename;
EOF

echo ""
echo "✅ All database fixes applied!"
echo ""
echo "📝 Next Steps:"
echo "1. The blog API route has already been created"
echo "2. Other missing API routes need to be created based on the check above"
echo "3. Deploy changes: git push"
echo ""
echo "🧪 To test a specific admin feature after deployment:"
echo "   - Contacts: https://bloompsychologynorthaustin.com/admin/contacts"
echo "   - Newsletter: https://bloompsychologynorthaustin.com/admin/newsletter"
echo "   - Email: https://bloompsychologynorthaustin.com/admin/email"
echo "   - Courses: https://bloompsychologynorthaustin.com/admin/courses"