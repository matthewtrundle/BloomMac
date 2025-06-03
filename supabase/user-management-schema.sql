-- Bloom Psychology User Management System
-- Comprehensive schema for course platform with HIPAA compliance
-- Run this in your Supabase SQL editor

-- ============================================================================
-- USER PROFILES AND AUTHENTICATION
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
    consent_type VARCHAR(50) NOT NULL, -- 'hipaa', 'marketing', 'terms', 'research'
    agreed BOOLEAN NOT NULL,
    consent_date TIMESTAMPTZ DEFAULT NOW(),
    withdrawal_date TIMESTAMPTZ,
    ip_address VARCHAR(45),
    user_agent TEXT,
    consent_version VARCHAR(10) DEFAULT '1.0',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COURSE MANAGEMENT SYSTEM
-- ============================================================================

-- Enhanced Course Enrollments
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
    access_expires_at TIMESTAMPTZ, -- NULL for lifetime access
    
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

-- Enhanced User Progress Tracking
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id VARCHAR(100) NOT NULL, -- Flexible lesson identifier
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

-- Workbook Responses (Enhanced)
CREATE TABLE IF NOT EXISTS user_workbook_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    question_id VARCHAR(100) NOT NULL,
    
    -- Response data
    response_data JSONB NOT NULL,
    response_type VARCHAR(50), -- 'text', 'scale', 'multiple_choice', 'reflection'
    
    -- Therapeutic tracking
    sentiment_score DECIMAL(3,2), -- AI-generated sentiment analysis
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

-- ============================================================================
-- USER ACTIVITY AND SESSIONS
-- ============================================================================

-- User Sessions (Enhanced for Analytics)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Session details
    session_start TIMESTAMPTZ DEFAULT NOW(),
    session_end TIMESTAMPTZ,
    duration_minutes INTEGER,
    
    -- Activity tracking
    pages_visited TEXT[],
    lessons_accessed TEXT[],
    workbook_responses_count INTEGER DEFAULT 0,
    
    -- Technical details
    device_info JSONB, -- Browser, OS, screen size, etc.
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    
    -- Course context
    course_id UUID REFERENCES courses(id),
    entry_point VARCHAR(100), -- 'dashboard', 'email_link', 'direct', etc.
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Activity Log (For Support and Debugging)
CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Activity details
    action VARCHAR(100) NOT NULL, -- 'lesson_started', 'workbook_saved', 'video_completed', etc.
    resource_type VARCHAR(50), -- 'lesson', 'workbook', 'video', 'quiz', etc.
    resource_id VARCHAR(100),
    
    -- Context
    course_id UUID REFERENCES courses(id),
    session_id UUID REFERENCES user_sessions(id),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SUPPORT AND COMMUNICATION
-- ============================================================================

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Ticket details
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('technical', 'content', 'billing', 'crisis', 'general')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent', 'crisis')),
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_user', 'resolved', 'closed')),
    assigned_to UUID REFERENCES user_profiles(id),
    
    -- Response tracking
    first_response_at TIMESTAMPTZ,
    last_response_at TIMESTAMPTZ,
    resolution_time_hours INTEGER,
    
    -- Crisis support
    is_crisis BOOLEAN DEFAULT FALSE,
    crisis_escalated_at TIMESTAMPTZ,
    crisis_resolution_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support Ticket Messages
CREATE TABLE IF NOT EXISTS support_ticket_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE, -- Internal staff notes
    attachments JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS AND MESSAGING
-- ============================================================================

-- User Notifications
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Notification content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'course_update', 'reminder')),
    
    -- Delivery
    delivery_method VARCHAR(20) DEFAULT 'in_app' CHECK (delivery_method IN ('in_app', 'email', 'sms', 'push')),
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    
    -- Context
    related_course_id UUID REFERENCES courses(id),
    action_url VARCHAR(500),
    
    -- Scheduling
    send_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUDIT TRAIL (HIPAA Requirement)
-- ============================================================================

