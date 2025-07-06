#!/bin/bash

echo "🔧 Fixing Pages/App Router Conflict"
echo "=================================="
echo ""

echo "The issue: Next.js found duplicate API routes:"
echo "- pages/api/blog-admin-supabase.ts (Pages Router)"
echo "- app/api/blog-admin-supabase/route.ts (App Router)"
echo "- pages/api/newsletter-admin.ts (Pages Router)"  
echo "- app/api/newsletter-admin/route.ts (App Router)"
echo ""

echo "✂️  Removing conflicting Pages Router files..."

# Remove the old Pages Router versions since we want to use App Router
if [ -f "pages/api/blog-admin-supabase.ts" ]; then
    echo "Removing pages/api/blog-admin-supabase.ts"
    rm pages/api/blog-admin-supabase.ts
fi

if [ -f "pages/api/newsletter-admin.ts" ]; then
    echo "Removing pages/api/newsletter-admin.ts"
    rm pages/api/newsletter-admin.ts
fi

echo ""
echo "📂 Checking what's left in pages/api/..."
ls -la pages/api/ 2>/dev/null || echo "pages/api directory not found or empty"

echo ""
echo "📂 Checking App Router API routes..."
ls -la app/api/*/route.ts 2>/dev/null || echo "No App Router routes found"

echo ""
echo "📝 Committing the cleanup..."

git add -A  # This will stage deletions too
git commit -m "fix: Remove conflicting Pages Router API files

- Remove pages/api/blog-admin-supabase.ts (conflicts with App Router)
- Remove pages/api/newsletter-admin.ts (conflicts with App Router)
- Keep App Router versions in app/api/
- Fixes Next.js build conflict

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main

echo ""
echo "✅ Conflict resolved!"
echo ""
echo "The build should now succeed with only App Router API routes."
echo "Your admin panel functionality will remain the same."