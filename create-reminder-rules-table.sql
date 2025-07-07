CREATE TABLE IF NOT EXISTS reminder_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB,
  conditions JSONB,
  actions JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO reminder_rules (name, trigger_type, trigger_config, conditions, actions, is_active) VALUES
('24-hour email reminder', 'appointment_reminder', '{"hours_before": 24}', '{"send_email": true}', '[{"action": "send_email", "template": "appointment_reminder"}]', true),
('2-hour email reminder', 'appointment_reminder', '{"hours_before": 2}', '{"send_email": true}', '[{"action": "send_email", "template": "appointment_reminder"}]', false),
('24-hour SMS reminder', 'appointment_reminder', '{"hours_before": 24}', '{"send_sms": true}', '[{"action": "send_sms", "template": "appointment_reminder"}]', true),
('2-hour SMS reminder', 'appointment_reminder', '{"hours_before": 2}', '{"send_sms": true}', '[{"action": "send_sms", "template": "appointment_reminder"}]', true);
