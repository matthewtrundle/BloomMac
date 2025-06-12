-- Clear Analytics Data - Start Fresh
-- Run this in Supabase SQL Editor to reset all analytics
-- Based on actual Bloom database tables

-- 1. Clear all chat conversations and interactions
DELETE FROM chat_conversations;

-- 2. Clear email queue (sent emails)
DELETE FROM email_queue;

-- 3. Clear email automation logs (email tracking)
DELETE FROM email_automation_logs;

-- 4. Clear admin activity log (optional - remove if you want to keep admin history)
DELETE FROM admin_activity_log;

-- Note: These tables don't exist in your database, removing them:
-- analytics_events - doesn't exist
-- chat_interactions - doesn't exist

-- Optional: Clear other data (uncomment if needed)
-- DELETE FROM additional_info;  -- If this contains form submissions
-- DELETE FROM resume_url;       -- If this contains job applications
-- DELETE FROM resume_filename;  -- If this contains job applications

-- DO NOT DELETE FROM THESE TABLES (they contain important configuration):
-- ✓ admin_users (keep admin accounts)
-- ✓ email_sequences (keep email automation setup)
-- ✓ sequence_emails (keep email templates)
-- ✓ email_templates (keep email designs)
-- ✓ subscribers (keep your email list)

-- Verify the cleanup
SELECT 
  'chat_conversations' as table_name, 
  COUNT(*) as record_count 
FROM chat_conversations
UNION ALL
SELECT 
  'email_queue', 
  COUNT(*) 
FROM email_queue
UNION ALL
SELECT 
  'email_automation_logs', 
  COUNT(*) 
FROM email_automation_logs
UNION ALL
SELECT 
  'admin_activity_log', 
  COUNT(*) 
FROM admin_activity_log;

-- Result should show 0 records for each table