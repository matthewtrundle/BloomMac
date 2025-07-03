import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API - Profile save endpoint called');
    
    // Parse request body
    const body = await request.json();
    console.log('📝 API - Incoming profile data:', {
      ...body,
      fields_present: Object.keys(body).filter(key => body[key] !== null && body[key] !== undefined)
    });
    
    // Get authentication
    let user = null;
    let authError = null;
    
    // First try with Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
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
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      const { data: { user: cookieUser }, error: cookieError } = await supabase.auth.getUser();
      
      if (cookieUser && !cookieError) {
        user = cookieUser;
        console.log('✅ Auth successful via cookies');
      } else {
        console.log('❌ Cookie auth failed:', cookieError?.message);
        authError = cookieError;
      }
    }

    if (!user) {
      console.error('API - Auth error:', authError);
      return NextResponse.json(
        { 
          error: 'Session expired',
          details: authError?.message || 'Auth session missing!',
          code: 'AUTH_REQUIRED'
        },
        { status: 401 }
      );
    }

    // Validate required fields
    const { first_name, last_name } = body;
    const validationErrors: string[] = [];
    
    if (!first_name?.trim()) {
      validationErrors.push('First name is required');
    }
    
    if (!last_name?.trim()) {
      validationErrors.push('Last name is required');
    }
    
    // Validate phone if provided
    if (body.phone && !/^[\+]?[\d\s\-\(\)]+$/.test(body.phone)) {
      validationErrors.push('Invalid phone number format');
    }
    
    // Validate emergency contact fields if any are provided
    const hasEmergencyContact = body.emergency_contact_name || 
                               body.emergency_contact_phone || 
                               body.emergency_contact_relationship;
    if (hasEmergencyContact) {
      if (!body.emergency_contact_name?.trim()) {
        validationErrors.push('Emergency contact name is required when adding emergency contact');
      }
      if (!body.emergency_contact_phone?.trim()) {
        validationErrors.push('Emergency contact phone is required when adding emergency contact');
      }
      if (!body.emergency_contact_relationship?.trim()) {
        validationErrors.push('Emergency contact relationship is required when adding emergency contact');
      }
    }
    
    if (validationErrors.length > 0) {
      console.log('❌ API - Validation failed:', validationErrors);
      return NextResponse.json(
        { 
          error: 'Please fix the following issues:\n• ' + validationErrors.join('\n• '),
          code: 'VALIDATION_ERROR',
          validationErrors
        },
        { status: 400 }
      );
    }
    
    // Use service role client to bypass RLS
    const supabaseService = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Prepare profile data
    const profileData = {
      id: user.id,
      first_name: body.first_name.trim(),
      last_name: body.last_name.trim(),
      phone: body.phone?.trim() || null,
      postpartum_date: body.postpartum_date || null,
      baby_due_date: body.baby_due_date || null,
      number_of_children: body.number_of_children || 0,
      emergency_contact_name: body.emergency_contact_name?.trim() || null,
      emergency_contact_phone: body.emergency_contact_phone?.trim() || null,
      emergency_contact_relationship: body.emergency_contact_relationship?.trim() || null,
      timezone: body.timezone || 'America/Chicago',
      updated_at: new Date().toISOString()
    };
    
    console.log('💾 Saving profile data:', profileData);

    // Upsert the profile
    const { data, error } = await supabaseService
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'id' })
      .select();

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
        const match = error.message.match(/column "(\w+)"/);
        const fieldName = match ? match[1] : 'unknown';
        userMessage = `Required field missing: ${fieldName.replace(/_/g, ' ')}`;
      }
      
      return NextResponse.json(
        { 
          error: userMessage,
          details: error.message,
          code: error.code
        },
        { status: 400 }
      );
    }

    console.log('✅ Profile saved successfully:', data);
    
    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Profile updated successfully!'
    });
    
  } catch (error: any) {
    console.error('API critical error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { 
        error: 'Something unexpected happened',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}