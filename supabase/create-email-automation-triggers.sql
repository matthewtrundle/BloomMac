-- Create email_automation_triggers table
CREATE TABLE IF NOT EXISTS email_automation_triggers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL,
  trigger_data JSONB DEFAULT '{}',
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_automation_triggers_subscriber ON email_automation_triggers(subscriber_id);
CREATE INDEX idx_automation_triggers_type ON email_automation_triggers(trigger_type);
CREATE INDEX idx_automation_triggers_processed ON email_automation_triggers(processed_at) WHERE processed_at IS NULL;

-- Add RLS policies
ALTER TABLE email_automation_triggers ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role can manage triggers" ON email_automation_triggers
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Comment on the table
COMMENT ON TABLE email_automation_triggers IS 'Tracks trigger events for email automation sequences';