import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // TODO: Implement get_user_workbook_status function in database
    // For now, return empty data to prevent 500 errors
    console.log('get_user_workbook_status function not yet implemented');
    
    return NextResponse.json({
      success: true,
      courses: []
    });
    
  } catch (error) {
    console.error('Error fetching enrolled workbooks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch workbook status' },
      { status: 500 }
    );
  }
}
