-- =====================================================
-- Phase 4: Communication Control RLS Implementation
-- Date: 2025-01-05
-- Description: Implement RLS for email and communication tables
-- =====================================================

-- Create missing communication tables
-- =====================================================

-- 1. Create email_campaign_metrics table
CREATE TABLE IF NOT EXISTS email_campaign_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID,
    email_id UUID,
    recipient_email TEXT NOT NULL,
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,
    bounce_type TEXT,
    click_data JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_metrics_campaign ON email_campaign_metrics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_metrics_email ON email_campaign_metrics(email_id);
CREATE INDEX IF NOT EXISTS idx_email_metrics_recipient ON email_campaign_metrics(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_metrics_sent ON email_campaign_metrics(sent_at);

-- Enable RLS
ALTER TABLE email_campaign_metrics ENABLE ROW LEVEL SECURITY;

-- Email campaign metrics policies
CREATE POLICY "Service role manages metrics" ON email_campaign_metrics
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Admins view all metrics" ON email_campaign_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 2. Create email_templates table if missing
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    html_content TEXT,
    text_content TEXT,
    variables JSONB DEFAULT '[]',
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_templates_name ON email_templates(name);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Email templates policies
CREATE POLICY "Admins manage templates" ON email_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

CREATE POLICY "Service role uses templates" ON email_templates
    FOR SELECT USING (auth.jwt()->>'role' = 'service_role');

-- 3. Update email_queue table with RLS if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'email_queue') THEN
        -- Enable RLS if not already enabled
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'email_queue' 
            AND rowsecurity = true
        ) THEN
            ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
        END IF;
        
        -- Create policies
        CREATE POLICY "Service role manages queue" ON email_queue
            FOR ALL USING (auth.jwt()->>'role' = 'service_role');
            
        CREATE POLICY "Admins view queue" ON email_queue
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM admin_users
                    WHERE id = auth.uid()
                    AND is_active = true
                )
            );
            
        CREATE POLICY "Users view own queued emails" ON email_queue
            FOR SELECT USING (
                recipient_email = auth.jwt()->>'email'
            );
    END IF;
END $$;

-- 4. Create email_unsubscribes table
CREATE TABLE IF NOT EXISTS email_unsubscribes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    list_type TEXT NOT NULL,
    reason TEXT,
    unsubscribed_at TIMESTAMPTZ DEFAULT NOW(),
    resubscribed_at TIMESTAMPTZ,
    UNIQUE(email, list_type)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_unsubscribes_email ON email_unsubscribes(email);
CREATE INDEX IF NOT EXISTS idx_email_unsubscribes_user ON email_unsubscribes(user_id);

-- Enable RLS
ALTER TABLE email_unsubscribes ENABLE ROW LEVEL SECURITY;

-- Unsubscribe policies
CREATE POLICY "Anyone can unsubscribe" ON email_unsubscribes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users manage own unsubscribes" ON email_unsubscribes
    FOR ALL USING (
        email = auth.jwt()->>'email'
        OR user_id = auth.uid()
    );

CREATE POLICY "Service role manages all" ON email_unsubscribes
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Admins view all unsubscribes" ON email_unsubscribes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 5. Create sms_messages table for future SMS support
CREATE TABLE IF NOT EXISTS sms_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    phone_number TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    provider TEXT,
    provider_message_id TEXT,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sms_messages_user ON sms_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_status ON sms_messages(status);
CREATE INDEX IF NOT EXISTS idx_sms_messages_created ON sms_messages(created_at DESC);

-- Enable RLS
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;

