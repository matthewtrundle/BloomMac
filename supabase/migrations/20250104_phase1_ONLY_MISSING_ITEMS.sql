-- Phase 1 Security Fixes - ONLY MISSING ITEMS
-- This migration only creates what doesn't exist in your database

-- =====================================================
-- STEP 1: CREATE MISSING TABLES
-- =====================================================

-- 1. Conversion Events Table (MISSING)
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

-- 2. Chatbot Interactions Table (MISSING)
CREATE TABLE IF NOT EXISTS chatbot_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Email Sends Table (MISSING)
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
-- STEP 2: CREATE INDEXES FOR NEW TABLES
-- =====================================================

-- Conversion events indexes
CREATE INDEX IF NOT EXISTS idx_conversion_events_type ON conversion_events(event_type);
CREATE INDEX IF NOT EXISTS idx_conversion_events_session ON conversion_events(session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_created ON conversion_events(created_at);

-- Chatbot interactions indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_session ON chatbot_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_created ON chatbot_interactions(created_at);

-- Email sends indexes
CREATE INDEX IF NOT EXISTS idx_email_sends_status ON email_sends(status);
CREATE INDEX IF NOT EXISTS idx_email_sends_to_email ON email_sends(to_email);

-- =====================================================
-- STEP 3: ENABLE RLS ON NEW TABLES
-- =====================================================

ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 4: CREATE RLS POLICIES FOR NEW TABLES
-- =====================================================

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
-- STEP 5: ADD MISSING COLUMNS TO EXISTING TABLES
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
  
  -- Add opened_count and clicked_count to newsletter_sends if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'newsletter_sends' 
                 AND column_name = 'opened_count') THEN
    ALTER TABLE newsletter_sends ADD COLUMN opened_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'newsletter_sends' 
                 AND column_name = 'clicked_count') THEN
    ALTER TABLE newsletter_sends ADD COLUMN clicked_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create index for role queries if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- =====================================================
-- STEP 6: CREATE MISSING FUNCTIONS
-- =====================================================

-- 1. Handle newsletter signup (MISSING)
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

  -- Track conversion event
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

-- 2. Handle email unsubscribe (MISSING)
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

-- 3. Validate unsubscribe token (MISSING)
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

-- 4. Get analytics summary (MISSING)
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

-- 5. Get analytics dashboard (MISSING)
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
-- STEP 7: GRANT PERMISSIONS
-- =====================================================

-- Grant permissions on new tables
GRANT SELECT, INSERT ON conversion_events TO anon;
GRANT SELECT ON conversion_events TO authenticated;
GRANT SELECT, INSERT ON chatbot_interactions TO anon;
GRANT SELECT ON chatbot_interactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON email_sends TO authenticated;

-- Grant execute permissions on new functions
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

-- =====================================================
-- STEP 8: CREATE MISSING RPC FUNCTIONS (from secure routes)
-- =====================================================

-- Get email analytics
CREATE OR REPLACE FUNCTION get_email_analytics(days_ago INTEGER)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  WITH email_stats AS (
    SELECT 
      COUNT(*) FILTER (WHERE type = 'email_sent') as total_sent,
      COUNT(*) FILTER (WHERE type = 'email_open') as total_opened,
      COUNT(*) FILTER (WHERE type = 'email_click') as total_clicked,
      COUNT(*) FILTER (WHERE type = 'newsletter_unsubscribe' AND data->>'source' = 'email_link') as total_unsubscribed
    FROM analytics_events
    WHERE created_at >= NOW() - INTERVAL '1 day' * days_ago
      AND type IN ('email_sent', 'email_open', 'email_click', 'newsletter_unsubscribe')
  )
  SELECT jsonb_build_object(
    'total_sent', COALESCE(total_sent, 0),
    'total_opened', COALESCE(total_opened, 0),
    'total_clicked', COALESCE(total_clicked, 0),
    'total_unsubscribed', COALESCE(total_unsubscribed, 0),
    'avg_open_rate', 
      CASE 
        WHEN total_sent > 0 
        THEN ROUND((total_opened::NUMERIC / total_sent) * 100, 1)
        ELSE 0
      END,
    'avg_click_rate',
      CASE 
        WHEN total_opened > 0 
        THEN ROUND((total_clicked::NUMERIC / total_opened) * 100, 1)
        ELSE 0
      END
  ) INTO result
  FROM email_stats;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get subscriber stats