-- Audit Trail for Data Access
CREATE TABLE IF NOT EXISTS audit_trail (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id),
    actor_id UUID REFERENCES user_profiles(id), -- Who performed the action
    
    -- Action details
    action VARCHAR(100) NOT NULL, -- 'view', 'edit', 'delete', 'export', etc.
    resource_type VARCHAR(50) NOT NULL, -- 'profile', 'workbook', 'progress', etc.
    resource_id VARCHAR(100),
    
    -- Context
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id UUID,
    
    -- Changes (for edit actions)
    old_values JSONB,
    new_values JSONB,
    
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(enrollment_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_login ON user_profiles(last_login);

-- Course enrollment indexes
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status ON course_enrollments(completion_status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_payment ON course_enrollments(payment_status);

-- Progress tracking indexes
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_course ON user_lesson_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_status ON user_lesson_progress(status);

-- Session and activity indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_date ON user_sessions(user_id, session_start);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_date ON user_activity_log(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_action ON user_activity_log(action);

-- Support indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_crisis ON support_tickets(is_crisis) WHERE is_crisis = TRUE;

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_unread ON user_notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_user_notifications_send_date ON user_notifications(send_at) WHERE delivered_at IS NULL;

-- Audit trail indexes
CREATE INDEX IF NOT EXISTS idx_audit_trail_user_date ON audit_trail(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_trail_resource ON audit_trail(resource_type, resource_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workbook_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_week_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

-- User profile policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Course enrollment policies
CREATE POLICY "Users can view own enrollments" ON course_enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollment progress" ON course_enrollments
    FOR UPDATE USING (auth.uid() = user_id);

-- Progress tracking policies
CREATE POLICY "Users can manage own progress" ON user_lesson_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own workbook responses" ON user_workbook_responses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own week submissions" ON user_week_submissions
    FOR ALL USING (auth.uid() = user_id);

-- Support ticket policies
CREATE POLICY "Users can view own support tickets" ON support_tickets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create support tickets" ON support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notification policies
CREATE POLICY "Users can view own notifications" ON user_notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON user_notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (service role has full access)
CREATE POLICY "Service role full access" ON user_profiles
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin users full access" ON user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update user activity
CREATE OR REPLACE FUNCTION update_user_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles 
    SET updated_at = NOW() 
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user activity updates
CREATE TRIGGER trigger_update_user_activity
    AFTER INSERT ON user_activity_log
    FOR EACH ROW
    EXECUTE FUNCTION update_user_last_activity();

-- Function to calculate course completion
CREATE OR REPLACE FUNCTION calculate_course_completion(p_user_id UUID, p_course_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
    completion_percentage INTEGER;
BEGIN
    -- Count total lessons for course (this would be based on your course structure)
    -- For now, assuming 24 lessons per course
    total_lessons := 24;
    
    -- Count completed lessons
    SELECT COUNT(*) INTO completed_lessons
    FROM user_lesson_progress
    WHERE user_id = p_user_id 
    AND course_id = p_course_id 
    AND status = 'completed';
    
    -- Calculate percentage
    IF total_lessons > 0 THEN
        completion_percentage := (completed_lessons * 100) / total_lessons;
    ELSE
        completion_percentage := 0;
    END IF;
    
    -- Update enrollment record
    UPDATE course_enrollments
    SET progress_percentage = completion_percentage,
        lessons_completed = completed_lessons,
        updated_at = NOW()
    WHERE user_id = p_user_id AND course_id = p_course_id;
    
    RETURN completion_percentage;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA INSERTION
-- ============================================================================

-- Insert sample user profile for demo user
INSERT INTO user_profiles (
    id, first_name, last_name, role, enrollment_status,
    hipaa_consent, terms_accepted, email_verified
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Demo', 'User', 'student', 'active',
    TRUE, TRUE, TRUE
) ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    updated_at = NOW();

-- Insert course enrollment for demo user
INSERT INTO course_enrollments (
    user_id, course_id, payment_status, completion_status
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    (SELECT id FROM courses WHERE slug = 'postpartum-wellness-foundations' LIMIT 1),
    'paid', 'in_progress'
) ON CONFLICT (user_id, course_id) DO UPDATE SET
    payment_status = EXCLUDED.payment_status,
    updated_at = NOW();

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

SELECT 'User management system schema created successfully! 🌸' as status,
       'Tables: ' || count(*) || ' created' as summary
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'user_%' OR table_name LIKE 'support_%' OR table_name LIKE 'audit_%';