-- Create click_heatmap table for efficient heatmap data storage
CREATE TABLE IF NOT EXISTS click_heatmap (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page VARCHAR(255) NOT NULL,
  x_percent DECIMAL(5,2) NOT NULL, -- Click X position as percentage of viewport width
  y_percent DECIMAL(5,2) NOT NULL, -- Click Y position as percentage of viewport height
  element_type VARCHAR(50),
  element_text VARCHAR(255),
  element_id VARCHAR(255),
  viewport_width INTEGER,
  viewport_height INTEGER,
  session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes separately
CREATE INDEX IF NOT EXISTS idx_heatmap_page ON click_heatmap(page);
CREATE INDEX IF NOT EXISTS idx_heatmap_created ON click_heatmap(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_heatmap_session ON click_heatmap(session_id);
CREATE INDEX IF NOT EXISTS idx_heatmap_element ON click_heatmap(element_type);

-- Create aggregated heatmap data view for faster queries
CREATE OR REPLACE VIEW heatmap_aggregated AS
SELECT 
  page,
  ROUND(x_percent::numeric, 0) as x_grid,
  ROUND(y_percent::numeric, 0) as y_grid,
  COUNT(*) as click_count,
  COUNT(DISTINCT session_id) as unique_sessions,
  MAX(created_at) as last_click
FROM click_heatmap
GROUP BY page, ROUND(x_percent::numeric, 0), ROUND(y_percent::numeric, 0);

-- Create function to get heatmap data for a page
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
  WITH max_clicks AS (
    SELECT MAX(click_count) as max_count
    FROM heatmap_aggregated
    WHERE page = p_page
    AND last_click >= NOW() - INTERVAL '1 day' * p_days
  )
  SELECT 
    h.x_grid as x_percent,
    h.y_grid as y_percent,
    h.click_count,
    CASE 
      WHEN m.max_count > 0 
      THEN (h.click_count::DECIMAL / m.max_count * 100)
      ELSE 0
    END as intensity
  FROM heatmap_aggregated h
  CROSS JOIN max_clicks m
  WHERE h.page = p_page
  AND h.last_click >= NOW() - INTERVAL '1 day' * p_days
  ORDER BY h.click_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT ALL ON click_heatmap TO authenticated;
GRANT INSERT ON click_heatmap TO anon; -- Allow anonymous click tracking
GRANT SELECT ON heatmap_aggregated TO authenticated;

-- Create initial test data to verify
INSERT INTO click_heatmap (page, x_percent, y_percent, element_type, element_text, session_id)
VALUES 
  ('/', 50.5, 30.2, 'button', 'Book Now', 'test-session-1'),
  ('/', 48.3, 29.8, 'button', 'Book Now', 'test-session-2'),
  ('/', 80.1, 70.5, 'a', 'Contact Us', 'test-session-1'),
  ('/contact', 50.0, 60.0, 'button', 'Submit', 'test-session-3');

-- Verify the setup
SELECT 
  'Click heatmap table created!' as status,
  COUNT(*) as test_clicks,
  COUNT(DISTINCT page) as pages_tracked
FROM click_heatmap;