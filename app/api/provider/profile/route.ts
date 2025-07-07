import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const profile = await request.json();

    const { error } = await supabase
      .from('therapist_profiles')
      .update(profile)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error updating provider profile:', error);
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      profile
    });
    
  } catch (error) {
    console.error('Error in provider profile API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update provider profile' },
      { status: 500 }
    );
  }
}