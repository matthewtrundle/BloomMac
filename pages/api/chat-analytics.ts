import { NextApiRequest, NextApiResponse } from 'next';
import { getChatConversations, ChatConversation } from './chat-capture';

interface ChatAnalytics {
  summary: {
    total_conversations: number;
    total_messages: number;
    avg_messages_per_conversation: number;
    period: string;
  };
  top_questions: {
    question: string;
    frequency: number;
    category: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];
  conversation_patterns: {
    pattern: string;
    frequency: number;
    description: string;
    improvement_suggestion: string;
  }[];
  user_pain_points: {
    pain_point: string;
    frequency: number;
    urgency: 'high' | 'medium' | 'low';
    suggested_content: string[];
  }[];
  bot_performance: {
    metric: string;
    value: number;
    benchmark: number;
    status: 'excellent' | 'good' | 'needs_improvement' | 'critical';
    recommendations: string[];
  }[];
  actionable_insights: {
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: 'content' | 'bot_response' | 'user_experience' | 'service';
    insight: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
    implementation_steps: string[];
  }[];
}

// Analyze chat conversations using AI-like pattern recognition
const analyzeConversations = (conversations: ChatConversation[], range: string): ChatAnalytics => {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  const recentConversations = conversations.filter(c => 
    new Date(c.timestamp) > cutoffDate
  );

  const totalMessages = recentConversations.reduce((acc, conv) => acc + conv.messages.length, 0);
  const userMessages = recentConversations.flatMap(conv => 
    conv.messages.filter(m => !m.isBot)
  );

  // Analyze common question patterns
  const questionPatterns = analyzeQuestionPatterns(userMessages);
  const painPoints = analyzePainPoints(userMessages);
  const conversationPatterns = analyzeConversationFlows(recentConversations);
  const botPerformance = analyzeBotPerformance(recentConversations);

  return {
    summary: {
      total_conversations: recentConversations.length,
      total_messages: totalMessages,
      avg_messages_per_conversation: recentConversations.length > 0 
        ? Math.round(totalMessages / recentConversations.length * 10) / 10 
        : 0,
      period: `Last ${days} days`
    },

    top_questions: questionPatterns,

    conversation_patterns: conversationPatterns,

    user_pain_points: painPoints,

    bot_performance: botPerformance,

    actionable_insights: generateActionableInsights(
      questionPatterns, 
      painPoints, 
      conversationPatterns, 
      recentConversations.length
    )
  };
};

const analyzeQuestionPatterns = (userMessages: any[]): ChatAnalytics['top_questions'] => {
  const patterns: { [key: string]: { count: number; category: string; sentiment: string } } = {};

  userMessages.forEach(message => {
    const text = message.text.toLowerCase();
    
    // Service-related questions
    if (text.includes('postpartum') || text.includes('after baby') || text.includes('new mom')) {
      patterns['postpartum support'] = (patterns['postpartum support'] || { count: 0, category: 'services', sentiment: 'neutral' });
      patterns['postpartum support'].count++;
    }
    
    if (text.includes('anxiety') || text.includes('anxious') || text.includes('worried') || text.includes('panic')) {
      patterns['anxiety help'] = (patterns['anxiety help'] || { count: 0, category: 'services', sentiment: 'negative' });
      patterns['anxiety help'].count++;
    }
    
    if (text.includes('depression') || text.includes('sad') || text.includes('depressed')) {
      patterns['depression support'] = (patterns['depression support'] || { count: 0, category: 'services', sentiment: 'negative' });
      patterns['depression support'].count++;
    }
    
    // Logistics questions
    if (text.includes('cost') || text.includes('price') || text.includes('how much') || text.includes('expensive')) {
      patterns['cost and pricing'] = (patterns['cost and pricing'] || { count: 0, category: 'logistics', sentiment: 'neutral' });
      patterns['cost and pricing'].count++;
    }
    
    if (text.includes('insurance') || text.includes('covered') || text.includes('benefits')) {
      patterns['insurance coverage'] = (patterns['insurance coverage'] || { count: 0, category: 'logistics', sentiment: 'neutral' });
      patterns['insurance coverage'].count++;
    }
    
    if (text.includes('appointment') || text.includes('schedule') || text.includes('when') || text.includes('available')) {
      patterns['scheduling questions'] = (patterns['scheduling questions'] || { count: 0, category: 'logistics', sentiment: 'positive' });
      patterns['scheduling questions'].count++;
    }
    
    if (text.includes('location') || text.includes('where') || text.includes('address') || text.includes('office')) {
      patterns['location and directions'] = (patterns['location and directions'] || { count: 0, category: 'logistics', sentiment: 'neutral' });
      patterns['location and directions'].count++;
    }
    
    // Experience questions
    if (text.includes('doctor') || text.includes('therapist') || text.includes('qualifications') || text.includes('experience')) {
      patterns['provider credentials'] = (patterns['provider credentials'] || { count: 0, category: 'trust', sentiment: 'neutral' });
      patterns['provider credentials'].count++;
    }
    
    if (text.includes('virtual') || text.includes('online') || text.includes('telehealth') || text.includes('remote')) {
      patterns['virtual therapy options'] = (patterns['virtual therapy options'] || { count: 0, category: 'services', sentiment: 'neutral' });
      patterns['virtual therapy options'].count++;
    }
  });

  return Object.entries(patterns)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 8)
    .map(([question, data]) => ({
      question,
      frequency: data.count,
      category: data.category,
      sentiment: data.sentiment as 'positive' | 'neutral' | 'negative'
    }));
};

