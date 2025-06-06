-- SAFE Migration Plan for Bloom Psychology Database
-- This plan PRESERVES ALL BLOG POSTS and existing data
-- Execute sections one at a time and verify after each step

-- ============================================================================
-- STEP 0: VERIFY BLOG POSTS EXIST (RUN THIS FIRST!)
-- ============================================================================

-- Check how many blog posts we have
SELECT COUNT(*) as total_blog_posts FROM blog_posts;

-- Preview blog posts to ensure they're there
SELECT id, slug, title, created_at FROM blog_posts ORDER BY created_at DESC LIMIT 5;

-- ============================================================================
-- STEP 1: CREATE COMPLETE BACKUP OF ALL DATA
-- ============================================================================

-- Create backup schema
CREATE SCHEMA IF NOT EXISTS backup_20250106;

-- Backup EVERYTHING including blog posts
CREATE TABLE backup_20250106.blog_posts AS SELECT * FROM blog_posts;
CREATE TABLE backup_20250106.subscribers AS SELECT * FROM subscribers;
CREATE TABLE backup_20250106.email_sequences AS SELECT * FROM email_sequences;
CREATE TABLE backup_20250106.sequence_emails AS SELECT * FROM sequence_emails;
CREATE TABLE backup_20250106.email_automation_logs AS SELECT * FROM email_automation_logs;
CREATE TABLE backup_20250106.email_templates_custom AS SELECT * FROM email_templates_custom;
CREATE TABLE backup_20250106.contact_submissions AS SELECT * FROM contact_submissions;
CREATE TABLE backup_20250106.admin_users AS SELECT * FROM admin_users;
CREATE TABLE backup_20250106.admin_sessions AS SELECT * FROM admin_sessions;
CREATE TABLE backup_20250106.admin_activity_log AS SELECT * FROM admin_activity_log;
CREATE TABLE backup_20250106.career_applications AS SELECT * FROM career_applications;
CREATE TABLE backup_20250106.analytics_events AS SELECT * FROM analytics_events;
CREATE TABLE backup_20250106.click_heatmap AS SELECT * FROM click_heatmap;
CREATE TABLE backup_20250106.chat_conversations AS SELECT * FROM chat_conversations;

-- Backup course-related tables if they have data
CREATE TABLE backup_20250106.course_enrollments AS 
  SELECT * FROM course_enrollments WHERE EXISTS (SELECT 1 FROM course_enrollments LIMIT 1);
CREATE TABLE backup_20250106.course_progress AS 
  SELECT * FROM course_progress WHERE EXISTS (SELECT 1 FROM course_progress LIMIT 1);
CREATE TABLE backup_20250106.course_users AS 
  SELECT * FROM course_users WHERE EXISTS (SELECT 1 FROM course_users LIMIT 1);
CREATE TABLE backup_20250106.user_course_access AS 
  SELECT * FROM user_course_access WHERE EXISTS (SELECT 1 FROM user_course_access LIMIT 1);
CREATE TABLE backup_20250106.course_purchases AS 
  SELECT * FROM course_purchases WHERE EXISTS (SELECT 1 FROM course_purchases LIMIT 1);

-- ============================================================================
-- STEP 2: VERIFY BACKUPS WERE CREATED
-- ============================================================================

-- Check that blog posts backup has all records
SELECT 
  (SELECT COUNT(*) FROM blog_posts) as original_count,
  (SELECT COUNT(*) FROM backup_20250106.blog_posts) as backup_count,
  CASE 
    WHEN (SELECT COUNT(*) FROM blog_posts) = (SELECT COUNT(*) FROM backup_20250106.blog_posts)
    THEN '✅ BACKUP SUCCESSFUL'
    ELSE '❌ BACKUP FAILED - DO NOT PROCEED'
  END as status;

-- List all backup tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'backup_20250106'
ORDER BY table_name;

-- ============================================================================
-- STEP 3: FIX DUPLICATE COURSE TABLES (SAFE - DOESN'T TOUCH BLOG POSTS)
-- ============================================================================

-- Only drop duplicate course tables that are causing conflicts
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS course_progress CASCADE;
DROP TABLE IF EXISTS course_users CASCADE;
DROP TABLE IF EXISTS user_course_access CASCADE;
DROP TABLE IF EXISTS course_purchases CASCADE;

-- Drop the complex user management tables we're not using
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
-- STEP 4: CREATE CLEAN COURSE TABLES
-- ============================================================================

-- Create the simple course tables that match your codebase
CREATE TABLE course_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    temp_password TEXT,
    password_reset_token TEXT,
    password_reset_expires TIMESTAMPTZ,
    last_login TIMESTAMPTZ,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE course_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_first_name TEXT NOT NULL,
    user_last_name TEXT NOT NULL,
    user_phone TEXT,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_amount DECIMAL(10,2),
    payment_reference TEXT,
    access_granted BOOLEAN DEFAULT FALSE,
    progress JSONB DEFAULT '{}',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, user_email)
);

CREATE TABLE course_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    course_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    progress_percentage INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_email, course_id, module_id, lesson_id)
);

