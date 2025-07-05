import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Unsubscribe user
    const { data, error } = await supabase
      .from('subscribers')
      .update({
        status: 'unsubscribed',
        updated_at: new Date().toISOString()
      })
      .eq('email', email.toLowerCase())
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
          email: email,
          unsubscribe_method: 'profile_settings'
        }
      });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
      isSubscribed: false
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
}