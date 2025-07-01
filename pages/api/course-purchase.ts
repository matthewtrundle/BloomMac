import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/email-automation';

const courseData: Record<string, any> = {
  'postpartum-wellness-foundations': {
    id: 'postpartum-wellness-foundations',
    title: 'Postpartum Wellness Foundations',
    price: 197,
    originalPrice: 297,
  },
  'anxiety-management-new-moms': {
    id: 'anxiety-management-new-moms',
    title: 'Anxiety Management for New Moms',
    price: 127,
  },
  'partner-support-bootcamp': {
    id: 'partner-support-bootcamp',
    title: 'Partner Support Bootcamp',
    price: 97,
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { courseId, firstName, lastName, email, phone, paymentToken } = req.body;

    // Validate required fields
    if (!courseId || !firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate course exists
    const course = courseData[courseId];
    if (!course) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    // In production, process payment with Stripe here
    // const paymentResult = await stripe.paymentIntents.create({...});
    
    // Generate a temporary password for the user
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = tempPassword; // In production, use bcrypt to hash this
    
    // Create user account in courses table
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('course_enrollments')
      .insert([
        {
          course_id: courseId,
          user_email: email,
          user_first_name: firstName,
          user_last_name: lastName,
          user_phone: phone,
          enrolled_at: new Date().toISOString(),
          payment_status: 'completed',
          payment_amount: course.price,
          access_granted: true
        }
      ])
      .select()
      .single();

    if (enrollmentError) {
      console.error('Enrollment error:', enrollmentError);
      return res.status(500).json({ error: 'Failed to create enrollment' });
    }

    // Create user credentials
    const { data: userCreds, error: userError } = await supabase
      .from('course_users')
      .insert([
        {
          email: email,
          first_name: firstName,
          last_name: lastName,
          password_hash: passwordHash,
          temp_password: tempPassword,
          created_at: new Date().toISOString(),
          status: 'active'
        }
      ])
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      // Don't fail the entire purchase if user creation fails
    }

    // Send welcome email with login credentials (with deduplication)
    try {
      // Check if we've already sent a welcome email recently
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
      } else {
        // Send the email
        await sendEmail({
          to: email,
          subject: `Welcome to ${course.title} - Your Login Details`,
          template: 'course-welcome',
          data: {
            firstName,
            courseName: course.title,
            loginEmail: email,
            tempPassword: tempPassword,
            loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/my-courses`,
            supportEmail: 'jana@bloompsychology.com'
          }
        });
        
        // Log the email send
        await supabase
          .from('email_logs')
          .insert({
            recipient: email,
            type: 'welcome_course',
            status: 'sent',
            metadata: {
              course_id: courseId,
              course_name: course.title,
              enrollment_id: enrollment.id
            }
          });
      }
    } catch (emailError) {
      console.error('Email send error:', emailError);
      
      // Log failed email
      await supabase
        .from('email_logs')
        .insert({
          recipient: email,
          type: 'welcome_course',
          status: 'failed',
          error: emailError instanceof Error ? emailError.message : 'Unknown error',
          metadata: {
            course_id: courseId,
            course_name: course.title
          }
        });
      
      // Don't fail the purchase if email fails
    }

    // Log the purchase
    const { error: logError } = await supabase
      .from('analytics_events')
      .insert([
        {
          event_type: 'course_purchase',
          event_data: {
            course_id: courseId,
            course_title: course.title,
            user_email: email,
            amount: course.price,
            timestamp: new Date().toISOString()
          },
          user_agent: req.headers['user-agent'] || null,
          ip_address: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                     req.connection.remoteAddress || null,
          created_at: new Date().toISOString()
        }
      ]);

    if (logError) {
      console.error('Analytics log error:', logError);
    }

    res.status(200).json({
      success: true,
      enrollmentId: enrollment.id,
      loginUrl: '/my-courses',
      tempPassword: tempPassword // In production, don't return this
    });

  } catch (error) {
    console.error('Course purchase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}