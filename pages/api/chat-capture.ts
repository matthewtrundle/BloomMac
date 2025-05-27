import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

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

    // Check if conversation exists in Supabase
    const { data: existingConv } = await supabaseAdmin
      .from('chat_conversations')
      .select('id')
      .eq('id', conversation.id)
      .single();

    if (existingConv) {
      // Update existing conversation
      const { error: updateError } = await supabaseAdmin
        .from('chat_conversations')
        .update({
          messages: conversation.messages,
          last_message_at: new Date().toISOString(),
          status: conversation.resolved ? 'resolved' : 'active'
        })
        .eq('id', conversation.id);

      if (updateError) {
        console.error('Error updating conversation:', updateError);
        throw updateError;
      }
    } else {
      // Create new conversation
      const { error: insertError } = await supabaseAdmin
        .from('chat_conversations')
        .insert({
          id: conversation.id,
          session_id: conversation.sessionId,
          messages: conversation.messages,
          source_page: conversation.page || 'unknown',
          user_agent: conversation.userAgent,
          status: conversation.resolved ? 'resolved' : 'active'
        });

      if (insertError) {
        console.error('Error inserting conversation:', insertError);
        throw insertError;
      }
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

// Export function to get conversations for analytics from Supabase
export const getChatConversations = async (): Promise<ChatConversation[]> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('chat_conversations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    
    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
    
    // Transform Supabase data to match ChatConversation interface
    return (data || []).map(conv => ({
      id: conv.id,
      timestamp: conv.created_at,
      messages: conv.messages || [],
      sessionId: conv.session_id || '',
      userAgent: conv.user_agent,
      page: conv.source_page,
      resolved: conv.status === 'resolved'
    }));
  } catch (error) {
    console.error('Error in getChatConversations:', error);
    return [];
  }
};