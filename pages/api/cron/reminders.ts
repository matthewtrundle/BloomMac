import { NextApiRequest, NextApiResponse } from 'next';
import { reminderCronJob } from '@/lib/reminder-system';

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
    console.log('Starting appointment reminder cron job...');
    
    const result = await reminderCronJob();
    
    if (result.success) {
      console.log('Reminder cron job completed successfully');
      return res.status(200).json({ 
        success: true, 
        message: 'Reminders sent successfully'
      });
    } else {
      console.error('Reminder cron job failed:', result.error);
      return res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error in reminder cron job:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}