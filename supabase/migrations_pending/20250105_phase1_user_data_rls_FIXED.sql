-- =====================================================
-- Phase 1: Critical User Data RLS Implementation (FIXED)
-- Date: 2025-01-05
-- Description: Fixed version based on actual production schema
-- =====================================================

-- 1. Enable RLS on subscribers table (already exists)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can subscribe" ON subscribers;
DROP POLICY IF EXISTS "Admins view all subscribers" ON subscribers;
DROP POLICY IF EXISTS "Users manage own subscription" ON subscribers;
DROP POLICY IF EXISTS "Admins manage all subscribers" ON subscribers;

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

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Service role manages triggers" ON email_automation_triggers;
DROP POLICY IF EXISTS "Admins view triggers" ON email_automation_triggers;

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

-- 3. Fix user_notifications policies (table already exists)
-- Drop the problematic policy
DROP POLICY IF EXISTS "System creates notifications" ON user_notifications;

-- Create corrected policy
CREATE POLICY "System creates notifications" ON user_notifications
    FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- 4. Fix wellness_entries policies (table already exists)
-- Drop existing generic policy
DROP POLICY IF EXISTS "Users can manage their own wellness entries" ON wellness_entries;

-- Create specific policies
CREATE POLICY "Users view own entries" ON wellness_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own entries" ON wellness_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own entries" ON wellness_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete own entries" ON wellness_entries
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Fix user_preferences policies (table already exists)
-- Add missing admin policy
CREATE POLICY IF NOT EXISTS "Admins view all preferences" ON user_preferences
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 6. Fix user_achievements policies (table already exists)
-- Add missing admin policy
CREATE POLICY IF NOT EXISTS "Admins view all achievements" ON user_achievements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 7. user_profiles already has RLS enabled and policies

-- 8. user_payment_methods (table already exists)
-- Enable RLS if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'user_payment_methods' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies for user_payment_methods
CREATE POLICY IF NOT EXISTS "Users view own payment methods" ON user_payment_methods
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Service role manages payment methods" ON user_payment_methods
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

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