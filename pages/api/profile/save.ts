import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 API - Checking authentication...');
    console.log('🔍 Headers:', {
      authorization: req.headers.authorization ? 'Present' : 'Missing',
      cookie: req.headers.cookie ? 'Present' : 'Missing',
      userAgent: req.headers['user-agent']?.includes('Chrome') ? 'Chrome' : 'Other'
    });
    
    let user = null;
    let authError = null;
    
    // First try with Authorization header (better for incognito)
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      console.log('🔍 Trying Authorization header...');
      
      const supabaseService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      const { data: { user: tokenUser }, error: tokenError } = await supabaseService.auth.getUser(token);
      
      if (tokenUser && !tokenError) {
        user = tokenUser;
        console.log('✅ Auth successful via Authorization header');
      } else {
        console.log('❌ Authorization header auth failed:', tokenError?.message);
        authError = tokenError;
      }
    }
    
    // Fallback to cookie-based auth
    if (!user) {
      console.log('🔍 Trying cookie-based auth...');
      const supabaseAuth = createServerSupabaseClient({ req, res });
      const result = await supabaseAuth.auth.getUser();
      user = result.data.user;
      authError = result.error;
      
      if (user) {
        console.log('✅ Auth successful via cookies');
      } else {
        console.log('❌ Cookie auth failed:', authError?.message);
      }
    }

    console.log('🔍 API - Final auth result:', { 
      hasUser: !!user, 
      authMethod: req.headers.authorization ? 'token' : 'cookie',
      authError: authError?.message, 
      userId: user?.id,
      userEmail: user?.email 
    });

    if (authError || !user) {
      console.error('API - Auth error:', authError);
      return res.status(401).json({ 
        error: 'Session expired',
        details: authError?.message || 'Auth session missing!',
        code: 'AUTH_REQUIRED'
      });
    }

    // Use service role client to bypass RLS
    const supabaseService = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Log incoming request data for debugging
    console.log('📝 API - Incoming profile data:', {
      ...req.body,
      // Show which fields are present
      fields_present: Object.keys(req.body).filter(key => req.body[key] !== null && req.body[key] !== undefined)
    });
    
    // Validate required fields
    const { first_name, last_name } = req.body;
    const validationErrors: string[] = [];
    
    if (!first_name?.trim()) {
      validationErrors.push('First name is required');
    }
    
    if (!last_name?.trim()) {
      validationErrors.push('Last name is required');
    }
    
    // Validate phone if provided
    if (req.body.phone && !/^[\+]?[\d\s\-\(\)]+$/.test(req.body.phone)) {
      validationErrors.push('Invalid phone number format (e.g., (555) 123-4567)');
    }
    
    // Validate emergency contact fields if any are provided
    const hasEmergencyContact = req.body.emergency_contact_name || req.body.emergency_contact_phone || req.body.emergency_contact_relationship;
    if (hasEmergencyContact) {
      if (!req.body.emergency_contact_name?.trim()) {
        validationErrors.push('Emergency contact name is required when adding emergency contact');
      }
      if (!req.body.emergency_contact_phone?.trim()) {
        validationErrors.push('Emergency contact phone is required when adding emergency contact');
      }
      if (!req.body.emergency_contact_relationship?.trim()) {
        validationErrors.push('Emergency contact relationship is required when adding emergency contact');
      }
    }
    
    if (validationErrors.length > 0) {
      console.log('❌ API - Validation failed:', validationErrors);
      return res.status(400).json({ 
        error: 'Please fix the following issues:\n• ' + validationErrors.join('\n• '),
        code: 'VALIDATION_ERROR',
        validationErrors,
        fields: {
          first_name: !first_name?.trim() ? 'Required' : 'Valid',
          last_name: !last_name?.trim() ? 'Required' : 'Valid',
          phone: req.body.phone && !/^[\+]?[\d\s\-\(\)]+$/.test(req.body.phone) ? 'Invalid format' : 'Valid',
          emergency_contact: hasEmergencyContact ? {
            name: !req.body.emergency_contact_name?.trim() ? 'Required' : 'Valid',
            phone: !req.body.emergency_contact_phone?.trim() ? 'Required' : 'Valid',
            relationship: !req.body.emergency_contact_relationship?.trim() ? 'Required' : 'Valid'
          } : 'Not provided'
        }
      });
    }
    
    const profileData = {
      ...req.body,
      id: user.id, // Ensure the ID matches the authenticated user
      updated_at: new Date().toISOString()
    };
    
    console.log('Validated profile data:', profileData);

    // Upsert the profile
    const { data, error } = await supabaseService
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'id' });

    if (error) {
      console.error('Profile save error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      let userMessage = 'Failed to save profile';
      
      if (error.code === '23505') {
        userMessage = 'Profile already exists and could not be updated';
      } else if (error.code === '42P01') {
        userMessage = 'Database table not found - please contact support';
      } else if (error.code === '42703') {
        userMessage = 'Invalid data format - please check your entries';
      } else if (error.message?.includes('violates not-null constraint')) {
        // Parse which field is causing the issue
        const match = error.message.match(/column "(\w+)"/);
        const fieldName = match ? match[1] : 'unknown';
        userMessage = `Required field missing: ${fieldName.replace(/_/g, ' ')}`;
        console.log('🔍 Not-null constraint violation:', { fieldName, fullError: error.message });
      } else if (error.message?.includes('violates')) {
        userMessage = 'Data validation failed - please check required fields';
      }
      
      return res.status(400).json({ 
        error: userMessage,
        details: error.message,
        code: error.code
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('API critical error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    let userMessage = 'Something unexpected happened';
    
    if (error.message?.includes('fetch')) {
      userMessage = 'Database connection failed - please try again';
    } else if (error.message?.includes('timeout')) {
      userMessage = 'Request timed out - please try again';
    } else if (error.message?.includes('network')) {
      userMessage = 'Network error - check your connection';
    }
    
    return res.status(500).json({ 
      error: userMessage,
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}