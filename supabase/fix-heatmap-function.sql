-- Drop the existing function first
DROP FUNCTION IF EXISTS get_heatmap_data(VARCHAR, INTEGER);

-- Create fixed function with proper column references
CREATE OR REPLACE FUNCTION get_heatmap_data(
  p_page VARCHAR,
  p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
  x_percent DECIMAL,
  y_percent DECIMAL,
  click_count BIGINT,
  intensity DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH click_data AS (
    SELECT 
      ROUND(ch.x_percent::numeric, 0) as x_grid,
      ROUND(ch.y_percent::numeric, 0) as y_grid,
      COUNT(*) as clicks
    FROM click_heatmap ch
    WHERE ch.page = p_page
    AND ch.created_at >= NOW() - INTERVAL '1 day' * p_days
    GROUP BY ROUND(ch.x_percent::numeric, 0), ROUND(ch.y_percent::numeric, 0)
  ),
  max_clicks AS (
    SELECT MAX(clicks) as max_count
    FROM click_data
  )
  SELECT 
    cd.x_grid::DECIMAL as x_percent,
    cd.y_grid::DECIMAL as y_percent,
    cd.clicks as click_count,
    CASE 
      WHEN mc.max_count > 0 
      THEN (cd.clicks::DECIMAL / mc.max_count * 100)
      ELSE 0
    END as intensity
  FROM click_data cd
  CROSS JOIN max_clicks mc
  ORDER BY cd.clicks DESC;
END;
$$ LANGUAGE plpgsql;