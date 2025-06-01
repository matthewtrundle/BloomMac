-- Check and create table if it doesn't exist
CREATE TABLE IF NOT EXISTS email_templates_custom (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence TEXT NOT NULL,
  step TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  modified_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(sequence, step)
);

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_email_templates_custom_sequence_step ON email_templates_custom(sequence, step);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_email_templates_custom_updated_at ON email_templates_custom;

-- Create or replace the function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER update_email_templates_custom_updated_at
  BEFORE UPDATE ON email_templates_custom
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Test query to verify the table is working
SELECT COUNT(*) FROM email_templates_custom;