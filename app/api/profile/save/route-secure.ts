import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser } from '@/lib/supabase-server';
import { z } from 'zod';

// Input validation schema
const profileSchema = z.object({
  first_name: z.string().min(1).max(50).transform(s => s.trim()),
  last_name: z.string().min(1).max(50).transform(s => s.trim()),
  phone: z.string().regex(/^[\+]?[\d\s\-\(\)]+$/).max(20).nullable().optional(),
  postpartum_date: z.string().nullable().optional(),
  baby_due_date: z.string().nullable().optional(),
  number_of_children: z.number().int().min(0).max(20).default(0),
  emergency_contact_name: z.string().max(100).nullable().optional(),
  emergency_contact_phone: z.string().max(20).nullable().optional(),
  emergency_contact_relationship: z.string().max(50).nullable().optional(),
  timezone: z.string().max(50).default('America/Chicago')
}).refine((data) => {
  // If any emergency contact field is provided, all are required
  const hasAnyEmergencyField = data.emergency_contact_name || 
                               data.emergency_contact_phone || 
                               data.emergency_contact_relationship;
  
  if (hasAnyEmergencyField) {
    return data.emergency_contact_name && 
           data.emergency_contact_phone && 
           data.emergency_contact_relationship;
  }
  return true;
}, {
  message: "All emergency contact fields are required when adding an emergency contact"
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API - Profile save endpoint called');
    
    // Create authenticated Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      console.error('API - No authenticated user');
      return NextResponse.json(
        { 
          error: 'Session expired',
          code: 'AUTH_REQUIRED'
        },
        { status: 401 }
      );
    }

    console.log('✅ Authenticated user:', user.id);

    // Parse and validate request body
    const body = await request.json();
    
    let validatedData;
    try {
      validatedData = profileSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errors = validationError.errors.map(e => 
          `${e.path.join('.')}: ${e.message}`
        );
        
        console.log('❌ API - Validation failed:', errors);
        return NextResponse.json(
          { 
            error: 'Please fix the following issues:\n• ' + errors.join('\n• '),
            code: 'VALIDATION_ERROR',
            validationErrors: validationError.errors
          },
          { status: 400 }
        );
      }
      throw validationError;
    }
    
    // Prepare profile data
    const profileData = {
      id: user.id,
      first_name: validatedData.first_name,
      last_name: validatedData.last_name,
      phone: validatedData.phone || null,
      postpartum_date: validatedData.postpartum_date || null,
      baby_due_date: validatedData.baby_due_date || null,
      number_of_children: validatedData.number_of_children,
      emergency_contact_name: validatedData.emergency_contact_name || null,
      emergency_contact_phone: validatedData.emergency_contact_phone || null,
      emergency_contact_relationship: validatedData.emergency_contact_relationship || null,
      timezone: validatedData.timezone,
      updated_at: new Date().toISOString()
    };
    
    console.log('💾 Saving profile data for user:', user.id);

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    let result;
    
    if (existingProfile) {
      // Update existing profile
      const { id, ...updateData } = profileData;
      result = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id)
        .select();
    } else {
      // Insert new profile
      result = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select();
    }

    if (result.error) {
      console.error('Profile save error:', {
        message: result.error.message,
        code: result.error.code,
        details: result.error.details
      });
      
      let userMessage = 'Failed to save profile';
      
      if (result.error.code === '23505') {
        userMessage = 'Profile already exists and could not be updated';
      } else if (result.error.code === '42P01') {
        userMessage = 'Database table not found - please contact support';
      } else if (result.error.code === '42703') {
        userMessage = 'Invalid data format - please check your entries';
      } else if (result.error.message?.includes('violates not-null constraint')) {
        const match = result.error.message.match(/column "(\w+)"/);
        const fieldName = match ? match[1] : 'unknown';
        userMessage = `Required field missing: ${fieldName.replace(/_/g, ' ')}`;
      }
      
      return NextResponse.json(
        { 
          error: userMessage,
          details: result.error.message,
          code: result.error.code
        },
        { status: 400 }
      );
    }

    console.log('✅ Profile saved successfully');

    // Log activity
    try {
      await supabase
        .from('analytics_events')
        .insert({
          type: 'profile_update',
          page: '/dashboard/settings',
          session_id: crypto.randomUUID(),
          user_id: user.id,
          data: {
            has_phone: !!profileData.phone,
            has_emergency_contact: !!profileData.emergency_contact_name,
            has_postpartum_date: !!profileData.postpartum_date,
            has_baby_due_date: !!profileData.baby_due_date
          }
        });
    } catch (analyticsError) {
      console.error('Analytics tracking failed:', analyticsError);
    }
    
    return NextResponse.json({ 
      success: true, 
      data: result.data,
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

// SQL needed:
/*
-- Ensure user can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure user can insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Ensure user can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);
*/