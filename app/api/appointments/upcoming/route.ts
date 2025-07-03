import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get upcoming appointments for the user
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('appointment_date', new Date().toISOString())
      .order('appointment_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching appointments:', error);
      
      // Return empty array if table doesn't exist
      if (error.code === '42P01') {
        return NextResponse.json({
          success: true,
          appointments: []
        });
      }
      
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      appointments: appointments || []
    });
    
  } catch (error) {
    console.error('Error in appointments API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}