-- Check which blog-related tables exist and their data
SELECT 
    'Checking blog tables...' as status;

-- Check if blog_posts table exists
SELECT 
    'blog_posts' as table_name,
    EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'blog_posts'
    ) as exists,
    (SELECT COUNT(*) FROM public.blog_posts WHERE 1=1) as count;

-- Check if posts table exists  
SELECT 
    'posts' as table_name,
    EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'posts'
    ) as exists,
    (SELECT COUNT(*) FROM public.posts WHERE 1=1) as count;

-- Show structure of blog_posts if it exists
SELECT 
    'blog_posts structure:' as info;
    
SELECT 
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'blog_posts'
ORDER BY ordinal_position;

-- Show structure of posts if it exists
SELECT 
    'posts structure:' as info;
    
SELECT 
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'posts'
ORDER BY ordinal_position;

-- Sample data from each table
SELECT 
    'Sample from blog_posts:' as info;
SELECT id, title, published FROM public.blog_posts LIMIT 3;

SELECT 
    'Sample from posts:' as info;
SELECT id, title, published FROM public.posts LIMIT 3;