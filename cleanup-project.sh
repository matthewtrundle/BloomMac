#!/bin/bash

# Project Cleanup Script for Bloom Psychology
# This script archives old files and organizes the project structure

echo "🧹 Starting Bloom Psychology project cleanup..."

# Create archive directories if they don't exist
mkdir -p archive/documentation/completed
mkdir -p archive/documentation/blog-improvements
mkdir -p archive/sql/analytics
mkdir -p archive/sql/migrations
mkdir -p archive/scripts/tests
mkdir -p archive/scripts/debug

# Archive completed documentation files
echo "📚 Archiving completed documentation..."

# Completed features
mv ADMIN_AUTH_COMPLETE.md archive/documentation/completed/ 2>/dev/null
mv ADMIN_AUTH_SETUP.md archive/documentation/completed/ 2>/dev/null
mv ADMIN_AUTH_TEST.md archive/documentation/completed/ 2>/dev/null
mv BLOG_FUNCTIONALITY_VERIFIED.md archive/documentation/completed/ 2>/dev/null
mv BLOG_SAVE_FIX_SUMMARY.md archive/documentation/completed/ 2>/dev/null
mv BLOG_POST_FIXES_SUMMARY.md archive/documentation/completed/ 2>/dev/null
mv BLOG_SYSTEM_FIX_REPORT.md archive/documentation/completed/ 2>/dev/null
mv MOBILE_OPTIMIZATIONS_COMPLETE.md archive/documentation/completed/ 2>/dev/null
mv PERFORMANCE_OPTIMIZATIONS_COMPLETE.md archive/documentation/completed/ 2>/dev/null
mv PERFORMANCE_OPTIMIZATIONS_ADDED.md archive/documentation/completed/ 2>/dev/null
mv PERFORMANCE_OPTIMIZATION_SUMMARY.md archive/documentation/completed/ 2>/dev/null
mv PRICING_REMOVAL_SUMMARY.md archive/documentation/completed/ 2>/dev/null
mv VIRTUAL_THERAPY_EXPANSION_SUMMARY.md archive/documentation/completed/ 2>/dev/null
mv EMAIL_SENDER_UPDATE_SUMMARY.md archive/documentation/completed/ 2>/dev/null
mv FOOTER_ENHANCEMENTS.md archive/documentation/completed/ 2>/dev/null
mv HERO_SIZING_UPDATE.md archive/documentation/completed/ 2>/dev/null

# Blog improvement iterations
echo "📝 Archiving blog improvement files..."
mv IMPROVED_BLOG_POSTS.md archive/documentation/blog-improvements/ 2>/dev/null
mv IMPROVED_BLOG_POSTS_2.md archive/documentation/blog-improvements/ 2>/dev/null
mv IMPROVED_BLOG_POSTS_3.md archive/documentation/blog-improvements/ 2>/dev/null
mv IMPROVED_BLOG_POSTS_4.md archive/documentation/blog-improvements/ 2>/dev/null

# Archive old SQL files
echo "🗄️  Archiving old SQL files..."

# Analytics reset scripts (keep only the latest)
mv supabase/clear-all-analytics-data.sql archive/sql/analytics/ 2>/dev/null
mv supabase/clear-analytics-data.sql archive/sql/analytics/ 2>/dev/null
mv supabase/force-clear-all-analytics.sql archive/sql/analytics/ 2>/dev/null
mv supabase/reset-all-analytics.sql archive/sql/analytics/ 2>/dev/null
mv supabase/reset-analytics-data.sql archive/sql/analytics/ 2>/dev/null
mv supabase/reset-analytics-clean.sql archive/sql/analytics/ 2>/dev/null

# Fixed/duplicate table creation scripts
mv supabase/create-contact-submissions-table-fixed.sql archive/sql/migrations/ 2>/dev/null
mv supabase/create-chat-conversations-table-fixed.sql archive/sql/migrations/ 2>/dev/null
mv supabase/create-click-heatmap-table-fixed.sql archive/sql/migrations/ 2>/dev/null
mv supabase/fix-existing-tables.sql archive/sql/migrations/ 2>/dev/null

# Archive test scripts
echo "🧪 Archiving old test scripts..."

