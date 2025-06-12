-- Drop existing table if you need to recreate it
-- DROP TABLE IF EXISTS analytics_events;

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
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

-- Only create indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_analytics_events_type') THEN
    CREATE INDEX idx_analytics_events_type ON analytics_events(type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_analytics_events_created_at') THEN
    CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_analytics_events_timestamp') THEN
    CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_analytics_events_session_id') THEN
    CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_analytics_events_user_id') THEN
    CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_analytics_events_page') THEN
    CREATE INDEX idx_analytics_events_page ON analytics_events(page);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated users (for the API)
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