-- =====================================================
-- Phase 2: Financial Security RLS Implementation (FIXED)
-- Date: 2025-01-05
-- Description: Fixed version based on actual production schema
-- =====================================================

-- 1. stripe_webhook_events - table already exists, add missing policies
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- Add service role policy
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'stripe_webhook_events' 
        AND policyname = 'Service role manages webhooks'
    ) THEN
        CREATE POLICY "Service role manages webhooks" ON stripe_webhook_events
            FOR ALL USING (auth.jwt()->>'role' = 'service_role');
    END IF;
END $$;

-- 2. appointment_payments - table already exists, enable RLS and add policies
ALTER TABLE appointment_payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policy to recreate with better rules
DROP POLICY IF EXISTS "System can update payment status" ON appointment_payments;

-- Create comprehensive policies
CREATE POLICY "Users view own appointment payments" ON appointment_payments
    FOR SELECT USING (auth.uid() = user_id);

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

-- 3. payment_methods table already exists, enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_methods
CREATE POLICY "Users view own payment methods" ON payment_methods
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role manages payment methods" ON payment_methods
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- 4. course_discount_codes - table already exists, enable RLS
ALTER TABLE course_discount_codes ENABLE ROW LEVEL SECURITY;

-- Create discount code policies
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

-- 5. Create missing tables that don't exist in production

-- Create payment_intents table (doesn't exist in production)
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

-- Create refund_requests table (doesn't exist in production)
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

-- Create payment_methods_audit table for compliance
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

-- Grant permissions
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT ON stripe_webhook_events TO authenticated;
GRANT SELECT ON payment_intents TO authenticated;
GRANT SELECT, INSERT ON refund_requests TO authenticated;
GRANT SELECT ON course_discount_codes TO authenticated;
GRANT SELECT ON payment_methods_audit TO authenticated;
GRANT SELECT ON appointment_payments TO authenticated;
GRANT SELECT ON payment_methods TO authenticated;

-- Grant full permissions to service role
GRANT ALL ON stripe_webhook_events TO service_role;
GRANT ALL ON payment_intents TO service_role;
GRANT ALL ON refund_requests TO service_role;
GRANT ALL ON course_discount_codes TO service_role;
GRANT ALL ON payment_methods_audit TO service_role;
GRANT ALL ON appointment_payments TO service_role;
GRANT ALL ON payment_methods TO service_role;

-- Grant permissions for sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;