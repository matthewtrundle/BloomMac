-- Course Enrollments Table
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_first_name TEXT NOT NULL,
    user_last_name TEXT NOT NULL,
    user_phone TEXT,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_amount DECIMAL(10,2),
    payment_reference TEXT,
    access_granted BOOLEAN DEFAULT FALSE,
    progress JSONB DEFAULT '{}',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Users Table (for login credentials)
CREATE TABLE IF NOT EXISTS course_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    temp_password TEXT,
    password_reset_token TEXT,
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Progress Table
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    course_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    progress_percentage INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_enrollments_email ON course_enrollments(user_email);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status ON course_enrollments(payment_status);
CREATE INDEX IF NOT EXISTS idx_course_users_email ON course_users(email);
CREATE INDEX IF NOT EXISTS idx_course_progress_enrollment ON course_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_email);

-- Enable Row Level Security
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Course enrollments: users can only see their own enrollments
CREATE POLICY "Users can view own enrollments" ON course_enrollments
    FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Course users: users can only see their own user record
CREATE POLICY "Users can view own user data" ON course_users
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Course progress: users can only see their own progress
CREATE POLICY "Users can view own progress" ON course_progress
    FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can update own progress" ON course_progress
    FOR UPDATE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can insert own progress" ON course_progress
    FOR INSERT WITH CHECK (user_email = current_setting('request.jwt.claims', true)::json->>'email');