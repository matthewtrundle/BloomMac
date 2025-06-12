-- Create email automation errors table to track issues with email sending
CREATE TABLE IF NOT EXISTS email_automation_errors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
  sequence_id UUID REFERENCES email_sequences(id) ON DELETE CASCADE,
  email_id UUID REFERENCES email_templates(id) ON DELETE CASCADE,
  error TEXT NOT NULL,
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_email_automation_errors_subscriber_id ON email_automation_errors(subscriber_id);
CREATE INDEX idx_email_automation_errors_sequence_id ON email_automation_errors(sequence_id);
CREATE INDEX idx_email_automation_errors_created_at ON email_automation_errors(created_at DESC);