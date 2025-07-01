import { NextApiRequest, NextApiResponse } from 'next';
import { sendWelcomeEmail } from '@/lib/email/auth-emails';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, customerName, courseName, userId } = req.body;

  if (!email || !courseName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check for duplicate email first
    const { data: recentEmail } = await supabase
      .from('email_logs')
      .select('id')
      .eq('recipient', email)
      .eq('type', 'welcome_course')
      .eq('status', 'sent')
      .gte('created_at', new Date(Date.now() - 60*60*1000).toISOString()) // Within last hour
      .single();
    
    if (recentEmail) {
      console.log(`Welcome email already sent to ${email} in the last hour, skipping duplicate`);
      return res.status(200).json({ 
        success: true,
        message: 'Welcome email already sent recently',
        duplicate: true
      });
    }

    // Generate magic link for the user
    const { data: { properties }, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/my-courses`
      }
    });

    if (error || !properties?.action_link) {
      throw new Error('Failed to generate magic link');
    }

    // Send welcome email with magic link
    await sendWelcomeEmail(
      email,
      customerName || '',
      courseName,
      properties.action_link
    );

    // Log email sent
    await supabase
      .from('email_logs')
      .insert({
        recipient: email,
        type: 'welcome_course',
        status: 'sent',
        metadata: {
          course_name: courseName,
          customer_name: customerName,
          user_id: userId
        }
      });

    return res.status(200).json({ 
      success: true,
      message: 'Welcome email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending welcome email:', error);
    
    // Log failed email
    await supabase
      .from('email_logs')
      .insert({
        recipient: email,
        type: 'welcome_course',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          course_name: courseName,
          customer_name: customerName,
          user_id: userId
        }
      });

    return res.status(500).json({ 
      error: 'Failed to send welcome email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}