const analyzePainPoints = (userMessages: any[]): ChatAnalytics['user_pain_points'] => {
  const painPoints: { [key: string]: { count: number; urgency: string; content: string[] } } = {};

  userMessages.forEach(message => {
    const text = message.text.toLowerCase();
    
    if (text.includes('urgent') || text.includes('crisis') || text.includes('emergency') || text.includes('immediate')) {
      painPoints['Need immediate help'] = painPoints['Need immediate help'] || { count: 0, urgency: 'high', content: [] };
      painPoints['Need immediate help'].count++;
      painPoints['Need immediate help'].content = ['Crisis resources page', 'Emergency contact information', 'Same-day appointment availability'];
    }
    
    if (text.includes('confused') || text.includes("don't understand") || text.includes('not clear')) {
      painPoints['Information clarity issues'] = painPoints['Information clarity issues'] || { count: 0, urgency: 'medium', content: [] };
      painPoints['Information clarity issues'].count++;
      painPoints['Information clarity issues'].content = ['FAQ page improvements', 'Service descriptions', 'Process explanations'];
    }
    
    if (text.includes('expensive') || text.includes('afford') || text.includes('money') || text.includes('budget')) {
      painPoints['Cost concerns'] = painPoints['Cost concerns'] || { count: 0, urgency: 'high', content: [] };
      painPoints['Cost concerns'].count++;
      painPoints['Cost concerns'].content = ['Sliding scale information', 'Insurance guide', 'Payment options'];
    }
    
    if (text.includes('waiting') || text.includes('wait') || text.includes('how long') || text.includes('available')) {
      painPoints['Availability concerns'] = painPoints['Availability concerns'] || { count: 0, urgency: 'medium', content: [] };
      painPoints['Availability concerns'].count++;
      painPoints['Availability concerns'].content = ['Real-time availability calendar', 'Waitlist options', 'Alternative resources'];
    }
    
    if (text.includes('judgment') || text.includes('shame') || text.includes('embarrassed') || text.includes('stigma')) {
      painPoints['Stigma and judgment fears'] = painPoints['Stigma and judgment fears'] || { count: 0, urgency: 'high', content: [] };
      painPoints['Stigma and judgment fears'].count++;
      painPoints['Stigma and judgment fears'].content = ['Testimonials and success stories', 'Therapy education content', 'Confidentiality information'];
    }
  });

  return Object.entries(painPoints)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 6)
    .map(([pain_point, data]) => ({
      pain_point,
      frequency: data.count,
      urgency: data.urgency as 'high' | 'medium' | 'low',
      suggested_content: data.content
    }));
};

