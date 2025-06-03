import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists and is not already verified
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error fetching users:', userError);
      return res.status(500).json({ error: 'Unable to verify email address' });
    }

    const user = userData.users.find(u => u.email === email);
    
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    if (user.email_confirmed_at) {
      return res.status(400).json({ error: 'Email is already verified. You can sign in to your account.' });
    }

    // Generate new verification link
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/course/email-verified`
      }
    });

    if (error) {
      console.error('Error generating verification link:', error);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    // Log the activity
    await supabase
      .from('user_activity_log')
      .insert({
        user_id: user.id,
        action: 'verification_email_resent',
        resource_type: 'user_profile',
        resource_id: user.id,
        metadata: {
          email: email,
          ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        },
        timestamp: new Date().toISOString()
      });

    return res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({ 
      error: 'An unexpected error occurred. Please try again.' 
    });
  }
}