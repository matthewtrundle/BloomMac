-- Create table for storing booking information from Calendly
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
  appointment_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed', -- confirmed, canceled, completed
  calendly_event_id TEXT UNIQUE,
  data JSONB, -- Store full Calendly payload
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_appointment_time ON bookings(appointment_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_calendly_event_id ON bookings(calendly_event_id);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create trigger to update updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a view for upcoming appointments
CREATE OR REPLACE VIEW upcoming_appointments AS
SELECT 
  id,
  email,
  name,
  appointment_time,
  appointment_type,
  status,
  data
FROM bookings
WHERE appointment_time > CURRENT_TIMESTAMP
  AND status = 'confirmed'
ORDER BY appointment_time ASC;