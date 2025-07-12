-- ============================================
-- FIX WELLNESS HUB DATABASE SCHEMA ISSUES
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Fix user_activity_log table
-- The API expects: user_id, action, ip_address, metadata
-- Let's check what exists and add missing columns
ALTER TABLE public.user_activity_log 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS action TEXT,
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON public.user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON public.user_activity_log(created_at);

-- 2. Fix contact_submissions table
-- The API expects: first_name, last_name, email, message
-- Check current structure first
DO $$ 
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contact_submissions' AND column_name='first_name') THEN
        ALTER TABLE public.contact_submissions ADD COLUMN first_name VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contact_submissions' AND column_name='last_name') THEN
        ALTER TABLE public.contact_submissions ADD COLUMN last_name VARCHAR(255);
    END IF;
    
    -- Migrate data from name column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contact_submissions' AND column_name='name') THEN
        UPDATE public.contact_submissions 
        SET first_name = split_part(name, ' ', 1),
            last_name = split_part(name, ' ', 2)
        WHERE first_name IS NULL;
    END IF;
END $$;

-- 3. Fix analytics_events table
-- The API expects: type, page, metadata
ALTER TABLE public.analytics_events
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- If there's a different column storing metadata, migrate it
-- UPDATE public.analytics_events SET metadata = your_old_column::jsonb WHERE metadata IS NULL;

-- 4. Create the missing RPC function for dashboard data
CREATE OR REPLACE FUNCTION public.get_dashboard_data(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'profile', (
            SELECT row_to_json(p.*)
            FROM user_profiles p
            WHERE p.id = user_id
        ),
        'achievements', (
            SELECT json_agg(a.*)
            FROM user_achievements a
            WHERE a.user_id = get_dashboard_data.user_id
        ),
        'course_progress', (
            SELECT json_agg(
                json_build_object(
                    'course_id', cp.course_id,
                    'course_title', c.title,
                    'completed_lessons', cp.completed_lessons,
                    'total_lessons', (
                        SELECT COUNT(*)
                        FROM course_lessons cl
                        JOIN course_modules cm ON cl.module_id = cm.id
                        WHERE cm.course_id = c.id
                    ),
                    'progress_percentage', 
                    CASE 
                        WHEN (SELECT COUNT(*) FROM course_lessons cl JOIN course_modules cm ON cl.module_id = cm.id WHERE cm.course_id = c.id) > 0
                        THEN (COALESCE(array_length(cp.completed_lessons, 1), 0)::float / 
                             (SELECT COUNT(*) FROM course_lessons cl JOIN course_modules cm ON cl.module_id = cm.id WHERE cm.course_id = c.id)::float * 100)
                        ELSE 0
                    END
                )
            )
            FROM course_progress cp
            JOIN courses c ON c.id = cp.course_id
            WHERE cp.user_id = get_dashboard_data.user_id
        ),
        'recent_activity', (
            SELECT json_agg(
                json_build_object(
                    'action', ua.action,
                    'created_at', ua.created_at,
                    'metadata', ua.metadata
                )
                ORDER BY ua.created_at DESC
            )
            FROM (
                SELECT action, created_at, metadata
                FROM user_activity_log
                WHERE user_id = get_dashboard_data.user_id
                ORDER BY created_at DESC
                LIMIT 10
            ) ua
        )
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_dashboard_data(UUID) TO authenticated;

-- 5. Ensure all the other RPC functions exist
-- If these don't exist, check if they have different names or need to be created

-- 6. Add any missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(type);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_course_progress_user_course ON public.course_progress(user_id, course_id);

-- 7. Verify the fixes worked
SELECT 
    'user_activity_log' as table_name,
    COUNT(*) FILTER (WHERE column_name IN ('user_id', 'action', 'ip_address', 'metadata')) as expected_columns,
    COUNT(*) as total_columns
FROM information_schema.columns
WHERE table_name = 'user_activity_log' AND table_schema = 'public'
UNION ALL
SELECT 
    'contact_submissions' as table_name,
    COUNT(*) FILTER (WHERE column_name IN ('first_name', 'last_name', 'email', 'message')) as expected_columns,
    COUNT(*) as total_columns
FROM information_schema.columns
WHERE table_name = 'contact_submissions' AND table_schema = 'public'
UNION ALL
SELECT 
    'analytics_events' as table_name,
    COUNT(*) FILTER (WHERE column_name IN ('type', 'page', 'metadata')) as expected_columns,
    COUNT(*) as total_columns
FROM information_schema.columns
WHERE table_name = 'analytics_events' AND table_schema = 'public';

-- This should show that all expected columns exist

-- 8. Test the RPC function
-- SELECT get_dashboard_data('00000000-0000-0000-0000-000000000000');