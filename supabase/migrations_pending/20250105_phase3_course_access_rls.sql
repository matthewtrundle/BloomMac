-- =====================================================
-- Phase 3: Course Access Control RLS Implementation
-- Date: 2025-01-05
-- Description: Implement RLS for course content and access
-- =====================================================

-- Ensure existing course tables have RLS enabled
-- =====================================================

-- 1. Courses table - already has RLS, add missing policies if needed
DO $$
BEGIN
    -- Add policy for enrolled users to view their courses
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'courses' 
        AND policyname = 'Enrolled users view their courses'
    ) THEN
        CREATE POLICY "Enrolled users view their courses" ON courses
            FOR SELECT USING (
                is_active = true 
                OR EXISTS (
                    SELECT 1 FROM course_enrollments
                    WHERE course_enrollments.course_id = courses.id
                    AND course_enrollments.user_id = auth.uid()
                    AND course_enrollments.payment_status = 'paid'
                )
            );
    END IF;
END $$;

-- 2. Course modules - ensure RLS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'course_modules') THEN
        -- Enable RLS if not already enabled
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'course_modules' 
            AND rowsecurity = true
        ) THEN
            ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
        END IF;
        
        -- Create policies
        CREATE POLICY "Public view published modules" ON course_modules
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM courses
                    WHERE courses.id = course_modules.course_id
                    AND courses.is_active = true
                )
            );
            
        CREATE POLICY "Enrolled users view all modules" ON course_modules
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM course_enrollments
                    WHERE course_enrollments.course_id = course_modules.course_id
                    AND course_enrollments.user_id = auth.uid()
                    AND course_enrollments.payment_status = 'paid'
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
    END IF;
END $$;

-- 3. Course lessons - ensure RLS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'course_lessons') THEN
        -- Enable RLS if not already enabled
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'course_lessons' 
            AND rowsecurity = true
        ) THEN
            ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
        END IF;
        
        -- Create policies
        CREATE POLICY "Enrolled users view lessons" ON course_lessons
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM course_enrollments ce
                    JOIN course_modules cm ON cm.course_id = ce.course_id
                    WHERE cm.id = course_lessons.module_id
                    AND ce.user_id = auth.uid()
                    AND ce.payment_status = 'paid'
                )
            );
            
        CREATE POLICY "Preview lessons are public" ON course_lessons
            FOR SELECT USING (
                is_preview = true
                AND EXISTS (
                    SELECT 1 FROM course_modules cm
                    JOIN courses c ON c.id = cm.course_id
                    WHERE cm.id = course_lessons.module_id
                    AND c.is_active = true
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
    END IF;
END $$;

-- 4. Course resources - create if missing and add RLS
CREATE TABLE IF NOT EXISTS course_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    module_id UUID,
    lesson_id UUID,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    file_type TEXT,
    file_size INTEGER,
    is_downloadable BOOLEAN DEFAULT true,
    access_level TEXT DEFAULT 'enrolled' CHECK (access_level IN ('public', 'enrolled', 'premium')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes if table was just created
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_course_resources_course') THEN
        CREATE INDEX idx_course_resources_course ON course_resources(course_id);
        CREATE INDEX idx_course_resources_module ON course_resources(module_id);
        CREATE INDEX idx_course_resources_lesson ON course_resources(lesson_id);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE course_resources ENABLE ROW LEVEL SECURITY;

-- Course resources policies
CREATE POLICY "Public resources are visible to all" ON course_resources
    FOR SELECT USING (access_level = 'public');

CREATE POLICY "Enrolled users access course resources" ON course_resources
    FOR SELECT USING (
        access_level IN ('enrolled', 'premium')
        AND EXISTS (
            SELECT 1 FROM course_enrollments
            WHERE course_enrollments.course_id = course_resources.course_id
            AND course_enrollments.user_id = auth.uid()
            AND course_enrollments.payment_status = 'paid'
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

-- 5. Course progress - ensure proper RLS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'course_progress') THEN
        -- Enable RLS if not already enabled
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'course_progress' 
            AND rowsecurity = true
        ) THEN
            ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
        END IF;
        
        -- Drop existing policies to avoid conflicts
        DROP POLICY IF EXISTS "Users view own progress" ON course_progress;
        DROP POLICY IF EXISTS "Users update own progress" ON course_progress;
        DROP POLICY IF EXISTS "System manages progress" ON course_progress;
        DROP POLICY IF EXISTS "Admins view all progress" ON course_progress;
        
        -- Create policies
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
    END IF;
END $$;

-- 6. Course certificates - ensure RLS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'course_certificates') THEN
        -- Enable RLS if not already enabled
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'course_certificates' 
            AND rowsecurity = true
        ) THEN
            ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;
        END IF;
        
        -- Create policies
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

-- 7. Course activity log - ensure RLS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'course_activity_log') THEN
        -- Enable RLS if not already enabled
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'course_activity_log' 
            AND rowsecurity = true
        ) THEN
            ALTER TABLE course_activity_log ENABLE ROW LEVEL SECURITY;
        END IF;
        
        -- Create policies
        CREATE POLICY "Users view own activity" ON course_activity_log
            FOR SELECT USING (user_id = auth.uid());
            
        CREATE POLICY "System logs activity" ON course_activity_log
            FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role');
            
        CREATE POLICY "Admins view all activity" ON course_activity_log
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM admin_users
                    WHERE id = auth.uid()
                    AND is_active = true
                )
            );
    END IF;
