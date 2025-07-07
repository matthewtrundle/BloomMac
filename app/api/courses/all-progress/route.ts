import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    
    const { data, error } = await supabase.rpc('get_all_courses_with_user_progress', { p_user_id: session?.user?.id });

    if (error) {
      console.error('Error fetching all courses progress:', error);
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      ...data
    });
    
  } catch (error) {
    console.error('Error fetching all courses progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses progress' },
      { status: 500 }
    );
  }
}
