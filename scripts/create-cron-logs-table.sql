-- ============================================
-- CREATE MISSING CRON_LOGS TABLE
-- The API expects this table to exist
-- ============================================

-- Create the cron_logs table
CREATE TABLE IF NOT EXISTS public.cron_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'running', -- 'running', 'completed', 'failed'
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cron_logs_job_name ON public.cron_logs(job_name);
CREATE INDEX IF NOT EXISTS idx_cron_logs_started_at ON public.cron_logs(started_at);
CREATE INDEX IF NOT EXISTS idx_cron_logs_status ON public.cron_logs(status);

-- Enable RLS
ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY;

-- Add service role policy (cron jobs run as service role)
DROP POLICY IF EXISTS "cron_logs_service_role" ON public.cron_logs;
CREATE POLICY "cron_logs_service_role" ON public.cron_logs
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Add admin view policy
DROP POLICY IF EXISTS "admins_select_cron_logs" ON public.cron_logs;
CREATE POLICY "admins_select_cron_logs" ON public.cron_logs
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

-- Verify it was created
SELECT 
    'cron_logs' as table_name,
    EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'cron_logs'
    ) as exists,
    (
        SELECT rowsecurity 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'cron_logs'
    ) as rls_enabled;