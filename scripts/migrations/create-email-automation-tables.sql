-- Email Automation Tables Migration
-- This creates the necessary tables for tracking email sequence enrollments and sends

-- 1. Create sequence_enrollments table for tracking who's enrolled in which sequences
CREATE TABLE IF NOT EXISTS sequence_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  sequence_id UUID NOT NULL REFERENCES email_sequences(id),
  enrollment_source TEXT NOT NULL, -- 'newsletter_signup', 'contact_form', etc.
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'unsubscribed', 'failed')),
  current_position INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  next_send_at TIMESTAMPTZ, -- Calculated based on delays
  completed_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent duplicate active enrollments for same subscriber and sequence
CREATE UNIQUE INDEX idx_unique_active_enrollment 
ON sequence_enrollments(subscriber_id, sequence_id) 
WHERE status = 'active';

-- Performance indexes
CREATE INDEX idx_enrollments_next_send ON sequence_enrollments(next_send_at) 
WHERE status = 'active' AND next_send_at IS NOT NULL;
CREATE INDEX idx_enrollments_subscriber ON sequence_enrollments(subscriber_id);
CREATE INDEX idx_enrollments_sequence ON sequence_enrollments(sequence_id);
CREATE INDEX idx_enrollments_status ON sequence_enrollments(status);

-- 2. Create sequence_email_sends table for tracking individual email sends
CREATE TABLE IF NOT EXISTS sequence_email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES sequence_enrollments(id) ON DELETE CASCADE,
  sequence_email_id UUID NOT NULL REFERENCES sequence_emails(id),
  email_template_id UUID REFERENCES email_templates(id), -- Link to the template used
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced', 'opened', 'clicked', 'unsubscribed')),
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  resend_id TEXT, -- Resend API tracking ID
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_email_sends_enrollment ON sequence_email_sends(enrollment_id);
CREATE INDEX idx_email_sends_status ON sequence_email_sends(status);
CREATE INDEX idx_email_sends_sent_at ON sequence_email_sends(sent_at);
CREATE INDEX idx_email_sends_resend_id ON sequence_email_sends(resend_id);

-- 3. Create email_automation_logs table for debugging and audit trail
CREATE TABLE IF NOT EXISTS email_automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES sequence_enrollments(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'enrolled', 'email_sent', 'email_failed', 'completed', 'unsubscribed', etc.
  details JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance index
CREATE INDEX idx_automation_logs_enrollment ON email_automation_logs(enrollment_id);
CREATE INDEX idx_automation_logs_created ON email_automation_logs(created_at);

-- 4. Create a view for monitoring email automation metrics
CREATE OR REPLACE VIEW email_automation_metrics AS
SELECT 
  s.id as sequence_id,
  s.name as sequence_name,
  s.trigger,
  s.status as sequence_status,
  COUNT(DISTINCT e.id) as total_enrollments,
  COUNT(DISTINCT CASE WHEN e.status = 'active' THEN e.id END) as active_enrollments,
  COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.id END) as completed_enrollments,
  COUNT(DISTINCT CASE WHEN e.status = 'unsubscribed' THEN e.id END) as unsubscribed_count,
  COUNT(DISTINCT ses.id) as total_emails_sent,
  COUNT(DISTINCT CASE WHEN ses.status = 'sent' THEN ses.id END) as emails_delivered,
  COUNT(DISTINCT CASE WHEN ses.status = 'opened' THEN ses.id END) as emails_opened,
  COUNT(DISTINCT CASE WHEN ses.status = 'clicked' THEN ses.id END) as emails_clicked,
  CASE 
    WHEN COUNT(DISTINCT ses.id) > 0 
    THEN ROUND(100.0 * COUNT(DISTINCT CASE WHEN ses.status = 'opened' THEN ses.id END) / COUNT(DISTINCT ses.id), 2)
    ELSE 0
  END as open_rate,
  CASE 
    WHEN COUNT(DISTINCT CASE WHEN ses.status = 'opened' THEN ses.id END) > 0 
    THEN ROUND(100.0 * COUNT(DISTINCT CASE WHEN ses.status = 'clicked' THEN ses.id END) / COUNT(DISTINCT CASE WHEN ses.status = 'opened' THEN ses.id END), 2)
    ELSE 0
  END as click_to_open_rate
FROM email_sequences s
LEFT JOIN sequence_enrollments e ON s.id = e.sequence_id
LEFT JOIN sequence_email_sends ses ON e.id = ses.enrollment_id
GROUP BY s.id, s.name, s.trigger, s.status;

-- 5. Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_sequence_enrollments_updated_at 
  BEFORE UPDATE ON sequence_enrollments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sequence_email_sends_updated_at 
  BEFORE UPDATE ON sequence_email_sends 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust based on your security model)
GRANT SELECT, INSERT, UPDATE ON sequence_enrollments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON sequence_email_sends TO authenticated;
GRANT SELECT ON email_automation_metrics TO authenticated;
GRANT INSERT ON email_automation_logs TO authenticated;