# Move specific test files that are no longer needed
mv scripts/test-admin-auth.js archive/scripts/tests/ 2>/dev/null
mv scripts/test-admin-login.js archive/scripts/tests/ 2>/dev/null
mv scripts/test-blog-save.js archive/scripts/tests/ 2>/dev/null
mv scripts/test-blog-save-auth.js archive/scripts/tests/ 2>/dev/null
mv scripts/test-blog-storage.js archive/scripts/tests/ 2>/dev/null
mv scripts/test-blog-supabase.js archive/scripts/tests/ 2>/dev/null
mv scripts/test-blog-final.js archive/scripts/tests/ 2>/dev/null
mv scripts/test-email-template-save.js archive/scripts/tests/ 2>/dev/null
mv scripts/test-email-template-save-complete.js archive/scripts/tests/ 2>/dev/null
mv scripts/verify-blog-auth.js archive/scripts/tests/ 2>/dev/null
mv scripts/verify-blog-functionality.js archive/scripts/tests/ 2>/dev/null

# Archive debug scripts
mv scripts/debug-admin-login.js archive/scripts/debug/ 2>/dev/null
mv scripts/debug-email-save.js archive/scripts/debug/ 2>/dev/null
mv scripts/debug-email-template-save.js archive/scripts/debug/ 2>/dev/null
mv scripts/debug-heatmap.js archive/scripts/debug/ 2>/dev/null

# Archive verification scripts for completed features
mv scripts/verify-analytics-cleared.js archive/scripts/tests/ 2>/dev/null
mv scripts/verify-analytics-detailed.js archive/scripts/tests/ 2>/dev/null
mv scripts/verify-email-template-fix.js archive/scripts/tests/ 2>/dev/null

# Remove old patch files
echo "🔧 Removing old patch files..."
rm -f *.patch 2>/dev/null

# Clean up root directory test files
mv test-admin-login.js archive/scripts/tests/ 2>/dev/null
mv test-admin-login-local.js archive/scripts/tests/ 2>/dev/null
mv test-login-flow.js archive/scripts/tests/ 2>/dev/null
mv test-build.js archive/scripts/tests/ 2>/dev/null
mv test-email-save.html archive/scripts/tests/ 2>/dev/null

# Create a summary of what needs attention
echo "📋 Creating cleanup summary..."

cat > CLEANUP_SUMMARY.md << EOF
# Project Cleanup Summary - $(date +"%Y-%m-%d")

## Files Archived

### Documentation
- Admin auth documentation (feature complete)
- Blog system fixes (feature stable)
- Performance optimization reports (completed)
- Mobile optimization reports (completed)
- Multiple iterations of blog post improvements

### SQL Files
- Multiple analytics reset scripts (consolidated)
- Duplicate table creation scripts
- Fixed versions of table creation scripts

### Scripts
- Test scripts for completed features
- Debug scripts for resolved issues
- Verification scripts for stable features

## Active Documentation Requiring Attention

### High Priority
1. **STRIPE_INTEGRATION_STATUS.md** - Needs Stripe keys and configuration
2. **SURVEY_IMPLEMENTATION_PLAN.md** - Deploy surveys this week
3. **COMPREHENSIVE_ERROR_FIX_PLAN.md** - Monitor email errors

### Recently Completed (Monitor)
1. **THEME_REFRESH_COMPLETE.md** - Ready for user testing
2. **DATA_DRIVEN_COURSE_COMPLETE.md** - Ready for focus group testing
3. **EMAIL_ERROR_FIX_SUMMARY.md** - Monitor for recurring issues

### Reference Documentation (Keep)
- GOOGLE_ANALYTICS_SETUP.md - New GA4 integration guide
- COMPREHENSIVE_SYSTEM_AUDIT.md - System overview
- GRAND_VISION_AND_ROADMAP.md - Strategic planning
- DATABASE_RECOMMENDATIONS.md - Database best practices

## Next Steps

1. Configure Stripe integration
2. Deploy theme refresh surveys
3. Test data-driven course content
4. Monitor email automation logs
5. Continue course content development

## Archive Location
All archived files have been moved to the \`/archive\` directory with the following structure:
- \`/archive/documentation/\` - Completed feature docs
- \`/archive/sql/\` - Old migration and utility scripts
- \`/archive/scripts/\` - Test and debug scripts
EOF

echo "✅ Cleanup complete! Check CLEANUP_SUMMARY.md for details."
echo "📁 Archived files are in the /archive directory"
echo ""
echo "🎯 Key actions needed:"
echo "  1. Configure Stripe (STRIPE_INTEGRATION_STATUS.md)"
echo "  2. Deploy surveys (SURVEY_IMPLEMENTATION_PLAN.md)"
echo "  3. Monitor email errors (COMPREHENSIVE_ERROR_FIX_PLAN.md)"