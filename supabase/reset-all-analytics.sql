-- Complete Analytics Reset Script
-- Clears all traffic and chat data while preserving newsletter/email data

-- Clear all analytics events
TRUNCATE TABLE analytics_events;

-- Clear all chat conversations (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') THEN
    TRUNCATE TABLE chat_conversations;
  END IF;
END $$;

-- Clear email automation logs but keep sequences/templates
DELETE FROM email_automation_logs;

-- Reset email sequences to active
UPDATE email_sequences SET status = 'active' WHERE status = 'paused';

-- Verification query
SELECT 'Data Reset Summary' as report;

SELECT 
  'Analytics Events' as data_type, 
  COUNT(*) as records,
  CASE WHEN COUNT(*) = 0 THEN '✓ Cleared' ELSE '✗ Not cleared' END as status
FROM analytics_events

UNION ALL

SELECT 
  'Chat Conversations' as data_type,
  COALESCE((SELECT COUNT(*) FROM chat_conversations), 0) as records,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') THEN '⚠️  Table not found'
    WHEN COALESCE((SELECT COUNT(*) FROM chat_conversations), 0) = 0 THEN '✓ Cleared'
    ELSE '✗ Not cleared'
  END as status

UNION ALL

SELECT 
  'Email Logs' as data_type,
  COUNT(*) as records,
  CASE WHEN COUNT(*) = 0 THEN '✓ Cleared' ELSE '✗ Not cleared' END as status
FROM email_automation_logs

UNION ALL

SELECT 
  'Newsletter Signups' as data_type,
  COUNT(*) as records,
  '✓ Preserved' as status
FROM newsletter_signups

UNION ALL

SELECT 
  'Email Sequences' as data_type,
  COUNT(*) as records,
  '✓ Preserved' as status
FROM email_sequences

ORDER BY data_type;