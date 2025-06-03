import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('Login error:', authError);
      
      if (authError.message.includes('Invalid login credentials')) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      if (authError.message.includes('Email not confirmed')) {
        return res.status(401).json({ 
          error: 'Please verify your email address before signing in',
          needsVerification: true 
        });
      }
      
      return res.status(400).json({ error: 'Unable to sign in. Please try again.' });
    }

    if (!authData.user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return res.status(500).json({ error: 'Unable to load user profile' });
    }

    // Check if user has active course enrollments
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('course_enrollments')
      .select(`
        *,
        courses (
          slug,
          title
        )
      `)
      .eq('user_id', authData.user.id)
      .eq('payment_status', 'paid');

    if (enrollmentError) {
      console.error('Enrollment fetch error:', enrollmentError);
      // Don't fail login for enrollment issues
    }

    // Log successful login
    await supabase
      .from('user_activity_log')
      .insert({
        user_id: authData.user.id,
        action: 'login',
        resource_type: 'authentication',
        metadata: {
          login_method: 'email_password',
          ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        },
        timestamp: new Date().toISOString()
      });

    // Update last login
    await supabase
      .from('user_profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', authData.user.id);

    return res.status(200).json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role: profile.role,
        enrolledCourses: enrollments?.map(e => e.courses?.slug) || []
      },
      session: authData.session
    });

  } catch (error) {
    console.error('Course login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}