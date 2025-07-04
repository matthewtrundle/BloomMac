import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Create authenticated Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's profile to get their email
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.email) {
      return NextResponse.json({
        isSubscribed: false,
        email: user.email || '',
        preferences: {
          frequency: 'monthly',
          topics: []
        },
        subscribedAt: null
      });
    }

    // Check if user is subscribed to newsletter
    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', profile.email.toLowerCase())
      .single();

    if (error && error.code === 'PGRST116') {
      // Not subscribed
      return NextResponse.json({
        isSubscribed: false,
        email: profile.email,
        preferences: {
          frequency: 'monthly',
          topics: []
        },
        subscribedAt: null
      });
    }

    if (error) {
      console.error('Error fetching subscriber:', error);
      throw error;
    }

    // Return subscription preferences
    return NextResponse.json({
      isSubscribed: subscriber.status === 'active',
      email: subscriber.email,
      preferences: {
        frequency: subscriber.metadata?.frequency || 'monthly',
        topics: subscriber.interests || []
      },
      subscribedAt: subscriber.created_at,
      lastUpdated: subscriber.updated_at
    });

  } catch (error) {
    console.error('Newsletter preferences error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletter preferences' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Create authenticated Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { isSubscribed, preferences } = body;

    // Get user's email from profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('email, first_name, last_name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.email) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    if (isSubscribed) {
      // Subscribe or update subscription
      const subscriberData = {
        email: profile.email.toLowerCase(),
        first_name: profile.first_name,
        last_name: profile.last_name,
        status: 'active',
        interests: preferences?.topics || [],
        metadata: {
          ...preferences,
          user_id: user.id,
          updated_via: 'preferences_page'
        },
        updated_at: new Date().toISOString()
      };

      const { error: upsertError } = await supabase
        .from('subscribers')
        .upsert(subscriberData, {
          onConflict: 'email'
        });

      if (upsertError) {
        console.error('Error updating subscription:', upsertError);
        throw upsertError;
      }

      // Log activity
      await supabase
        .from('analytics_events')
        .insert({
          type: 'newsletter_preferences_updated',
          page: '/account/preferences',
          session_id: crypto.randomUUID(),
          user_id: user.id,
          data: {
            action: 'subscribe',
            topics: preferences?.topics || []
          }
        });

      return NextResponse.json({
        success: true,
        message: 'Newsletter preferences updated successfully'
      });
      
    } else {
      // Unsubscribe
      const { error: unsubscribeError } = await supabase
        .from('subscribers')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', profile.email.toLowerCase());

      if (unsubscribeError) {
        console.error('Error unsubscribing:', unsubscribeError);
        throw unsubscribeError;
      }

      // Log activity
      await supabase
        .from('analytics_events')
        .insert({
          type: 'newsletter_unsubscribe',
          page: '/account/preferences',
          session_id: crypto.randomUUID(),
          user_id: user.id,
          data: {
            action: 'unsubscribe',
            source: 'preferences_page'
          }
        });

      return NextResponse.json({
        success: true,
        message: 'Successfully unsubscribed from newsletter'
      });
    }

  } catch (error) {
    console.error('Newsletter preferences update error:', error);
    return NextResponse.json(
      { error: 'Failed to update newsletter preferences' },
      { status: 500 }
    );
  }
}