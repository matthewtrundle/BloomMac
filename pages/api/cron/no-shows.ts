import { NextApiRequest, NextApiResponse } from 'next';
import { noShowCronJob } from '@/lib/no-show-management';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Verify cron secret to prevent unauthorized access
  const cronSecret = req.headers['x-cron-secret'];
  if (cronSecret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Starting no-show processing cron job...');
    
    const result = await noShowCronJob();
    
    if (result.success) {
      console.log(`No-show cron job completed: ${result.processed} appointments processed`);
      return res.status(200).json({ 
        success: true, 
        processed: result.processed,
        total: result.total,
        message: 'No-show processing completed'
      });
    } else {
      console.error('No-show cron job failed:', result.error);
      return res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error in no-show cron job:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}