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
      cookie: req.headers.cookie ? 'Present' : 'Missing'
    });
    
    // Get the authenticated user
    const supabaseAuth = createServerSupabaseClient({ req, res });
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

    console.log('🔍 API - Auth check:', { 
      hasUser: !!user, 
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

    // Validate required fields
    const { first_name, last_name } = req.body;
    
    if (!first_name?.trim()) {
      return res.status(400).json({ 
        error: 'First name is required',
        code: 'MISSING_FIRST_NAME'
      });
    }
    
    if (!last_name?.trim()) {
      return res.status(400).json({ 
        error: 'Last name is required',
        code: 'MISSING_LAST_NAME'
      });
    }
    
    // Validate phone if provided
    if (req.body.phone && !/^[\+]?[\d\s\-\(\)]+$/.test(req.body.phone)) {
      return res.status(400).json({ 
        error: 'Invalid phone number format',
        code: 'INVALID_PHONE'
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