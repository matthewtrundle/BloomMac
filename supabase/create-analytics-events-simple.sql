-- Simple version - if table already exists, drop it first
DROP TABLE IF EXISTS analytics_events CASCADE;

-- Create analytics_events table fresh
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN (
    'page_view', 
    'contact_form', 
    'booking_click', 
    'exit_intent', 
    'scroll_banner', 
    'resource_download', 
    'chatbot_interaction', 
    'newsletter_signup', 
    'new_mom_signup'
  )),
  page TEXT NOT NULL,
  session_id TEXT,
  user_id TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX idx_analytics_events_type ON analytics_events(type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_page ON analytics_events(page);

-- Enable Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from all (for the API)
CREATE POLICY "Allow insert for all" ON analytics_events
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow select for authenticated users (for admin dashboard)
CREATE POLICY "Allow select for authenticated" ON analytics_events
  FOR SELECT
  USING (auth.role() = 'authenticated');

COMMENT ON TABLE analytics_events IS 'Stores all analytics events for tracking user behavior';
COMMENT ON COLUMN analytics_events.type IS 'Type of analytics event';
COMMENT ON COLUMN analytics_events.page IS 'Page where the event occurred';
COMMENT ON COLUMN analytics_events.session_id IS 'Session identifier for grouping events';
COMMENT ON COLUMN analytics_events.user_id IS 'User identifier for tracking across sessions';
COMMENT ON COLUMN analytics_events.data IS 'Additional event data (source, service, action, etc.)';