const analyzeConversationFlows = (conversations: ChatConversation[]): ChatAnalytics['conversation_patterns'] => {
  const patterns: { [key: string]: { count: number; description: string; suggestion: string } } = {};

  conversations.forEach(conv => {
    const messageCount = conv.messages.length;
    const userMessages = conv.messages.filter(m => !m.isBot);
    
    if (messageCount <= 2) {
      patterns['Single question dropoff'] = patterns['Single question dropoff'] || { 
        count: 0, 
        description: 'Users ask one question and leave without engagement',
        suggestion: 'Improve bot responses with follow-up questions and related resources'
      };
      patterns['Single question dropoff'].count++;
    }
    
    if (messageCount >= 6) {
      patterns['Extended conversations'] = patterns['Extended conversations'] || { 
        count: 0,
        description: 'Users engage in lengthy conversations showing high interest',
        suggestion: 'Identify what makes these conversations successful and replicate'
      };
      patterns['Extended conversations'].count++;
    }
    
    if (userMessages.some(m => m.text.toLowerCase().includes('book') || m.text.toLowerCase().includes('schedule'))) {
      patterns['Booking intent shown'] = patterns['Booking intent shown'] || { 
        count: 0,
        description: 'Users express interest in booking appointments',
        suggestion: 'Streamline the booking process directly from chat interface'
      };
      patterns['Booking intent shown'].count++;
    }
    
    if (userMessages.some(m => m.text.toLowerCase().includes('thank') || m.text.toLowerCase().includes('helpful'))) {
      patterns['Positive feedback received'] = patterns['Positive feedback received'] || { 
        count: 0,
        description: 'Users express satisfaction with chat experience',
        suggestion: 'Analyze these conversations to identify best practices'
      };
      patterns['Positive feedback received'].count++;
    }
  });

  return Object.entries(patterns)
    .sort(([,a], [,b]) => b.count - a.count)
    .map(([pattern, data]) => ({
      pattern,
      frequency: data.count,
      description: data.description,
      improvement_suggestion: data.suggestion
    }));
};

const analyzeBotPerformance = (conversations: ChatConversation[]): ChatAnalytics['bot_performance'] => {
  const totalConversations = conversations.length;
  const totalMessages = conversations.reduce((acc, conv) => acc + conv.messages.length, 0);
  const avgMessagesPerConv = totalConversations > 0 ? totalMessages / totalConversations : 0;
  
  const extendedConversations = conversations.filter(conv => conv.messages.length >= 4).length;
  const engagementRate = totalConversations > 0 ? (extendedConversations / totalConversations) * 100 : 0;
  
  const bookingMentions = conversations.filter(conv => 
    conv.messages.some(m => 
      !m.isBot && (
        m.text.toLowerCase().includes('book') || 
        m.text.toLowerCase().includes('schedule') ||
        m.text.toLowerCase().includes('appointment')
      )
    )
  ).length;
  
  const conversionRate = totalConversations > 0 ? (bookingMentions / totalConversations) * 100 : 0;

  return [
    {
      metric: 'Conversation Engagement Rate',
      value: Math.round(engagementRate * 10) / 10,
      benchmark: 35,
      status: engagementRate >= 35 ? 'good' : engagementRate >= 25 ? 'needs_improvement' : 'critical',
      recommendations: engagementRate < 35 ? [
        'Improve initial bot responses to be more engaging',
        'Ask follow-up questions to encourage continued conversation',
        'Provide more specific and helpful information'
      ] : [
        'Maintain current engagement strategies',
        'Continue monitoring conversation quality'
      ]
    },
    {
      metric: 'Booking Intent Conversion',
      value: Math.round(conversionRate * 10) / 10,
      benchmark: 15,
      status: conversionRate >= 15 ? 'excellent' : conversionRate >= 10 ? 'good' : 'needs_improvement',
      recommendations: conversionRate < 15 ? [
        'Add more direct booking prompts in bot responses',
        'Integrate Calendly widget directly in chat',
        'Provide clearer next steps for scheduling'
      ] : [
        'Excellent conversion rate - analyze successful conversations',
        'Consider A/B testing different booking prompts'
      ]
    },
    {
      metric: 'Average Messages per Conversation',
      value: Math.round(avgMessagesPerConv * 10) / 10,
      benchmark: 4,
      status: avgMessagesPerConv >= 4 ? 'good' : avgMessagesPerConv >= 2.5 ? 'needs_improvement' : 'critical',
      recommendations: avgMessagesPerConv < 4 ? [
        'Encourage longer conversations with open-ended questions',
        'Provide comprehensive answers that invite follow-up',
        'Add conversation starters and related topics'
      ] : [
        'Good conversation depth - maintain current approach',
        'Focus on conversion optimization'
      ]
    }
  ];
};

