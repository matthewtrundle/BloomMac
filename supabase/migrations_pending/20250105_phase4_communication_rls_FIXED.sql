-- =====================================================
-- Phase 4: Communication Control RLS Implementation (FIXED)
-- Date: 2025-01-05
-- Description: Fixed version based on actual production schema
-- =====================================================

-- 1. email_templates - table already exists, enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Create email template policies
CREATE POLICY "Public templates are visible" ON email_templates
    FOR SELECT USING (is_public = true);

CREATE POLICY "Admins manage all templates" ON email_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

CREATE POLICY "Service role uses templates" ON email_templates
    FOR SELECT USING (auth.jwt()->>'role' = 'service_role');

-- 2. email_queue - table already exists, enable RLS
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- Create email queue policies
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

-- 3. email_campaign_metrics - table already exists, enable RLS
ALTER TABLE email_campaign_metrics ENABLE ROW LEVEL SECURITY;

-- Create campaign metrics policies
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

-- 4. email_sequences - enable RLS if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'email_sequences') THEN
        ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
        
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

-- 5. sequence_emails - enable RLS if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'sequence_emails') THEN
        ALTER TABLE sequence_emails ENABLE ROW LEVEL SECURITY;
        
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

-- 6. email_automation_logs - enable RLS if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'email_automation_logs') THEN
        ALTER TABLE email_automation_logs ENABLE ROW LEVEL SECURITY;
        
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

-- Create missing communication tables
-- =====================================================

-- 7. Create email_unsubscribes table
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

-- 8. Create sms_messages table for future SMS support
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

-- 9. Create push_notifications table
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

-- 10. Create notification_preferences table
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

-- Grant permissions
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT ON email_templates TO authenticated;
GRANT SELECT ON email_queue TO authenticated;
GRANT SELECT ON email_campaign_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE ON email_unsubscribes TO authenticated;
GRANT SELECT ON sms_messages TO authenticated;
GRANT SELECT, UPDATE ON push_notifications TO authenticated;
GRANT ALL ON notification_preferences TO authenticated;

-- Grant full permissions to service role
GRANT ALL ON email_templates TO service_role;
GRANT ALL ON email_queue TO service_role;
GRANT ALL ON email_campaign_metrics TO service_role;
GRANT ALL ON email_unsubscribes TO service_role;
GRANT ALL ON sms_messages TO service_role;
GRANT ALL ON push_notifications TO service_role;
GRANT ALL ON notification_preferences TO service_role;

-- Grant permissions for sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;