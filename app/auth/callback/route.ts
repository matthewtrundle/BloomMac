import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const errorCode = requestUrl.searchParams.get('error_code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  // Handle errors from Supabase
  if (error || errorCode) {
    const errorParams = new URLSearchParams({
      error: error || 'authentication_error',
      ...(errorDescription && { error_description: errorDescription }),
      ...(errorCode && { error_code: errorCode })
    });
    
    return NextResponse.redirect(
      new URL(`/auth/error?${errorParams.toString()}`, requestUrl.origin)
    );
  }

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) {
        console.error('Error exchanging code for session:', sessionError);
        const errorParams = new URLSearchParams({
          error: 'session_error',
          error_description: sessionError.message
        });
        
        return NextResponse.redirect(
          new URL(`/auth/error?${errorParams.toString()}`, requestUrl.origin)
        );
      }

      // Check if this is a new user who needs onboarding
      if (data?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        // If no profile exists, this is a new user - redirect to onboarding
        if (!profile) {
          return NextResponse.redirect(
            new URL('/onboarding?source=signup', requestUrl.origin)
          );
        }
      }
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      // Redirect to error page
      return NextResponse.redirect(
        new URL('/auth/error?error=authentication_error&error_description=Could not complete authentication', requestUrl.origin)
      );
    }
  } else {
    // No code provided
    return NextResponse.redirect(
      new URL('/auth/error?error=invalid_request&error_description=No authentication code provided', requestUrl.origin)
    );
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}