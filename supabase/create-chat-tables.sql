-- Create chat tables for tracking chatbot interactions
-- This enables persistent chat history and analytics

-- Chat conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  lead_captured BOOLEAN DEFAULT FALSE,
  lead_quality_score INTEGER DEFAULT 0,
  conversion_type VARCHAR(50), -- 'contact_form', 'booking', 'newsletter', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Indexes for performance
  INDEX idx_chat_session (session_id),
  INDEX idx_chat_created (created_at),
  INDEX idx_chat_email (user_email)
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Indexes for performance
  INDEX idx_message_conversation (conversation_id),
  INDEX idx_message_created (created_at)
);

-- Chat analytics summary table (for faster dashboard queries)
CREATE TABLE IF NOT EXISTS chat_analytics_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  total_conversations INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  avg_messages_per_conversation DECIMAL(10,2) DEFAULT 0,
  leads_captured INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  top_questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint on date
  UNIQUE(date),
  INDEX idx_chat_summary_date (date)
);

-- Function to update chat analytics summary
CREATE OR REPLACE FUNCTION update_chat_analytics_summary()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the summary for today
  INSERT INTO chat_analytics_summary (
    date,
    total_conversations,
    unique_users,
    messages_sent,
    avg_messages_per_conversation,
    leads_captured,
    conversion_rate
  )
  SELECT 
    CURRENT_DATE,
    COUNT(DISTINCT c.id),
    COUNT(DISTINCT c.session_id),
    COUNT(m.id),
    CASE 
      WHEN COUNT(DISTINCT c.id) > 0 
      THEN COUNT(m.id)::DECIMAL / COUNT(DISTINCT c.id)
      ELSE 0
    END,
    COUNT(DISTINCT CASE WHEN c.lead_captured THEN c.id END),
    CASE 
      WHEN COUNT(DISTINCT c.id) > 0 
      THEN (COUNT(DISTINCT CASE WHEN c.lead_captured THEN c.id END)::DECIMAL / COUNT(DISTINCT c.id) * 100)
      ELSE 0
    END
  FROM chat_conversations c
  LEFT JOIN chat_messages m ON m.conversation_id = c.id
  WHERE DATE(c.created_at) = CURRENT_DATE
  ON CONFLICT (date) DO UPDATE SET
    total_conversations = EXCLUDED.total_conversations,
    unique_users = EXCLUDED.unique_users,
    messages_sent = EXCLUDED.messages_sent,
    avg_messages_per_conversation = EXCLUDED.avg_messages_per_conversation,
    leads_captured = EXCLUDED.leads_captured,
    conversion_rate = EXCLUDED.conversion_rate,
    updated_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update analytics
CREATE TRIGGER update_chat_analytics_on_conversation
AFTER INSERT OR UPDATE ON chat_conversations
FOR EACH ROW
EXECUTE FUNCTION update_chat_analytics_summary();

CREATE TRIGGER update_chat_analytics_on_message
AFTER INSERT ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_chat_analytics_summary();

-- Grant permissions
GRANT ALL ON chat_conversations TO authenticated;
GRANT ALL ON chat_messages TO authenticated;
GRANT SELECT ON chat_analytics_summary TO authenticated;

-- Insert some test data to verify
INSERT INTO chat_conversations (session_id, user_email, lead_captured) VALUES
  ('test-session-1', 'test@example.com', true);

INSERT INTO chat_messages (conversation_id, role, content) 
SELECT id, 'user', 'I need help with postpartum anxiety'
FROM chat_conversations 
WHERE session_id = 'test-session-1';

INSERT INTO chat_messages (conversation_id, role, content) 
SELECT id, 'assistant', 'I understand you''re looking for support with postpartum anxiety. We specialize in helping mothers navigate these challenges. Would you like to schedule a free consultation?'
FROM chat_conversations 
WHERE session_id = 'test-session-1';

-- Verify the tables were created
SELECT 
  'Tables created successfully!' as status,
  (SELECT COUNT(*) FROM chat_conversations) as conversations,
  (SELECT COUNT(*) FROM chat_messages) as messages,
  (SELECT COUNT(*) FROM chat_analytics_summary) as summary_rows;