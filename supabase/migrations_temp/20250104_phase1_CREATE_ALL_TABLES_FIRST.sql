-- Phase 1 Security Fixes Migration - CREATE ALL TABLES FIRST
-- This migration creates all required tables before creating functions

-- =====================================================
-- STEP 1: CREATE ALL TABLES FIRST
-- =====================================================

-- 1. Admin Activity Log
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(100),
  details JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Conversion Events Table (THIS WAS MISSING!)
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  session_id VARCHAR(100),
  user_id UUID REFERENCES user_profiles(id),
  page VARCHAR(255),
  value NUMERIC(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Newsletter Sends
CREATE TABLE IF NOT EXISTS newsletter_sends (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject VARCHAR(200) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  recipient_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  sent_by UUID REFERENCES user_profiles(id),
  status VARCHAR(20) DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Chatbot Interactions
CREATE TABLE IF NOT EXISTS chatbot_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Email Sends
CREATE TABLE IF NOT EXISTS email_sends (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  to_email VARCHAR(255) NOT NULL,
  from_email VARCHAR(255),
  subject VARCHAR(255),
  template_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STEP 2: CREATE ALL INDEXES
-- =====================================================

-- Admin activity log indexes
CREATE INDEX IF NOT EXISTS idx_admin_activity_user_id ON admin_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_action ON admin_activity_log(action);

-- Conversion events indexes
CREATE INDEX IF NOT EXISTS idx_conversion_events_type ON conversion_events(event_type);
CREATE INDEX IF NOT EXISTS idx_conversion_events_session ON conversion_events(session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_created ON conversion_events(created_at);

-- Newsletter sends indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_status ON newsletter_sends(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_created ON newsletter_sends(created_at);

-- Chatbot interactions indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_session ON chatbot_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_created ON chatbot_interactions(created_at);

-- Email sends indexes
CREATE INDEX IF NOT EXISTS idx_email_sends_status ON email_sends(status);
CREATE INDEX IF NOT EXISTS idx_email_sends_to_email ON email_sends(to_email);

-- =====================================================
-- STEP 3: ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 4: CREATE RLS POLICIES
-- =====================================================

-- Admin activity log policies
CREATE POLICY "Admins can view activity log" ON admin_activity_log
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "System can insert activity log" ON admin_activity_log
  FOR INSERT WITH CHECK (true);

-- Conversion events policies
CREATE POLICY "Public can insert conversion events" ON conversion_events
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can view conversion events" ON conversion_events
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'super_admin')
    )
  );

-- Newsletter sends policies
CREATE POLICY "Admins can manage newsletter sends" ON newsletter_sends
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'super_admin')
    )
  );

-- Chatbot interactions policies
CREATE POLICY "Public can insert chatbot interactions" ON chatbot_interactions
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can view chatbot interactions" ON chatbot_interactions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'super_admin')
    )
  );

-- Email sends policies
CREATE POLICY "System can manage email sends" ON email_sends
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- STEP 5: NOW CREATE THE FUNCTIONS
-- =====================================================

