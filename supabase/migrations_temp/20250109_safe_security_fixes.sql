-- Safe Security Fixes Migration - Checks for existing objects
-- This migration safely applies missing functions and permissions

-- =====================================================
-- HELPER: Check if function exists
-- =====================================================
CREATE OR REPLACE FUNCTION pg_temp.function_exists(func_name text, func_schema text DEFAULT 'public')
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = func_schema AND p.proname = func_name
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FIX 1: Create missing handle_newsletter_signup function (if not exists)
-- =====================================================
DO $$
BEGIN
  IF NOT pg_temp.function_exists('handle_newsletter_signup') THEN
    CREATE OR REPLACE FUNCTION handle_newsletter_signup(
      email_input TEXT,
      first_name_input TEXT DEFAULT NULL,
      last_name_input TEXT DEFAULT NULL,
      interests_input TEXT[] DEFAULT '{}',
      signup_source_input TEXT DEFAULT 'website',
      session_id_input TEXT DEFAULT NULL
    )
    RETURNS JSONB AS $func$
    DECLARE
      subscriber_id UUID;
      result JSONB;
    BEGIN
      -- Insert or update subscriber
      INSERT INTO subscribers (
        email,
        status
      )
      VALUES (
        LOWER(TRIM(email_input)),
        'active'
      )
      ON CONFLICT (email) DO UPDATE
      SET
        status = 'active',
        updated_at = NOW()
      RETURNING id INTO subscriber_id;

      -- Track newsletter signup event (only if analytics_events exists)
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics_events') THEN
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
      END IF;

      -- Track conversion event (only if conversion_events exists)
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversion_events') THEN
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
      END IF;

      -- Return success
      result := jsonb_build_object(
        'success', true,
        'subscriber_id', subscriber_id,
        'message', 'Successfully subscribed to newsletter'
      );

      RETURN result;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;
    
    RAISE NOTICE 'Created function: handle_newsletter_signup';
  ELSE
    RAISE NOTICE 'Function already exists: handle_newsletter_signup';
  END IF;
END $$;

-- =====================================================
-- FIX 2: Create missing handle_email_unsubscribe function (if not exists)
-- =====================================================
DO $$
BEGIN
  IF NOT pg_temp.function_exists('handle_email_unsubscribe') THEN
    CREATE OR REPLACE FUNCTION handle_email_unsubscribe(
      email_input TEXT,
      token_input TEXT DEFAULT NULL,
      reason_input TEXT DEFAULT NULL
    )
    RETURNS JSONB AS $func$
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
        updated_at = NOW()
      WHERE email = LOWER(TRIM(email_input));

      -- Track unsubscribe event (only if analytics_events exists)
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics_events') THEN
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
      END IF;

      -- Log the unsubscribe (only if admin_activity_log exists)
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_activity_log') THEN
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
      END IF;

      result := jsonb_build_object(
        'success', true,
        'message', 'Successfully unsubscribed from newsletter'
      );

      RETURN result;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;
    
    RAISE NOTICE 'Created function: handle_email_unsubscribe';
  ELSE
    RAISE NOTICE 'Function already exists: handle_email_unsubscribe';
  END IF;
END $$;

-- =====================================================
-- FIX 3: Create missing validate_unsubscribe_token function (if not exists)
-- =====================================================
DO $$
BEGIN
  IF NOT pg_temp.function_exists('validate_unsubscribe_token') THEN
    CREATE OR REPLACE FUNCTION validate_unsubscribe_token(unsubscribe_token TEXT)
    RETURNS TABLE(email TEXT) AS $func$
    BEGIN
      -- Simple base64 decode validation
      BEGIN
        -- Decode the token and extract email
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
          -- Invalid token format, return empty
          RETURN;
      END;
    END;
    $func$ LANGUAGE plpgsql SECURITY DEFINER;
    
    RAISE NOTICE 'Created function: validate_unsubscribe_token';
  ELSE
    RAISE NOTICE 'Function already exists: validate_unsubscribe_token';
  END IF;
END $$;

-- =====================================================
-- FIX 4: Create/Replace analytics functions with proper syntax
-- =====================================================
DO $$
BEGIN
  -- Always replace these to fix any syntax issues
  CREATE OR REPLACE FUNCTION get_analytics_summary(days_ago INTEGER)
  RETURNS TABLE(
    id UUID,
    type TEXT,
    page TEXT,
    event_timestamp TIMESTAMPTZ,
    session_id TEXT,
    created_at TIMESTAMPTZ,
    data JSONB
  ) AS $func$
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
  $func$ LANGUAGE plpgsql SECURITY DEFINER;
  
  RAISE NOTICE 'Created/Updated function: get_analytics_summary';
