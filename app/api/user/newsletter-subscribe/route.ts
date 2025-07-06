import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabaseAdmin
      .from('subscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          { error: 'This email address is already subscribed to our newsletter.' },
          { status: 409 }
        );
      } else {
        // Reactivate unsubscribed user
        const { data: reactivated, error: reactivateError } = await supabaseAdmin
          .from('subscribers')
          .update({ 
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscriber.id)
          .select()
          .single();
        
        if (reactivateError) {
          throw reactivateError;
        }
        
        return NextResponse.json({
          success: true,
          message: 'Welcome back! You\'ve been resubscribed to our newsletter.',
          isSubscribed: true
        });
      }
    }

    // Create new subscriber
    const { data: subscriber, error: insertError } = await supabaseAdmin
      .from('subscribers')
      .insert({
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        status: 'active',
        signup_source: 'profile_settings',
        confirmed: true
      })
      .select()
      .single();
    
    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      isSubscribed: true
    });

  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    
    // Always return valid JSON
    return NextResponse.json(
      { 
        error: 'Failed to subscribe to newsletter',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}