-- Bloom Psychology Course System Database Schema
-- Run this in your Supabase SQL editor

-- ============================================================================
-- COURSES AND CONTENT TABLES
-- ============================================================================

-- Main courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    long_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    duration VARCHAR(50), -- "6 weeks", "4 weeks", etc.
    total_modules INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    total_duration_minutes INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    instructor_name VARCHAR(255) DEFAULT 'Dr. Jana Rundle',
    instructor_credentials VARCHAR(255) DEFAULT 'Licensed Therapist, Perinatal Mental Health Specialist',
    features JSONB DEFAULT '[]'::jsonb, -- ["24 video lessons", "Workbooks", etc.]
    learning_outcomes JSONB DEFAULT '[]'::jsonb, -- ["Reduce anxiety", "Build confidence", etc.]
    bonus_materials JSONB DEFAULT '[]'::jsonb, -- ["Emergency coping cards", "Partner guide", etc.]
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course modules (weeks)
CREATE TABLE IF NOT EXISTS course_modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    module_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    estimated_duration_minutes INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, module_number)
);

-- Individual lessons within modules
CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    lesson_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('video', 'audio', 'workbook', 'quiz', 'reading')),
    video_url VARCHAR(500), -- Vimeo, YouTube, etc.
    video_duration_seconds INTEGER DEFAULT 0,
    audio_url VARCHAR(500), -- For meditation tracks
    content_data JSONB DEFAULT '{}'::jsonb, -- Workbook questions, quiz data, etc.
    transcript TEXT, -- Video/audio transcript for accessibility
    resources JSONB DEFAULT '[]'::jsonb, -- Downloadable PDFs, links, etc.
    is_preview BOOLEAN DEFAULT false, -- Can non-enrolled users access?
    is_published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module_id, lesson_number)
);

-- ============================================================================
-- USER ENROLLMENT AND ACCESS
-- ============================================================================

-- Course enrollments (who bought what)
CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_method VARCHAR(50) DEFAULT 'purchase', -- 'purchase', 'gift', 'admin'
    stripe_payment_intent_id VARCHAR(255), -- For payment tracking
    stripe_customer_id VARCHAR(255),
    amount_paid DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ, -- NULL for lifetime access
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'refunded', 'suspended')),
    refunded_at TIMESTAMPTZ,
    refund_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_position_seconds INTEGER DEFAULT 0, -- For video resume
    time_spent_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    first_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Course completion certificates
CREATE TABLE IF NOT EXISTS course_certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    certificate_url VARCHAR(500), -- Generated PDF location
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    completion_percentage DECIMAL(5,2) DEFAULT 100.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- ============================================================================
-- WORKBOOKS AND RESPONSES
-- ============================================================================

-- Workbook form responses
CREATE TABLE IF NOT EXISTS workbook_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    responses JSONB NOT NULL DEFAULT '{}'::jsonb, -- {"question_1": "answer", "mood_rating": 7}
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_draft BOOLEAN DEFAULT false,
    pdf_generated_url VARCHAR(500), -- Link to generated PDF
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- ============================================================================
-- COMMUNITY AND DISCUSSIONS
-- ============================================================================

-- Course discussions/forums
CREATE TABLE IF NOT EXISTS course_discussions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES course_discussions(id), -- For threaded replies
    lesson_id UUID REFERENCES course_lessons(id), -- Optional: discussion about specific lesson
    title VARCHAR(255), -- NULL for replies
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_moderated BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discussion likes
CREATE TABLE IF NOT EXISTS discussion_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    discussion_id UUID REFERENCES course_discussions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(discussion_id, user_id)
);

-- ============================================================================
-- ANALYTICS AND TRACKING
-- ============================================================================

-- Detailed user activity tracking
CREATE TABLE IF NOT EXISTS course_activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- 'video_start', 'video_pause', 'workbook_save', etc.
    action_data JSONB DEFAULT '{}'::jsonb, -- Additional context
    session_id VARCHAR(255), -- Track user sessions
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course completion stats (aggregated)
CREATE TABLE IF NOT EXISTS course_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    total_enrollments INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    average_completion_rate DECIMAL(5,2) DEFAULT 0.00,
    average_completion_time_days DECIMAL(8,2) DEFAULT 0.00,
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_status ON course_enrollments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_status ON course_enrollments(course_id, status);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_lesson ON user_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed, completed_at);
CREATE INDEX IF NOT EXISTS idx_course_discussions_course_created ON course_discussions(course_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_activity_logs_user_created ON course_activity_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_active_featured ON courses(is_active, is_featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_sort ON course_lessons(module_id, sort_order);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbook_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_stats ENABLE ROW LEVEL SECURITY;

-- Public can view active courses
CREATE POLICY "Public can view active courses" ON courses
    FOR SELECT USING (is_active = true);

-- Users can view their own enrollments
CREATE POLICY "Users can view own enrollments" ON course_enrollments
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own enrollments (for purchase flow)
CREATE POLICY "Users can create own enrollments" ON course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view course content if enrolled
CREATE POLICY "Enrolled users can view modules" ON course_modules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM course_enrollments 
            WHERE course_enrollments.course_id = course_modules.course_id 
            AND course_enrollments.user_id = auth.uid() 
            AND course_enrollments.status = 'active'
        )
    );

-- Users can view lessons if enrolled or if it's a preview
CREATE POLICY "Enrolled users can view lessons" ON course_lessons
    FOR SELECT USING (
        is_preview = true OR 
        EXISTS (
            SELECT 1 FROM course_enrollments 
            JOIN course_modules ON course_modules.course_id = course_enrollments.course_id
            WHERE course_modules.id = course_lessons.module_id
            AND course_enrollments.user_id = auth.uid() 
            AND course_enrollments.status = 'active'
        )
    );

