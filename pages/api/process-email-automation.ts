import { NextApiRequest, NextApiResponse } from 'next';
import { processScheduledEmails } from '../../lib/email-automation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // This endpoint is called by Vercel Cron
  
  // Vercel Cron uses GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // In production, Vercel adds a header to verify cron requests
  if (process.env.NODE_ENV === 'production') {
    const authHeader = req.headers['authorization'];
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      // Also check for Vercel's cron verification
      const vercelCron = req.headers['x-vercel-cron'];
      if (!vercelCron) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }
  }

  try {
    await processScheduledEmails();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Email automation processed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error processing email automation:', error);
    return res.status(500).json({ 
      error: 'Failed to process email automation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}