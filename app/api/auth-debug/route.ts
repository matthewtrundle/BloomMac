import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    console.log('=== AUTH DEBUG ENDPOINT ===');
    
    // 1. Check cookies
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    
    console.log('All cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
    
    // Look for Supabase auth cookies
    const authCookies = allCookies.filter(c => c.name.includes('sb-') && c.name.includes('auth'));
    console.log('Auth cookies found:', authCookies.length);
    
    // 2. Try to get session
    const { supabase } = createSupabaseRouteHandlerClient(request);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('Session check:', {
      hasSession: !!session,
      sessionError: sessionError?.message,
      userId: session?.user?.id,
      email: session?.user?.email,
      expiresAt: session?.expires_at
    });
    
    // 3. Try to get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    console.log('User check:', {
      hasUser: !!user,
      userError: userError?.message,
      userId: user?.id
    });
    
    // 4. Check profile
    let profile = null;
    if (session?.user?.id) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      profile = { exists: !!data, error: error?.message };
    }
    
    return NextResponse.json({
      success: true,
      debug: {
        cookies: {
          total: allCookies.length,
          authCookies: authCookies.map(c => c.name),
          hasSupabaseAuth: authCookies.length > 0
        },
        session: {
          exists: !!session,
          error: sessionError?.message,
          userId: session?.user?.id,
          email: session?.user?.email,
          expiresAt: session?.expires_at,
          expired: session ? new Date(session.expires_at * 1000) < new Date() : null
        },
        user: {
          exists: !!user,
          error: userError?.message,
          id: user?.id
        },
        profile: profile,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Auth debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}