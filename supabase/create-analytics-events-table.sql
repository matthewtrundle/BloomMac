-- Create Analytics Events Table
-- This table is required for tracking page views, conversions, and analytics data

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'page_view', 'contact_form', 'booking_click', 'newsletter_signup', etc.
  page VARCHAR(255), -- The page URL where event occurred
  session_id VARCHAR(255), -- To group events by session
  user_agent TEXT, -- Browser/device info
  ip_address VARCHAR(45), -- User IP (for geographic data)
  referrer TEXT, -- Where the user came from
  data JSONB DEFAULT '{}', -- Additional event-specific data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_page ON analytics_events(page);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_analytics_events_updated_at BEFORE UPDATE ON analytics_events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust based on your needs)
GRANT SELECT ON analytics_events TO anon;
GRANT INSERT ON analytics_events TO anon;
GRANT ALL ON analytics_events TO authenticated;
GRANT ALL ON analytics_events TO service_role;

-- Insert a test event to verify the table works
INSERT INTO analytics_events (type, page, session_id, data) 
VALUES ('page_view', '/test', 'test-session-123', '{"test": true}');

-- Verify the table was created
SELECT 
  'Table created successfully!' as status,
  COUNT(*) as test_records 
FROM analytics_events;