import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Test endpoint - REMOVE IN PRODUCTION
export async function GET() {
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_TEST_ENDPOINTS) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Check user_profiles table structure
    const { data: columns } = await supabase
      .rpc('get_table_columns', { table_name: 'user_profiles' });

    const hasRoleColumn = columns?.some((col: any) => col.column_name === 'role');
    const hasNoEmailColumn = !columns?.some((col: any) => col.column_name === 'email');

    return NextResponse.json({
      hasRoleColumn,
      hasNoEmailColumn,
      columns: columns?.map((col: any) => col.column_name)
    }, { status: 200 });

  } catch (error) {
    // Fallback method if RPC doesn't exist
    try {
      const { data, error: queryError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);

      if (!queryError && data) {
        const sampleRow = data[0] || {};
        const hasRoleColumn = 'role' in sampleRow;
        const hasNoEmailColumn = !('email' in sampleRow);

        return NextResponse.json({
          hasRoleColumn,
          hasNoEmailColumn,
          columns: Object.keys(sampleRow)
        }, { status: 200 });
      }
    } catch (fallbackError) {
      // Continue to error response
    }

    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}