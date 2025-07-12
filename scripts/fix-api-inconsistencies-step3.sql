-- ============================================
-- STEP 3: CREATE FUNCTIONS AND INDEXES
-- Run this after policies are set up
-- ============================================

-- 1. Create the increment RPC function (used by email analytics)
CREATE OR REPLACE FUNCTION public.increment(table_name text, column_name text, row_id uuid, increment_by int DEFAULT 1)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    EXECUTE format('UPDATE %I SET %I = COALESCE(%I, 0) + $1 WHERE id = $2', table_name, column_name, column_name)
    USING increment_by, row_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment(text, text, uuid, int) TO authenticated;

-- 2. Create email check helper function
CREATE OR REPLACE FUNCTION public.check_email_exists(check_email VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users WHERE email = check_email
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_email_exists(VARCHAR) TO anon;

-- 3. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_to_email ON public.email_logs(to_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON public.email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_analytics_created_at ON public.email_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_career_applications_status ON public.career_applications(status);
CREATE INDEX IF NOT EXISTS idx_career_applications_created_at ON public.career_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_cron_logs_job_name ON public.cron_logs(job_name);
CREATE INDEX IF NOT EXISTS idx_cron_logs_started_at ON public.cron_logs(started_at);

-- 4. Final verification
SELECT 
    'Functions' as check_type,
    COUNT(*) as count
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('increment', 'check_email_exists');
-- Should return 2

SELECT 
    'Indexes' as check_type,
    COUNT(*) as count
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%';
-- Should show your new indexes