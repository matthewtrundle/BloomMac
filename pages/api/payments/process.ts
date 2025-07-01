import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { 
  captureAppointmentPayment, 
  chargeNoShowFee, 
  refundAppointmentPayment 
} from '@/lib/payment-management';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient({ req, res });

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { action, appointmentId, amount } = req.body;

  if (!action || !appointmentId) {
    return res.status(400).json({ 
      error: 'Action and appointment ID are required' 
    });
  }

  try {
    let result;

    switch (action) {
      case 'capture':
        result = await captureAppointmentPayment(appointmentId);
        break;
      
      case 'no-show-fee':
        result = await chargeNoShowFee(appointmentId, amount);
        break;
      
      case 'refund':
        result = await refundAppointmentPayment(appointmentId, amount);
        break;
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ 
      error: 'Failed to process payment' 
    });
  }
}