import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      return NextResponse.json({
        error: error.message,
        hasSession: false,
        user: null
      });
    }
    
    return NextResponse.json({
      hasSession: !!session,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        emailConfirmed: !!session.user.email_confirmed_at
      } : null,
      expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to check auth state',
      hasSession: false,
      user: null 
    });
  }
}

// Force sign out endpoint
export async function DELETE() {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    await supabase.auth.signOut();
    
    return NextResponse.json({ 
      success: true,
      message: 'Signed out successfully' 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: 'Failed to sign out' 
    }, { status: 500 });
  }
}