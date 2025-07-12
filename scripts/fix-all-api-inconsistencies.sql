-- ============================================
-- FIX ALL API DATABASE INCONSISTENCIES
-- Run this in Supabase SQL Editor
-- Created: Jan 2025
-- ============================================

-- 1. Create missing email_logs table (used by email analytics API)
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    subject TEXT,
    status VARCHAR(50) DEFAULT 'sent',
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Add policy for service role
CREATE POLICY "Service role manages email logs" ON public.email_logs
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Add policy for admins to view
CREATE POLICY "Admins can view email logs" ON public.email_logs
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

-- 2. Create missing email_analytics table
CREATE TABLE IF NOT EXISTS public.email_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email_id UUID,
    event_type VARCHAR(50), -- 'sent', 'opened', 'clicked', 'bounced', 'complained'
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.email_analytics ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Service role manages email analytics" ON public.email_analytics
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Admins can view email analytics" ON public.email_analytics
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

-- 3. Create missing career_applications table
CREATE TABLE IF NOT EXISTS public.career_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    position VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    resume_url TEXT,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'reviewing', 'interviewed', 'rejected', 'accepted'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- Re-create the existing policies (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Admins can manage career applications" ON public.career_applications;
CREATE POLICY "Admins can manage career applications" ON public.career_applications
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

DROP POLICY IF EXISTS "Public can submit career applications" ON public.career_applications;
CREATE POLICY "Public can submit career applications" ON public.career_applications
    FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Service role has full access to career applications" ON public.career_applications;
CREATE POLICY "Service role has full access to career applications" ON public.career_applications
    FOR ALL TO public USING (auth.role() = 'service_role');

-- 4. Create missing system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Add the existing policies (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Admins can manage system settings" ON public.system_settings;
CREATE POLICY "Admins can manage system settings" ON public.system_settings
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

DROP POLICY IF EXISTS "Service role manages system settings" ON public.system_settings;
CREATE POLICY "Service role manages system settings" ON public.system_settings
    FOR ALL TO public USING (auth.jwt() ->> 'role' = 'service_role');

-- Insert default settings
INSERT INTO public.system_settings (key, value, description) VALUES
    ('maintenance_mode', '"false"', 'Enable/disable maintenance mode'),
    ('contact_email', '"info@bloompsychology.com"', 'Primary contact email'),
    ('office_hours', '{"monday": "9-5", "tuesday": "9-5", "wednesday": "9-5", "thursday": "9-5", "friday": "9-5"}', 'Office hours')
ON CONFLICT (key) DO NOTHING;

-- 5. Create missing user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(100) NOT NULL,
    achievement_data JSONB DEFAULT '{}',
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Recreate existing policies (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
    FOR SELECT TO public USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements
    FOR INSERT TO public WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role manages achievements" ON public.user_achievements;
CREATE POLICY "Service role manages achievements" ON public.user_achievements
    FOR ALL TO public USING (auth.jwt() ->> 'role' = 'service_role');

-- 6. Create missing cron_logs table
CREATE TABLE IF NOT EXISTS public.cron_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'running', -- 'running', 'completed', 'failed'
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Service role manages cron logs" ON public.cron_logs
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Admins can view cron logs" ON public.cron_logs
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    ));

-- 7. Create the increment RPC function (used by email analytics)
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

-- 8. Fix the email check issue in registration
-- The user_profiles table doesn't have an email column, so we need to check auth.users
-- This requires updating the API code, but let's add a helper function
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

-- 9. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_logs_to_email ON public.email_logs(to_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON public.email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_analytics_created_at ON public.email_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_career_applications_status ON public.career_applications(status);
CREATE INDEX IF NOT EXISTS idx_career_applications_created_at ON public.career_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_cron_logs_job_name ON public.cron_logs(job_name);
CREATE INDEX IF NOT EXISTS idx_cron_logs_started_at ON public.cron_logs(started_at);

-- 10. Clean up old HIPAA-related tables (if you're sure they're not needed)
-- UNCOMMENT ONLY IF YOU'RE CERTAIN THESE ARE NOT NEEDED
-- DROP TABLE IF EXISTS public.appointments CASCADE;
-- DROP TABLE IF EXISTS public.appointment_data CASCADE;
-- DROP TABLE IF EXISTS public.clinical_notes CASCADE;
-- DROP TABLE IF EXISTS public.provider_profiles CASCADE;
-- DROP TABLE IF EXISTS public.user_workbook_responses CASCADE;
-- DROP TABLE IF EXISTS public.user_week_submissions CASCADE;

-- 11. Verify all tables were created
SELECT 
    'Tables Created' as check_type,
    COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'email_logs',
    'email_analytics', 
    'career_applications',
    'system_settings',
    'user_achievements',
    'cron_logs'
);

-- Should return 6 if all tables were created successfully