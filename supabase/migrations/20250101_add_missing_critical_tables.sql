-- Critical Missing Tables for Bloom Psychology
-- Run this after the nuclear fix to add webhook and notification support

-- 1. Stripe Webhook Events (Critical for payment reliability)
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient webhook processing
CREATE INDEX idx_stripe_webhooks_event_id ON stripe_webhook_events(stripe_event_id);
CREATE INDEX idx_stripe_webhooks_processed ON stripe_webhook_events(processed, created_at);

-- 2. Calendly Webhook Events (Critical for appointment sync)
CREATE TABLE IF NOT EXISTS calendly_webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_uuid TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    uri TEXT,
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for webhook processing
CREATE INDEX idx_calendly_webhooks_event_uuid ON calendly_webhook_events(event_uuid);
CREATE INDEX idx_calendly_webhooks_processed ON calendly_webhook_events(processed, created_at);

-- 3. User Notifications (For engagement)
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('achievement', 'appointment', 'course', 'workshop', 'payment', 'system')),
    title TEXT NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for notification queries
CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id, read, created_at DESC);
CREATE INDEX idx_user_notifications_created ON user_notifications(created_at DESC);

-- 4. Email Campaign Metrics (Marketing analytics)
CREATE TABLE IF NOT EXISTS email_campaign_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    email_id UUID REFERENCES email_queue(id),
    recipient_email TEXT NOT NULL,
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,
    bounce_type TEXT CHECK (bounce_type IN ('hard', 'soft', 'complaint')),
    click_data JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for email analytics
CREATE INDEX idx_email_metrics_campaign ON email_campaign_metrics(campaign_id);
CREATE INDEX idx_email_metrics_recipient ON email_campaign_metrics(recipient_email);
CREATE INDEX idx_email_metrics_dates ON email_campaign_metrics(sent_at, opened_at);

-- 5. Course Discount Codes (Promotions)
CREATE TABLE IF NOT EXISTS course_discount_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
    course_id TEXT, -- NULL means applies to all courses
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    minimum_purchase DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for code lookups
CREATE INDEX idx_discount_codes_code ON course_discount_codes(code, is_active);
CREATE INDEX idx_discount_codes_dates ON course_discount_codes(valid_from, valid_until);

-- 6. Therapist Profiles (Multi-provider support)
CREATE TABLE IF NOT EXISTS therapist_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    specializations TEXT[],
    languages TEXT[] DEFAULT ARRAY['English'],
    calendly_url TEXT,
    hourly_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    license_number TEXT,
    license_state TEXT,
    years_experience INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for therapist lookups
CREATE INDEX idx_therapist_profiles_active ON therapist_profiles(is_active);
CREATE INDEX idx_therapist_profiles_user ON therapist_profiles(user_id);

-- Enable RLS on new tables
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendly_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Stripe webhooks (admin only)
CREATE POLICY "Only admins can view stripe webhooks" ON stripe_webhook_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Calendly webhooks (admin only)
CREATE POLICY "Only admins can view calendly webhooks" ON calendly_webhook_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- User notifications
CREATE POLICY "Users can view their own notifications" ON user_notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON user_notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Email campaign metrics (admin only)
CREATE POLICY "Only admins can view email metrics" ON email_campaign_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Discount codes (public read for valid codes)
CREATE POLICY "Anyone can view active discount codes" ON course_discount_codes
    FOR SELECT USING (
        is_active = true 
        AND (valid_from IS NULL OR valid_from <= NOW())
        AND (valid_until IS NULL OR valid_until >= NOW())
    );

CREATE POLICY "Only admins can manage discount codes" ON course_discount_codes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id = auth.uid()
        )
    );

-- Therapist profiles (public read)
CREATE POLICY "Anyone can view active therapist profiles" ON therapist_profiles
    FOR SELECT USING (is_active = true);

CREATE POLICY "Therapists can update their own profile" ON therapist_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to create notification
CREATE OR REPLACE FUNCTION create_user_notification(
    p_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT DEFAULT NULL,
    p_data JSONB DEFAULT '{}',
    p_action_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO user_notifications (
        user_id, type, title, message, data, action_url
    ) VALUES (
        p_user_id, p_type, p_title, p_message, p_data, p_action_url
    ) RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process webhook with retry logic
CREATE OR REPLACE FUNCTION mark_webhook_processed(
    p_webhook_id UUID,
    p_table_name TEXT,
    p_success BOOLEAN,
    p_error_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    IF p_table_name = 'stripe' THEN
        UPDATE stripe_webhook_events
        SET 
            processed = p_success,
            processed_at = NOW(),
            error_message = p_error_message,
            retry_count = CASE WHEN p_success THEN retry_count ELSE retry_count + 1 END
        WHERE id = p_webhook_id;
    ELSIF p_table_name = 'calendly' THEN
        UPDATE calendly_webhook_events
        SET 
            processed = p_success,
            processed_at = NOW(),
            error_message = p_error_message,
            retry_count = CASE WHEN p_success THEN retry_count ELSE retry_count + 1 END
        WHERE id = p_webhook_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_user_notification TO authenticated;
GRANT EXECUTE ON FUNCTION mark_webhook_processed TO service_role;

-- Success message
SELECT 'Critical missing tables created successfully!' as result;