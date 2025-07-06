-- =====================================================
-- Phase 2: Financial Security RLS Implementation
-- Date: 2025-01-05
-- Description: Implement RLS for payment and financial tables
-- =====================================================

-- Create missing financial tables
-- =====================================================

-- 1. Create stripe_webhook_events table
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_type ON stripe_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_processed ON stripe_webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_created ON stripe_webhook_events(created_at DESC);

-- Enable RLS
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- Webhook events policies (service role only)
CREATE POLICY "Service role manages webhooks" ON stripe_webhook_events
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Admins view webhooks" ON stripe_webhook_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 2. Create payment_intents table
CREATE TABLE IF NOT EXISTS payment_intents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    payment_method_id TEXT,
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payment_intents_user_id ON payment_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_stripe_id ON payment_intents(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON payment_intents(status);
CREATE INDEX IF NOT EXISTS idx_payment_intents_created ON payment_intents(created_at DESC);

-- Enable RLS
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;

-- Payment intents policies
CREATE POLICY "Users view own payment intents" ON payment_intents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role manages payment intents" ON payment_intents
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Admins view all payment intents" ON payment_intents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 3. Create refund_requests table
CREATE TABLE IF NOT EXISTS refund_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    payment_intent_id UUID REFERENCES payment_intents(id),
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'processed')),
    admin_notes TEXT,
    processed_by UUID REFERENCES admin_users(id),
    processed_at TIMESTAMPTZ,
    stripe_refund_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_refund_requests_user_id ON refund_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON refund_requests(status);
CREATE INDEX IF NOT EXISTS idx_refund_requests_created ON refund_requests(created_at DESC);

-- Enable RLS
ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;

-- Refund requests policies
CREATE POLICY "Users view own refund requests" ON refund_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create refund requests" ON refund_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage all refund requests" ON refund_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 4. Create course_discount_codes table
CREATE TABLE IF NOT EXISTS course_discount_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    course_id UUID REFERENCES courses(id),
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON course_discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_course ON course_discount_codes(course_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_valid ON course_discount_codes(valid_from, valid_until);

-- Enable RLS
ALTER TABLE course_discount_codes ENABLE ROW LEVEL SECURITY;

-- Discount codes policies
CREATE POLICY "Public can validate discount codes" ON course_discount_codes
    FOR SELECT USING (
        uses_count < COALESCE(max_uses, uses_count + 1)
        AND NOW() >= valid_from
        AND NOW() <= COALESCE(valid_until, NOW())
    );

CREATE POLICY "Admins manage discount codes" ON course_discount_codes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 5. Create payment_methods_audit table for compliance
CREATE TABLE IF NOT EXISTS payment_methods_audit (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('added', 'removed', 'updated', 'used')),
    payment_method_id TEXT,
    payment_method_type TEXT,
    payment_method_last4 TEXT,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payment_methods_audit_user ON payment_methods_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_audit_created ON payment_methods_audit(created_at DESC);

-- Enable RLS
ALTER TABLE payment_methods_audit ENABLE ROW LEVEL SECURITY;

-- Audit policies (strict access)
CREATE POLICY "Users view own audit trail" ON payment_methods_audit
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role creates audit entries" ON payment_methods_audit
    FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Admins view all audit trails" ON payment_methods_audit
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- Update existing appointment_payments table if needed
-- =====================================================

-- Ensure appointment_payments has proper RLS
DO $$ 
BEGIN
    -- Check if RLS is already enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'appointment_payments' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE appointment_payments ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies for appointment_payments if they don't exist
DO $$
BEGIN
    -- Drop existing policies if any (to avoid conflicts)
    DROP POLICY IF EXISTS "Users view own appointment payments" ON appointment_payments;
    DROP POLICY IF EXISTS "Service role manages appointment payments" ON appointment_payments;
    DROP POLICY IF EXISTS "Admins view all appointment payments" ON appointment_payments;
    
    -- Create new policies
    CREATE POLICY "Users view own appointment payments" ON appointment_payments
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM appointment_data
                WHERE appointment_data.id = appointment_payments.appointment_id
                AND appointment_data.user_id = auth.uid()
            )
        );

    CREATE POLICY "Service role manages appointment payments" ON appointment_payments
        FOR ALL USING (auth.jwt()->>'role' = 'service_role');

    CREATE POLICY "Admins view all appointment payments" ON appointment_payments
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM admin_users
                WHERE id = auth.uid()
                AND is_active = true
            )
        );
END $$;

-- Create functions for financial compliance
-- =====================================================

-- Function to log payment method changes
CREATE OR REPLACE FUNCTION log_payment_method_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO payment_methods_audit (
            user_id, action, payment_method_id, 
            payment_method_type, payment_method_last4
        ) VALUES (
            NEW.user_id, 'added', NEW.stripe_payment_method_id,
            NEW.type, NEW.last4
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO payment_methods_audit (
            user_id, action, payment_method_id,
            payment_method_type, payment_method_last4
        ) VALUES (
            OLD.user_id, 'removed', OLD.stripe_payment_method_id,
            OLD.type, OLD.last4
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO payment_methods_audit (
            user_id, action, payment_method_id,
            payment_method_type, payment_method_last4
        ) VALUES (
            NEW.user_id, 'updated', NEW.stripe_payment_method_id,
            NEW.type, NEW.last4
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for payment method auditing
CREATE TRIGGER payment_method_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON user_payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION log_payment_method_change();

-- Function to update payment intent timestamps
CREATE OR REPLACE FUNCTION update_payment_intent_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update trigger
CREATE TRIGGER update_payment_intents_updated_at
    BEFORE UPDATE ON payment_intents
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_intent_timestamp();

CREATE TRIGGER update_refund_requests_updated_at
    BEFORE UPDATE ON refund_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_intent_timestamp();

-- Grant permissions
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT ON stripe_webhook_events TO authenticated;
GRANT SELECT ON payment_intents TO authenticated;
GRANT SELECT, INSERT ON refund_requests TO authenticated;
GRANT SELECT ON course_discount_codes TO authenticated;
GRANT SELECT ON payment_methods_audit TO authenticated;

-- Grant full permissions to service role
GRANT ALL ON stripe_webhook_events TO service_role;
GRANT ALL ON payment_intents TO service_role;
GRANT ALL ON refund_requests TO service_role;
GRANT ALL ON course_discount_codes TO service_role;
GRANT ALL ON payment_methods_audit TO service_role;

-- Grant permissions for sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Validation queries
-- =====================================================
-- Run these to verify RLS is properly configured:

-- Check tables with RLS enabled
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN (
--     'stripe_webhook_events', 'payment_intents', 'refund_requests',
--     'course_discount_codes', 'payment_methods_audit', 'appointment_payments'
-- )
-- ORDER BY tablename;

-- Check policies per table
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- AND tablename IN (
--     'stripe_webhook_events', 'payment_intents', 'refund_requests',
--     'course_discount_codes', 'payment_methods_audit', 'appointment_payments'
-- )
-- ORDER BY tablename, policyname;