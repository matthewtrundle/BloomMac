import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

interface EmailSequence {
  id: string;
  name: string;
  trigger: string;
  status: 'active' | 'paused' | 'draft';
  emails: {
    id: string;
    subject: string;
    delay: string;
    sent: number;
    opened: number;
    clicked: number;
  }[];
  performance: {
    totalSent: number;
    avgOpenRate: number;
    avgClickRate: number;
    conversions: number;
  };
}

interface AutomationDashboard {
  activeSequences: number;
  totalEmailsSent: number;
  avgAutomationPerformance: number;
  sequences: EmailSequence[];
  templates: {
    id: string;
    name: string;
    category: string;
    lastUsed: string;
    performance: number;
  }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // For now, return mock data since automation isn't fully implemented
      const automationData: AutomationDashboard = {
        activeSequences: 3,
        totalEmailsSent: 1247,
        avgAutomationPerformance: 68.5,
        sequences: [
          {
            id: 'seq-1',
            name: 'New Mom Welcome Series',
            trigger: 'New Mom Program Signup',
            status: 'active',
            emails: [
              {
                id: 'email-1',
                subject: 'Welcome to Your Postpartum Journey',
                delay: 'Immediately',
                sent: 145,
                opened: 112,
                clicked: 45
              },
              {
                id: 'email-2',
                subject: 'Understanding Postpartum Emotions',
                delay: '3 days',
                sent: 138,
                opened: 98,
                clicked: 32
              },
              {
                id: 'email-3',
                subject: 'Free Resources for New Moms',
                delay: '7 days',
                sent: 125,
                opened: 85,
                clicked: 28
              }
            ],
            performance: {
              totalSent: 408,
              avgOpenRate: 74.2,
              avgClickRate: 35.8,
              conversions: 22
            }
          },
          {
            id: 'seq-2',
            name: 'Newsletter Welcome',
            trigger: 'Newsletter Signup',
            status: 'active',
            emails: [
              {
                id: 'email-4',
                subject: 'Thank You for Subscribing!',
                delay: 'Immediately',
                sent: 234,
                opened: 178,
                clicked: 56
              },
              {
                id: 'email-5',
                subject: 'Meet Dr. Jana Rundle',
                delay: '2 days',
                sent: 220,
                opened: 145,
                clicked: 42
              }
            ],
            performance: {
              totalSent: 454,
              avgOpenRate: 71.0,
              avgClickRate: 30.3,
              conversions: 18
            }
          },
          {
            id: 'seq-3',
            name: 'Consultation Follow-up',
            trigger: 'Free Consultation Booked',
            status: 'active',
            emails: [
              {
                id: 'email-6',
                subject: 'Preparing for Your Consultation',
                delay: '1 day before',
                sent: 89,
                opened: 78,
                clicked: 34
              },
              {
                id: 'email-7',
                subject: 'Thank You for Our Conversation',
                delay: '1 hour after',
                sent: 82,
                opened: 68,
                clicked: 28
              }
            ],
            performance: {
              totalSent: 171,
              avgOpenRate: 85.4,
              avgClickRate: 42.5,
              conversions: 35
            }
          }
        ],
        templates: [
          {
            id: 'tpl-1',
            name: 'Welcome Email - Warm',
            category: 'Welcome Series',
            lastUsed: '2 days ago',
            performance: 82
          },
          {
            id: 'tpl-2',
            name: 'Educational - Postpartum Tips',
            category: 'Educational',
            lastUsed: '5 days ago',
            performance: 75
          },
          {
            id: 'tpl-3',
            name: 'Testimonial Showcase',
            category: 'Social Proof',
            lastUsed: '1 week ago',
            performance: 88
          },
          {
            id: 'tpl-4',
            name: 'Service Introduction',
            category: 'Services',
            lastUsed: '3 days ago',
            performance: 71
          }
        ]
      };
      
      return res.status(200).json(automationData);
      
    } catch (error) {
      console.error('Email automation error:', error);
      return res.status(500).json({ error: 'Failed to fetch automation data' });
    }
    
  } else if (req.method === 'POST') {
    // Handle creating new automation sequences
    const { sequence } = req.body;
    
    try {
      // In production, save to database
      console.log('Creating automation sequence:', sequence);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Automation sequence created',
        id: `seq-${Date.now()}`
      });
      
    } catch (error) {
      console.error('Error creating automation:', error);
      return res.status(500).json({ error: 'Failed to create automation' });
    }
    
  } else if (req.method === 'PUT') {
    // Handle updating automation status
    const { sequenceId, status } = req.body;
    
    try {
      console.log('Updating automation:', { sequenceId, status });
      
      return res.status(200).json({ 
        success: true, 
        message: 'Automation updated' 
      });
      
    } catch (error) {
      console.error('Error updating automation:', error);
      return res.status(500).json({ error: 'Failed to update automation' });
    }
    
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}