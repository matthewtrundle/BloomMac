import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Get user info from headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const supabase = createSupabaseServiceClient();

    // Fetch all course data using the new database function
    const { data, error } = await supabase.rpc('get_courses_with_details');

    if (error) {
      console.error('Error fetching courses with details:', error);
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Course API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

