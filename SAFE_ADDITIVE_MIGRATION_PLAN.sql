-- SAFE ADDITIVE Migration Plan for Bloom Psychology Database
-- This plan ONLY ADDS improvements without breaking existing functionality
-- NO TABLES WILL BE DROPPED - Your course system remains intact

-- ============================================================================
-- STEP 0: AUDIT CURRENT STATE (RUN FIRST!)
-- ============================================================================

-- Check current table inventory
SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size,
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_name = t.table_name AND table_schema = 'public') as columns
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check blog posts specifically
SELECT 
    'blog_posts' as table_name,
    COUNT(*) as row_count,
    pg_size_pretty(pg_total_relation_size('blog_posts')) as table_size
FROM blog_posts;

-- ============================================================================
-- STEP 1: CREATE SAFETY BACKUP (ALWAYS DO THIS!)
-- ============================================================================

-- Create timestamped backup schema
CREATE SCHEMA IF NOT EXISTS backup_safe_20250106;

-- Backup critical tables only (faster, focused backup)
CREATE TABLE backup_safe_20250106.blog_posts AS SELECT * FROM blog_posts;
CREATE TABLE backup_safe_20250106.course_enrollments AS 
    SELECT * FROM course_enrollments WHERE EXISTS (SELECT 1 FROM course_enrollments LIMIT 1);
CREATE TABLE backup_safe_20250106.user_course_access AS 
    SELECT * FROM user_course_access WHERE EXISTS (SELECT 1 FROM user_course_access LIMIT 1);
CREATE TABLE backup_safe_20250106.course_purchases AS 
    SELECT * FROM course_purchases WHERE EXISTS (SELECT 1 FROM course_purchases LIMIT 1);
CREATE TABLE backup_safe_20250106.user_profiles AS 
    SELECT * FROM user_profiles WHERE EXISTS (SELECT 1 FROM user_profiles LIMIT 1);

-- Verify backup
SELECT 
    'Backup Status' as check_type,
    (SELECT COUNT(*) FROM blog_posts) as original_blogs,
    (SELECT COUNT(*) FROM backup_safe_20250106.blog_posts) as backup_blogs,
    CASE 
        WHEN (SELECT COUNT(*) FROM blog_posts) = (SELECT COUNT(*) FROM backup_safe_20250106.blog_posts)
        THEN '✅ Backup successful'
        ELSE '❌ Backup failed - STOP!'
    END as status;

-- ============================================================================
-- STEP 2: ADD BLOG IMAGES METADATA TABLE (NEW FEATURE)
-- ============================================================================

-- Create blog images tracking table
CREATE TABLE IF NOT EXISTS blog_post_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    storage_bucket TEXT DEFAULT 'blog-images',
    filename TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    uploaded_by TEXT,
    upload_source TEXT DEFAULT 'editor', -- 'editor', 'migration', 'api'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_blog_image_path UNIQUE(blog_post_id, storage_path)
);

-- Create indexes for blog images
CREATE INDEX IF NOT EXISTS idx_blog_images_post ON blog_post_images(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_images_featured ON blog_post_images(blog_post_id, is_featured) 
    WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_images_created ON blog_post_images(created_at DESC);

-- Add RLS for blog images
ALTER TABLE blog_post_images ENABLE ROW LEVEL SECURITY;

-- Public can view all blog images
CREATE POLICY "Public can view blog images" ON blog_post_images
    FOR SELECT USING (true);

-- Service role can manage images
CREATE POLICY "Service role manages blog images" ON blog_post_images
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- STEP 3: CREATE STORAGE BUCKET FOR BLOG IMAGES
-- ============================================================================

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'blog-images', 
    'blog-images', 
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies
CREATE POLICY "Public can view blog images 1" ON storage.objects
    FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images 2" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'blog-images' 
        AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    );

CREATE POLICY "Service role can manage blog images 3" ON storage.objects
    FOR ALL USING (
        bucket_id = 'blog-images' 
        AND auth.role() = 'service_role'
    );

-- ============================================================================
-- STEP 4: ADD MISSING INDEXES FOR PERFORMANCE
-- ============================================================================

-- Blog posts indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_name);

-- Course enrollment indexes (only if columns exist)
DO $$
BEGIN
    -- Check if user_email column exists before creating index
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_enrollments' 
        AND column_name = 'user_email'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_course_enrollments_email 
            ON course_enrollments(user_email);
    END IF;
    
    -- Check if course_id column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_enrollments' 
        AND column_name = 'course_id'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_course_enrollments_course 
            ON course_enrollments(course_id);
    END IF;
END $$;

