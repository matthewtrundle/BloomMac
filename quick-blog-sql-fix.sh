#!/bin/bash

echo "🔧 Quick Blog SQL Fix"
echo "===================="

# Run SQL directly
psql "postgresql://postgres.utetcmirepwdxbtrcczv:F13aUlrMdMFDpSkg@aws-0-us-east-2.pooler.supabase.com:5432/postgres" << 'EOF'
-- Quick fix for blog access
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.blog_posts TO anon, authenticated;
SELECT COUNT(*) as blog_count FROM public.blog_posts;
EOF

echo "✅ Done!"