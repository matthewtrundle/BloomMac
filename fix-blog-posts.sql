-- =====================================================
-- FIX BLOG POSTS FOR ADMIN PANEL
-- =====================================================

-- First, let's see what we're working with
DO $$
DECLARE
    v_blog_posts_exists boolean;
    v_posts_exists boolean;
    v_blog_posts_count integer := 0;
    v_posts_count integer := 0;
BEGIN
    -- Check what exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'blog_posts'
    ) INTO v_blog_posts_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'posts'
    ) INTO v_posts_exists;
    
    -- Count records
    IF v_blog_posts_exists THEN
        SELECT COUNT(*) INTO v_blog_posts_count FROM public.blog_posts;
    END IF;
    
    IF v_posts_exists THEN
        SELECT COUNT(*) INTO v_posts_count FROM public.posts;
    END IF;
    
    RAISE NOTICE 'blog_posts table exists: % (% records)', v_blog_posts_exists, v_blog_posts_count;
    RAISE NOTICE 'posts table exists: % (% records)', v_posts_exists, v_posts_count;
END $$;

-- OPTION 1: If you have data in 'posts' but code expects 'blog_posts'
-- Create a view to map posts -> blog_posts
DROP VIEW IF EXISTS blog_posts_view;
CREATE OR REPLACE VIEW public.blog_posts AS
SELECT 
    id,
    title,
    slug,
    content,
    excerpt,
    featured_image as image_url,  -- Map column names
    category,
    tags,
    author,
    published,
    featured,
    views,
    created_at,
    updated_at
FROM public.posts;

-- Grant permissions on the view
GRANT SELECT ON public.blog_posts TO anon, authenticated;

-- OPTION 2: If blog_posts exists but has no data, copy from posts
-- (Uncomment if needed)
-- INSERT INTO public.blog_posts (
--     id, title, slug, content, excerpt, image_url, 
--     category, tags, author, published, featured, 
--     views, created_at, updated_at
-- )
-- SELECT 
--     id, title, slug, content, excerpt, featured_image,
--     category, tags, author, published, featured,
--     views, created_at, updated_at
-- FROM public.posts
-- ON CONFLICT (id) DO NOTHING;

-- Make sure RLS is disabled for blog tables (they should be public)
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;

-- If blog_posts is a real table, disable RLS on it too
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'blog_posts'
        AND table_type = 'BASE TABLE'
    ) THEN
        ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Test the fix
SELECT 
    'Blog posts accessible via blog_posts:' as status,
    COUNT(*) as count
FROM public.blog_posts;

-- Show sample data
SELECT 
    id,
    title,
    category,
    published,
    featured
FROM public.blog_posts
ORDER BY created_at DESC
LIMIT 5;