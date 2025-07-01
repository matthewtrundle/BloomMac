import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createAppointmentPaymentIntent } from '@/lib/payment-management';

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

  const { appointmentId, amount, description } = req.body;

  if (!appointmentId || !amount) {
    return res.status(400).json({ 
      error: 'Appointment ID and amount are required' 
    });
  }

  try {
    // Verify the appointment belongs to the user
    const { data: appointment, error: aptError } = await supabase
      .from('appointment_data')
      .select('id, user_id, appointment_type')
      .eq('id', appointmentId)
      .eq('user_id', session.user.id)
      .single();

    if (aptError || !appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Create payment intent
    const result = await createAppointmentPaymentIntent(
      session.user.id,
      appointmentId,
      amount,
      description || `${appointment.appointment_type} appointment`
    );

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json({
      clientSecret: result.clientSecret,
      appointmentId
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({ 
      error: 'Failed to create payment intent' 
    });
  }
}