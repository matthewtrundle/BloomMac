-- Course purchases table
CREATE TABLE IF NOT EXISTS course_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    customer_stripe_id TEXT,
    course_id TEXT NOT NULL,
    amount INTEGER NOT NULL, -- Amount in cents
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'expired', 'refunded')),
    stripe_checkout_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User course access table
CREATE TABLE IF NOT EXISTS user_course_access (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_email TEXT NOT NULL,
    course_id TEXT NOT NULL,
    access_granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    access_expires_at TIMESTAMP WITH TIME ZONE, -- NULL for lifetime access
    payment_status TEXT DEFAULT 'paid' CHECK (payment_status IN ('paid', 'refunded', 'disputed')),
    stripe_session_id TEXT,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    progress_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_email, course_id)
);

-- Course progress tracking
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_email TEXT NOT NULL,
    course_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    lesson_id TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent_minutes INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_email, course_id, module_id, lesson_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_purchases_email ON course_purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_course_purchases_session ON course_purchases(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_user_course_access_email_course ON user_course_access(customer_email, course_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_email_course ON course_progress(customer_email, course_id);

-- Row Level Security (RLS)
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_purchases (admin only for now)
CREATE POLICY "Admin can view all course purchases" ON course_purchases
    FOR ALL USING (FALSE); -- Restrict to admin users only

-- RLS Policies for user_course_access
CREATE POLICY "Users can view their own course access" ON user_course_access
    FOR SELECT USING (customer_email = current_setting('app.current_user_email', true));

-- RLS Policies for course_progress
CREATE POLICY "Users can manage their own progress" ON course_progress
    FOR ALL USING (customer_email = current_setting('app.current_user_email', true));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_course_purchases_updated_at 
    BEFORE UPDATE ON course_purchases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_course_access_updated_at 
    BEFORE UPDATE ON user_course_access 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_progress_updated_at 
    BEFORE UPDATE ON course_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();