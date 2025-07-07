import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Test endpoint - REMOVE IN PRODUCTION
export async function GET(request: NextRequest) {
  // Only allow in development/test environments
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_TEST_ENDPOINTS) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const trigger = searchParams.get('trigger');

  if (!email || !trigger) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Check if subscriber exists
    const { data: subscriber } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (!subscriber) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    // Check if enrollment exists
    const { data: enrollment } = await supabase
      .from('sequence_enrollments')
      .select('*')
      .eq('subscriber_id', subscriber.id)
      .single();

    return NextResponse.json({ 
      exists: !!enrollment,
      enrollment: enrollment || null
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}