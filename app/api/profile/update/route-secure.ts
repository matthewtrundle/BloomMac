import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser } from '@/lib/supabase-server';
import { z } from 'zod';

// Input validation schema
const profileUpdateSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  phone: z.string().regex(/^\+?[\d\s()-]+$/).optional().nullable(),
  postpartum_date: z.string().datetime().optional().nullable(),
  baby_due_date: z.string().datetime().optional().nullable(),
  number_of_children: z.number().int().min(0).max(20).optional().nullable(),
  emergency_contact_name: z.string().max(200).optional().nullable(),
  emergency_contact_phone: z.string().regex(/^\+?[\d\s()-]+$/).optional().nullable(),
  emergency_contact_relationship: z.string().max(100).optional().nullable(),
  timezone: z.string().max(50).optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    console.log('Profile update endpoint called');
    
    // Create authenticated Supabase client
    const { supabase, response } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    
    // Validate input
    let validatedData;
    try {
      validatedData = profileUpdateSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Invalid input',
            details: validationError.errors
          },
          { status: 400 }
        );
      }
      throw validationError;
    }
    
    // Ensure user can only update their own profile
    const profileData = {
      ...validatedData,
      id: user.id, // Force the ID to be the authenticated user's ID
      updated_at: new Date().toISOString()
    };
    
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    
    let result;
    
    if (checkError && checkError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      console.log('Creating new profile for user:', user.id);
      
      result = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();
    } else if (existingProfile) {
      // Update existing profile
      console.log('Updating existing profile for user:', user.id);
      
      const { id, ...updateData } = profileData;
      result = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();
    } else if (checkError) {
      // Unexpected error
      console.error('Error checking profile:', checkError);
      return NextResponse.json(
        { 
          error: 'Failed to check existing profile',
          details: checkError.message
        },
        { status: 500 }
      );
    }
    
    if (result?.error) {
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
    
    // Log successful update for audit trail
    await supabase
      .from('user_activity_log')
      .insert({
        user_id: user.id,
        action: 'profile_updated',
        resource_type: 'profile',
        resource_id: user.id,
        metadata: {
          updated_fields: Object.keys(validatedData),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        }
      });
    
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