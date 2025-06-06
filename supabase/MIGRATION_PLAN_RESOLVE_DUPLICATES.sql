-- Migration Plan to Resolve Duplicate Tables in Bloom Psychology Database
-- EXECUTE THESE IN ORDER

-- ============================================================================
-- STEP 1: BACKUP EXISTING DATA (RUN FIRST!)
-- ============================================================================

-- Create backup tables for any existing data
CREATE TABLE IF NOT EXISTS _backup_course_enrollments AS SELECT * FROM course_enrollments;
CREATE TABLE IF NOT EXISTS _backup_course_progress AS SELECT * FROM course_progress;
CREATE TABLE IF NOT EXISTS _backup_course_users AS SELECT * FROM course_users;
CREATE TABLE IF NOT EXISTS _backup_analytics_events AS SELECT * FROM analytics_events;

-- ============================================================================
-- STEP 2: DROP CONFLICTING TABLES
-- ============================================================================

-- Drop tables that will be recreated with proper structure
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS course_progress CASCADE;
DROP TABLE IF EXISTS course_users CASCADE;
DROP TABLE IF EXISTS user_course_access CASCADE;
DROP TABLE IF EXISTS course_purchases CASCADE;

-- Drop the complex user management tables (we'll use simpler structure)
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS user_consents CASCADE;
DROP TABLE IF EXISTS user_lesson_progress CASCADE;
DROP TABLE IF EXISTS user_workbook_responses CASCADE;
DROP TABLE IF EXISTS user_week_submissions CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS user_activity_log CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS support_ticket_messages CASCADE;
DROP TABLE IF EXISTS user_notifications CASCADE;
DROP TABLE IF EXISTS audit_trail CASCADE;

-- ============================================================================
-- STEP 3: CREATE CLEAN COURSE TABLES (SIMPLIFIED VERSION THAT'S IN USE)
-- ============================================================================

-- Course Enrollments Table (matches what's used in the codebase)
CREATE TABLE course_enrollments (
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, user_email)
);

-- Course Users Table (for login credentials)
CREATE TABLE course_users (
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
CREATE TABLE course_progress (
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_email, course_id, module_id, lesson_id)
);

-- ============================================================================
-- STEP 4: CREATE INDEXES
-- ============================================================================

-- Course enrollments indexes
CREATE INDEX idx_course_enrollments_email ON course_enrollments(user_email);
CREATE INDEX idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_course_enrollments_status ON course_enrollments(payment_status);
CREATE INDEX idx_course_enrollments_created ON course_enrollments(created_at DESC);

-- Course users indexes
CREATE INDEX idx_course_users_email ON course_users(email);
CREATE INDEX idx_course_users_status ON course_users(status);

-- Course progress indexes
CREATE INDEX idx_course_progress_enrollment ON course_progress(enrollment_id);
CREATE INDEX idx_course_progress_user ON course_progress(user_email);
CREATE INDEX idx_course_progress_course ON course_progress(course_id);

-- ============================================================================
-- STEP 5: RESTORE DATA FROM BACKUPS
-- ============================================================================

-- Restore course enrollments (map columns as needed)
INSERT INTO course_enrollments (
    course_id, user_email, user_first_name, user_last_name, user_phone,
    enrolled_at, payment_status, payment_amount, access_granted, progress
)
SELECT 
    course_id, user_email, user_first_name, user_last_name, user_phone,
    enrolled_at, payment_status, payment_amount, access_granted, progress
FROM _backup_course_enrollments
ON CONFLICT (course_id, user_email) DO NOTHING;

-- Restore course users
INSERT INTO course_users (
    email, first_name, last_name, password_hash, temp_password,
    last_login, status, created_at
)
SELECT 
    email, first_name, last_name, password_hash, temp_password,
    last_login, status, created_at
FROM _backup_course_users
ON CONFLICT (email) DO NOTHING;

-- Restore course progress
INSERT INTO course_progress (
    enrollment_id, user_email, course_id, module_id, lesson_id,
    completed, progress_percentage, time_spent, completed_at
)
SELECT 
    enrollment_id, user_email, course_id, module_id, lesson_id,
    completed, progress_percentage, time_spent, completed_at
FROM _backup_course_progress
ON CONFLICT (user_email, course_id, module_id, lesson_id) DO NOTHING;

-- ============================================================================
-- STEP 6: ENABLE RLS AND CREATE POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY "Service role full access enrollments" ON course_enrollments
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access users" ON course_users
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access progress" ON course_progress
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- STEP 7: ADD MISSING BLOG IMAGES TABLE
-- ============================================================================

-- Execute the blog images metadata table creation
-- (Run the create-blog-images-metadata-table.sql file)

-- ============================================================================
-- STEP 8: CLEANUP
-- ============================================================================

-- After verifying everything works, drop backup tables
-- DROP TABLE IF EXISTS _backup_course_enrollments;
-- DROP TABLE IF EXISTS _backup_course_progress;
-- DROP TABLE IF EXISTS _backup_course_users;
-- DROP TABLE IF EXISTS _backup_analytics_events;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check table counts
SELECT 'course_enrollments' as table_name, COUNT(*) as row_count FROM course_enrollments
UNION ALL
SELECT 'course_users', COUNT(*) FROM course_users
UNION ALL
SELECT 'course_progress', COUNT(*) FROM course_progress;

-- List all tables to confirm cleanup
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;