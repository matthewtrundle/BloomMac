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
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes separately
CREATE INDEX IF NOT EXISTS idx_chat_session_id ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_status ON chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_last_message ON chat_conversations(last_message_at);

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