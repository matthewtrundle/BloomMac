-- =====================================================
-- Phase 1: Critical User Data RLS Implementation
-- Date: 2025-01-05
-- Description: Implement RLS for user-related tables
-- =====================================================

-- Enable RLS on existing tables that need it
-- =====================================================

-- 1. Enable RLS on subscribers table
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Subscribers policies
CREATE POLICY "Anyone can subscribe" ON subscribers
    FOR INSERT WITH CHECK (email IS NOT NULL);

CREATE POLICY "Admins view all subscribers" ON subscribers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

CREATE POLICY "Users manage own subscription" ON subscribers
    FOR UPDATE USING (
        auth.uid()::text = metadata->>'user_id'
        OR email = auth.jwt()->>'email'
    );

CREATE POLICY "Admins manage all subscribers" ON subscribers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 2. Enable RLS on email_automation_triggers
ALTER TABLE email_automation_triggers ENABLE ROW LEVEL SECURITY;

-- Email automation triggers policies (system/admin only)
CREATE POLICY "Service role manages triggers" ON email_automation_triggers
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Admins view triggers" ON email_automation_triggers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- Create missing user-related tables with RLS
-- =====================================================

-- 3. Create user_preferences table with RLS
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    newsletter_subscribed BOOLEAN DEFAULT true,
    course_reminders BOOLEAN DEFAULT true,
    appointment_reminders BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT true,
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es')),
    timezone TEXT DEFAULT 'America/Chicago',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for user lookups
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- User preferences policies
CREATE POLICY "Users view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins view all preferences" ON user_preferences
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 4. Create user_achievements table with RLS
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    achievement_name TEXT NOT NULL,
    achievement_description TEXT,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_type ON user_achievements(achievement_type);
CREATE INDEX idx_user_achievements_earned_at ON user_achievements(earned_at);

-- Enable RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- User achievements policies
CREATE POLICY "Users view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System creates achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Admins view all achievements" ON user_achievements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 5. Create user_notifications table with RLS
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN (
        'system', 'course', 'appointment', 'payment', 
        'achievement', 'reminder', 'marketing', 'support'
    )),
    title TEXT NOT NULL,
    message TEXT,
    action_url TEXT,
    action_text TEXT,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_read ON user_notifications(user_id, read);
CREATE INDEX idx_user_notifications_created_at ON user_notifications(created_at DESC);
CREATE INDEX idx_user_notifications_type ON user_notifications(type);

-- Enable RLS
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- User notifications policies
CREATE POLICY "Users view own notifications" ON user_notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications" ON user_notifications
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System creates notifications" ON user_notifications
    FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "System deletes old notifications" ON user_notifications
    FOR DELETE USING (
        auth.jwt()->>'role' = 'service_role'
        OR (auth.uid() = user_id AND (expires_at < NOW() OR read = true))
    );

-- 6. Create wellness_entries table with RLS
CREATE TABLE IF NOT EXISTS wellness_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 10),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    activities TEXT[],
    notes TEXT,
    gratitude TEXT[],
    goals_progress JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, entry_date)
);

-- Create indexes
CREATE INDEX idx_wellness_entries_user_id ON wellness_entries(user_id);
CREATE INDEX idx_wellness_entries_date ON wellness_entries(user_id, entry_date DESC);

-- Enable RLS
ALTER TABLE wellness_entries ENABLE ROW LEVEL SECURITY;

-- Wellness entries policies
CREATE POLICY "Users view own entries" ON wellness_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own entries" ON wellness_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own entries" ON wellness_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete own entries" ON wellness_entries
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Therapists view patient entries" ON wellness_entries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM appointment_data
            WHERE therapist_id = auth.uid()
            AND user_id = wellness_entries.user_id
            AND status IN ('scheduled', 'completed')
        )
    );

-- 7. Create user_payment_methods table with RLS
CREATE TABLE IF NOT EXISTS user_payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_payment_method_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    brand TEXT,
    last4 TEXT,
    exp_month INTEGER,
    exp_year INTEGER,
    is_default BOOLEAN DEFAULT false,
    billing_details JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_payment_methods_user_id ON user_payment_methods(user_id);
CREATE INDEX idx_user_payment_methods_stripe_id ON user_payment_methods(stripe_payment_method_id);

-- Enable RLS
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;

-- Payment methods policies
CREATE POLICY "Users view own payment methods" ON user_payment_methods
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role manages payment methods" ON user_payment_methods
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Create functions for automatic preference creation
-- =====================================================

-- Function to automatically create user preferences
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create preferences on user creation
CREATE TRIGGER create_user_preferences_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_preferences();

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers for tables with updated_at
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_payment_methods_updated_at
    BEFORE UPDATE ON user_payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_entries_updated_at
    BEFORE UPDATE ON wellness_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON user_preferences TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_achievements TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON wellness_entries TO authenticated;
GRANT SELECT ON user_payment_methods TO authenticated;

-- Grant full permissions to service role
GRANT ALL ON user_preferences TO service_role;
GRANT ALL ON user_achievements TO service_role;
GRANT ALL ON user_notifications TO service_role;
GRANT ALL ON wellness_entries TO service_role;
GRANT ALL ON user_payment_methods TO service_role;

-- Grant permissions for sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Validation queries
-- =====================================================
-- Run these to verify RLS is properly configured:

-- Check tables with RLS enabled
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN (
--     'user_preferences', 'user_achievements', 'user_notifications',
--     'wellness_entries', 'user_payment_methods', 'subscribers',
--     'email_automation_triggers'
-- )
-- ORDER BY tablename;

-- Check policies per table
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- AND tablename IN (
--     'user_preferences', 'user_achievements', 'user_notifications',
--     'wellness_entries', 'user_payment_methods', 'subscribers',
--     'email_automation_triggers'
-- )
-- ORDER BY tablename, policyname;