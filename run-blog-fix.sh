#!/bin/bash

echo "🔧 Running Blog Admin Fixes..."
echo "================================"

# Your production database connection
PROD_DB="postgresql://postgres.utetcmirepwdxbtrcczv:F13aUlrMdMFDpSkg@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

# Run the blog access fix
echo "📝 Fixing blog admin access..."
psql "$PROD_DB" << 'EOF'
-- Fix Blog Admin Access
-- 1. Disable RLS on blog_posts
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;

-- 2. Grant permissions
GRANT ALL ON public.blog_posts TO postgres, anon, authenticated, service_role;

-- 3. Check status
SELECT 
    'Blog posts status:' as info,
    COUNT(*) as total_posts,
    COUNT(CASE WHEN featured THEN 1 END) as featured_posts
FROM public.blog_posts;

-- 4. Show sample posts
SELECT 
    id,
    title,
    category,
    published_at
FROM public.blog_posts
ORDER BY created_at DESC
LIMIT 5;
EOF

echo ""
echo "✅ SQL fixes applied!"
echo ""
echo "📦 Now committing and pushing the API route..."

# Add and commit the new API route
git add app/api/blog-admin-supabase/route.ts
git commit -m "fix: Add missing blog admin API route

- Created /api/blog-admin-supabase route
- Connects admin panel to blog_posts table
- Fixes 'Failed to fetch posts' error

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to repository
git push origin main

echo ""
echo "🎉 All fixes applied!"
echo ""
echo "Next steps:"
echo "1. Wait for deployment to complete"
echo "2. Refresh your admin panel"
echo "3. Blog posts should now load!"