-- Users can manage their own progress
CREATE POLICY "Users can manage own progress" ON user_progress
    FOR ALL USING (auth.uid() = user_id);

-- Users can manage their own workbook responses
CREATE POLICY "Users can manage own workbook responses" ON workbook_responses
    FOR ALL USING (auth.uid() = user_id);

-- Users can view their own certificates
CREATE POLICY "Users can view own certificates" ON course_certificates
    FOR SELECT USING (auth.uid() = user_id);

-- Users can participate in discussions if enrolled
CREATE POLICY "Enrolled users can view discussions" ON course_discussions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM course_enrollments 
            WHERE course_enrollments.course_id = course_discussions.course_id 
            AND course_enrollments.user_id = auth.uid() 
            AND course_enrollments.status = 'active'
        )
    );

CREATE POLICY "Enrolled users can create discussions" ON course_discussions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM course_enrollments 
            WHERE course_enrollments.course_id = course_discussions.course_id 
            AND course_enrollments.user_id = auth.uid() 
            AND course_enrollments.status = 'active'
        )
    );

-- Users can like discussions if enrolled
CREATE POLICY "Enrolled users can like discussions" ON discussion_likes
    FOR ALL USING (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM course_discussions 
            JOIN course_enrollments ON course_enrollments.course_id = course_discussions.course_id
            WHERE course_discussions.id = discussion_likes.discussion_id
            AND course_enrollments.user_id = auth.uid() 
            AND course_enrollments.status = 'active'
        )
    );

-- Track user activity
CREATE POLICY "Users can log own activity" ON course_activity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view everything (you'll need to create admin users)
-- CREATE POLICY "Admins can view all" ON [table_name]
--     FOR ALL USING (
--         EXISTS (
--             SELECT 1 FROM user_roles 
--             WHERE user_roles.user_id = auth.uid() 
--             AND user_roles.role = 'admin'
--         )
--     );

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update course stats
CREATE OR REPLACE FUNCTION update_course_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update enrollment count
    UPDATE course_stats 
    SET 
        total_enrollments = (
            SELECT COUNT(*) FROM course_enrollments 
            WHERE course_id = NEW.course_id AND status = 'active'
        ),
        last_calculated_at = NOW()
    WHERE course_id = NEW.course_id;
    
    -- Insert if doesn't exist
    INSERT INTO course_stats (course_id, total_enrollments)
    SELECT NEW.course_id, 1
    WHERE NOT EXISTS (SELECT 1 FROM course_stats WHERE course_id = NEW.course_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stats on enrollment
CREATE TRIGGER trigger_update_course_stats
    AFTER INSERT OR UPDATE ON course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_course_stats();

-- Function to calculate completion percentage
CREATE OR REPLACE FUNCTION calculate_course_completion(p_user_id UUID, p_course_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
BEGIN
    -- Count total lessons in course
    SELECT COUNT(cl.id) INTO total_lessons
    FROM course_lessons cl
    JOIN course_modules cm ON cm.id = cl.module_id
    WHERE cm.course_id = p_course_id AND cl.is_published = true;
    
    -- Count completed lessons
    SELECT COUNT(up.id) INTO completed_lessons
    FROM user_progress up
    JOIN course_lessons cl ON cl.id = up.lesson_id
    JOIN course_modules cm ON cm.id = cl.module_id
    WHERE cm.course_id = p_course_id 
    AND up.user_id = p_user_id 
    AND up.completed = true;
    
    -- Return percentage
    IF total_lessons = 0 THEN
        RETURN 0;
    ELSE
        RETURN (completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
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
) ON CONFLICT (slug) DO NOTHING;

-- Get the course ID for sample modules
DO $$
DECLARE
    course_uuid UUID;
    module1_uuid UUID;
    module2_uuid UUID;
BEGIN
    SELECT id INTO course_uuid FROM courses WHERE slug = 'postpartum-wellness-foundations';
    
    -- Insert sample modules
    INSERT INTO course_modules (course_id, module_number, title, description, estimated_duration_minutes) VALUES
    (course_uuid, 1, 'Understanding Your New Reality', 'Learn about the fourth trimester and what to expect', 60),
    (course_uuid, 2, 'Emotional Wellness', 'Navigate the emotional ups and downs of early motherhood', 75)
    ON CONFLICT (course_id, module_number) DO NOTHING;
    
    -- Get module IDs
    SELECT id INTO module1_uuid FROM course_modules WHERE course_id = course_uuid AND module_number = 1;
    SELECT id INTO module2_uuid FROM course_modules WHERE course_id = course_uuid AND module_number = 2;
    
    -- Insert sample lessons
    INSERT INTO course_lessons (module_id, lesson_number, title, content_type, video_duration_seconds) VALUES
    (module1_uuid, 1, 'Welcome to Your Fourth Trimester', 'video', 720),
    (module1_uuid, 2, 'Physical Changes and Recovery', 'video', 840),
    (module1_uuid, 3, 'Emotional Shifts Are Normal', 'video', 900),
    (module1_uuid, 4, 'Building Your Support Village', 'video', 780),
    (module2_uuid, 1, 'Understanding Postpartum Emotions', 'video', 660),
    (module2_uuid, 2, 'Coping with Baby Blues', 'video', 720)
    ON CONFLICT (module_id, lesson_number) DO NOTHING;
END $$;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

-- This will show in the Supabase SQL editor
SELECT 'Course system database schema created successfully! 🎉' as status;
SELECT 
    'Tables created: ' || count(*) as tables_created
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'course%';