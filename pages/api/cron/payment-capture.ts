import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { captureAppointmentPayment } from '@/lib/payment-management';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    console.log('Starting payment capture cron job...');
    
    // Find appointments that need payment capture (24 hours before appointment)
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + (24 * 60 * 60 * 1000));
    
    const { data: appointments, error } = await supabase
      .from('appointment_data')
      .select('id, appointment_date, status, payment_status')
      .eq('status', 'scheduled')
      .eq('payment_status', 'authorized')
      .gte('appointment_date', new Date(twentyFourHoursFromNow.getTime() - 30 * 60 * 1000).toISOString()) // 30 min window
      .lte('appointment_date', new Date(twentyFourHoursFromNow.getTime() + 30 * 60 * 1000).toISOString());

    if (error) {
      console.error('Error fetching appointments for payment capture:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    if (!appointments || appointments.length === 0) {
      console.log('No payments to capture');
      return res.status(200).json({ 
        success: true, 
        processed: 0,
        message: 'No payments to capture'
      });
    }

    console.log(`Processing ${appointments.length} payment captures`);

    let successful = 0;
    let failed = 0;
    const results = [];

    for (const appointment of appointments) {
      try {
        const result = await captureAppointmentPayment(appointment.id);
        
        if (result.success) {
          successful++;
          console.log(`Payment captured for appointment ${appointment.id}`);
          
          // Update appointment payment status
          await supabase
            .from('appointment_data')
            .update({ payment_status: 'paid' })
            .eq('id', appointment.id);
            
          results.push({
            appointmentId: appointment.id,
            status: 'captured'
          });
        } else {
          failed++;
          console.error(`Failed to capture payment for appointment ${appointment.id}:`, result.error);
          results.push({
            appointmentId: appointment.id,
            status: 'failed',
            error: result.error
          });
        }
      } catch (error) {
        failed++;
        console.error(`Error processing payment capture for appointment ${appointment.id}:`, error);
        results.push({
          appointmentId: appointment.id,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log(`Payment capture completed: ${successful} successful, ${failed} failed`);

    return res.status(200).json({
      success: true,
      processed: successful + failed,
      successful,
      failed,
      results,
      message: 'Payment capture processing completed'
    });

  } catch (error) {
    console.error('Error in payment capture cron job:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}