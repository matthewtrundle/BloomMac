-- Bloom Psychology Database Migration
-- This fixes the conflicting table structures and creates proper user management

-- ============================================================================
-- STEP 1: BACKUP EXISTING DATA
-- ============================================================================

-- Create backup tables for existing course data
CREATE TABLE IF NOT EXISTS course_enrollments_backup AS 
SELECT * FROM course_enrollments;

CREATE TABLE IF NOT EXISTS course_progress_backup AS 
SELECT * FROM course_progress;

CREATE TABLE IF NOT EXISTS course_users_backup AS 
SELECT * FROM course_users;

-- ============================================================================
-- STEP 2: DROP CONFLICTING TABLES
-- ============================================================================

-- Drop existing course tables that conflict
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS course_progress CASCADE; 
DROP TABLE IF EXISTS course_users CASCADE;

-- ============================================================================
-- STEP 3: CREATE COURSE SYSTEM
-- ============================================================================

-- Main courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    long_description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    original_price DECIMAL(10,2),
    duration VARCHAR(50),
    total_modules INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    total_duration_minutes INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    instructor_name VARCHAR(255) DEFAULT 'Dr. Jana Rundle',
    instructor_credentials VARCHAR(255) DEFAULT 'Licensed Therapist, Perinatal Mental Health Specialist',
    features JSONB DEFAULT '[]'::jsonb,
    learning_outcomes JSONB DEFAULT '[]'::jsonb,
    bonus_materials JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 4: CREATE USER MANAGEMENT SYSTEM
-- ============================================================================

-- User Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
    enrollment_status VARCHAR(20) DEFAULT 'pending' CHECK (enrollment_status IN ('pending', 'active', 'completed', 'suspended')),
    
    -- Maternal health specific fields
    postpartum_date DATE,
    baby_due_date DATE,
    number_of_children INTEGER,
    
    -- Emergency contact information
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    
    -- Consent and compliance
    hipaa_consent BOOLEAN DEFAULT FALSE,
    hipaa_consent_date TIMESTAMPTZ,
    marketing_consent BOOLEAN DEFAULT FALSE,
    terms_accepted BOOLEAN DEFAULT FALSE,
    terms_accepted_date TIMESTAMPTZ,
    
    -- Account management
    email_verified BOOLEAN DEFAULT FALSE,
    account_status VARCHAR(20) DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deleted')),
    last_login TIMESTAMPTZ,
    timezone VARCHAR(50) DEFAULT 'America/Chicago',
    
    -- Preferences
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb,
    accessibility_preferences JSONB DEFAULT '{"large_text": false, "dark_mode": false, "audio_enabled": false}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Consent Tracking (HIPAA Requirement)
CREATE TABLE IF NOT EXISTS user_consents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL,
    agreed BOOLEAN NOT NULL,
    consent_date TIMESTAMPTZ DEFAULT NOW(),
    withdrawal_date TIMESTAMPTZ,
    ip_address VARCHAR(45),
    user_agent TEXT,
    consent_version VARCHAR(10) DEFAULT '1.0',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced Course Enrollments (NEW STRUCTURE)
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    
    -- Enrollment details
    enrollment_date TIMESTAMPTZ DEFAULT NOW(),
    enrollment_method VARCHAR(30) DEFAULT 'online' CHECK (enrollment_method IN ('online', 'phone', 'admin', 'gift')),
    
    -- Payment and access
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed', 'free')),
    payment_amount DECIMAL(10,2),
    payment_date TIMESTAMPTZ,
    stripe_payment_intent_id VARCHAR(255),
    access_expires_at TIMESTAMPTZ,
    
    -- Progress tracking
    completion_status VARCHAR(20) DEFAULT 'not_started' CHECK (completion_status IN ('not_started', 'in_progress', 'completed', 'dropped')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completion_date TIMESTAMPTZ,
    certificate_issued_date TIMESTAMPTZ,
    
    -- Activity tracking
    last_accessed TIMESTAMPTZ,
    total_time_spent_minutes INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Enhanced User Progress Tracking (NEW STRUCTURE)
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id VARCHAR(100) NOT NULL,
    week_number INTEGER,
    
    -- Progress details
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent_minutes INTEGER DEFAULT 0,
    
    -- Completion tracking
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    
    -- Video/content specific
    last_position_seconds INTEGER DEFAULT 0,
    completion_threshold_met BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id, lesson_id)
);

