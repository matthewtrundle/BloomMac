-- Run this query to see what tables exist in your database
-- This will help us understand what's already there

SELECT 
    schemaname,
    tablename,
    tableowner
FROM 
    pg_catalog.pg_tables
WHERE 
    schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY 
    schemaname, tablename;

-- Check if specific tables we need exist
SELECT 
    'admin_activity_log' as table_name,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_activity_log') as exists
UNION ALL
SELECT 
    'conversion_events',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversion_events')
UNION ALL
SELECT 
    'newsletter_sends',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter_sends')
UNION ALL
SELECT 
    'chatbot_interactions',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chatbot_interactions')
UNION ALL
SELECT 
    'email_sends',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_sends')
UNION ALL
SELECT 
    'analytics_events',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics_events')
UNION ALL
SELECT 
    'subscribers',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscribers')
UNION ALL
SELECT 
    'user_profiles',
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles');

-- Check what functions exist
SELECT 
    proname as function_name,
    proargnames as arguments
FROM 
    pg_proc
WHERE 
    pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    AND proname IN (
        'create_user_profile',
        'subscribe_to_newsletter',
        'handle_newsletter_signup',
        'handle_email_unsubscribe',
        'validate_unsubscribe_token',
        'get_analytics_summary',
        'get_analytics_dashboard'
    )
ORDER BY 
    proname;