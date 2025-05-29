-- Fix existing tables without recreating them

-- 1. Contact Submissions - Add any missing columns if needed
-- Check if all columns exist first
DO $$ 
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'contact_submissions' 
                 AND column_name = 'status') THEN
    ALTER TABLE contact_submissions 
    ADD COLUMN status VARCHAR(50) DEFAULT 'new';
  END IF;
  
  -- Add replied_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'contact_submissions' 
                 AND column_name = 'replied_at') THEN
    ALTER TABLE contact_submissions 
    ADD COLUMN replied_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  -- Add notes column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'contact_submissions' 
                 AND column_name = 'notes') THEN
    ALTER TABLE contact_submissions 
    ADD COLUMN notes TEXT;
  END IF;
  
  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'contact_submissions' 
                 AND column_name = 'updated_at') THEN
    ALTER TABLE contact_submissions 
    ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_source ON contact_submissions(source);

-- 2. Chat Conversations - Add missing last_message_at column
DO $$ 
BEGIN
  -- Add last_message_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'chat_conversations' 
                 AND column_name = 'last_message_at') THEN
    ALTER TABLE chat_conversations 
    ADD COLUMN last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    
    -- Update existing rows to set last_message_at from created_at
    UPDATE chat_conversations 
    SET last_message_at = created_at 
    WHERE last_message_at IS NULL;
  END IF;
END $$;

-- Create the update function if it doesn't exist
CREATE OR REPLACE FUNCTION update_last_message_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_message_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate the trigger to ensure it's correct
DROP TRIGGER IF EXISTS update_chat_last_message ON chat_conversations;
CREATE TRIGGER update_chat_last_message
BEFORE UPDATE ON chat_conversations
FOR EACH ROW
WHEN (OLD.messages IS DISTINCT FROM NEW.messages)
EXECUTE FUNCTION update_last_message_at();

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_chat_session_id ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_status ON chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_last_message ON chat_conversations(last_message_at);

-- 3. Verify all tables are ready
SELECT 
  'contact_submissions' as table_name,
  COUNT(*) as row_count,
  COUNT(DISTINCT status) as status_types
FROM contact_submissions
UNION ALL
SELECT 
  'chat_conversations' as table_name,
  COUNT(*) as row_count,
  COUNT(DISTINCT status) as status_types
FROM chat_conversations
UNION ALL
SELECT 
  'click_heatmap' as table_name,
  COUNT(*) as row_count,
  COUNT(DISTINCT page) as pages_tracked
FROM click_heatmap;