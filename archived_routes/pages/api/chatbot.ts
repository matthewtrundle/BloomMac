import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

// For now, we'll use a simple rule-based response system
// Replace this with OpenAI API integration once you add your API key

interface ChatResponse {
  response: string;
  action?: {
    type: 'redirect' | 'scroll' | 'highlight';
    target: string;
    guidance?: string;
  };
}

const predefinedResponses: { [key: string]: { response: string; action?: { type: 'redirect' | 'scroll' | 'highlight'; target: string; guidance?: string } } } = {
  // Services
  'services': { 
    response: 'We offer specialized therapy for women, moms, and parents including postpartum depression support, anxiety & stress management, therapy for women, therapy for moms, and parent support. Which service interests you most?' 
  },
  'postpartum': { 
    response: 'Our postpartum depression support helps new mothers navigate the challenges of early motherhood. We offer both virtual and in-person sessions with licensed perinatal specialists. Would you like to book a free consultation?',
    action: { type: 'redirect', target: '/services/postpartum-depression-support', guidance: 'You can learn more about the service and book directly from our postpartum support page.' }
  },
  'anxiety': { 
    response: 'We specialize in anxiety and stress management using evidence-based approaches. Our therapists understand the unique pressures facing women and mothers. Schedule a free consultation to learn more about how we can help.',
    action: { type: 'redirect', target: '/services/anxiety-stress-management', guidance: 'You can book a consultation from our anxiety support page.' }
  },
  'therapy': { 
    response: 'We provide specialized therapy services for women, moms, and parents. All our therapists are licensed and have specialized training in perinatal mental health.' 
  },
  
  // Booking & Contact
  'appointment': { 
    response: 'Perfect! You can schedule your free 15-minute consultation directly - we offer same-week appointments and both virtual and in-person sessions.',
    action: { type: 'redirect', target: '/book', guidance: 'You can select your preferred time and session type there.' }
  },
  'book': { 
    response: 'Absolutely! You can schedule your free consultation right away.',
    action: { type: 'redirect', target: '/book', guidance: 'You can choose your preferred appointment type and time there.' }
  },
  'cost': { 
    response: 'For information about session fees and payment options, please contact our office directly. We\'re happy to discuss what works best for your situation.',
    action: { type: 'redirect', target: '/contact', guidance: 'You can reach out to discuss payment options that work for you.' }
  },
  'insurance': { 
    response: 'Dr. Rundle is considered an out-of-network provider on all insurance panels. We can provide a Super Bill for you to submit to insurance for reimbursement if you have out-of-network benefits.',
    action: { type: 'redirect', target: '/faq', guidance: 'Our FAQ page has detailed insurance information and examples of how reimbursement works.' }
  },
  
  // Location & Logistics
  'location': { 
    response: 'We\'re located at 13706 N Highway 183, Suite 114, Austin, TX 78750. We offer both in-person sessions at our North Austin office and virtual sessions.',
    action: { type: 'redirect', target: '/contact', guidance: 'You can find our full address, directions, and office details on our contact page.' }
  },
  'virtual': { 
    response: 'Yes! We offer secure virtual therapy sessions that are just as effective as in-person sessions. Many of our clients prefer the convenience, especially new moms.' 
  },
  'hours': { 
    response: 'Our office hours are Monday through Friday, 9:00 AM to 6:00 PM. We also offer some weekend appointments upon request.',
    action: { type: 'redirect', target: '/book', guidance: 'You can see real-time availability and schedule during our office hours on our booking page.' }
  },
  
  // About the practice
  'doctor': { 
    response: 'Dr. Jana Rundle is our lead psychologist with specialized training in perinatal mental health. She has extensive experience helping women and mothers through various life transitions.',
    action: { type: 'redirect', target: '/about', guidance: 'You can learn more about Dr. Rundle\'s background, training, and approach on our About page.' }
  },
  'experience': { 
    response: 'Our team has years of experience in women\'s mental health and perinatal psychology. We understand the unique challenges facing women, especially during motherhood.',
    action: { type: 'redirect', target: '/about', guidance: 'Our About page has detailed information about our experience and specializations.' }
  },
  'approach': { 
    response: 'We use evidence-based therapeutic approaches tailored to each client\'s needs. Our focus is on creating a safe, supportive environment where you can heal and grow.',
    action: { type: 'redirect', target: '/about', guidance: 'You can find more details about our therapeutic approach and philosophy on our About page.' }
  },
  
  // Emergency
  'crisis': { 
    response: 'If you\'re experiencing a mental health crisis, please contact the Crisis Text Line by texting HOME to 741741 or call 988 for the Suicide & Crisis Lifeline. For immediate medical emergencies, call 911. Please reach out for professional help immediately.' 
  },
  'emergency': { 
    response: 'For immediate crisis support, text HOME to 741741 or call 988. If this is a medical emergency, please call 911. Please seek professional help immediately.' 
  },
  'suicidal': { 
    response: 'I\'m very concerned about you. Please contact the 988 Suicide & Crisis Lifeline immediately by calling 988 or texting HOME to 741741. If you\'re in immediate danger, please call 911. You deserve support and help is available.' 
  },
  'harm': { 
    response: 'I\'m concerned about what you\'re sharing. Please reach out for immediate help: call 988 or text HOME to 741741 for crisis support. If you\'re in immediate danger, call 911. Professional help is available.' 
  }
};