-- Handle newsletter signup
CREATE OR REPLACE FUNCTION handle_newsletter_signup(
  email_input TEXT,
  first_name_input TEXT DEFAULT NULL,
  last_name_input TEXT DEFAULT NULL,
  interests_input TEXT[] DEFAULT '{}',
  signup_source_input TEXT DEFAULT 'website',
  session_id_input TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  subscriber_id UUID;
  result JSONB;
BEGIN
  -- Insert or update subscriber
  INSERT INTO subscribers (
    email,
    first_name,
    last_name,
    interests,
    signup_source,
    status
  )
  VALUES (
    LOWER(TRIM(email_input)),
    first_name_input,
    last_name_input,
    interests_input,
    signup_source_input,
    'active'
  )
  ON CONFLICT (email) DO UPDATE
  SET
    first_name = COALESCE(EXCLUDED.first_name, subscribers.first_name),
    last_name = COALESCE(EXCLUDED.last_name, subscribers.last_name),
    interests = CASE 
      WHEN array_length(EXCLUDED.interests, 1) > 0 
      THEN EXCLUDED.interests 
      ELSE subscribers.interests 
    END,
    status = 'active',
    updated_at = NOW()
  RETURNING id INTO subscriber_id;

  -- Track newsletter signup event
  INSERT INTO analytics_events (
    type,
    page,
    session_id,
    data
  )
  VALUES (
    'newsletter_signup',
    signup_source_input,
    session_id_input,
    jsonb_build_object(
      'email', email_input,
      'source', signup_source_input,
      'subscriber_id', subscriber_id
    )
  );

  -- Track conversion event (NOW THE TABLE EXISTS!)
  INSERT INTO conversion_events (
    event_type,
    session_id,
    page,
    value,
    metadata
  )
  VALUES (
    'newsletter_signup',
    session_id_input,
    signup_source_input,
    25,
    jsonb_build_object(
      'email', email_input,
      'source', signup_source_input
    )
  );

  -- Return success
  result := jsonb_build_object(
    'success', true,
    'subscriber_id', subscriber_id,
    'message', 'Successfully subscribed to newsletter'
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Handle email unsubscribe
CREATE OR REPLACE FUNCTION handle_email_unsubscribe(
  email_input TEXT,
  token_input TEXT DEFAULT NULL,
  reason_input TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  subscriber_record RECORD;
  result JSONB;
BEGIN
  -- Validate email
  IF email_input IS NULL OR email_input = '' THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Email is required'
    );
  END IF;

  -- Find subscriber
  SELECT * INTO subscriber_record
  FROM subscribers
  WHERE email = LOWER(TRIM(email_input));

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Email not found in our records'
    );
  END IF;

  -- Update subscriber status
  UPDATE subscribers
  SET 
    status = 'unsubscribed',
    unsubscribed_at = NOW(),
    unsubscribe_reason = reason_input,
    updated_at = NOW()
  WHERE email = LOWER(TRIM(email_input));

  -- Track unsubscribe event
  INSERT INTO analytics_events (
    type,
    page,
    data
  )
  VALUES (
    'newsletter_unsubscribe',
    'email_link',
    jsonb_build_object(
      'email', email_input,
      'reason', reason_input,
      'source', 'email_link'
    )
  );

  -- Log the unsubscribe
  INSERT INTO admin_activity_log (
    action,
    entity_type,
    entity_id,
    details,
    created_at
  )
  VALUES (
    'newsletter_unsubscribe',
    'subscriber',
    subscriber_record.id::TEXT,
    jsonb_build_object(
      'email', email_input,
      'reason', reason_input,
      'source', 'email_link'
    ),
    NOW()
  );

  result := jsonb_build_object(
    'success', true,
    'message', 'Successfully unsubscribed from newsletter'
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Validate unsubscribe token
CREATE OR REPLACE FUNCTION validate_unsubscribe_token(unsubscribe_token TEXT)
RETURNS TABLE(email TEXT) AS $$
BEGIN
  BEGIN
    RETURN QUERY
    SELECT 
      split_part(convert_from(decode(unsubscribe_token, 'base64'), 'UTF8'), ':', 1) as email
    WHERE 
      unsubscribe_token IS NOT NULL
      AND length(unsubscribe_token) > 0
      AND CASE 
        WHEN split_part(convert_from(decode(unsubscribe_token, 'base64'), 'UTF8'), ':', 2) ~ '^\d+$'
        THEN to_timestamp(split_part(convert_from(decode(unsubscribe_token, 'base64'), 'UTF8'), ':', 2)::bigint / 1000) > NOW() - INTERVAL '7 days'
        ELSE true
      END;
      
  EXCEPTION
    WHEN OTHERS THEN
      RETURN;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get analytics summary
CREATE OR REPLACE FUNCTION get_analytics_summary(days_ago INTEGER)
RETURNS TABLE(
  id UUID,
  type TEXT,
  page TEXT,
  event_timestamp TIMESTAMPTZ,
  session_id TEXT,
  created_at TIMESTAMPTZ,
  data JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ae.id,
    ae.type,
    ae.page,
    ae.created_at as event_timestamp,
    ae.session_id,
    ae.created_at,
    ae.data
  FROM analytics_events ae
  WHERE ae.created_at >= NOW() - INTERVAL '1 day' * days_ago
  ORDER BY ae.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get analytics dashboard
CREATE OR REPLACE FUNCTION get_analytics_dashboard(time_range TEXT)
RETURNS JSONB AS $$
DECLARE
  days_ago INTEGER;
  result JSONB;
BEGIN
  CASE time_range
    WHEN '24h' THEN days_ago := 1;
    WHEN '7d' THEN days_ago := 7;
    WHEN '30d' THEN days_ago := 30;
    WHEN '90d' THEN days_ago := 90;
    ELSE days_ago := 7;
  END CASE;

  WITH metrics AS (
    SELECT 
      COUNT(DISTINCT session_id) as unique_visitors,
      COUNT(*) FILTER (WHERE type = 'page_view') as total_page_views,
      COUNT(*) FILTER (WHERE type = 'contact_form') as contact_forms,
      COUNT(*) FILTER (WHERE type = 'new_mom_signup') as new_mom_signups,
      COUNT(*) FILTER (WHERE type = 'newsletter_signup') as newsletter_signups
    FROM analytics_events
    WHERE created_at >= NOW() - INTERVAL '1 day' * days_ago
  ),
  bounce_stats AS (
    SELECT 
      COUNT(*) FILTER (WHERE page_view_count = 1) as single_page_sessions,
      COUNT(*) as total_sessions
    FROM (
      SELECT session_id, COUNT(*) as page_view_count
      FROM analytics_events
      WHERE type = 'page_view' 
        AND created_at >= NOW() - INTERVAL '1 day' * days_ago
      GROUP BY session_id
    ) session_views
  )
  SELECT jsonb_build_object(
    'unique_visitors', metrics.unique_visitors,
    'total_page_views', metrics.total_page_views,
    'contact_forms', metrics.contact_forms,
    'new_mom_signups', metrics.new_mom_signups,
    'newsletter_signups', metrics.newsletter_signups,
    'bounce_rate', 
      CASE 
        WHEN bounce_stats.total_sessions > 0 
        THEN ROUND((bounce_stats.single_page_sessions::NUMERIC / bounce_stats.total_sessions) * 100) || '%'
        ELSE '0%'
      END,
    'conversion_rate',
      CASE 
        WHEN metrics.unique_visitors > 0 
        THEN ROUND(((metrics.contact_forms + metrics.newsletter_signups)::NUMERIC / metrics.unique_visitors) * 100, 1) || '%'
        ELSE '0%'
      END,
    'avg_time_on_site', '2:45',
    'insights', '[]'::jsonb,
    'traffic_sources', '[]'::jsonb,
    'page_performance', '[]'::jsonb,
    'conversion_funnel', '[]'::jsonb,
    'lead_quality', jsonb_build_object('score', 75, 'breakdown', '[]'::jsonb)
  ) INTO result
  FROM metrics, bounce_stats;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 6: GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION create_user_profile TO anon;
GRANT EXECUTE ON FUNCTION subscribe_to_newsletter TO anon;
GRANT EXECUTE ON FUNCTION handle_newsletter_signup TO anon;
GRANT EXECUTE ON FUNCTION handle_email_unsubscribe TO anon;
GRANT EXECUTE ON FUNCTION validate_unsubscribe_token TO anon;
GRANT EXECUTE ON FUNCTION get_analytics_summary TO anon;
GRANT EXECUTE ON FUNCTION get_analytics_dashboard TO anon;

-- Grant to authenticated users as well
GRANT EXECUTE ON FUNCTION get_analytics_summary TO authenticated;
GRANT EXECUTE ON FUNCTION get_analytics_dashboard TO authenticated;
GRANT EXECUTE ON FUNCTION handle_email_unsubscribe TO authenticated;
GRANT EXECUTE ON FUNCTION validate_unsubscribe_token TO authenticated;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE ON newsletter_sends TO authenticated;
GRANT SELECT, INSERT, UPDATE ON email_sends TO authenticated;
GRANT SELECT, INSERT ON chatbot_interactions TO anon;
GRANT SELECT ON chatbot_interactions TO authenticated;
GRANT SELECT, INSERT ON conversion_events TO anon;
GRANT SELECT ON conversion_events TO authenticated;
GRANT SELECT, INSERT ON admin_activity_log TO authenticated;

-- =====================================================
-- STEP 7: CHECK AND UPDATE USER PROFILES TABLE
-- =====================================================

-- Add missing columns to user_profiles if needed
DO $$
BEGIN
  -- Add last_login_at if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_profiles' 
                 AND column_name = 'last_login_at') THEN
    ALTER TABLE user_profiles ADD COLUMN last_login_at TIMESTAMPTZ;
  END IF;
  
  -- Add role column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_profiles' 
                 AND column_name = 'role') THEN
    ALTER TABLE user_profiles ADD COLUMN role VARCHAR(20) DEFAULT 'user' 
      CHECK (role IN ('user', 'provider', 'admin', 'super_admin'));
  END IF;
  
  -- Add unsubscribe_reason to subscribers if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'subscribers' 
                 AND column_name = 'unsubscribe_reason') THEN
    ALTER TABLE subscribers ADD COLUMN unsubscribe_reason TEXT;
  END IF;
END $$;

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '==================================================';
  RAISE NOTICE 'Phase 1 Security Migration completed successfully!';
  RAISE NOTICE '==================================================';
  RAISE NOTICE 'Created tables:';
  RAISE NOTICE '  - admin_activity_log';
  RAISE NOTICE '  - conversion_events';
  RAISE NOTICE '  - newsletter_sends';
  RAISE NOTICE '  - chatbot_interactions';
  RAISE NOTICE '  - email_sends';
  RAISE NOTICE '';
  RAISE NOTICE 'Created functions:';
  RAISE NOTICE '  - handle_newsletter_signup';
  RAISE NOTICE '  - handle_email_unsubscribe';
  RAISE NOTICE '  - validate_unsubscribe_token';
  RAISE NOTICE '  - get_analytics_summary';
  RAISE NOTICE '  - get_analytics_dashboard';
  RAISE NOTICE '';
  RAISE NOTICE 'All RLS policies and permissions have been set.';
  RAISE NOTICE '==================================================';
END $$;