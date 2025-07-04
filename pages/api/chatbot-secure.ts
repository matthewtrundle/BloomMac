import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

// Create anonymous Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Message validation
const messageSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().max(100).optional(),
  context: z.object({
    page: z.string().optional(),
    previousMessages: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string()
    })).max(10).optional()
  }).optional()
});

// Predefined responses for common questions
const responses = {
  greeting: [
    "Hello! I'm here to help you learn about our services at Bloom Psychology. What would you like to know?",
    "Hi there! Welcome to Bloom Psychology. How can I assist you today?"
  ],
  services: "We offer individual therapy, postpartum support, anxiety management, and wellness services. Our approach is personalized to meet your unique needs. Would you like to learn more about a specific service?",
  booking: "To schedule an appointment, you can click the 'Book Now' button on our website or call us at (512) 898-9510. Dr. Jana Rundle specializes in maternal mental health and anxiety management.",
  insurance: "We accept many insurance plans. For specific coverage information, please contact us at (512) 898-9510 or use our contact form, and we'll verify your benefits.",
  location: "We're located at 13706 N Highway 183, Suite 114, Austin, TX 78750. We also offer teletherapy options for your convenience.",
  hours: "Our office hours vary to accommodate different schedules. Please call (512) 898-9510 or book online to find a time that works for you.",
  emergency: "If you're experiencing a mental health emergency, please call 911 or the National Suicide Prevention Lifeline at 988. For urgent but non-emergency support, call our office at (512) 898-9510.",
  default: "I'd be happy to help! For specific questions about our services or to schedule an appointment, please call us at (512) 898-9510 or use our contact form."
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Apply rate limiting
  const identifier = 
    req.headers['x-forwarded-for'] as string || 
    req.headers['x-real-ip'] as string ||
    req.socket.remoteAddress ||
    'anonymous';
    
  const rateLimitResult = await rateLimit(RATE_LIMITS.chatbot, identifier);
  
  if (!rateLimitResult.success) {
    return res.status(429).json({ 
      error: 'Too many messages. Please wait a moment before sending another message.',
      retryAfter: Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000)
    });
  }

  try {
    // Validate input
    let validatedData;
    try {
      validatedData = messageSchema.parse(req.body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Invalid message format',
          details: validationError.errors 
        });
      }
      throw validationError;
    }

    const { message, sessionId, context } = validatedData;
    const session = sessionId || crypto.randomUUID();

    // Simple keyword-based response selection
    const lowerMessage = message.toLowerCase();
    let response = responses.default;

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (lowerMessage.includes('service') || lowerMessage.includes('therapy') || lowerMessage.includes('help')) {
      response = responses.services;
    } else if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
      response = responses.booking;
    } else if (lowerMessage.includes('insurance') || lowerMessage.includes('cost') || lowerMessage.includes('pay')) {
      response = responses.insurance;
    } else if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
      response = responses.location;
    } else if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('time')) {
      response = responses.hours;
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('crisis') || lowerMessage.includes('urgent')) {
      response = responses.emergency;
    }

    // Log chat interaction
    const chatData = {
      session_id: session,
      user_message: message,
      bot_response: response,
      context: context || {},
      metadata: {
        page: context?.page || req.headers.referer || 'unknown',
        ip_address: identifier,
        user_agent: req.headers['user-agent'] || ''
      },
      created_at: new Date().toISOString()
    };

    // Save to database (don't wait for response)
    supabase
      .from('chatbot_interactions')
      .insert(chatData)
      .then(({ error }) => {
        if (error) {
          console.error('Error saving chat interaction:', error);
        }
      });

    // Track as analytics event
    supabase
      .from('analytics_events')
      .insert({
        type: 'chatbot_interaction',
        page: context?.page || '/chat',
        session_id: session,
        data: {
          message_length: message.length,
          has_context: !!context?.previousMessages?.length
        }
      })
      .then(({ error }) => {
        if (error) {
          console.error('Error tracking chat event:', error);
        }
      });

    // Check if this might lead to a conversion
    if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('contact')) {
      // Track potential conversion
      supabase
        .from('conversion_events')
        .insert({
          event_type: 'chatbot_booking_intent',
          session_id: session,
          page: context?.page || '/chat',
          value: 50, // Assign value to booking intent
          metadata: { message: message.substring(0, 100) }
        })
        .then(({ error }) => {
          if (error) {
            console.error('Error tracking conversion:', error);
          }
        });
    }

    return res.status(200).json({
      response,
      sessionId: session,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    return res.status(500).json({ 
      error: 'I apologize, but I encountered an error. Please try again or contact us directly at (512) 898-9510.' 
    });
  }
}

// SQL needed:
/*
-- Create chatbot interactions table
CREATE TABLE IF NOT EXISTS chatbot_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_chatbot_session ON chatbot_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_created ON chatbot_interactions(created_at);

-- Allow public to insert chat interactions
CREATE POLICY "Public can insert chatbot interactions" ON chatbot_interactions
  FOR INSERT TO anon
  WITH CHECK (true);

-- RLS for reading (only admins can read)
CREATE POLICY "Admins can view chatbot interactions" ON chatbot_interactions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM user_profiles WHERE role IN ('admin', 'super_admin')
    )
  );
*/