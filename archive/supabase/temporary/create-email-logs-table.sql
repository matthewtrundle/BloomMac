-- Create email_logs table for tracking all email sends
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient TEXT NOT NULL,
    type TEXT NOT NULL, -- 'welcome_course', 'magic_link', 'password_reset', 'verification', etc.
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'bounced', 'opened', 'clicked'
    subject TEXT,
    provider TEXT DEFAULT 'resend', -- 'resend', 'supabase', 'sendgrid', etc.
    provider_id TEXT, -- ID from the email provider
    error TEXT,
    metadata JSONB DEFAULT '{}', -- Store additional data like course_name, user_id, etc.
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_email_logs_recipient ON public.email_logs(recipient);
CREATE INDEX idx_email_logs_type ON public.email_logs(type);
CREATE INDEX idx_email_logs_status ON public.email_logs(status);
CREATE INDEX idx_email_logs_created_at ON public.email_logs(created_at DESC);
CREATE INDEX idx_email_logs_metadata_user_id ON public.email_logs((metadata->>'user_id')) WHERE metadata->>'user_id' IS NOT NULL;

-- Add RLS policies
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Admin users can view all email logs
CREATE POLICY "Admin users can view all email logs" ON public.email_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.email = auth.email()
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );

-- Service role can do everything
CREATE POLICY "Service role can manage email logs" ON public.email_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_email_logs_updated_at
    BEFORE UPDATE ON public.email_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_email_logs_updated_at();

-- Add comment to table
COMMENT ON TABLE public.email_logs IS 'Tracks all emails sent by the system for debugging and analytics';