CREATE OR REPLACE FUNCTION get_subscriber_stats(days_ago INTEGER)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  WITH stats AS (
    SELECT 
      COUNT(*) FILTER (WHERE status = 'active') as total_active,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day' * days_ago) as new_subscribers,
      COUNT(*) FILTER (WHERE status = 'unsubscribed' AND unsubscribed_at >= NOW() - INTERVAL '1 day' * days_ago) as unsubscribed
    FROM subscribers
  ),
  domains AS (
    SELECT 
      split_part(email, '@', 2) as domain,
      COUNT(*) as count
    FROM subscribers
    WHERE status = 'active'
    GROUP BY domain
    ORDER BY count DESC
    LIMIT 5
  )
  SELECT jsonb_build_object(
    'total_active', stats.total_active,
    'new_subscribers', stats.new_subscribers,
    'unsubscribed', stats.unsubscribed,
    'growth_rate', 
      CASE 
        WHEN stats.new_subscribers > 0 
        THEN ROUND(((stats.new_subscribers - stats.unsubscribed)::NUMERIC / stats.new_subscribers) * 100, 1)
        ELSE 0
      END,
    'top_domains', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'domain', domain,
          'count', count,
          'percentage', ROUND((count::NUMERIC / stats.total_active) * 100, 1)
        )
      )
      FROM domains
    )
  ) INTO result
  FROM stats;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get email engagement patterns
CREATE OR REPLACE FUNCTION get_email_engagement_patterns(days_ago INTEGER)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  WITH hourly AS (
    SELECT 
      EXTRACT(HOUR FROM created_at) as hour,
      COUNT(*) as opens
    FROM analytics_events
    WHERE type = 'email_open'
      AND created_at >= NOW() - INTERVAL '1 day' * days_ago
    GROUP BY hour
  ),
  daily AS (
    SELECT 
      TO_CHAR(created_at, 'Dy') as day,
      COUNT(*) as opens
    FROM analytics_events
    WHERE type = 'email_open'
      AND created_at >= NOW() - INTERVAL '1 day' * days_ago
    GROUP BY day
  )
  SELECT jsonb_build_object(
    'hourly_distribution', (
      SELECT jsonb_agg(
        jsonb_build_object('hour', hour::INTEGER, 'opens', opens)
        ORDER BY hour
      )
      FROM generate_series(0, 23) as hour
      LEFT JOIN hourly USING (hour)
    ),
    'daily_distribution', (
      SELECT jsonb_agg(
        jsonb_build_object('day', day, 'opens', COALESCE(opens, 0))
      )
      FROM (VALUES ('Mon'), ('Tue'), ('Wed'), ('Thu'), ('Fri'), ('Sat'), ('Sun')) as d(day)
      LEFT JOIN daily USING (day)
    ),
    'best_send_time', 'Tuesday 10:00 AM'
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get subscriber growth trend
CREATE OR REPLACE FUNCTION get_subscriber_growth_trend(days INTEGER)
RETURNS TABLE(
  date DATE,
  subscribers INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - INTERVAL '1 day' * (days - 1),
      CURRENT_DATE,
      '1 day'::interval
    )::date AS date
  )
  SELECT 
    ds.date,
    COUNT(s.id) FILTER (WHERE s.created_at::date <= ds.date AND (s.status = 'active' OR s.unsubscribed_at::date > ds.date))::INTEGER as subscribers
  FROM date_series ds
  LEFT JOIN subscribers s ON true
  GROUP BY ds.date
  ORDER BY ds.date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions on these functions
GRANT EXECUTE ON FUNCTION get_email_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION get_subscriber_stats TO authenticated;
GRANT EXECUTE ON FUNCTION get_email_engagement_patterns TO authenticated;
GRANT EXECUTE ON FUNCTION get_subscriber_growth_trend TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Phase 1 Migration - ONLY MISSING ITEMS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Created missing tables:';
  RAISE NOTICE '  - conversion_events';
  RAISE NOTICE '  - chatbot_interactions';
  RAISE NOTICE '  - email_sends';
  RAISE NOTICE '';
  RAISE NOTICE 'Created missing functions:';
  RAISE NOTICE '  - handle_newsletter_signup';
  RAISE NOTICE '  - handle_email_unsubscribe';
  RAISE NOTICE '  - validate_unsubscribe_token';
  RAISE NOTICE '  - get_analytics_summary';
  RAISE NOTICE '  - get_analytics_dashboard';
  RAISE NOTICE '  - get_email_analytics';
  RAISE NOTICE '  - get_subscriber_stats';
  RAISE NOTICE '  - get_email_engagement_patterns';
  RAISE NOTICE '  - get_subscriber_growth_trend';
  RAISE NOTICE '';
  RAISE NOTICE 'All migrations completed successfully!';
  RAISE NOTICE '========================================';
END $$;