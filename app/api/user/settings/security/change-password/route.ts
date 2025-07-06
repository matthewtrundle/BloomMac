import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser } from '@/lib/supabase-server';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Password change request received');
    
    // Rate limiting for security - 3 attempts per hour
    const identifier = 
      request.headers.get('x-forwarded-for') || 
      request.headers.get('x-real-ip') || 
      'anonymous';
      
    const rateLimitResult = await rateLimit(
      { interval: 60 * 60 * 1000, uniqueTokenPerInterval: 3 },
      identifier
    );

    if (!rateLimitResult.success) {
      console.log('❌ Rate limit exceeded for:', identifier);
      return NextResponse.json(
        { 
          error: 'Too many password change attempts. Please try again later.',
          retryAfter: rateLimitResult.reset
        },
        { status: 429 }
      );
    }

    const { supabase, applySetCookies } = createSupabaseRouteHandlerClient(request);
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      console.log('❌ Unauthorized - no user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('👤 User authenticated:', user.id);

    // Parse request body
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check for common weak patterns
    if (newPassword.toLowerCase() === 'password' || 
        newPassword === '12345678' || 
        newPassword === currentPassword) {
      return NextResponse.json(
        { error: 'Please choose a stronger password' },
        { status: 400 }
      );
    }

    // Verify current password by attempting to sign in
    console.log('🔍 Verifying current password...');
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });

    if (signInError) {
      console.log('❌ Current password verification failed');
      
      // Log failed attempt for security monitoring
      try {
        await supabase
          .from('user_activity_log')
          .insert({
            user_id: user.id,
            action: 'password_change_failed',
            ip_address: identifier,
            metadata: {
              reason: 'incorrect_current_password'
            },
            created_at: new Date().toISOString()
          });
      } catch (logError) {
        console.error('Failed to log activity:', logError);
      }
      
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    console.log('✅ Current password verified');

    // Update password
    console.log('🔄 Updating password...');
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error('❌ Password update failed:', updateError);
      throw updateError;
    }

    console.log('✅ Password updated successfully');

    // Log successful password change
    try {
      await supabase
        .from('user_activity_log')
        .insert({
          user_id: user.id,
          action: 'password_changed',
          ip_address: identifier,
          user_agent: request.headers.get('user-agent') || 'unknown',
          metadata: {
            success: true
          },
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      console.error('Failed to log activity:', logError);
    }

    // Update security_settings to track password last changed
    try {
      const { data: currentPrefs } = await supabase
        .from('user_preferences')
        .select('security_settings')
        .eq('user_id', user.id)
        .single();

      const securitySettings = currentPrefs?.security_settings || {};
      securitySettings.password_last_changed = new Date().toISOString();

      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          security_settings: securitySettings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
    } catch (prefError) {
      console.error('Failed to update security settings:', prefError);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Password changed successfully. Please sign in with your new password.'
    });

    return applySetCookies(response);
  } catch (error) {
    console.error('❌ Password change error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to change password',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}