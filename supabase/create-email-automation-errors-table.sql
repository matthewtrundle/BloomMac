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

-- Add RLS policies
ALTER TABLE email_automation_errors ENABLE ROW LEVEL SECURITY;

-- Admin users can view all errors
CREATE POLICY "Admin users can view email automation errors" ON email_automation_errors
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.is_active = true
    )
  );

-- Service role can do everything
CREATE POLICY "Service role has full access to email automation errors" ON email_automation_errors
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);