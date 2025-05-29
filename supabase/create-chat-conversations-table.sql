-- Create chat_conversations table that matches your existing implementation
-- This table structure aligns with your ChatBot component and API endpoints

CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL UNIQUE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_page VARCHAR(255),
  user_agent TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for performance
  INDEX idx_chat_session_id (session_id),
  INDEX idx_chat_status (status),
  INDEX idx_chat_created_at (created_at),
  INDEX idx_chat_last_message (last_message_at)
);

-- Grant permissions for API access
GRANT ALL ON chat_conversations TO authenticated;
GRANT ALL ON chat_conversations TO anon;

-- Function to automatically update last_message_at
CREATE OR REPLACE FUNCTION update_last_message_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_message_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_message_at on any update
CREATE TRIGGER update_chat_last_message
BEFORE UPDATE ON chat_conversations
FOR EACH ROW
WHEN (OLD.messages IS DISTINCT FROM NEW.messages)
EXECUTE FUNCTION update_last_message_at();

-- Verify table creation
SELECT 
  'Chat conversations table created successfully!' as status,
  COUNT(*) as existing_conversations 
FROM chat_conversations;