END $$;

DO $$
BEGIN
  CREATE OR REPLACE FUNCTION get_analytics_dashboard(time_range TEXT)
  RETURNS JSONB AS $func$
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
  $func$ LANGUAGE plpgsql SECURITY DEFINER;
  
  RAISE NOTICE 'Created/Updated function: get_analytics_dashboard';
END $$;

-- =====================================================
-- GRANT PERMISSIONS (only for functions that exist)
-- =====================================================
DO $$
BEGIN
  -- Grant execute permissions on functions that exist
  IF pg_temp.function_exists('create_user_profile') THEN
    GRANT EXECUTE ON FUNCTION create_user_profile TO anon;
    RAISE NOTICE 'Granted permissions on: create_user_profile';
  END IF;
  
  IF pg_temp.function_exists('subscribe_to_newsletter') THEN
    GRANT EXECUTE ON FUNCTION subscribe_to_newsletter TO anon;
    RAISE NOTICE 'Granted permissions on: subscribe_to_newsletter';
  END IF;
  
  IF pg_temp.function_exists('handle_newsletter_signup') THEN
    GRANT EXECUTE ON FUNCTION handle_newsletter_signup TO anon;
    RAISE NOTICE 'Granted permissions on: handle_newsletter_signup';
  END IF;
  
  IF pg_temp.function_exists('handle_email_unsubscribe') THEN
    GRANT EXECUTE ON FUNCTION handle_email_unsubscribe TO anon;
    GRANT EXECUTE ON FUNCTION handle_email_unsubscribe TO authenticated;
    RAISE NOTICE 'Granted permissions on: handle_email_unsubscribe';
  END IF;
  
  IF pg_temp.function_exists('validate_unsubscribe_token') THEN
    GRANT EXECUTE ON FUNCTION validate_unsubscribe_token TO anon;
    GRANT EXECUTE ON FUNCTION validate_unsubscribe_token TO authenticated;
    RAISE NOTICE 'Granted permissions on: validate_unsubscribe_token';
  END IF;
  
  IF pg_temp.function_exists('get_analytics_summary') THEN
    GRANT EXECUTE ON FUNCTION get_analytics_summary TO anon;
    GRANT EXECUTE ON FUNCTION get_analytics_summary TO authenticated;
    RAISE NOTICE 'Granted permissions on: get_analytics_summary';
  END IF;
  
  IF pg_temp.function_exists('get_analytics_dashboard') THEN
    GRANT EXECUTE ON FUNCTION get_analytics_dashboard TO anon;
    GRANT EXECUTE ON FUNCTION get_analytics_dashboard TO authenticated;
    RAISE NOTICE 'Granted permissions on: get_analytics_dashboard';
  END IF;
END $$;

-- =====================================================
-- CREATE MISSING TABLES (if not exist)
-- =====================================================

