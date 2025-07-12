-- ============================================
-- STEP 1: CREATE MISSING TABLES
-- Run this first to create all missing tables
-- ============================================

-- 1. Create missing email_logs table
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

-- 2. Create missing email_analytics table
CREATE TABLE IF NOT EXISTS public.email_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email_id UUID,
    event_type VARCHAR(50), -- 'sent', 'opened', 'clicked', 'bounced', 'complained'
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- 4. Create missing system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create missing user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(100) NOT NULL,
    achievement_data JSONB DEFAULT '{}',
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description) VALUES
    ('maintenance_mode', '"false"', 'Enable/disable maintenance mode'),
    ('contact_email', '"info@bloompsychology.com"', 'Primary contact email'),
    ('office_hours', '{"monday": "9-5", "tuesday": "9-5", "wednesday": "9-5", "thursday": "9-5", "friday": "9-5"}', 'Office hours')
ON CONFLICT (key) DO NOTHING;

-- Verify tables were created
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
-- Should return 6