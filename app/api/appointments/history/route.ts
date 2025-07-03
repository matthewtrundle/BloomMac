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
    
    // Get appointment history for the user
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', session.user.id)
      .lt('appointment_date', new Date().toISOString())
      .order('appointment_date', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching appointment history:', error);
      
      // Return empty array if table doesn't exist
      if (error.code === '42P01') {
        return NextResponse.json({
          success: true,
          appointments: []
        });
      }
      
      throw error;
    }
    
    // Calculate some stats
    const stats = {
      totalAppointments: appointments?.length || 0,
      completedAppointments: appointments?.filter(a => a.status === 'completed').length || 0,
      cancelledAppointments: appointments?.filter(a => a.status === 'cancelled').length || 0,
      lastAppointment: appointments?.[0]?.appointment_date || null
    };
    
    return NextResponse.json({
      success: true,
      appointments: appointments || [],
      stats
    });
    
  } catch (error) {
    console.error('Error in appointment history API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointment history' },
      { status: 500 }
    );
  }
}