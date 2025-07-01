import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Subscribe or reactivate user
    const { data, error } = await supabase
      .from('subscribers')
      .upsert({
        email: email.toLowerCase(),
        first_name: firstName || '',
        last_name: lastName || '',
        status: 'active',
        source: 'profile_settings',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Track analytics
    await supabase
      .from('analytics_events')
      .insert({
        type: 'newsletter_subscribe',
        page: '/profile/settings',
        session_id: crypto.randomUUID(),
        data: {
          email: email,
          subscription_method: 'profile_settings',
          reactivation: data.created_at !== data.updated_at
        }
      });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      isSubscribed: true
    });

  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}