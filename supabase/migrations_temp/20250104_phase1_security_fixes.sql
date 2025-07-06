-- Phase 1 Security Fixes Migration
-- This migration adds RPC functions and RLS policies needed for secure API routes

-- =====================================================
-- USER PROFILES
-- =====================================================

-- Add missing columns to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'provider', 'admin', 'super_admin'));

-- Create index for role queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'super_admin')
    )
  );

-- =====================================================
-- ADMIN ACTIVITY LOG
-- =====================================================

-- Create admin audit trail if not exists
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

-- Create index for activity queries
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_action ON admin_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at);

-- Allow anonymous to log certain events
CREATE POLICY "Allow anonymous to log failed logins" ON admin_activity_log
  FOR INSERT TO anon
  WITH CHECK (action IN ('failed_admin_login', 'unauthorized_admin_login_attempt', 'newsletter_signup', 'newsletter_unsubscribe'));

-- =====================================================
-- ANALYTICS EVENTS
-- =====================================================

-- Allow public to insert analytics events
CREATE POLICY "Public can insert analytics events" ON analytics_events
  FOR INSERT TO anon
  WITH CHECK (true);

-- =====================================================
-- CONTACT SUBMISSIONS
-- =====================================================

-- Allow public to submit contacts
CREATE POLICY "Public can submit contacts" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- =====================================================
-- CAREER APPLICATIONS
-- =====================================================

-- Allow public to submit career applications
CREATE POLICY "Public can submit career applications" ON career_applications
  FOR INSERT TO anon
  WITH CHECK (true);

-- =====================================================
-- NEWSLETTER FUNCTIONS
-- =====================================================

