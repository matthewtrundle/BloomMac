-- Create table for storing custom email template edits
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

-- Create index for faster lookups
CREATE INDEX idx_email_templates_custom_sequence_step ON email_templates_custom(sequence, step);

-- Add RLS policies
ALTER TABLE email_templates_custom ENABLE ROW LEVEL SECURITY;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_templates_custom_updated_at
  BEFORE UPDATE ON email_templates_custom
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create backup table for template history
CREATE TABLE IF NOT EXISTS email_templates_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES email_templates_custom(id),
  sequence TEXT NOT NULL,
  step TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  modified_by TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for history lookups
CREATE INDEX idx_email_templates_history_template_id ON email_templates_history(template_id);
CREATE INDEX idx_email_templates_history_sequence_step ON email_templates_history(sequence, step);