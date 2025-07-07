CREATE OR REPLACE FUNCTION get_analytics_dashboard(days_ago integer)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_start_date timestamptz := now() - (days_ago || ' days')::interval;
  v_end_date timestamptz := now();
  v_visitors integer;
  v_page_views integer;
  v_avg_time_on_site text;
  v_bounce_rate text;
  v_conversion_rate text;
  v_contact_forms integer;
  v_new_mom_signups integer;
  v_newsletter_signups integer;
BEGIN
  -- Visitors
  SELECT COUNT(DISTINCT session_id) INTO v_visitors
  FROM analytics_events
  WHERE created_at >= v_start_date;

  -- Page Views
  SELECT COUNT(*) INTO v_page_views
  FROM analytics_events
  WHERE type = 'page_view' AND created_at >= v_start_date;

  -- Avg Time on Site (This is a simplified calculation)
  SELECT COALESCE(AVG(duration_seconds), 0) || 's' INTO v_avg_time_on_site
  FROM (
    SELECT 
      session_id, 
      EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) as duration_seconds
    FROM analytics_events
    WHERE created_at >= v_start_date
    GROUP BY session_id
  ) as session_durations;

  -- Bounce Rate (Simplified: sessions with only one page view)
  SELECT
    (COUNT(CASE WHEN page_view_count = 1 THEN 1 END) * 100.0 / COUNT(*)) || '%' INTO v_bounce_rate
  FROM (
    SELECT session_id, COUNT(*) as page_view_count
    FROM analytics_events
    WHERE type = 'page_view' AND created_at >= v_start_date
    GROUP BY session_id
  ) as session_page_views;

  -- Contact Forms
  SELECT COUNT(*) INTO v_contact_forms
  FROM contact_submissions
  WHERE created_at >= v_start_date;

  -- New Mom Signups
  SELECT COUNT(*) INTO v_new_mom_signups
  FROM analytics_events
  WHERE type = 'new_mom_signup' AND created_at >= v_start_date;

  -- Newsletter Signups
  SELECT COUNT(*) INTO v_newsletter_signups
  FROM subscribers
  WHERE created_at >= v_start_date;

  -- Conversion Rate (Simplified: contact forms / visitors)
  v_conversion_rate := (v_contact_forms * 100.0 / GREATEST(v_visitors, 1)) || '%';

  RETURN jsonb_build_object(
    'timeRange', days_ago || 'd',
    'visitors', v_visitors,
    'pageViews', v_page_views,
    'avgTimeOnSite', v_avg_time_on_site,
    'bounceRate', v_bounce_rate,
    'conversionRate', v_conversion_rate,
    'contactForms', v_contact_forms,
    'newMomSignups', v_new_mom_signups,
    'newsletterSignups', v_newsletter_signups,
    'insights', '[]'::jsonb,
    'trafficSources', '[]'::jsonb,
    'pagePerformance', '[]'::jsonb,
    'conversionFunnel', '[]'::jsonb,
    'leadQuality', '{"score": 0, "breakdown": []}'::jsonb
  );
END;
$$;