const findBestResponse = (message: string): ChatResponse => {
  const lowerMessage = message.toLowerCase();
  
  // Check for exact keyword matches first
  for (const [keyword, responseData] of Object.entries(predefinedResponses)) {
    if (lowerMessage.includes(keyword)) {
      return { response: responseData.response, action: responseData.action };
    }
  }
  
  // Check for question patterns
  if (lowerMessage.includes('how much') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    const responseData = predefinedResponses['cost'];
    return { response: responseData.response, action: responseData.action };
  }
  
  if (lowerMessage.includes('schedule') || lowerMessage.includes('appointment') || lowerMessage.includes('book')) {
    const responseData = predefinedResponses['book'];
    return { response: responseData.response, action: responseData.action };
  }
  
  if (lowerMessage.includes('where') || lowerMessage.includes('address')) {
    const responseData = predefinedResponses['location'];
    return { response: responseData.response, action: responseData.action };
  }
  
  if (lowerMessage.includes('who') || lowerMessage.includes('doctor') || lowerMessage.includes('therapist')) {
    const responseData = predefinedResponses['doctor'];
    return { response: responseData.response, action: responseData.action };
  }
  
  if (lowerMessage.includes('help') && (lowerMessage.includes('depression') || lowerMessage.includes('sad') || lowerMessage.includes('postpartum'))) {
    const responseData = predefinedResponses['postpartum'];
    return { response: responseData.response, action: responseData.action };
  }
  
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
    const responseData = predefinedResponses['anxiety'];
    return { response: responseData.response, action: responseData.action };
  }
  
  // Critical safety check - crisis situations
  if (lowerMessage.includes('suicid') || lowerMessage.includes('kill myself') || lowerMessage.includes('end my life') ||
      lowerMessage.includes('want to die') || lowerMessage.includes('hurt myself') || lowerMessage.includes('self harm')) {
    const responseData = predefinedResponses['suicidal'];
    return { response: responseData.response };
  }
  
  if (lowerMessage.includes('harm my baby') || lowerMessage.includes('hurt my baby') || lowerMessage.includes('dangerous thoughts')) {
    const responseData = predefinedResponses['harm'];
    return { response: responseData.response };
  }
  
  // Healthcare safety check - redirect clinical questions
  if (lowerMessage.includes('symptom') || lowerMessage.includes('diagnos') || lowerMessage.includes('medication') || 
      lowerMessage.includes('treatment') || lowerMessage.includes('depress') || lowerMessage.includes('therapy advice') ||
      lowerMessage.includes('should I take') || lowerMessage.includes('what medicine')) {
    return { 
      response: "I can't provide medical advice or discuss symptoms. For personalized care and clinical questions, please book a consultation with Dr. Rundle who can properly assess and help you. If you're in crisis, please call 988 or text HOME to 741741.",
      action: { type: 'redirect', target: '/book', guidance: 'You can schedule a consultation with Dr. Rundle for personalized care.' }
    };
  }
  
  // Default response
  return { 
    response: "I'd be happy to help you learn more about our practice services, scheduling, and location. For any therapeutic or clinical questions, I'd recommend booking a free consultation with Dr. Rundle who can provide personalized professional guidance.",
    action: { type: 'redirect', target: '/book', guidance: 'Feel free to book a free consultation to get personalized answers to your questions!' }
  };
};