-- Workbook Responses
CREATE TABLE IF NOT EXISTS user_workbook_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    question_id VARCHAR(100) NOT NULL,
    
    -- Response data
    response_data JSONB NOT NULL,
    response_type VARCHAR(50),
    
    -- Therapeutic tracking
    sentiment_score DECIMAL(3,2),
    word_count INTEGER,
    completion_time_seconds INTEGER,
    
    -- Submission tracking
    is_draft BOOLEAN DEFAULT TRUE,
    submitted_at TIMESTAMPTZ,
    last_modified TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id, week_number, question_id)
);

-- Week Submissions
CREATE TABLE IF NOT EXISTS user_week_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    
    -- Submission details
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    all_lessons_completed BOOLEAN DEFAULT FALSE,
    all_workbook_completed BOOLEAN DEFAULT FALSE,
    completion_percentage INTEGER DEFAULT 0,
    
    -- Feedback
    instructor_feedback TEXT,
    instructor_rating INTEGER CHECK (instructor_rating >= 1 AND instructor_rating <= 5),
    feedback_date TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id, week_number)
);

-- User Activity Log
CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Activity details
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    
    -- Context
    course_id UUID REFERENCES courses(id),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 5: CREATE SAMPLE DATA
-- ============================================================================

-- Insert sample course
INSERT INTO courses (
    slug, title, subtitle, description, price, original_price, duration,
    total_modules, total_lessons, features, learning_outcomes, bonus_materials
) VALUES (
    'postpartum-wellness-foundations',
    'Postpartum Wellness Foundations',
    'Navigate your fourth trimester with confidence and support',
    'A comprehensive 6-week program designed specifically for new mothers navigating the challenges of postpartum life.',
    297.00,
    397.00,
    '6 weeks',
    6,
    24,
    '["24 video lessons (10-15 minutes each)", "Downloadable PDF workbooks", "Guided meditations and exercises", "Private community access", "Monthly live Q&As with Dr. Jana", "Certificate of completion"]'::jsonb,
    '["Understand normal postpartum changes", "Develop healthy coping strategies", "Build a strong support network", "Improve sleep and self-care", "Enhance partner communication", "Increase confidence in mothering"]'::jsonb,
    '["Emergency Coping Cards (printable)", "Partner Communication Guide", "Postpartum Meal Planning Template", "Sleep Optimization Checklist", "Return-to-Work Transition Guide"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    updated_at = NOW();

-- ============================================================================
-- STEP 6: CREATE INDEXES
-- ============================================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(enrollment_status);

-- Course enrollment indexes
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status ON course_enrollments(completion_status);

-- Progress tracking indexes
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_course ON user_lesson_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson ON user_lesson_progress(lesson_id);

-- Activity indexes
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_date ON user_activity_log(user_id, timestamp);

-- ============================================================================
-- STEP 7: SETUP ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workbook_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_week_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Public can view active courses
CREATE POLICY "Public can view active courses" ON courses
    FOR SELECT USING (is_active = true);

-- User profile policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Course enrollment policies
CREATE POLICY "Users can view own enrollments" ON course_enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own enrollments" ON course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollment progress" ON course_enrollments
    FOR UPDATE USING (auth.uid() = user_id);

-- Progress tracking policies
CREATE POLICY "Users can manage own progress" ON user_lesson_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own workbook responses" ON user_workbook_responses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own week submissions" ON user_week_submissions
    FOR ALL USING (auth.uid() = user_id);

-- Service role has full access (for API operations)
CREATE POLICY "Service role full access profiles" ON user_profiles
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access enrollments" ON course_enrollments
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access progress" ON user_lesson_progress
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access workbooks" ON user_workbook_responses
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access activity" ON user_activity_log
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access consents" ON user_consents
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

SELECT 'Database migration completed successfully! 🎉' as status,
       'Old tables backed up, new user management system created' as summary;