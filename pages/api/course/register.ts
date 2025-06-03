import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  postpartumDate?: string;
  numberOfChildren?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  hipaaConsent: boolean;
  termsAccepted: boolean;
  marketingConsent: boolean;
  courseId: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const registrationData: RegistrationData = req.body;

    // Validate required fields
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      hipaaConsent, 
      termsAccepted,
      courseId 
    } = registrationData;

    if (!firstName || !lastName || !email || !password || !hipaaConsent || !termsAccepted) {
      return res.status(400).json({ 
        error: 'Missing required fields. Please fill in all required information.' 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long.' 
      });
    }

    // Create user in Supabase Auth using signUp (respects auth settings)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          course_registration: true
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/course/email-verified`
      }
    });

    if (authError) {
      console.error('Supabase Auth Error:', {
        message: authError.message,
        code: authError.status,
        details: authError
      });
      
      // Handle specific error cases
      if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
        return res.status(400).json({ 
          error: 'An account with this email already exists. Please sign in or use a different email.' 
        });
      }
      
      if (authError.message.includes('Signups not allowed')) {
        return res.status(400).json({ 
          error: 'Account registration is currently disabled. Please contact support.' 
        });
      }
      
      return res.status(400).json({ 
        error: `Registration failed: ${authError.message}`,
        debug: process.env.NODE_ENV === 'development' ? authError : undefined
      });
    }

    if (!authData.user) {
      return res.status(500).json({ 
        error: 'Account creation failed. Please try again.' 
      });
    }

    // Create user profile in our custom table
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        phone: registrationData.phone || null,
        role: 'student',
        enrollment_status: 'pending',
        postpartum_date: registrationData.postpartumDate || null,
        number_of_children: registrationData.numberOfChildren ? parseInt(registrationData.numberOfChildren) : null,
        emergency_contact_name: registrationData.emergencyContactName || null,
        emergency_contact_phone: registrationData.emergencyContactPhone || null,
        hipaa_consent: hipaaConsent,
        hipaa_consent_date: new Date().toISOString(),
        marketing_consent: registrationData.marketingConsent,
        terms_accepted: termsAccepted,
        terms_accepted_date: new Date().toISOString(),
        email_verified: false,
        account_status: 'active',
        timezone: 'America/Chicago'
      });

    if (profileError) {
      console.error('Profile Creation Error:', profileError);
      
      // Note: With signUp(), we can't easily clean up the auth user, but that's ok
      // The user will need to verify email anyway
      
      return res.status(500).json({ 
        error: 'Failed to complete registration. Please try again.' 
      });
    }

    // Record consent history
    const consentRecords = [
      {
        user_id: authData.user.id,
        consent_type: 'hipaa',
        agreed: hipaaConsent,
        consent_date: new Date().toISOString(),
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        consent_version: '1.0'
      },
      {
        user_id: authData.user.id,
        consent_type: 'terms',
        agreed: termsAccepted,
        consent_date: new Date().toISOString(),
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        consent_version: '1.0'
      },
      {
        user_id: authData.user.id,
        consent_type: 'marketing',
        agreed: registrationData.marketingConsent,
        consent_date: new Date().toISOString(),
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        consent_version: '1.0'
      }
    ];

    const { error: consentError } = await supabase
      .from('user_consents')
      .insert(consentRecords);

    if (consentError) {
      console.error('Consent Recording Error:', consentError);
      // Don't fail registration for consent recording issues, just log
    }

    // Create course enrollment if courseId is provided
    if (courseId) {
      // First, check if course exists (assuming you have a courses table)
      const { data: courseData } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', courseId)
        .single();

      if (courseData) {
        const { error: enrollmentError } = await supabase
          .from('course_enrollments')
          .insert({
            user_id: authData.user.id,
            course_id: courseData.id,
            enrollment_date: new Date().toISOString(),
            enrollment_method: 'online',
            payment_status: 'pending', // Will be updated when payment is processed
            completion_status: 'not_started'
          });

        if (enrollmentError) {
          console.error('Enrollment Error:', enrollmentError);
          // Don't fail registration, but log the error
        }
      }
    }

    // Email verification is automatically handled by signUp() above
    // No need for additional email generation

    // Log user activity
    const { error: activityError } = await supabase
      .from('user_activity_log')
      .insert({
        user_id: authData.user.id,
        action: 'account_created',
        resource_type: 'user_profile',
        resource_id: authData.user.id,
        metadata: {
          registration_method: 'course_signup',
          course_id: courseId,
          consent_given: {
            hipaa: hipaaConsent,
            terms: termsAccepted,
            marketing: registrationData.marketingConsent
          }
        },
        timestamp: new Date().toISOString()
      });

    if (activityError) {
      console.error('Activity Logging Error:', activityError);
      // Don't fail registration for logging issues
    }

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      userId: authData.user.id,
      email: email,
      requiresVerification: true
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ 
      error: 'An unexpected error occurred during registration. Please try again.' 
    });
  }
}