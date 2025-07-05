import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { supabase, applySetCookies } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email } = body;

    // Use authenticated user's email if not provided
    const unsubscribeEmail = email || user.email;

    if (!unsubscribeEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Verify the email matches the authenticated user
    if (unsubscribeEmail.toLowerCase() !== user.email?.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized to unsubscribe this email' }, { status: 403 });
    }

    // Unsubscribe user
    const { data, error } = await supabase
      .from('subscribers')
      .update({
        status: 'unsubscribed',
        updated_at: new Date().toISOString()
      })
      .eq('email', unsubscribeEmail.toLowerCase())
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Email not found in newsletter list' }, { status: 404 });
      }
      throw error;
    }

    // Track analytics
    await supabase
      .from('analytics_events')
      .insert({
        type: 'newsletter_unsubscribe',
        page: '/profile/settings',
        session_id: crypto.randomUUID(),
        data: {
          email: unsubscribeEmail,
          unsubscribe_method: 'profile_settings'
        }
      });

    const response = NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
      isSubscribed: false
    });
    
    return applySetCookies(response);

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
}