import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request: NextRequest) {
  try {
    console.log('Profile update endpoint called');
    
    // Get the user from cookies
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    console.log('Update request for user:', user.id);
    console.log('Profile data:', body);
    
    // Create admin client for database operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Remove fields that might cause issues
    const { id, email, created_at, ...updateData } = body;
    
    // Ensure we're updating the correct user
    const profileData = {
      ...updateData,
      id: user.id,
      updated_at: new Date().toISOString()
    };
    
    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    
    let result;
    
    if (existingProfile) {
      // Update existing profile
      console.log('Updating existing profile');
      result = await supabaseAdmin
        .from('user_profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
    } else {
      // Insert new profile
      console.log('Creating new profile');
      result = await supabaseAdmin
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();
    }
    
    if (result.error) {
      console.error('Database error:', result.error);
      return NextResponse.json(
        { 
          error: 'Failed to update profile',
          details: result.error.message,
          code: result.error.code
        },
        { status: 400 }
      );
    }
    
    console.log('Profile updated successfully:', result.data);
    
    return NextResponse.json({
      success: true,
      profile: result.data
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}