const callOpenAI = async (message: string): Promise<ChatResponse> => {
  try {
    // Use OpenRouter API with GPT-3.5-turbo
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bloompsychologynorthaustin.com',
        'X-Title': 'Bloom Psychology Chatbot',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for Bloom Psychology, a therapy practice specializing in women's mental health, postpartum support, and perinatal psychology. 
            
            Key information:
            - Location: 13706 N Highway 183, Suite 114, Austin, TX 78750
            - Services: Postpartum depression support, anxiety & stress management, therapy for women, therapy for moms, parent support
            - Lead therapist: Dr. Jana Rundle, licensed psychologist with perinatal specialty
            - We offer free 15-minute consultations
            - Both virtual and in-person sessions available
            - Same-week appointments available
            - Insurance: Dr. Rundle is an out-of-network provider on all insurance panels. We provide Super Bills for reimbursement if you have out-of-network benefits.
            - Office hours: Monday-Friday 9AM-6PM, weekend appointments upon request
            - Booking: bloompsychologynorthaustin.com/book
            - Contact: jana@bloompsychologynorthaustin.com
            
            CRITICAL HEALTHCARE GUIDELINES:
            - NEVER provide medical advice, diagnoses, treatment recommendations, or medication suggestions
            - NEVER interpret symptoms or suggest what conditions someone might have
            - NEVER provide therapeutic interventions or coping strategies beyond general wellness
            - NEVER discuss self-harm, suicide, or crisis situations beyond providing crisis resources
            - ALWAYS refer medical questions to healthcare providers
            - ALWAYS emphasize that therapy consultation is needed for personalized care
            - For ANY crisis indicators (suicide, self-harm, abuse, immediate danger): IMMEDIATELY provide crisis resources and suggest calling 911 if imminent danger
            
            Response Guidelines:
            - Be warm, professional, and encouraging
            - Keep responses concise (2-3 sentences max)
            - Direct users to book consultations for any therapeutic needs
            - For crisis situations, provide: Crisis Text Line (text HOME to 741741), 988 Suicide & Crisis Lifeline, or 911 for immediate danger
            - Emphasize that seeking help is a sign of strength
            - Focus only on practice information, scheduling, and general support
            - Redirect all clinical questions to professional consultation`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, response.statusText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return { response: data.choices[0].message.content };
    } else {
      console.error('Unexpected API response format:', data);
      throw new Error('Unexpected API response format');
    }

  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    // Fallback to rule-based responses if API fails
    return findBestResponse(message);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ChatResponse | { error: string }>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, sessionId, conversationId } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    console.log('Chatbot received message:', message);
    
    const chatResponse = await callOpenAI(message);
    
    console.log('Chatbot response:', chatResponse);
    
    // Save conversation to Supabase
    try {
      let convId = conversationId;
      
      // If no conversation ID, create a new conversation
      if (!convId) {
        const { data: newConv, error: convError } = await supabaseAdmin
          .from('chat_conversations')
          .insert({
            session_id: sessionId || null,
            source_page: req.headers.referer || 'unknown',
            status: 'active'
          })
          .select()
          .single();
          
        if (!convError && newConv) {
          convId = newConv.id;
        }
      }
      
      // Add messages to conversation
      if (convId) {
        const messages = [
          {
            conversation_id: convId,
            role: 'user',
            content: message
          },
          {
            conversation_id: convId,
            role: 'assistant',
            content: chatResponse.response,
            action_type: chatResponse.action?.type || null,
            action_target: chatResponse.action?.target || null
          }
        ];
        
        await supabaseAdmin
          .from('chat_conversations')
          .update({ 
            messages: supabaseAdmin.sql`
              COALESCE(messages, '[]'::jsonb) || ${JSON.stringify(messages)}::jsonb
            `,
            last_message_at: new Date().toISOString()
          })
          .eq('id', convId);
          
        // Track analytics event
        await supabaseAdmin
          .from('analytics_events')
          .insert({
            type: 'chatbot_interaction',
            page: req.headers.referer || '/unknown',
            session_id: sessionId || null,
            data: { 
              action: 'chat_message',
              has_action: !!chatResponse.action
            }
          });
      }
    } catch (dbError) {
      console.error('Error saving to database:', dbError);
      // Don't fail the request if DB save fails
    }
    
    return res.status(200).json(chatResponse);

  } catch (error) {
    console.error('Chatbot error:', error);
    return res.status(500).json({ error: 'Failed to process message' });
  }
}