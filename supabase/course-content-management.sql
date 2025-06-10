-- Course Content Management System for Bloom Psychology
-- This schema manages course creation, editing, and organization

-- Main courses table for course metadata
CREATE TABLE IF NOT EXISTS course_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    subtitle TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    version INTEGER DEFAULT 1,
    duration_weeks INTEGER DEFAULT 6,
    total_lessons INTEGER DEFAULT 24,
    price DECIMAL(10,2),
    original_price DECIMAL(10,2),
    hero_image TEXT,
    target_audience TEXT,
    learning_outcomes JSONB DEFAULT '[]',
    course_features JSONB DEFAULT '[]',
    bonus_materials JSONB DEFAULT '[]',
    instructor_id UUID,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Course weeks/modules
CREATE TABLE IF NOT EXISTS course_weeks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES course_content(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    objectives JSONB DEFAULT '[]',
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(course_id, week_number)
);

-- Individual lessons within weeks
CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_id UUID REFERENCES course_weeks(id) ON DELETE CASCADE,
    lesson_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    lesson_type TEXT DEFAULT 'video' CHECK (lesson_type IN ('video', 'reading', 'exercise', 'quiz')),
    content_body TEXT, -- Main lesson content/transcript
    video_script TEXT, -- Video recording script
    slides_html TEXT, -- HTML slides content
    slides_url TEXT, -- Link to external slides
    video_url TEXT, -- Link to video file
    order_index INTEGER NOT NULL,
    is_preview BOOLEAN DEFAULT false, -- Can be previewed without purchase
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(week_id, lesson_number)
);

-- Course resources and downloadables
CREATE TABLE IF NOT EXISTS course_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES course_content(id) ON DELETE CASCADE,
    week_id UUID REFERENCES course_weeks(id) ON DELETE CASCADE NULL,
    lesson_id UUID REFERENCES course_lessons(id) ON DELETE CASCADE NULL,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    storage_path TEXT NOT NULL,
    download_url TEXT,
    is_public BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Course templates for reusable content
CREATE TABLE IF NOT EXISTS course_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT NOT NULL CHECK (template_type IN ('lesson', 'week', 'course')),
    template_data JSONB NOT NULL,
    created_by UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Course version history for content management
CREATE TABLE IF NOT EXISTS course_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES course_content(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    changes_description TEXT,
    content_snapshot JSONB, -- Snapshot of course content at this version
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(course_id, version_number)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_course_content_status ON course_content(status);
CREATE INDEX IF NOT EXISTS idx_course_content_slug ON course_content(slug);
CREATE INDEX IF NOT EXISTS idx_course_weeks_course_id ON course_weeks(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_week_id ON course_lessons(week_id);
CREATE INDEX IF NOT EXISTS idx_course_assets_course_id ON course_assets(course_id);

-- Row Level Security (RLS) policies
ALTER TABLE course_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_versions ENABLE ROW LEVEL SECURITY;

-- Admin access policies (admins can do everything)
CREATE POLICY "Admins can manage all course content" ON course_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Admins can manage all course weeks" ON course_weeks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Admins can manage all course lessons" ON course_lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Admins can manage all course assets" ON course_assets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Admins can manage all course templates" ON course_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Admins can manage all course versions" ON course_versions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Public read access for published courses (for course preview/purchase pages)
CREATE POLICY "Published courses are publicly readable" ON course_content
    FOR SELECT USING (status = 'published');

CREATE POLICY "Published course weeks are publicly readable" ON course_weeks
    FOR SELECT USING (
        is_active = true AND 
        EXISTS (
            SELECT 1 FROM course_content 
            WHERE id = course_weeks.course_id AND status = 'published'
        )
    );

CREATE POLICY "Published course lessons are publicly readable" ON course_lessons
    FOR SELECT USING (
        is_active = true AND 
        EXISTS (
            SELECT 1 FROM course_weeks cw 
            JOIN course_content cc ON cw.course_id = cc.id
            WHERE cw.id = course_lessons.week_id 
            AND cc.status = 'published'
        )
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_course_content_updated_at 
    BEFORE UPDATE ON course_content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_weeks_updated_at 
    BEFORE UPDATE ON course_weeks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_lessons_updated_at 
    BEFORE UPDATE ON course_lessons 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial course data from existing structure
INSERT INTO course_content (
    title, slug, description, subtitle, status, duration_weeks, total_lessons, 
    price, original_price, target_audience, learning_outcomes, course_features
) VALUES (
    'Postpartum Wellness Foundations',
    'postpartum-wellness-foundations',
    'A comprehensive self-paced program designed to help new mothers navigate the emotional challenges of postpartum life with confidence and clarity.',
    'Your 6-Week Journey to Emotional Balance',
    'draft',
    6,
    24,
    197.00,
    297.00,
    'New mothers in the postpartum period',
    '["Understand postpartum emotions", "Build coping strategies", "Create self-care routines", "Strengthen mother-baby bond"]',
    '["Weekly video lessons with Dr. Jana", "Downloadable workbooks and exercises", "Audio meditations for busy moms", "Lifetime access to materials", "Certificate of completion"]'
) ON CONFLICT (slug) DO NOTHING;

-- Comment for future reference
COMMENT ON TABLE course_content IS 'Main table for managing course metadata and structure';
COMMENT ON TABLE course_weeks IS 'Organizes course content into weekly modules';
COMMENT ON TABLE course_lessons IS 'Individual lessons with scripts, slides, and video content';
COMMENT ON TABLE course_assets IS 'File storage and management for course resources';