-- Create user profile function
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_first_name TEXT,
  user_last_name TEXT,
  user_phone TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_profiles (id, email, first_name, last_name, phone, status, created_at)
  VALUES (user_id, user_email, user_first_name, user_last_name, user_phone, 'active', NOW())
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Subscribe to newsletter function
CREATE OR REPLACE FUNCTION subscribe_to_newsletter(
  subscriber_email TEXT,
  subscriber_first_name TEXT,
  subscriber_last_name TEXT,
  subscriber_source TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO subscribers (email, first_name, last_name, status, source, created_at)
  VALUES (subscriber_email, subscriber_first_name, subscriber_last_name, 'active', subscriber_source, NOW())
  ON CONFLICT (email) DO UPDATE
  SET first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Handle newsletter signup
CREATE OR REPLACE FUNCTION handle_newsletter_signup(
  subscriber_email TEXT,
  subscriber_first_name TEXT,
  subscriber_last_name TEXT,
  signup_source TEXT,
  subscriber_interests TEXT[],
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT
)
RETURNS JSONB AS $$
DECLARE
  existing_subscriber RECORD;
  new_subscriber RECORD;
  result JSONB;
BEGIN
  -- Check if subscriber exists
  SELECT * INTO existing_subscriber
  FROM subscribers
  WHERE email = LOWER(subscriber_email);
  
  IF existing_subscriber.id IS NOT NULL THEN
    IF existing_subscriber.status = 'active' THEN
      -- Already active
      RAISE EXCEPTION 'already_active';
    ELSE
      -- Reactivate
      UPDATE subscribers
      SET 
        status = 'active',
        updated_at = NOW()
      WHERE id = existing_subscriber.id
      RETURNING * INTO new_subscriber;
      
      result := jsonb_build_object(
        'subscriber', row_to_json(new_subscriber),
        'reactivated', true
      );
    END IF;
  ELSE
    -- Create new subscriber
    INSERT INTO subscribers (
      email,
      first_name,
      last_name,
      status,
      signup_source,
      interests,
      ip_address,
      user_agent,
      referrer,
      confirmed,
      created_at
    ) VALUES (
      LOWER(subscriber_email),
      subscriber_first_name,
      subscriber_last_name,
      'active',
      signup_source,
      subscriber_interests,
      ip_address,
      user_agent,
      referrer,
      true,
      NOW()
    )
    RETURNING * INTO new_subscriber;
    
    result := jsonb_build_object(
      'subscriber', row_to_json(new_subscriber),
      'reactivated', false
    );
  END IF;
  
  -- Log activity
  INSERT INTO admin_activity_log (
    action,
    entity_type,
    entity_id,
    details,
    created_at
  ) VALUES (
    'newsletter_signup',
    'subscriber',
    new_subscriber.id::TEXT,
    jsonb_build_object(
      'email', new_subscriber.email,
      'source', signup_source,
      'reactivated', (result->>'reactivated')::boolean
    ),
    NOW()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Handle email unsubscribe
CREATE OR REPLACE FUNCTION handle_email_unsubscribe(
  subscriber_email TEXT,
  unsubscribe_source TEXT,
  ip_address TEXT,
  user_agent TEXT
)
RETURNS JSONB AS $$
DECLARE
  existing_subscriber RECORD;
  result JSONB;
BEGIN
  -- Check if subscriber exists
  SELECT * INTO existing_subscriber
  FROM subscribers
  WHERE email = LOWER(subscriber_email);
  
  IF existing_subscriber.id IS NULL THEN
    -- Not in list
    result := jsonb_build_object(
      'success', true,
      'already_unsubscribed', true,
      'message', 'Email not found in subscriber list'
    );
  ELSIF existing_subscriber.status = 'unsubscribed' THEN
    -- Already unsubscribed
    result := jsonb_build_object(
      'success', true,
      'already_unsubscribed', true,
      'message', 'Already unsubscribed'
    );
  ELSE
    -- Unsubscribe
    UPDATE subscribers
    SET 
      status = 'unsubscribed',
      unsubscribed_at = NOW(),
      updated_at = NOW()
    WHERE id = existing_subscriber.id;
    
    -- Log activity
    INSERT INTO admin_activity_log (
      action,
      entity_type,
      entity_id,
      details,
      created_at
    ) VALUES (
      'newsletter_unsubscribe',
      'subscriber',
      existing_subscriber.id::TEXT,
      jsonb_build_object(
        'email', subscriber_email,
        'source', unsubscribe_source,
        'ip_address', ip_address,
        'user_agent', user_agent
      ),
      NOW()
    );
    
    result := jsonb_build_object(
      'success', true,
      'already_unsubscribed', false,
      'message', 'Successfully unsubscribed'
    );
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Validate unsubscribe token
CREATE OR REPLACE FUNCTION validate_unsubscribe_token(unsubscribe_token TEXT)
RETURNS TABLE(email TEXT) AS $$
BEGIN
  -- Simple implementation - in production, use proper token validation
  -- This assumes token format: base64(email:timestamp:signature)
  -- You should implement proper HMAC validation
  
  -- For now, just decode the email part
  RETURN QUERY
  SELECT 
    split_part(convert_from(decode(unsubscribe_token, 'base64'), 'UTF8'), ':', 1) as email
  WHERE 
    -- Check token isn't too old (7 days)
    to_timestamp(split_part(convert_from(decode(unsubscribe_token, 'base64'), 'UTF8'), ':', 2)::bigint) > NOW() - INTERVAL '7 days';
    
  EXCEPTION
    WHEN OTHERS THEN
      -- Invalid token format
      RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ANALYTICS FUNCTIONS
-- =====================================================

-- Get analytics summary
CREATE OR REPLACE FUNCTION get_analytics_summary(days_ago INTEGER)
RETURNS TABLE(
  id UUID,
  type TEXT,
  page TEXT,
  timestamp TIMESTAMPTZ,
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
    ae.created_at as timestamp,
    ae.session_id,
    ae.created_at,
    ae.data
  FROM analytics_events ae
  WHERE ae.created_at >= NOW() - INTERVAL '1 day' * days_ago
  ORDER BY ae.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get full analytics dashboard
CREATE OR REPLACE FUNCTION get_analytics_dashboard(time_range TEXT)
RETURNS JSONB AS $$
DECLARE
  days_ago INTEGER;
  result JSONB;
BEGIN
  -- Convert time range to days
  CASE time_range
    WHEN '24h' THEN days_ago := 1;
    WHEN '7d' THEN days_ago := 7;
    WHEN '30d' THEN days_ago := 30;
    WHEN '90d' THEN days_ago := 90;
    ELSE days_ago := 7;
  END CASE;

  -- Calculate all metrics
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
-- GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION create_user_profile TO anon;
GRANT EXECUTE ON FUNCTION subscribe_to_newsletter TO anon;
GRANT EXECUTE ON FUNCTION handle_newsletter_signup TO anon;
GRANT EXECUTE ON FUNCTION handle_email_unsubscribe TO anon;
GRANT EXECUTE ON FUNCTION validate_unsubscribe_token TO anon;
GRANT EXECUTE ON FUNCTION get_analytics_summary TO anon;
GRANT EXECUTE ON FUNCTION get_analytics_dashboard TO anon;

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create resumes bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Allow public to upload resumes
CREATE POLICY "Public can upload resumes" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'resumes');

-- =====================================================
-- CLEANUP
-- =====================================================

-- Note: The following should be done after confirming all API routes are updated:
-- 1. Remove service role key from environment variables
-- 2. Rotate the service role key in Supabase dashboard
-- 3. Update any edge functions that legitimately need service role
-- 4. Remove the deprecated admin_users table after migrating to user_profiles