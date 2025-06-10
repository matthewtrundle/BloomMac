-- Course Platform Schema Consolidation
-- This migration creates the missing tables for course content management
-- while preserving all existing data and tables

-- Create course modules (weeks) table
CREATE TABLE IF NOT EXISTS course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    objectives JSONB DEFAULT '[]',
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, week_number)
);

-- Create course lessons table with content storage
CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    lesson_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    video_duration_minutes INTEGER,
    video_thumbnail_url TEXT,
    slides_html TEXT, -- Store HTML slides content directly
    transcript TEXT,
    script_notes TEXT,
    resources JSONB DEFAULT '[]',
    order_index INTEGER DEFAULT 0,
    is_preview BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(module_id, lesson_number)
);

-- Create course resources table
CREATE TABLE IF NOT EXISTS course_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    file_type VARCHAR(50),
    file_size_bytes INTEGER,
    download_count INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content version history table
CREATE TABLE IF NOT EXISTS course_content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- 'course', 'module', 'lesson'
    entity_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    content_snapshot JSONB NOT NULL,
    changed_by UUID REFERENCES admin_users(id),
    change_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_course_id ON course_resources(course_id);
CREATE INDEX IF NOT EXISTS idx_course_content_versions_entity ON course_content_versions(entity_type, entity_id);

-- Enable RLS
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_content_versions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admins can manage course modules" ON course_modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Admins can manage course lessons" ON course_lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Admins can manage course resources" ON course_resources
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Admins can view content versions" ON course_content_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Create RLS policies for public access (published content only)
CREATE POLICY "Public can view published modules" ON course_modules
    FOR SELECT USING (
        is_published = true AND
        EXISTS (
            SELECT 1 FROM courses 
            WHERE id = course_modules.course_id 
            AND is_active = true
        )
    );

CREATE POLICY "Public can view published lessons" ON course_lessons
    FOR SELECT USING (
        is_published = true AND
        EXISTS (
            SELECT 1 FROM course_modules cm
            JOIN courses c ON c.id = cm.course_id
            WHERE cm.id = course_lessons.module_id 
            AND cm.is_published = true
            AND c.is_active = true
        )
    );

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for timestamp updates
DROP TRIGGER IF EXISTS update_course_modules_updated_at ON course_modules;
CREATE TRIGGER update_course_modules_updated_at 
    BEFORE UPDATE ON course_modules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_course_lessons_updated_at ON course_lessons;
CREATE TRIGGER update_course_lessons_updated_at 
    BEFORE UPDATE ON course_lessons 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add missing columns to existing tables if needed
DO $$ 
BEGIN
    -- Add auth_user_id to course_users if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_users' 
        AND column_name = 'auth_user_id'
    ) THEN
        ALTER TABLE course_users ADD COLUMN auth_user_id UUID REFERENCES auth.users(id);
    END IF;

    -- Add stripe_customer_id to user_course_access if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_course_access' 
        AND column_name = 'stripe_customer_id'
    ) THEN
        ALTER TABLE user_course_access ADD COLUMN stripe_customer_id TEXT;
    END IF;
END $$;

-- Create a view for easier course management queries
CREATE OR REPLACE VIEW course_overview AS
SELECT 
    c.id,
    c.slug,
    c.title,
    c.price,
    c.is_active,
    COUNT(DISTINCT cm.id) as module_count,
    COUNT(DISTINCT cl.id) as lesson_count,
    COUNT(DISTINCT uca.id) as enrolled_students,
    MAX(uca.created_at) as last_enrollment
FROM courses c
LEFT JOIN course_modules cm ON cm.course_id = c.id
LEFT JOIN course_lessons cl ON cl.module_id = cm.id
LEFT JOIN user_course_access uca ON uca.course_id = c.slug AND uca.payment_status = 'paid'
GROUP BY c.id, c.slug, c.title, c.price, c.is_active;

-- Grant permissions on the view
GRANT SELECT ON course_overview TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE course_modules IS 'Stores course modules/weeks structure';
COMMENT ON TABLE course_lessons IS 'Stores individual lessons with content including HTML slides';
COMMENT ON TABLE course_resources IS 'Stores downloadable resources and materials for courses';
COMMENT ON TABLE course_content_versions IS 'Tracks version history for course content changes';
COMMENT ON COLUMN course_lessons.slides_html IS 'HTML content for lesson slides, stored directly in database';

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE 'Course schema consolidation completed successfully!';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Run the content migration script to import existing course data';
    RAISE NOTICE '2. Update course viewing pages to use database content';
    RAISE NOTICE '3. Test the new admin course management interface';
END $$;