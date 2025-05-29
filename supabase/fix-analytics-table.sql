-- Create the analytics_events table that the analytics API expects
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  page VARCHAR(255),
  session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data JSONB DEFAULT '{}'::jsonb,
  
  -- Add indexes for performance
  INDEX idx_analytics_type (type),
  INDEX idx_analytics_created (created_at),
  INDEX idx_analytics_session (session_id),
  INDEX idx_analytics_page (page)
);

-- Add some test data to verify it's working
INSERT INTO analytics_events (type, page, session_id, data) VALUES
  ('page_view', '/', 'test-session-1', '{"source": "direct"}'::jsonb),
  ('page_view', '/contact', 'test-session-1', '{"source": "direct"}'::jsonb),
  ('page_view', '/', 'test-session-2', '{"source": "google"}'::jsonb),
  ('contact_form', '/contact', 'test-session-1', '{"source": "direct"}'::jsonb);

-- Verify the data
SELECT 
  type,
  COUNT(*) as count,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events
GROUP BY type;