-- User course access indexes
CREATE INDEX IF NOT EXISTS idx_user_course_access_email 
    ON user_course_access(customer_email) 
    WHERE EXISTS (SELECT 1 FROM user_course_access LIMIT 1);

-- Email and subscriber indexes
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent ON email_automation_logs(sent_at DESC)
    WHERE EXISTS (SELECT 1 FROM email_automation_logs LIMIT 1);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(type);

-- ============================================================================
-- STEP 5: ADD HELPFUL FUNCTIONS
-- ============================================================================

-- Function to get blog image URL
CREATE OR REPLACE FUNCTION get_blog_image_url(image_path TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Replace with your actual Supabase URL
    RETURN 'https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/blog-images/' || image_path;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to migrate existing blog post images to tracking table
CREATE OR REPLACE FUNCTION migrate_existing_blog_images()
RETURNS TABLE(blog_id UUID, image_url TEXT, status TEXT) AS $$
DECLARE
    blog_record RECORD;
    image_filename TEXT;
BEGIN
    FOR blog_record IN 
        SELECT id, image_url 
        FROM blog_posts 
        WHERE image_url IS NOT NULL 
        AND image_url != ''
    LOOP
        -- Extract filename from URL
        image_filename := substring(blog_record.image_url from '[^/]+$');
        
        -- Try to insert into blog_post_images
        BEGIN
            INSERT INTO blog_post_images (
                blog_post_id,
                storage_path,
                filename,
                is_featured,
                alt_text,
                upload_source
            ) VALUES (
                blog_record.id,
                image_filename,
                image_filename,
                true, -- Featured image
                'Blog featured image',
                'migration'
            )
            ON CONFLICT (blog_post_id, storage_path) DO NOTHING;
            
            RETURN QUERY SELECT blog_record.id, blog_record.image_url, 'migrated'::TEXT;
        EXCEPTION WHEN OTHERS THEN
            RETURN QUERY SELECT blog_record.id, blog_record.image_url, 'failed: ' || SQLERRM;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 6: FIX INCONSISTENCIES WITHOUT BREAKING ANYTHING
-- ============================================================================

-- Add missing columns if they don't exist (safe operations)
DO $$
BEGIN
    -- Add updated_at to tables missing it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blog_posts' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    -- Add metadata column to tables that could use it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_enrollments' AND column_name = 'metadata'
    ) THEN
        ALTER TABLE course_enrollments ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
END $$;

-- Create update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
DO $$
DECLARE
    t_name TEXT;
BEGIN
    FOR t_name IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_%I_updated_at 
            BEFORE UPDATE ON %I 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column()',
            t_name, t_name
        );
    END LOOP;
END $$;

-- ============================================================================
-- STEP 7: ENHANCE RLS POLICIES (WITHOUT BREAKING EXISTING ONES)
-- ============================================================================

-- Ensure RLS is enabled on critical tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

-- Add policies only if they don't exist
DO $$
BEGIN
    -- Blog posts public read policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' 
        AND policyname = 'Public can read published posts'
    ) THEN
        CREATE POLICY "Public can read published posts" ON blog_posts
            FOR SELECT USING (published_at IS NOT NULL AND published_at <= NOW());
    END IF;
    
    -- Service role access
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' 
        AND policyname = 'Service role full access'
    ) THEN
        CREATE POLICY "Service role full access" ON blog_posts
            FOR ALL USING (auth.role() = 'service_role');
    END IF;
END $$;

-- ============================================================================
-- STEP 8: VERIFICATION QUERIES
-- ============================================================================

-- Check what we added
SELECT 'New Features Added:' as status;

-- Check blog images table
SELECT 
    'blog_post_images table' as feature,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_post_images')
        THEN '✅ Created'
        ELSE '❌ Failed'
    END as status;

-- Check storage bucket
SELECT 
    'blog-images storage bucket' as feature,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'blog-images')
        THEN '✅ Created'
        ELSE '❌ Failed'
    END as status;

-- Count indexes
SELECT 
    'Performance indexes' as feature,
    COUNT(*) || ' indexes total' as status
FROM pg_indexes 
WHERE schemaname = 'public';

-- Check blog posts are intact
SELECT 
    'Blog posts' as feature,
    COUNT(*) || ' posts (should be 17)' as status
FROM blog_posts;

-- ============================================================================
-- STEP 9: OPTIONAL - MIGRATE EXISTING BLOG IMAGES
-- ============================================================================

-- Run this to track existing blog post images
-- SELECT * FROM migrate_existing_blog_images();

-- ============================================================================
-- CLEANUP (ONLY AFTER TESTING)
-- ============================================================================

-- After everything is verified working for at least a week:
-- DROP SCHEMA backup_safe_20250106 CASCADE;