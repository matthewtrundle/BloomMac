import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get user from session (you'll need to implement auth middleware)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, let's get email from query params (in production, get from auth)
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Check if user is subscribed
    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error && error.code === 'PGRST116') {
      // Not subscribed
      return NextResponse.json({
        isSubscribed: false,
        email: email,
        subscriptionSource: '',
        subscribedAt: ''
      });
    }

    if (error) {
      throw error;
    }

    return NextResponse.json({
      isSubscribed: subscriber.status === 'active',
      email: subscriber.email,
      subscriptionSource: subscriber.source || 'website',
      subscribedAt: subscriber.created_at
    });

  } catch (error) {
    console.error('Newsletter preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter preferences' },
      { status: 500 }
    );
  }
}