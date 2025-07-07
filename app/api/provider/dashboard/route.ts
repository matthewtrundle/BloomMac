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

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await supabase.rpc('get_provider_dashboard_data', {
      p_provider_id: session.user.id,
      p_start_date: startDate,
      p_end_date: endDate
    });

    if (error) {
      console.error('Error fetching provider dashboard data:', error);
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      ...data
    });
    
  } catch (error) {
    console.error('Error in provider dashboard API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch provider dashboard data' },
      { status: 500 }
    );
  }
}
