import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Create a direct Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 400 });
    }
    
    // Set the session cookies manually
    const response = NextResponse.json({ 
      success: true, 
      user: data.user,
      session: data.session
    });
    
    // Set Supabase auth cookies
    if (data.session) {
      response.cookies.set({
        name: 'sb-access-token',
        value: data.session.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      });
      
      response.cookies.set({
        name: 'sb-refresh-token',
        value: data.session.refresh_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });
    }
    
    return response;
  } catch (error) {
    console.error('Test login error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Server error' 
    }, { status: 500 });
  }
}