-- Create missing tables for Bloom Psychology Platform

-- 1. User Courses (enrollment tracking)
CREATE TABLE IF NOT EXISTS user_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Will reference auth.users when auth is implemented
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    stripe_payment_intent_id TEXT,
    access_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- 2. Email Automation Rules
CREATE TABLE IF NOT EXISTS email_automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    trigger_type TEXT NOT NULL CHECK (trigger_type IN ('signup', 'purchase', 'download', 'tag_added', 'custom')),
    trigger_config JSONB DEFAULT '{}',
    conditions JSONB DEFAULT '[]',
    actions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Email Analytics
CREATE TABLE IF NOT EXISTS email_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_id UUID NOT NULL,
    recipient_email TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed')),
    event_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'complained')),
    tags TEXT[] DEFAULT '{}',
    source TEXT,
    ip_address INET,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Newsletter Sends
CREATE TABLE IF NOT EXISTS newsletter_sends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    template_id UUID REFERENCES email_templates(id),
    sent_by TEXT,
    recipient_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    stats JSONB DEFAULT '{"sent": 0, "opened": 0, "clicked": 0, "bounced": 0, "complained": 0}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Blog Images Metadata
CREATE TABLE IF NOT EXISTS blog_images_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    uploaded_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Bookings (Calendly webhook data)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendly_event_id TEXT UNIQUE,
    event_type TEXT,
    invitee_name TEXT,
    invitee_email TEXT,
    event_start_time TIMESTAMP WITH TIME ZONE,
    event_end_time TIMESTAMP WITH TIME ZONE,
    location TEXT,
    questions_and_answers JSONB DEFAULT '[]',
    calendly_data JSONB,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_status ON user_courses(status);
CREATE INDEX IF NOT EXISTS idx_email_analytics_email_id ON email_analytics(email_id);
CREATE INDEX IF NOT EXISTS idx_email_analytics_event_type ON email_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_email_analytics_created_at ON email_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_bookings_calendly_event_id ON bookings(calendly_event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_invitee_email ON bookings(invitee_email);

-- Add RLS policies
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_images_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Admin access policies (temporary until auth is implemented)
CREATE POLICY "Admins can view all user_courses" ON user_courses FOR ALL USING (true);
CREATE POLICY "Admins can manage email_automation_rules" ON email_automation_rules FOR ALL USING (true);
CREATE POLICY "Admins can view email_analytics" ON email_analytics FOR ALL USING (true);
CREATE POLICY "Admins can manage newsletter_subscribers" ON newsletter_subscribers FOR ALL USING (true);
CREATE POLICY "Admins can manage newsletter_sends" ON newsletter_sends FOR ALL USING (true);
CREATE POLICY "Admins can manage blog_images_metadata" ON blog_images_metadata FOR ALL USING (true);
CREATE POLICY "Admins can manage bookings" ON bookings FOR ALL USING (true);

-- Add comments
COMMENT ON TABLE user_courses IS 'Tracks user enrollment in courses';
COMMENT ON TABLE email_automation_rules IS 'Defines automated email sending rules';
COMMENT ON TABLE email_analytics IS 'Tracks email engagement metrics';
COMMENT ON TABLE newsletter_subscribers IS 'Newsletter subscriber list';
COMMENT ON TABLE newsletter_sends IS 'Newsletter campaign history';
COMMENT ON TABLE blog_images_metadata IS 'Metadata for blog post images';
COMMENT ON TABLE bookings IS 'Calendly booking webhook data';