import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { supabase, applySetCookies } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's email
    const email = user.email;

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
      const response = NextResponse.json({
        isSubscribed: false,
        email: email,
        subscriptionSource: '',
        subscribedAt: ''
      });
      return applySetCookies(response);
    }

    if (error) {
      throw error;
    }

    const response = NextResponse.json({
      isSubscribed: subscriber.status === 'active',
      email: subscriber.email,
      subscriptionSource: subscriber.source || 'website',
      subscribedAt: subscriber.created_at
    });
    
    return applySetCookies(response);

  } catch (error) {
    console.error('Newsletter preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter preferences' },
      { status: 500 }
    );
  }
}