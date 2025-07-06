-- Check all tables that admin panel might need
SELECT 
    table_name,
    CASE 
        WHEN rowsecurity THEN 'RLS Enabled ⚠️'
        ELSE 'RLS Disabled ✅'
    END as rls_status,
    (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.tablename) as columns,
    CASE
        WHEN table_name = 'blog_posts' THEN (SELECT COUNT(*) FROM public.blog_posts WHERE 1=1)
        WHEN table_name = 'posts' THEN (SELECT COUNT(*) FROM public.posts WHERE 1=1)
        WHEN table_name = 'contact_submissions' THEN (SELECT COUNT(*) FROM public.contact_submissions WHERE 1=1)
        WHEN table_name = 'subscribers' THEN (SELECT COUNT(*) FROM public.subscribers WHERE 1=1)
        WHEN table_name = 'email_templates' THEN (SELECT COUNT(*) FROM public.email_templates WHERE 1=1)
        WHEN table_name = 'courses' THEN (SELECT COUNT(*) FROM public.courses WHERE 1=1)
        WHEN table_name = 'career_applications' THEN (SELECT COUNT(*) FROM public.career_applications WHERE 1=1)
        ELSE NULL
    END as record_count
FROM pg_tables t
WHERE schemaname = 'public'
AND tablename IN (
    'blog_posts',
    'posts', 
    'contact_submissions',
    'subscribers',
    'email_templates',
    'courses',
    'career_applications',
    'admin_users',
    'admin_activity_log'
)
ORDER BY tablename;