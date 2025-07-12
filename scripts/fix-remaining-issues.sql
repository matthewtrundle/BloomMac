-- ============================================
-- FIX REMAINING WELLNESS HUB ISSUES
-- ============================================

-- 1. Fix analytics_events table - add missing page_path column
ALTER TABLE public.analytics_events
ADD COLUMN IF NOT EXISTS page_path VARCHAR(500);

-- If there's a different column storing the path, migrate it
-- For example, if it's stored in url or path:
-- UPDATE public.analytics_events SET page_path = url WHERE page_path IS NULL;
-- UPDATE public.analytics_events SET page_path = path WHERE page_path IS NULL;

-- 2. Fix the dashboard RPC function - UUID type mismatch
DROP FUNCTION IF EXISTS public.get_dashboard_data(UUID);

CREATE OR REPLACE FUNCTION public.get_dashboard_data(p_user_id UUID)
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
            WHERE p.id = p_user_id
        ),
        'achievements', (
            SELECT json_agg(a.*)
            FROM user_achievements a
            WHERE a.user_id = p_user_id
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
            WHERE cp.user_id = p_user_id
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
                WHERE user_id = p_user_id
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

-- 3. Let's check what columns analytics_events actually has
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'analytics_events'
ORDER BY ordinal_position;

-- 4. Verify the fixes
SELECT 
    'analytics_events has page_path' as check,
    EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'analytics_events' 
        AND column_name = 'page_path'
    ) as result;