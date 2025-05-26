import { NextApiRequest, NextApiResponse } from 'next';

export interface ChatConversation {
  id: string;
  timestamp: string;
  messages: {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: string;
  }[];
  sessionId: string;
  userAgent?: string;
  page?: string;
  resolved?: boolean;
}

interface ChatCaptureRequest {
  conversation: ChatConversation;
}

interface ChatCaptureResponse {
  success: boolean;
  conversationId: string;
}

// In-memory storage for this implementation
// In production, you would use a database
let chatConversations: ChatConversation[] = [];

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ChatCaptureResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { conversation }: ChatCaptureRequest = req.body;

    if (!conversation || !conversation.id || !conversation.messages) {
      return res.status(400).json({ error: 'Invalid conversation data' });
    }

    // Add conversation to storage
    const existingIndex = chatConversations.findIndex(c => c.id === conversation.id);
    
    if (existingIndex >= 0) {
      // Update existing conversation
      chatConversations[existingIndex] = {
        ...conversation,
        timestamp: new Date().toISOString()
      };
    } else {
      // Add new conversation
      chatConversations.push({
        ...conversation,
        timestamp: new Date().toISOString()
      });
    }

    // Keep only last 200 conversations to prevent memory overflow
    if (chatConversations.length > 200) {
      chatConversations = chatConversations.slice(-200);
    }

    console.log('Chat conversation captured:', {
      id: conversation.id,
      messageCount: conversation.messages.length,
      sessionId: conversation.sessionId
    });

    return res.status(200).json({
      success: true,
      conversationId: conversation.id
    });

  } catch (error) {
    console.error('Chat capture error:', error);
    return res.status(500).json({ error: 'Failed to capture chat conversation' });
  }
}

// Export function to get conversations for analytics
export const getChatConversations = (): ChatConversation[] => {
  return chatConversations;
};