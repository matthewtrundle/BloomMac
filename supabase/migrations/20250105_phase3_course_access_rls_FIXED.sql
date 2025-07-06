-- =====================================================
-- Phase 3: Course Access Control RLS Implementation (FIXED)
-- Date: 2025-01-05
-- Description: Fixed version based on actual production schema
-- =====================================================

-- 1. Courses table - enable RLS and add policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Everyone can view active courses" ON courses;
DROP POLICY IF EXISTS "Public can read active courses" ON courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;
DROP POLICY IF EXISTS "Enrolled users view their courses" ON courses;

-- Create course policies
CREATE POLICY "Everyone can view active courses" ON courses
    FOR SELECT USING (is_active = true);

CREATE POLICY "Enrolled users view their courses" ON courses
    FOR SELECT USING (
        is_active = true 
        OR EXISTS (
            SELECT 1 FROM course_enrollments
            WHERE course_enrollments.course_id = courses.slug
            AND course_enrollments.user_id = auth.uid()
            AND course_enrollments.payment_status = 'paid'
        )
    );

CREATE POLICY "Admins can manage courses" ON courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 2. Course modules - enable RLS
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

-- Create module policies
CREATE POLICY "Public view published modules" ON course_modules
    FOR SELECT USING (
        is_published = true
        AND EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = course_modules.course_id
            AND courses.is_active = true
        )
    );

CREATE POLICY "Enrolled users view all modules" ON course_modules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM course_enrollments ce
            JOIN courses c ON c.slug = ce.course_id
            WHERE c.id = course_modules.course_id
            AND ce.user_id = auth.uid()
            AND ce.payment_status = 'paid'
        )
    );

CREATE POLICY "Admins manage modules" ON course_modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 3. Course lessons - enable RLS
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

-- Create lesson policies
CREATE POLICY "Preview lessons are public" ON course_lessons
    FOR SELECT USING (
        is_preview = true
        AND is_published = true
        AND EXISTS (
            SELECT 1 FROM course_modules cm
            JOIN courses c ON c.id = cm.course_id
            WHERE cm.id = course_lessons.module_id
            AND c.is_active = true
        )
    );

CREATE POLICY "Enrolled users view lessons" ON course_lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM course_enrollments ce
            JOIN courses c ON c.slug = ce.course_id
            JOIN course_modules cm ON cm.course_id = c.id
            WHERE cm.id = course_lessons.module_id
            AND ce.user_id = auth.uid()
            AND ce.payment_status = 'paid'
        )
    );

CREATE POLICY "Admins manage lessons" ON course_lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 4. Course resources - table already exists, enable RLS
ALTER TABLE course_resources ENABLE ROW LEVEL SECURITY;

-- Create resource policies
CREATE POLICY "Public resources are visible to all" ON course_resources
    FOR SELECT USING (access_level = 'public');

CREATE POLICY "Enrolled users access course resources" ON course_resources
    FOR SELECT USING (
        access_level IN ('enrolled', 'premium')
        AND EXISTS (
            SELECT 1 FROM course_enrollments ce
            JOIN courses c ON c.slug = ce.course_id
            WHERE c.id = course_resources.course_id
            AND ce.user_id = auth.uid()
            AND ce.payment_status = 'paid'
        )
    );

CREATE POLICY "Admins manage resources" ON course_resources
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 5. Course progress - enable RLS
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- Create progress policies
CREATE POLICY "Users view own progress" ON course_progress
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users update own progress" ON course_progress
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System manages progress" ON course_progress
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Admins view all progress" ON course_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- 6. Course certificates - enable RLS if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'course_certificates') THEN
        ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users view own certificates" ON course_certificates
            FOR SELECT USING (user_id = auth.uid());
        
        CREATE POLICY "Public can verify certificates" ON course_certificates
            FOR SELECT USING (true);
        
        CREATE POLICY "System creates certificates" ON course_certificates
            FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role');
        
        CREATE POLICY "Admins manage certificates" ON course_certificates
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM admin_users
                    WHERE id = auth.uid()
                    AND is_active = true
                )
            );
    END IF;
END $$;

-- 7. Course activity logs - enable RLS if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'course_activity_logs') THEN
        ALTER TABLE course_activity_logs ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users view own activity" ON course_activity_logs
            FOR SELECT USING (user_id = auth.uid());
        
        CREATE POLICY "System logs activity" ON course_activity_logs
            FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role');
        
        CREATE POLICY "Admins view all activity" ON course_activity_logs
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM admin_users
                    WHERE id = auth.uid()
                    AND is_active = true
                )
            );
    END IF;
END $$;

-- 8. Create missing course tables

-- Create course_announcements table
CREATE TABLE IF NOT EXISTS course_announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_pinned BOOLEAN DEFAULT false,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_course_announcements_course ON course_announcements(course_id);
CREATE INDEX IF NOT EXISTS idx_course_announcements_created ON course_announcements(created_at DESC);

-- Enable RLS
ALTER TABLE course_announcements ENABLE ROW LEVEL SECURITY;

-- Announcements policies
CREATE POLICY "Enrolled users view announcements" ON course_announcements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM course_enrollments ce
            JOIN courses c ON c.slug = ce.course_id
            WHERE c.id = course_announcements.course_id
            AND ce.user_id = auth.uid()
            AND ce.payment_status = 'paid'
        )
    );

CREATE POLICY "Admins manage announcements" ON course_announcements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        )
    );

-- Create course_discussions table
CREATE TABLE IF NOT EXISTS course_discussions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    module_id UUID,
    lesson_id UUID,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES course_discussions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_answer BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_course_discussions_course ON course_discussions(course_id);
CREATE INDEX IF NOT EXISTS idx_course_discussions_user ON course_discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_course_discussions_parent ON course_discussions(parent_id);

-- Enable RLS
ALTER TABLE course_discussions ENABLE ROW LEVEL SECURITY;

-- Discussion policies
CREATE POLICY "Enrolled users participate in discussions" ON course_discussions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM course_enrollments ce
            JOIN courses c ON c.slug = ce.course_id
            WHERE c.id = course_discussions.course_id
            AND ce.user_id = auth.uid()
            AND ce.payment_status = 'paid'
        )
    );

CREATE POLICY "Users manage own posts" ON course_discussions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users delete own posts" ON course_discussions
    FOR DELETE USING (user_id = auth.uid());

-- Grant permissions
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT ON courses TO authenticated;
GRANT SELECT ON course_modules TO authenticated;
GRANT SELECT ON course_lessons TO authenticated;
GRANT SELECT ON course_resources TO authenticated;
GRANT SELECT, UPDATE ON course_progress TO authenticated;
GRANT SELECT ON course_announcements TO authenticated;
GRANT ALL ON course_discussions TO authenticated;

-- Grant full permissions to service role
GRANT ALL ON courses TO service_role;
GRANT ALL ON course_modules TO service_role;
GRANT ALL ON course_lessons TO service_role;
GRANT ALL ON course_resources TO service_role;
GRANT ALL ON course_progress TO service_role;
GRANT ALL ON course_announcements TO service_role;
GRANT ALL ON course_discussions TO service_role;

-- Grant permissions for sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;