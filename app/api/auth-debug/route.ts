import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { supabase, applySetCookies } = createSupabaseRouteHandlerClient(request);
    
    // Get session info
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // Get user info
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // Check cookies
    const cookies = request.cookies.getAll();
    const authCookies = cookies.filter(c => 
      c.name.includes('sb-') || 
      c.name.includes('supabase') || 
      c.name.includes('auth')
    );
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      session: {
        exists: !!session,
        expiresAt: session?.expires_at,
        expiresIn: session?.expires_in,
        accessToken: session?.access_token ? 'Present' : 'Missing',
        refreshToken: session?.refresh_token ? 'Present' : 'Missing',
        error: sessionError?.message
      },
      user: {
        exists: !!user,
        id: user?.id,
        email: user?.email,
        error: userError?.message
      },
      cookies: {
        all: authCookies.map(c => ({
          name: c.name,
          value: c.value ? 'Present' : 'Missing',
          size: c.value?.length
        })),
        sbAccessToken: request.cookies.get('sb-access-token')?.value ? 'Present' : 'Missing',
        sbRefreshToken: request.cookies.get('sb-refresh-token')?.value ? 'Present' : 'Missing'
      },
      headers: {
        referer: request.headers.get('referer'),
        userAgent: request.headers.get('user-agent')
      }
    };
    
    const response = NextResponse.json(debugInfo);
    return applySetCookies(response);
    
  } catch (error) {
    console.error('Auth debug error:', error);
    return NextResponse.json({
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
EOF < /dev/null