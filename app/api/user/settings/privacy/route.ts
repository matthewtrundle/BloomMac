import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Privacy settings GET request');
    
    const { supabase, applySetCookies } = createSupabaseRouteHandlerClient(request);
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      console.log('❌ Unauthorized - no user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('👤 User authenticated:', user.id);

    // Get user's privacy settings from user_preferences
    const { data: preferences, error } = await supabase
      .from('user_preferences')
      .select('privacy_settings')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('❌ Database error:', error);
      throw error;
    }

    // Default privacy settings if none exist
    const defaultPrivacySettings = {
      share_data_research: false,
      profile_visibility: 'private', // private, friends, public
      analytics_enabled: true,
      contact_visibility: 'friends' // from existing data structure
    };

    const privacySettings = preferences?.privacy_settings || defaultPrivacySettings;

    console.log('✅ Privacy settings retrieved:', privacySettings);

    const response = NextResponse.json({
      success: true,
      privacy_settings: privacySettings
    });

    return applySetCookies(response);
  } catch (error) {
    console.error('❌ Privacy settings GET error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch privacy settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 Privacy settings PUT request');
    
    const { supabase, applySetCookies } = createSupabaseRouteHandlerClient(request);
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      console.log('❌ Unauthorized - no user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { privacy_settings } = body;

    console.log('📝 Incoming privacy settings:', privacy_settings);

    // Validate input
    if (!privacy_settings || typeof privacy_settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid privacy settings format' },
        { status: 400 }
      );
    }

    // Validate specific fields
    const validVisibilityOptions = ['private', 'friends', 'public'];
    if (privacy_settings.profile_visibility && 
        !validVisibilityOptions.includes(privacy_settings.profile_visibility)) {
      return NextResponse.json(
        { error: 'Invalid profile visibility option' },
        { status: 400 }
      );
    }

    if (privacy_settings.contact_visibility && 
        !validVisibilityOptions.includes(privacy_settings.contact_visibility)) {
      return NextResponse.json(
        { error: 'Invalid contact visibility option' },
        { status: 400 }
      );
    }

    // Update or insert privacy settings
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        privacy_settings: privacy_settings,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('❌ Database update error:', error);
      throw error;
    }

    console.log('✅ Privacy settings updated successfully');

    // Log the update for security tracking
    try {
      await supabase
        .from('user_activity_log')
        .insert({
          user_id: user.id,
          action: 'privacy_settings_updated',
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
          metadata: {
            changed_fields: Object.keys(privacy_settings)
          },
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      // Don't fail the request if logging fails
      console.error('Failed to log activity:', logError);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Privacy settings updated successfully'
    });

    return applySetCookies(response);
  } catch (error) {
    console.error('❌ Privacy settings PUT error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update privacy settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}