-- Reset Analytics Data - Clear all traffic metrics while preserving newsletter data
-- Run this in Supabase SQL Editor

-- Clear all analytics events (page views, conversions, etc)
TRUNCATE TABLE analytics_events;

-- Clear chat conversations if they exist
TRUNCATE TABLE chat_conversations CASCADE;

-- Clear chat messages if they exist  
TRUNCATE TABLE chat_messages CASCADE;

-- Clear any email automation logs (but keep the sequences and templates)
DELETE FROM email_automation_logs;

-- Reset any sequences back to active if needed
UPDATE email_sequences SET status = 'active' WHERE status = 'paused';

-- Verify the reset
SELECT 'Analytics Events' as table_name, COUNT(*) as count FROM analytics_events
UNION ALL
SELECT 'Chat Conversations', COUNT(*) FROM chat_conversations
UNION ALL
SELECT 'Chat Messages', COUNT(*) FROM chat_messages
UNION ALL
SELECT 'Email Automation Logs', COUNT(*) FROM email_automation_logs
UNION ALL
SELECT 'Newsletter Signups (PRESERVED)', COUNT(*) FROM newsletter_signups
UNION ALL
SELECT 'Email Sequences (PRESERVED)', COUNT(*) FROM email_sequences
UNION ALL
SELECT 'Email Templates (PRESERVED)', COUNT(*) FROM email_templates;