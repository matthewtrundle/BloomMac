-- =====================================================
-- Phase 3: Course Access Control RLS Implementation (SAFE VERSION)
-- Date: 2025-01-05
-- Description: Safe version that handles different schema variations
-- =====================================================

-- Ensure existing course tables have RLS enabled
-- =====================================================

-- 1. Courses table - add policy that works with both schema versions
DO $$
BEGIN
    -- Check if payment_status column exists in course_enrollments
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_enrollments' 
        AND column_name = 'payment_status'
    ) THEN
        -- Use payment_status if it exists
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
    ELSE
        -- Use status column instead
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
                        AND course_enrollments.status = 'active'
                    )
                );
        END IF;
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
        
        -- Create policies if they don't exist
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_modules' AND policyname = 'Public view published modules') THEN
            CREATE POLICY "Public view published modules" ON course_modules
                FOR SELECT USING (
                    EXISTS (
                        SELECT 1 FROM courses
                        WHERE courses.id = course_modules.course_id
                        AND courses.is_active = true
                    )
                );
        END IF;
        
        -- Check which schema version we have
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_enrollments' AND column_name = 'payment_status') THEN
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_modules' AND policyname = 'Enrolled users view all modules') THEN
                CREATE POLICY "Enrolled users view all modules" ON course_modules
                    FOR SELECT USING (
                        EXISTS (
                            SELECT 1 FROM course_enrollments
                            WHERE course_enrollments.course_id = course_modules.course_id
                            AND course_enrollments.user_id = auth.uid()
                            AND course_enrollments.payment_status = 'paid'
                        )
                    );
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_modules' AND policyname = 'Enrolled users view all modules') THEN
                CREATE POLICY "Enrolled users view all modules" ON course_modules
                    FOR SELECT USING (
                        EXISTS (
                            SELECT 1 FROM course_enrollments
                            WHERE course_enrollments.course_id = course_modules.course_id
                            AND course_enrollments.user_id = auth.uid()
                            AND course_enrollments.status = 'active'
                        )
                    );
            END IF;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_modules' AND policyname = 'Admins manage modules') THEN
            CREATE POLICY "Admins manage modules" ON course_modules
                FOR ALL USING (
                    EXISTS (
                        SELECT 1 FROM admin_users
                        WHERE id = auth.uid()
                        AND is_active = true
                    )
                );
        END IF;
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
        
        -- Check which schema version we have
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_enrollments' AND column_name = 'payment_status') THEN
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_lessons' AND policyname = 'Enrolled users view lessons') THEN
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
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_lessons' AND policyname = 'Enrolled users view lessons') THEN
                CREATE POLICY "Enrolled users view lessons" ON course_lessons
                    FOR SELECT USING (
                        EXISTS (
                            SELECT 1 FROM course_enrollments ce
                            JOIN course_modules cm ON cm.course_id = ce.course_id
                            WHERE cm.id = course_lessons.module_id
                            AND ce.user_id = auth.uid()
                            AND ce.status = 'active'
                        )
                    );
            END IF;
        END IF;
        
        -- Preview lessons policy
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_lessons' AND policyname = 'Preview lessons are public') THEN
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_lessons' AND column_name = 'is_preview') THEN
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
            END IF;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_lessons' AND policyname = 'Admins manage lessons') THEN
            CREATE POLICY "Admins manage lessons" ON course_lessons
                FOR ALL USING (
                    EXISTS (
                        SELECT 1 FROM admin_users
                        WHERE id = auth.uid()
                        AND is_active = true
                    )
                );
        END IF;
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

-- Course resources policies with schema version check
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_resources' AND policyname = 'Public resources are visible to all') THEN
        CREATE POLICY "Public resources are visible to all" ON course_resources
            FOR SELECT USING (access_level = 'public');
    END IF;
    
    -- Check which schema version we have
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_enrollments' AND column_name = 'payment_status') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_resources' AND policyname = 'Enrolled users access course resources') THEN
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
        END IF;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_resources' AND policyname = 'Enrolled users access course resources') THEN
            CREATE POLICY "Enrolled users access course resources" ON course_resources
                FOR SELECT USING (
                    access_level IN ('enrolled', 'premium')
                    AND EXISTS (
                        SELECT 1 FROM course_enrollments
                        WHERE course_enrollments.course_id = course_resources.course_id
                        AND course_enrollments.user_id = auth.uid()
                        AND course_enrollments.status = 'active'
                    )
                );
        END IF;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_resources' AND policyname = 'Admins manage resources') THEN
        CREATE POLICY "Admins manage resources" ON course_resources
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM admin_users
                    WHERE id = auth.uid()
                    AND is_active = true
                )
            );
    END IF;
END $$;

-- Continue with rest of Phase 3 tables...
-- (Include the rest of the Phase 3 migration with similar safety checks)