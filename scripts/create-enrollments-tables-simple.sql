-- Simple creation of enrollment tables
-- Run this in Supabase SQL Editor

-- Create sequence_enrollments table
CREATE TABLE sequence_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  sequence_id UUID NOT NULL REFERENCES email_sequences(id),
  enrollment_source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  current_position INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  next_send_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index to prevent duplicate active enrollments
CREATE UNIQUE INDEX idx_unique_active_enrollment 
ON sequence_enrollments(subscriber_id, sequence_id) 
WHERE status = 'active';

-- Create sequence_email_sends table
CREATE TABLE sequence_email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES sequence_enrollments(id) ON DELETE CASCADE,
  sequence_email_id UUID NOT NULL REFERENCES sequence_emails(id),
  email_template_id UUID REFERENCES email_templates(id),
  status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  resend_id TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_enrollments_next_send ON sequence_enrollments(next_send_at) 
WHERE status = 'active' AND next_send_at IS NOT NULL;
CREATE INDEX idx_enrollments_subscriber ON sequence_enrollments(subscriber_id);
CREATE INDEX idx_email_sends_enrollment ON sequence_email_sends(enrollment_id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON sequence_enrollments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON sequence_email_sends TO authenticated;