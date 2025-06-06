-- Blog Images Metadata Table
-- This table tracks all images uploaded for blog posts
-- Works in conjunction with the blog-images storage bucket

-- Create the blog post images metadata table
CREATE TABLE IF NOT EXISTS blog_post_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    
    -- Storage information
    storage_path TEXT NOT NULL, -- Path in Supabase storage
    storage_object_id TEXT, -- Supabase storage object ID
    file_name TEXT NOT NULL,
    file_size INTEGER, -- Size in bytes
    mime_type TEXT,
    
    -- Image metadata
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    
    -- Usage tracking
    is_featured BOOLEAN DEFAULT FALSE, -- Is this the main blog image?
    display_order INTEGER DEFAULT 0, -- For galleries
    usage_count INTEGER DEFAULT 0, -- Track where it's used
    
    -- Timestamps
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by UUID REFERENCES admin_users(id),
    last_used_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_images_post ON blog_post_images(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_images_featured ON blog_post_images(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_blog_images_uploaded ON blog_post_images(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_images_storage_path ON blog_post_images(storage_path);

-- Create a view for easy access to featured images
CREATE OR REPLACE VIEW blog_featured_images AS
SELECT 
    bp.id as blog_post_id,
    bp.slug,
    bp.title,
    bpi.id as image_id,
    bpi.storage_path,
    bpi.alt_text,
    bpi.width,
    bpi.height
FROM blog_posts bp
LEFT JOIN blog_post_images bpi ON bp.id = bpi.blog_post_id AND bpi.is_featured = TRUE;

-- Function to get full Supabase storage URL
CREATE OR REPLACE FUNCTION get_blog_image_url(p_storage_path TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Replace with your actual Supabase URL
    RETURN 'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/blog-images/' || p_storage_path;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to set featured image (ensures only one per post)
CREATE OR REPLACE FUNCTION set_featured_blog_image(p_blog_post_id UUID, p_image_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Unset any existing featured images for this post
    UPDATE blog_post_images 
    SET is_featured = FALSE, updated_at = NOW()
    WHERE blog_post_id = p_blog_post_id AND is_featured = TRUE;
    
    -- Set the new featured image
    UPDATE blog_post_images 
    SET is_featured = TRUE, updated_at = NOW()
    WHERE id = p_image_id AND blog_post_id = p_blog_post_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update the blog post's image_url when featured image changes
CREATE OR REPLACE FUNCTION update_blog_post_featured_image()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_featured = TRUE THEN
        -- Update the blog post's image_url field
        UPDATE blog_posts 
        SET 
            image_url = get_blog_image_url(NEW.storage_path),
            image_alt = NEW.alt_text,
            updated_at = NOW()
        WHERE id = NEW.blog_post_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_blog_featured_image
AFTER INSERT OR UPDATE OF is_featured ON blog_post_images
FOR EACH ROW
WHEN (NEW.is_featured = TRUE)
EXECUTE FUNCTION update_blog_post_featured_image();

-- Add updated_at trigger
CREATE TRIGGER update_blog_images_updated_at 
BEFORE UPDATE ON blog_post_images
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE blog_post_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can view all blog images
CREATE POLICY "Public can view blog images" ON blog_post_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM blog_posts 
            WHERE blog_posts.id = blog_post_images.blog_post_id 
            AND blog_posts.published_at <= NOW()
        )
    );

-- Admin users can manage all blog images
CREATE POLICY "Admin users can manage blog images" ON blog_post_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.is_active = TRUE
        )
    );

-- Service role has full access
CREATE POLICY "Service role full access to blog images" ON blog_post_images
    FOR ALL USING (auth.role() = 'service_role');

-- Sample query to get all images for a blog post
-- SELECT * FROM blog_post_images WHERE blog_post_id = 'YOUR_POST_ID' ORDER BY display_order;

-- Sample query to get unused images (for cleanup)
-- SELECT * FROM blog_post_images WHERE usage_count = 0 AND uploaded_at < NOW() - INTERVAL '30 days';