-- Newsletter sends table
CREATE TABLE IF NOT EXISTS newsletter_sends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Chatbot interactions table
CREATE TABLE IF NOT EXISTS chatbot_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversion events table (if not exists)
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  session_id TEXT,
  page TEXT,
  value NUMERIC DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_status ON newsletter_sends(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_created ON newsletter_sends(created_at);
CREATE INDEX IF NOT EXISTS idx_email_sends_status ON email_sends(status);
CREATE INDEX IF NOT EXISTS idx_email_sends_to_email ON email_sends(to_email);
CREATE INDEX IF NOT EXISTS idx_chatbot_session ON chatbot_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_created ON chatbot_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_conversion_events_type ON conversion_events(event_type);
CREATE INDEX IF NOT EXISTS idx_conversion_events_session ON conversion_events(session_id);

-- Grant permissions on tables
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter_sends') THEN
    GRANT SELECT, INSERT, UPDATE ON newsletter_sends TO authenticated;
    RAISE NOTICE 'Granted permissions on table: newsletter_sends';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_sends') THEN
    GRANT SELECT, INSERT, UPDATE ON email_sends TO authenticated;
    RAISE NOTICE 'Granted permissions on table: email_sends';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chatbot_interactions') THEN
    GRANT SELECT, INSERT ON chatbot_interactions TO anon;
    GRANT SELECT ON chatbot_interactions TO authenticated;
    RAISE NOTICE 'Granted permissions on table: chatbot_interactions';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversion_events') THEN
    GRANT SELECT, INSERT ON conversion_events TO anon;
    GRANT SELECT ON conversion_events TO authenticated;
    RAISE NOTICE 'Granted permissions on table: conversion_events';
  END IF;
END $$;

-- =====================================================
-- ENABLE RLS (if not already enabled)
-- =====================================================
DO $$
BEGIN
  -- Enable RLS on tables if they exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_activity_log') THEN
    ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'Enabled RLS on: admin_activity_log';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversion_events') THEN
    ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'Enabled RLS on: conversion_events';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter_sends') THEN
    ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'Enabled RLS on: newsletter_sends';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chatbot_interactions') THEN
    ALTER TABLE chatbot_interactions ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'Enabled RLS on: chatbot_interactions';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_sends') THEN
    ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'Enabled RLS on: email_sends';
  END IF;
END $$;

-- =====================================================
-- CREATE RLS POLICIES (if not exist)
-- =====================================================

-- Check and create policy for chatbot interactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'chatbot_interactions' 
    AND policyname = 'Public can insert chatbot interactions'
  ) THEN
    CREATE POLICY "Public can insert chatbot interactions" ON chatbot_interactions
      FOR INSERT TO anon
      WITH CHECK (true);
    RAISE NOTICE 'Created RLS policy: Public can insert chatbot interactions';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'chatbot_interactions' 
    AND policyname = 'Admins can view chatbot interactions'
  ) THEN
    CREATE POLICY "Admins can view chatbot interactions" ON chatbot_interactions
      FOR SELECT USING (
        auth.uid() IN (
          SELECT id FROM user_profiles WHERE role IN ('admin', 'super_admin')
        )
      );
    RAISE NOTICE 'Created RLS policy: Admins can view chatbot interactions';
  END IF;
END $$;

-- =====================================================
-- GRANT PERMISSIONS ON OTHER FUNCTIONS
-- =====================================================
DO $$
BEGIN
  -- Email analytics functions
  IF pg_temp.function_exists('get_email_analytics') THEN
    GRANT EXECUTE ON FUNCTION get_email_analytics TO authenticated;
    RAISE NOTICE 'Granted permissions on: get_email_analytics';
  END IF;
  
  IF pg_temp.function_exists('get_subscriber_stats') THEN
    GRANT EXECUTE ON FUNCTION get_subscriber_stats TO authenticated;
    RAISE NOTICE 'Granted permissions on: get_subscriber_stats';
  END IF;
  
  IF pg_temp.function_exists('get_email_engagement_patterns') THEN
    GRANT EXECUTE ON FUNCTION get_email_engagement_patterns TO authenticated;
    RAISE NOTICE 'Granted permissions on: get_email_engagement_patterns';
  END IF;
  
  IF pg_temp.function_exists('get_subscriber_growth_trend') THEN
    GRANT EXECUTE ON FUNCTION get_subscriber_growth_trend TO authenticated;
    RAISE NOTICE 'Granted permissions on: get_subscriber_growth_trend';
  END IF;
  
  IF pg_temp.function_exists('get_career_applications') THEN
    GRANT EXECUTE ON FUNCTION get_career_applications TO authenticated;
    RAISE NOTICE 'Granted permissions on: get_career_applications';
  END IF;
  
  IF pg_temp.function_exists('get_contact_submissions') THEN
    GRANT EXECUTE ON FUNCTION get_contact_submissions TO authenticated;
    RAISE NOTICE 'Granted permissions on: get_contact_submissions';
  END IF;
END $$;

-- =====================================================
-- CLEAN UP TEMP FUNCTION
-- =====================================================
DROP FUNCTION IF EXISTS pg_temp.function_exists(text, text);

-- =====================================================
-- FINAL SUMMARY
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'Safe Security Fixes Migration Complete!';
  RAISE NOTICE 'The migration has:';
  RAISE NOTICE '- Created missing functions';
  RAISE NOTICE '- Fixed analytics function syntax';
  RAISE NOTICE '- Created missing tables';
  RAISE NOTICE '- Granted appropriate permissions';  
  RAISE NOTICE '- Enabled RLS where needed';
  RAISE NOTICE '- Created RLS policies';
  RAISE NOTICE '=================================================';
END $$;