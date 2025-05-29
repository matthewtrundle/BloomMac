-- SAFE Analytics Data Cleanup Script
-- This script ONLY deletes analytics/tracking data
-- It will NOT touch blog posts, contact submissions, subscribers, or any business data

-- First, let's see what we're about to delete
SELECT '=== PREVIEW: Data to be deleted ===' as info;

-- Show analytics_events that will be deleted
SELECT 'Analytics Events to delete:' as table_info, COUNT(*) as count FROM analytics_events;
SELECT '  Sample:' as info, type, page, created_at FROM analytics_events LIMIT 3;

-- Show chat_conversations that will be deleted (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') THEN
    RAISE NOTICE 'Chat Conversations to delete: %', (SELECT COUNT(*) FROM chat_conversations);
  END IF;
END $$;

-- Show click_heatmap that will be deleted (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'click_heatmap') THEN
    RAISE NOTICE 'Click Heatmap entries to delete: %', (SELECT COUNT(*) FROM click_heatmap);
  END IF;
END $$;

-- Show email_automation_logs that will be deleted (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_automation_logs') THEN
    RAISE NOTICE 'Email Automation Logs to delete: %', (SELECT COUNT(*) FROM email_automation_logs);
  END IF;
END $$;

-- Show admin_activity_log that will be deleted
SELECT 'Admin Activity Logs to delete:' as table_info, COUNT(*) as count FROM admin_activity_log;
SELECT '  Sample:' as info, action, entity_type, created_at FROM admin_activity_log LIMIT 3;

SELECT '---' as separator;
SELECT '=== IMPORTANT: The following will be PRESERVED (NOT deleted) ===' as info;

-- Show what we're NOT deleting
SELECT 'Blog Posts (PRESERVED):' as table_info, COUNT(*) as count FROM blog_posts;
SELECT 'Contact Submissions (PRESERVED):' as table_info, COUNT(*) as count FROM contact_submissions;
SELECT 'Subscribers (PRESERVED):' as table_info, COUNT(*) as count FROM subscribers;
SELECT 'Career Applications (PRESERVED):' as table_info, COUNT(*) as count FROM career_applications;

SELECT '---' as separator;
SELECT '=== To proceed with deletion, uncomment the DELETE statements below ===' as info;

-- UNCOMMENT THESE LINES TO ACTUALLY DELETE THE ANALYTICS DATA
-- DELETE FROM analytics_events;
-- DELETE FROM admin_activity_log;

-- Delete from conditional tables if they exist
-- DO $$ 
-- BEGIN
--   IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') THEN
--     EXECUTE 'DELETE FROM chat_conversations';
--   END IF;
--   
--   IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'click_heatmap') THEN
--     EXECUTE 'DELETE FROM click_heatmap';
--   END IF;
--   
--   IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_automation_logs') THEN
--     EXECUTE 'DELETE FROM email_automation_logs';
--   END IF;
-- END $$;

-- After deletion verification (uncomment when running deletes)
-- SELECT 'Post-deletion verification:' as info;
-- SELECT 'Analytics Events remaining:' as check_table, COUNT(*) as count FROM analytics_events;
-- SELECT 'Admin Activity Logs remaining:' as check_table, COUNT(*) as count FROM admin_activity_log;
-- SELECT 'Blog Posts (should be unchanged):' as check_table, COUNT(*) as count FROM blog_posts;
-- SELECT 'Contact Submissions (should be unchanged):' as check_table, COUNT(*) as count FROM contact_submissions;