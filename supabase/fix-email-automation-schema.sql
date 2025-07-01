-- Fix Email Automation Schema Issues
-- This script adds missing columns and tables for email automation

-- 1. Add 'source' column to subscribers table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscribers' 
                   AND column_name = 'source') THEN
        ALTER TABLE subscribers 
        ADD COLUMN source VARCHAR(100) DEFAULT 'website';
        
        -- Update existing records to have a default source based on signup_source
        UPDATE subscribers 
        SET source = COALESCE(signup_source, 'website')
        WHERE source IS NULL;
        
        COMMENT ON COLUMN subscribers.source IS 'Source of subscriber (website, contact_form, new_mom_program, etc.)';
    END IF;
END $$;

-- 2. Add 'created_at' column to email_automation_logs table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'email_automation_logs' 
                   AND column_name = 'created_at') THEN
        ALTER TABLE email_automation_logs 
        ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
        
        -- Set created_at to sent_at for existing records
        UPDATE email_automation_logs 
        SET created_at = COALESCE(sent_at, NOW())
        WHERE created_at IS NULL;
        
        COMMENT ON COLUMN email_automation_logs.created_at IS 'When the log entry was created';
    END IF;
END $$;

-- 3. Create email_automation_triggers table if it doesn't exist
CREATE TABLE IF NOT EXISTS email_automation_triggers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL,
  trigger_data JSONB DEFAULT '{}',
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance (only if table was just created)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_automation_triggers_subscriber') THEN
        CREATE INDEX idx_automation_triggers_subscriber ON email_automation_triggers(subscriber_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_automation_triggers_type') THEN
        CREATE INDEX idx_automation_triggers_type ON email_automation_triggers(trigger_type);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_automation_triggers_processed') THEN
        CREATE INDEX idx_automation_triggers_processed ON email_automation_triggers(processed_at) WHERE processed_at IS NULL;
    END IF;
END $$;

-- Add RLS policies if not already present
ALTER TABLE email_automation_triggers ENABLE ROW LEVEL SECURITY;

-- Check if policy exists before creating
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'email_automation_triggers' 
        AND policyname = 'Service role can manage triggers'
    ) THEN
        CREATE POLICY "Service role can manage triggers" ON email_automation_triggers
          FOR ALL TO service_role
          USING (true)
          WITH CHECK (true);
    END IF;
END $$;

-- Comment on the table
COMMENT ON TABLE email_automation_triggers IS 'Tracks trigger events for email automation sequences';

-- Add index on source column for subscribers table
CREATE INDEX IF NOT EXISTS idx_subscribers_source ON subscribers(source);

-- Add index on created_at column for email_automation_logs table
CREATE INDEX IF NOT EXISTS idx_automation_logs_created_at ON email_automation_logs(created_at DESC);

-- Verify the schema changes
SELECT 
    'subscribers.source' as check_item,
    EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subscribers' AND column_name = 'source'
    ) as exists
UNION ALL
SELECT 
    'email_automation_logs.created_at' as check_item,
    EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'email_automation_logs' AND column_name = 'created_at'
    ) as exists
UNION ALL
SELECT 
    'email_automation_triggers table' as check_item,
    EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'email_automation_triggers'
    ) as exists;