const generateActionableInsights = (
  questions: ChatAnalytics['top_questions'],
  painPoints: ChatAnalytics['user_pain_points'],
  patterns: ChatAnalytics['conversation_patterns'],
  totalConversations: number
): ChatAnalytics['actionable_insights'] => {
  const insights: ChatAnalytics['actionable_insights'] = [];

  // High-priority insights based on pain points
  const topPainPoint = painPoints[0];
  if (topPainPoint && topPainPoint.frequency >= 3) {
    insights.push({
      priority: topPainPoint.urgency === 'high' ? 'critical' : 'high',
      category: 'content',
      insight: `Users frequently struggle with: ${topPainPoint.pain_point}`,
      impact: `${topPainPoint.frequency} users affected - addressing this could improve user experience significantly`,
      effort: 'medium',
      implementation_steps: [
        ...topPainPoint.suggested_content.map(content => `Create ${content}`),
        'Add dedicated section to website addressing this concern',
        'Update bot responses to proactively address this issue'
      ]
    });
  }

  // Service-related insights
  const serviceQuestions = questions.filter(q => q.category === 'services');
  if (serviceQuestions.length > 0) {
    const topService = serviceQuestions[0];
    insights.push({
      priority: 'high',
      category: 'service',
      insight: `High demand for information about: ${topService.question}`,
      impact: `${topService.frequency} inquiries - opportunity to create targeted content and improve service presentation`,
      effort: 'low',
      implementation_steps: [
        `Create dedicated landing page for ${topService.question}`,
        'Add more detailed information to existing service pages',
        'Update bot knowledge base with comprehensive service details',
        'Consider creating service-specific lead magnets'
      ]
    });
  }

  // Bot performance insights
  const singleDropoffs = patterns.find(p => p.pattern === 'Single question dropoff');
  if (singleDropoffs && singleDropoffs.frequency > totalConversations * 0.3) {
    insights.push({
      priority: 'high',
      category: 'bot_response',
      insight: 'High rate of single-question dropoffs indicates bot responses need improvement',
      impact: `${singleDropoffs.frequency} lost engagement opportunities - improving could increase conversion by 25%`,
      effort: 'medium',
      implementation_steps: [
        'Analyze successful multi-message conversations for patterns',
        'Add follow-up questions to bot responses',
        'Include related resources and topics in responses',
        'Implement conversation flow optimization'
      ]
    });
  }

  // Logistics optimization
  const logisticsQuestions = questions.filter(q => q.category === 'logistics');
  if (logisticsQuestions.length >= 2) {
    insights.push({
      priority: 'medium',
      category: 'user_experience',
      insight: 'Multiple logistics questions suggest need for clearer information architecture',
      impact: 'Reducing logistics confusion could improve user experience and reduce repetitive inquiries',
      effort: 'medium',
      implementation_steps: [
        'Create comprehensive FAQ section',
        'Add quick access to common information (pricing, location, scheduling)',
        'Implement smart bot responses that provide complete logistics information',
        'Add visual elements like maps and calendars to reduce confusion'
      ]
    });
  }

  return insights.slice(0, 4); // Return top 4 insights
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { range = '7d' } = req.query;
    
    // Validate range parameter
    if (!['7d', '30d', '90d'].includes(range as string)) {
      return res.status(400).json({ error: 'Invalid range parameter' });
    }

    const conversations = getChatConversations();
    const analytics = analyzeConversations(conversations, range as string);

    console.log('Chat analytics generated:', {
      totalConversations: analytics.summary.total_conversations,
      topQuestions: analytics.top_questions.length,
      painPoints: analytics.user_pain_points.length,
      insights: analytics.actionable_insights.length,
      range
    });

    // Set caching headers - cache for 5 minutes
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return res.status(200).json(analytics);

  } catch (error) {
    console.error('Chat analytics error:', error);
    return res.status(500).json({ error: 'Failed to generate chat analytics' });
  }
}