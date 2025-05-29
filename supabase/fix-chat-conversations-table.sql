-- Fix chat_conversations table step by step

-- First, check what columns exist in the table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'chat_conversations'
ORDER BY ordinal_position;

-- Add the missing last_message_at column
ALTER TABLE chat_conversations 
ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing rows to set last_message_at from created_at
UPDATE chat_conversations 
SET last_message_at = COALESCE(last_message_at, created_at, NOW())
WHERE last_message_at IS NULL;

-- Now create indexes (these won't fail if they already exist)
CREATE INDEX IF NOT EXISTS idx_chat_session_id ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_status ON chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_last_message ON chat_conversations(last_message_at);

-- Create or replace the update function
CREATE OR REPLACE FUNCTION update_last_message_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_message_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists (this might be causing the error)
DROP TRIGGER IF EXISTS update_chat_last_message ON chat_conversations;

-- Only create the trigger after we know the column exists
DO $$
BEGIN
  -- Check if last_message_at column exists before creating trigger
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'chat_conversations' 
             AND column_name = 'last_message_at') THEN
    
    CREATE TRIGGER update_chat_last_message
    BEFORE UPDATE ON chat_conversations
    FOR EACH ROW
    WHEN (OLD.messages IS DISTINCT FROM NEW.messages)
    EXECUTE FUNCTION update_last_message_at();
    
    RAISE NOTICE 'Trigger created successfully';
  ELSE
    RAISE NOTICE 'Column last_message_at does not exist yet';
  END IF;
END $$;

-- Verify the table structure
SELECT 
  'chat_conversations' as table_name,
  COUNT(*) as total_rows,
  COUNT(last_message_at) as rows_with_last_message_at
FROM chat_conversations;