-- SMS policies
CREATE POLICY "Users view own SMS" ON sms_messages
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role manages SMS" ON sms_messages
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Admins view all SMS" ON sms_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 6. Create push_notifications table
CREATE TABLE IF NOT EXISTS push_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    platform TEXT CHECK (platform IN ('web', 'ios', 'android')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_push_notifications_user ON push_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_push_notifications_status ON push_notifications(status);

-- Enable RLS
ALTER TABLE push_notifications ENABLE ROW LEVEL SECURITY;

-- Push notification policies
CREATE POLICY "Users view own push notifications" ON push_notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users mark as read" ON push_notifications
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role manages push" ON push_notifications
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- 7. Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT false,
    push_enabled BOOLEAN DEFAULT true,
    email_frequency TEXT DEFAULT 'immediate' CHECK (email_frequency IN ('immediate', 'daily', 'weekly', 'never')),
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    notification_types JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user ON notification_preferences(user_id);

-- Enable RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Notification preferences policies
CREATE POLICY "Users manage own preferences" ON notification_preferences
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Service role manages preferences" ON notification_preferences
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Update existing communication tables
-- =====================================================

-- 8. Update email_sequences table if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'email_sequences') THEN
        -- Enable RLS if not already enabled
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'email_sequences' 
            AND rowsecurity = true
        ) THEN
            ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
        END IF;
        
        -- Create policies
        CREATE POLICY "Admins manage sequences" ON email_sequences
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM admin_users
                    WHERE id = auth.uid()
                    AND is_active = true
                )
            );
            
        CREATE POLICY "Service role uses sequences" ON email_sequences
            FOR SELECT USING (auth.jwt()->>'role' = 'service_role');
    END IF;
END $$;

-- 9. Update sequence_emails table if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'sequence_emails') THEN
        -- Enable RLS if not already enabled
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'sequence_emails' 
            AND rowsecurity = true
        ) THEN
            ALTER TABLE sequence_emails ENABLE ROW LEVEL SECURITY;
        END IF;
        
        -- Create policies
        CREATE POLICY "Admins manage sequence emails" ON sequence_emails
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM admin_users
                    WHERE id = auth.uid()
                    AND is_active = true
                )
            );
            
        CREATE POLICY "Service role uses sequence emails" ON sequence_emails
            FOR SELECT USING (auth.jwt()->>'role' = 'service_role');
    END IF;
END $$;

-- 10. Update email_automation_logs table if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'email_automation_logs') THEN
        -- Enable RLS if not already enabled
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'email_automation_logs' 
            AND rowsecurity = true
        ) THEN
            ALTER TABLE email_automation_logs ENABLE ROW LEVEL SECURITY;
        END IF;
        
        -- Create policies
        CREATE POLICY "Service role logs automation" ON email_automation_logs
            FOR ALL USING (auth.jwt()->>'role' = 'service_role');
            
        CREATE POLICY "Admins view logs" ON email_automation_logs
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM admin_users
                    WHERE id = auth.uid()
                    AND is_active = true
                )
            );
    END IF;
END $$;

-- Create helper functions
-- =====================================================

-- Function to check if email is unsubscribed
CREATE OR REPLACE FUNCTION is_email_unsubscribed(
    p_email TEXT,
    p_list_type TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM email_unsubscribes
        WHERE email = p_email
        AND list_type = p_list_type
        AND resubscribed_at IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update notification preferences timestamp
CREATE OR REPLACE FUNCTION update_notification_preferences_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_notification_preferences_updated_at
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_notification_preferences_timestamp();

-- Grant permissions
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT ON email_campaign_metrics TO authenticated;
GRANT SELECT ON email_templates TO authenticated;
GRANT SELECT, INSERT, UPDATE ON email_unsubscribes TO authenticated;
GRANT SELECT ON sms_messages TO authenticated;
GRANT SELECT, UPDATE ON push_notifications TO authenticated;
GRANT ALL ON notification_preferences TO authenticated;

-- Grant full permissions to service role
GRANT ALL ON email_campaign_metrics TO service_role;
GRANT ALL ON email_templates TO service_role;
GRANT ALL ON email_unsubscribes TO service_role;
GRANT ALL ON sms_messages TO service_role;
GRANT ALL ON push_notifications TO service_role;
GRANT ALL ON notification_preferences TO service_role;

-- Grant permissions for sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Validation queries
-- =====================================================
-- Run these to verify RLS is properly configured:

-- Check communication tables with RLS
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN (
--     'email_campaign_metrics', 'email_templates', 'email_queue',
--     'email_unsubscribes', 'sms_messages', 'push_notifications',
--     'notification_preferences', 'email_sequences', 'sequence_emails',
--     'email_automation_logs'
-- )
-- ORDER BY tablename;

-- Check policies count per table
-- SELECT tablename, COUNT(*) as policy_count
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- AND tablename IN (
--     'email_campaign_metrics', 'email_templates', 'email_queue',
--     'email_unsubscribes', 'sms_messages', 'push_notifications',
--     'notification_preferences'
-- )
-- GROUP BY tablename
-- ORDER BY tablename;