END $$;

-- 8. User course stats view - add security
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'user_course_stats') THEN
        -- Create a secure version of the view with built-in filtering
        CREATE OR REPLACE VIEW user_course_stats_secure AS
        SELECT * FROM user_course_stats
        WHERE user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND is_active = true
        );
        
        -- Grant access
        GRANT SELECT ON user_course_stats_secure TO authenticated;
    END IF;
END $$;

-- 9. Course milestones - ensure RLS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'course_milestones') THEN
        -- Enable RLS if not already enabled
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'course_milestones' 
            AND rowsecurity = true
        ) THEN
            ALTER TABLE course_milestones ENABLE ROW LEVEL SECURITY;
        END IF;
        
        -- Create policies
        CREATE POLICY "Users view own milestones" ON course_milestones
            FOR SELECT USING (user_id = auth.uid());
            
        CREATE POLICY "System manages milestones" ON course_milestones
            FOR ALL USING (auth.jwt()->>'role' = 'service_role');
            
        CREATE POLICY "Admins view all milestones" ON course_milestones
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM admin_users
                    WHERE id = auth.uid()
                    AND is_active = true
                )
            );
    END IF;
END $$;

-- Create missing course-related tables
-- =====================================================

-- 10. Create course announcements table
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
            SELECT 1 FROM course_enrollments
            WHERE course_enrollments.course_id = course_announcements.course_id
            AND course_enrollments.user_id = auth.uid()
            AND course_enrollments.payment_status = 'paid'
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

-- 11. Create course discussions table
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
            SELECT 1 FROM course_enrollments
            WHERE course_enrollments.course_id = course_discussions.course_id
            AND course_enrollments.user_id = auth.uid()
            AND course_enrollments.payment_status = 'paid'
        )
    );

CREATE POLICY "Users manage own posts" ON course_discussions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users delete own posts" ON course_discussions
    FOR DELETE USING (user_id = auth.uid());

-- Grant permissions
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT ON course_resources TO authenticated;
GRANT SELECT ON course_announcements TO authenticated;
GRANT ALL ON course_discussions TO authenticated;

-- Grant full permissions to service role
GRANT ALL ON course_resources TO service_role;
GRANT ALL ON course_announcements TO service_role;
GRANT ALL ON course_discussions TO service_role;

-- Grant permissions for sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Validation queries
-- =====================================================
-- Run these to verify RLS is properly configured:

-- Check course-related tables with RLS
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND (
--     tablename LIKE 'course_%' 
--     OR tablename = 'courses'
-- )
-- ORDER BY tablename;

-- Check policies count per table
-- SELECT tablename, COUNT(*) as policy_count
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- AND (
--     tablename LIKE 'course_%' 
--     OR tablename = 'courses'
-- )
-- GROUP BY tablename
-- ORDER BY tablename;