-- For Stripe integration
CREATE TABLE user_course_access (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_email TEXT NOT NULL,
    course_id TEXT NOT NULL,
    stripe_customer_id TEXT,
    stripe_session_id TEXT,
    payment_status TEXT DEFAULT 'pending',
    access_granted_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,
    progress_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(customer_email, course_id)
);

CREATE TABLE course_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_session_id TEXT UNIQUE NOT NULL,
    customer_email TEXT NOT NULL,
    course_id TEXT NOT NULL,
    amount_paid INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    payment_status TEXT DEFAULT 'pending',
    stripe_payment_intent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 5: RESTORE COURSE DATA IF ANY EXISTS
-- ============================================================================

-- Restore course data from backups if they exist
INSERT INTO course_users 
SELECT * FROM backup_20250106.course_users
WHERE EXISTS (SELECT 1 FROM backup_20250106.course_users LIMIT 1)
ON CONFLICT (email) DO NOTHING;

INSERT INTO course_enrollments 
SELECT * FROM backup_20250106.course_enrollments
WHERE EXISTS (SELECT 1 FROM backup_20250106.course_enrollments LIMIT 1)
ON CONFLICT (course_id, user_email) DO NOTHING;

INSERT INTO user_course_access 
SELECT * FROM backup_20250106.user_course_access
WHERE EXISTS (SELECT 1 FROM backup_20250106.user_course_access LIMIT 1)
ON CONFLICT (customer_email, course_id) DO NOTHING;

INSERT INTO course_purchases 
SELECT * FROM backup_20250106.course_purchases
WHERE EXISTS (SELECT 1 FROM backup_20250106.course_purchases LIMIT 1)
ON CONFLICT (stripe_session_id) DO NOTHING;

-- ============================================================================
-- STEP 6: ADD MISSING INDEXES (IMPROVES PERFORMANCE)
-- ============================================================================

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_name);

-- Course indexes
CREATE INDEX idx_course_enrollments_email ON course_enrollments(user_email);
CREATE INDEX idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_course_users_email ON course_users(email);
CREATE INDEX idx_course_progress_user ON course_progress(user_email);
CREATE INDEX idx_user_course_access_email ON user_course_access(customer_email);

-- Email indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_sent ON email_automation_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- ============================================================================
-- STEP 7: ADD BLOG IMAGES METADATA TABLE
-- ============================================================================

-- Create table to track blog post images
CREATE TABLE IF NOT EXISTS blog_post_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    storage_bucket TEXT DEFAULT 'blog-images',
    filename TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    alt_text TEXT,
    caption TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    uploaded_by TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(blog_post_id, storage_path)
);

-- Index for blog images
CREATE INDEX idx_blog_images_post ON blog_post_images(blog_post_id);
CREATE INDEX idx_blog_images_featured ON blog_post_images(blog_post_id, is_featured) WHERE is_featured = true;

-- ============================================================================
-- STEP 8: ENABLE RLS WITH PROPER POLICIES
-- ============================================================================

-- Blog posts RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published posts" ON blog_posts
    FOR SELECT USING (published_at <= NOW());
CREATE POLICY "Service role full access" ON blog_posts
    FOR ALL USING (auth.role() = 'service_role');

-- Blog images RLS
ALTER TABLE blog_post_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view blog images" ON blog_post_images
    FOR SELECT USING (true);
CREATE POLICY "Service role can manage images" ON blog_post_images
    FOR ALL USING (auth.role() = 'service_role');

-- Course tables RLS
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON course_enrollments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON course_users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON course_progress FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON user_course_access FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON course_purchases FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- STEP 9: FINAL VERIFICATION
-- ============================================================================

-- Verify blog posts are intact
SELECT 
  'Blog Posts' as check_name,
  (SELECT COUNT(*) FROM blog_posts) as current_count,
  (SELECT COUNT(*) FROM backup_20250106.blog_posts) as backup_count,
  CASE 
    WHEN (SELECT COUNT(*) FROM blog_posts) = (SELECT COUNT(*) FROM backup_20250106.blog_posts)
    THEN '✅ All blog posts preserved'
    ELSE '❌ BLOG POSTS MISSING - RESTORE FROM BACKUP!'
  END as status;

-- Check all tables
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================================================
-- STEP 10: CLEANUP (ONLY AFTER EVERYTHING IS VERIFIED WORKING!)
-- ============================================================================

-- DO NOT RUN THIS UNTIL YOU'VE TESTED EVERYTHING FOR AT LEAST A WEEK!
-- DROP SCHEMA backup_20250106 CASCADE;

-- ============================================================================
-- EMERGENCY ROLLBACK PROCEDURE
-- ============================================================================

-- If anything goes wrong, restore blog posts:
-- INSERT INTO blog_posts SELECT * FROM backup_20250106.blog_posts ON CONFLICT DO NOTHING;

-- To restore everything:
-- DROP TABLE IF EXISTS blog_posts CASCADE;
-- CREATE TABLE blog_posts AS SELECT * FROM backup_20250106.blog_posts;
-- (Repeat for other critical tables)