import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient, createSupabaseRouteHandlerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    console.log('Profile update endpoint called');
    
    // Get the user from cookies
    const { supabase, applySetCookies } = createSupabaseRouteHandlerClient(request);
    
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
    const supabaseAdmin = createSupabaseServiceClient();
    
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
    
    // Check error only for unexpected errors (not "no rows" error)
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking profile:', checkError);
      return NextResponse.json(
        { 
          error: 'Failed to check existing profile',
          details: checkError.message
        },
        { status: 500 }
      );
    }
    
    let result;
    
    if (existingProfile) {
      // Update existing profile
      console.log('Updating existing profile');
      const { id, ...updateData } = profileData;
      result = await supabaseAdmin
        .from('user_profiles')
        .update(updateData)
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