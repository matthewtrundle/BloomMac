-- Complete Analytics Data Reset Script for Bloom Psychology
-- This script clears ALL analytics/metrics data while preserving business-critical data
-- Run this in Supabase SQL Editor to reset analytics to zero

-- 1. Clear all analytics events (page views, clicks, etc.)
TRUNCATE TABLE analytics_events CASCADE;

-- 2. Clear chat conversations
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') THEN
    TRUNCATE TABLE chat_conversations CASCADE;
  END IF;
END $$;

-- 3. Clear click heatmap data
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'click_heatmap') THEN
    TRUNCATE TABLE click_heatmap CASCADE;
  END IF;
END $$;

-- 4. Clear email automation logs (but keep email sequences and templates)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_automation_logs') THEN
    DELETE FROM email_automation_logs;
  END IF;
END $$;

-- 5. Clear admin activity logs
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_activity_log') THEN
    TRUNCATE TABLE admin_activity_log CASCADE;
  END IF;
END $$;

-- 6. Reset any email sequences to active state
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_sequences') THEN
    UPDATE email_sequences SET status = 'active' WHERE status = 'paused';
  END IF;
END $$;

-- Verification Report
SELECT 'Analytics Data Reset Report' as report_title, NOW() as executed_at;

-- Show what was cleared
SELECT 
  'Analytics Events' as data_type,
  COUNT(*) as remaining_records,
  CASE WHEN COUNT(*) = 0 THEN '✓ Successfully cleared' ELSE '✗ Not cleared - check for errors' END as status
FROM analytics_events

UNION ALL

SELECT 
  'Chat Conversations' as data_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') 
    THEN (SELECT COUNT(*) FROM chat_conversations)
    ELSE 0
  END as remaining_records,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') THEN '⚠️ Table does not exist'
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') 
      AND (SELECT COUNT(*) FROM chat_conversations) = 0 THEN '✓ Successfully cleared'
    ELSE '✗ Not cleared - check for errors'
  END as status

UNION ALL

SELECT 
  'Click Heatmap' as data_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'click_heatmap') 
    THEN (SELECT COUNT(*) FROM click_heatmap)
    ELSE 0
  END as remaining_records,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'click_heatmap') THEN '⚠️ Table does not exist'
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'click_heatmap') 
      AND (SELECT COUNT(*) FROM click_heatmap) = 0 THEN '✓ Successfully cleared'
    ELSE '✗ Not cleared - check for errors'
  END as status

UNION ALL

SELECT 
  'Email Automation Logs' as data_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_automation_logs') 
    THEN (SELECT COUNT(*) FROM email_automation_logs)
    ELSE 0
  END as remaining_records,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_automation_logs') THEN '⚠️ Table does not exist'
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_automation_logs') 
      AND (SELECT COUNT(*) FROM email_automation_logs) = 0 THEN '✓ Successfully cleared'
    ELSE '✗ Not cleared - check for errors'
  END as status

UNION ALL

SELECT 
  'Admin Activity Log' as data_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_activity_log') 
    THEN (SELECT COUNT(*) FROM admin_activity_log)
    ELSE 0
  END as remaining_records,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_activity_log') THEN '⚠️ Table does not exist'
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_activity_log') 
      AND (SELECT COUNT(*) FROM admin_activity_log) = 0 THEN '✓ Successfully cleared'
    ELSE '✗ Not cleared - check for errors'
  END as status

ORDER BY data_type;

-- Show what was preserved
SELECT '---' as separator;
SELECT 'Preserved Business Data' as report_title;

SELECT 
  'Contact Submissions' as data_type,
  COUNT(*) as total_records,
  '✓ Preserved - NOT cleared' as status
FROM contact_submissions

UNION ALL

SELECT 
  'Newsletter Signups' as data_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'newsletter_signups') 
    THEN (SELECT COUNT(*) FROM newsletter_signups)
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscribers') 
    THEN (SELECT COUNT(*) FROM subscribers)
    ELSE 0
  END as total_records,
  '✓ Preserved - NOT cleared' as status

UNION ALL

SELECT 
  'Blog Posts' as data_type,
  COUNT(*) as total_records,
  '✓ Preserved - NOT cleared' as status
FROM blog_posts

UNION ALL

SELECT 
  'Career Applications' as data_type,
  COUNT(*) as total_records,
  '✓ Preserved - NOT cleared' as status
FROM career_applications

ORDER BY data_type;