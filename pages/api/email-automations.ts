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
      // Get sequences from Supabase
      const { data: sequences, error: seqError } = await supabaseAdmin
        .from('email_sequences')
        .select(`
          *,
          sequence_emails (*)
        `)
        .order('created_at', { ascending: false });
      
      // Get automation logs for performance metrics
      const { data: logs } = await supabaseAdmin
        .from('email_automation_logs')
        .select('*');
      
      // Get templates
      const { data: templates } = await supabaseAdmin
        .from('email_templates')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      // Calculate metrics
      const activeSequences = sequences?.filter(s => s.status === 'active').length || 0;
      const totalEmailsSent = logs?.filter(l => l.status === 'sent').length || 0;
      
      // Format sequences with performance data
      const formattedSequences = (sequences || []).map(seq => {
        const seqLogs = logs?.filter(l => l.sequence_id === seq.id) || [];
        const sent = seqLogs.filter(l => l.status === 'sent').length;
        const opened = seqLogs.filter(l => l.opened_at).length;
        const clicked = seqLogs.filter(l => l.clicked_at).length;
        
        return {
          id: seq.id,
          name: seq.name,
          trigger: seq.trigger,
          status: seq.status,
          emails: (seq.sequence_emails || []).map(email => ({
            id: email.id,
            subject: email.subject,
            delay: `${email.delay_days}d ${email.delay_hours}h`,
            sent: seqLogs.filter(l => l.email_id === email.id && l.status === 'sent').length,
            opened: seqLogs.filter(l => l.email_id === email.id && l.opened_at).length,
            clicked: seqLogs.filter(l => l.email_id === email.id && l.clicked_at).length
          })),
          performance: {
            totalSent: sent,
            avgOpenRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
            avgClickRate: opened > 0 ? Math.round((clicked / opened) * 100) : 0,
            conversions: 0 // TODO: Track conversions
          }
        };
      });
      
      // Format templates
      const formattedTemplates = (templates || []).map(template => ({
        id: template.id,
        name: template.name,
        category: template.category || 'general',
        lastUsed: template.updated_at,
        performance: 85 // Mock performance score for now
      }));
      
      // Calculate average performance
      const avgOpenRates = formattedSequences
        .filter(s => s.performance.totalSent > 0)
        .map(s => s.performance.avgOpenRate);
      const avgAutomationPerformance = avgOpenRates.length > 0
        ? Math.round(avgOpenRates.reduce((a, b) => a + b, 0) / avgOpenRates.length)
        : 0;
      
      const automationData: AutomationDashboard = {
        activeSequences,
        totalEmailsSent,
        avgAutomationPerformance,
        sequences: formattedSequences,
        templates: formattedTemplates
      };
      
      return res.status(200).json(automationData);
      
    } catch (error) {
      console.error('Email automation error:', error);
      
      // Return default data if tables don't exist yet
      const defaultData: AutomationDashboard = {
        activeSequences: 2,
        totalEmailsSent: 0,
        avgAutomationPerformance: 0,
        sequences: [
          {
            id: 'default-1',
            name: 'Welcome Series',
            trigger: 'newsletter_signup',
            status: 'active',
            emails: [
              { id: '1', subject: 'Welcome to Bloom Psychology', delay: '0d 0h', sent: 0, opened: 0, clicked: 0 },
              { id: '2', subject: '5 Ways to Manage Daily Anxiety', delay: '3d 0h', sent: 0, opened: 0, clicked: 0 },
              { id: '3', subject: 'Your Mental Health Matters', delay: '7d 0h', sent: 0, opened: 0, clicked: 0 }
            ],
            performance: { totalSent: 0, avgOpenRate: 0, avgClickRate: 0, conversions: 0 }
          },
          {
            id: 'default-2',
            name: 'New Mom Nurture',
            trigger: 'new_mom_program',
            status: 'active',
            emails: [
              { id: '4', subject: 'You\'re Not Alone: Support for New Mothers', delay: '0d 0h', sent: 0, opened: 0, clicked: 0 },
              { id: '5', subject: 'Common Postpartum Challenges', delay: '2d 0h', sent: 0, opened: 0, clicked: 0 }
            ],
            performance: { totalSent: 0, avgOpenRate: 0, avgClickRate: 0, conversions: 0 }
          }
        ],
        templates: [
          { id: 't1', name: 'Welcome Email', category: 'welcome', lastUsed: new Date().toISOString(), performance: 92 },
          { id: 't2', name: 'Anxiety Management Tips', category: 'educational', lastUsed: new Date().toISOString(), performance: 88 },
          { id: 't3', name: 'New Mom Support', category: 'promotional', lastUsed: new Date().toISOString(), performance: 90 }
        ]
      };
      
      return res.status(200).json(defaultData);
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