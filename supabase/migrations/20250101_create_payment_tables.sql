-- Create appointment payments table
CREATE TABLE IF NOT EXISTS appointment_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES appointment_data(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  stripe_payment_intent_id TEXT UNIQUE,
  status TEXT CHECK (status IN ('pending', 'authorized', 'charged', 'failed', 'refunded', 'cancelled')) DEFAULT 'pending',
  payment_type TEXT CHECK (payment_type IN ('appointment', 'no_show_fee', 'cancellation_fee')) DEFAULT 'appointment',
  authorized_at TIMESTAMPTZ,
  charged_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  refund_amount_cents INTEGER,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user payment methods table
CREATE TABLE IF NOT EXISTS user_payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT NOT NULL,
  payment_method_type TEXT NOT NULL DEFAULT 'card',
  card_details JSONB,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, stripe_payment_method_id)
);

-- Add payment-related columns to appointment_data table if they don't exist
ALTER TABLE appointment_data 
ADD COLUMN IF NOT EXISTS payment_status TEXT CHECK (payment_status IN ('pending', 'authorized', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS no_show_fee_charged BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS confirmation_received BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cancellation_policy TEXT DEFAULT '24_hours',
ADD COLUMN IF NOT EXISTS session_fee_dollars DECIMAL(10,2) DEFAULT 150.00;

-- Create indexes for performance
CREATE INDEX idx_appointment_payments_user_id ON appointment_payments(user_id);
CREATE INDEX idx_appointment_payments_appointment_id ON appointment_payments(appointment_id);
CREATE INDEX idx_appointment_payments_status ON appointment_payments(status);
CREATE INDEX idx_appointment_payments_stripe_intent ON appointment_payments(stripe_payment_intent_id);
CREATE INDEX idx_user_payment_methods_user_id ON user_payment_methods(user_id);
CREATE INDEX idx_user_payment_methods_default ON user_payment_methods(user_id, is_default) WHERE is_default = true;

-- Enable RLS
ALTER TABLE appointment_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies for appointment_payments
CREATE POLICY "Users can view their own payment records" ON appointment_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create payment records for their appointments" ON appointment_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow system to update payment status
CREATE POLICY "System can update payment status" ON appointment_payments
  FOR UPDATE USING (true);

-- RLS Policies for user_payment_methods
CREATE POLICY "Users can view their own payment methods" ON user_payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own payment methods" ON user_payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- Create function to automatically update payment status on appointment
CREATE OR REPLACE FUNCTION sync_appointment_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update appointment payment status when appointment status changes
  IF NEW.status = 'no_show' AND OLD.status != 'no_show' THEN
    -- Mark for no-show fee processing
    UPDATE appointment_data 
    SET no_show_fee_charged = false 
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment status sync
CREATE TRIGGER sync_payment_status_trigger
  AFTER UPDATE ON appointment_data
  FOR EACH ROW
  EXECUTE FUNCTION sync_appointment_payment_status();

-- Create function to ensure only one default payment method per user
CREATE OR REPLACE FUNCTION ensure_single_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting a new default, unset others
  IF NEW.is_default = true THEN
    UPDATE user_payment_methods 
    SET is_default = false 
    WHERE user_id = NEW.user_id 
    AND id != NEW.id 
    AND is_default = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for default payment method enforcement
CREATE TRIGGER enforce_single_default_payment_trigger
  BEFORE INSERT OR UPDATE ON user_payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_payment_method();

-- Create view for payment summary
CREATE OR REPLACE VIEW user_payment_summary AS
SELECT 
  user_id,
  COUNT(*) as total_payments,
  SUM(amount_cents) FILTER (WHERE status = 'charged') / 100.0 as total_paid,
  COUNT(*) FILTER (WHERE status = 'charged') as successful_payments,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_payments,
  COUNT(*) FILTER (WHERE payment_type = 'no_show_fee') as no_show_fees,
  MAX(charged_at) as last_payment_date
FROM appointment_payments
GROUP BY user_id;

-- Grant permissions for the view
GRANT SELECT ON user_payment_summary TO authenticated;

-- Create RLS policy for the view
CREATE POLICY "Users can view their own payment summary" ON user_payment_summary
  FOR SELECT USING (auth.uid() = user_id);