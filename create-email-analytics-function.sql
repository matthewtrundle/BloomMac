CREATE OR REPLACE FUNCTION get_email_analytics(days_ago integer)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_start_date timestamptz := now() - (days_ago || ' days')::interval;
  v_total_sent integer;
  v_total_opened integer;
  v_total_clicked integer;
  v_open_rate text;
  v_click_rate text;
  v_unsubscribe_rate text;
  v_total_subscribers integer;
  v_unsubscribed_count integer;
BEGIN
  -- Total Sent
  SELECT COUNT(*) INTO v_total_sent
  FROM email_logs
  WHERE created_at >= v_start_date;

  -- Total Opened
  SELECT COUNT(*) INTO v_total_opened
  FROM email_logs
  WHERE opened_at IS NOT NULL AND created_at >= v_start_date;

  -- Total Clicked
  SELECT COUNT(*) INTO v_total_clicked
  FROM email_logs
  WHERE clicked_at IS NOT NULL AND created_at >= v_start_date;

  -- Open Rate
  v_open_rate := (v_total_opened * 100.0 / GREATEST(v_total_sent, 1)) || '%';

  -- Click Rate
  v_click_rate := (v_total_clicked * 100.0 / GREATEST(v_total_sent, 1)) || '%';

  -- Unsubscribe Rate
  SELECT COUNT(*) INTO v_total_subscribers FROM subscribers;
  SELECT COUNT(*) INTO v_unsubscribed_count FROM subscribers WHERE status = 'unsubscribed';
  v_unsubscribe_rate := (v_unsubscribed_count * 100.0 / GREATEST(v_total_subscribers, 1)) || '%';

  RETURN jsonb_build_object(
    'overview', jsonb_build_object(
      'totalSent', v_total_sent,
      'openRate', v_open_rate,
      'clickRate', v_click_rate,
      'unsubscribeRate', v_unsubscribe_rate
    ),
    'recentActivity', '[]'::jsonb,
    'campaignPerformance', '[]'::jsonb,
    'timeSeriesData', '{"labels": [], "datasets": []}'::jsonb
  );
END;
$$;
