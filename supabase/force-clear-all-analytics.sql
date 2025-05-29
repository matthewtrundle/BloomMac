-- Force Clear All Analytics Data
-- This script uses DELETE instead of TRUNCATE to avoid any permission issues
-- Run this in Supabase SQL Editor to ensure all analytics data is cleared

-- 1. Delete all analytics events
DELETE FROM analytics_events;

-- 2. Delete all chat conversations (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') THEN
    EXECUTE 'DELETE FROM chat_conversations';
  END IF;
END $$;

-- 3. Delete all click heatmap data (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'click_heatmap') THEN
    EXECUTE 'DELETE FROM click_heatmap';
  END IF;
END $$;

-- 4. Delete all email automation logs (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_automation_logs') THEN
    EXECUTE 'DELETE FROM email_automation_logs';
  END IF;
END $$;

-- 5. Delete all admin activity logs
DELETE FROM admin_activity_log;

-- 6. Reset any sequences/auto-increment counters (optional)
-- This ensures IDs start fresh
DO $$ 
BEGIN
  -- Reset analytics_events sequence
  IF EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'analytics_events_id_seq') THEN
    ALTER SEQUENCE analytics_events_id_seq RESTART WITH 1;
  END IF;
  
  -- Reset admin_activity_log sequence
  IF EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'admin_activity_log_id_seq') THEN
    ALTER SEQUENCE admin_activity_log_id_seq RESTART WITH 1;
  END IF;
END $$;

-- Verification Report
SELECT 'Analytics Data Force Clear Report' as report_title, NOW() as executed_at;

-- Check what remains
SELECT 
  'Analytics Events' as table_name,
  COUNT(*) as record_count,
  CASE WHEN COUNT(*) = 0 THEN '✓ Successfully cleared' ELSE '✗ Still has data' END as status
FROM analytics_events

UNION ALL

SELECT 
  'Chat Conversations' as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') 
    THEN (SELECT COUNT(*) FROM chat_conversations)
    ELSE 0
  END as record_count,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') THEN '⚠️ Table does not exist'
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') 
      AND (SELECT COUNT(*) FROM chat_conversations) = 0 THEN '✓ Successfully cleared'
    ELSE '✗ Still has data'
  END as status

UNION ALL

SELECT 
  'Click Heatmap' as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'click_heatmap') 
    THEN (SELECT COUNT(*) FROM click_heatmap)
    ELSE 0
  END as record_count,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'click_heatmap') THEN '⚠️ Table does not exist'
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'click_heatmap') 
      AND (SELECT COUNT(*) FROM click_heatmap) = 0 THEN '✓ Successfully cleared'
    ELSE '✗ Still has data'
  END as status

UNION ALL

SELECT 
  'Email Automation Logs' as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_automation_logs') 
    THEN (SELECT COUNT(*) FROM email_automation_logs)
    ELSE 0
  END as record_count,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_automation_logs') THEN '⚠️ Table does not exist'
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_automation_logs') 
      AND (SELECT COUNT(*) FROM email_automation_logs) = 0 THEN '✓ Successfully cleared'
    ELSE '✗ Still has data'
  END as status

UNION ALL

SELECT 
  'Admin Activity Log' as table_name,
  COUNT(*) as record_count,
  CASE WHEN COUNT(*) = 0 THEN '✓ Successfully cleared' ELSE '✗ Still has data' END as status
FROM admin_activity_log

ORDER BY table_name;

-- Show preserved data counts
SELECT '---' as separator;
SELECT 'Preserved Business Data (NOT cleared)' as report_title;

SELECT 
  'Contact Submissions' as table_name,
  COUNT(*) as record_count,
  '✓ Preserved' as status
FROM contact_submissions

UNION ALL

SELECT 
  'Newsletter Subscribers' as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscribers') 
    THEN (SELECT COUNT(*) FROM subscribers)
    ELSE 0
  END as record_count,
  '✓ Preserved' as status

UNION ALL

SELECT 
  'Blog Posts' as table_name,
  COUNT(*) as record_count,
  '✓ Preserved' as status
FROM blog_posts

UNION ALL

SELECT 
  'Career Applications' as table_name,
  COUNT(*) as record_count,
  '✓ Preserved' as status
FROM career_applications

ORDER BY table_name;