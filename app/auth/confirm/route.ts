import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next') || '/onboarding';

  if (!token_hash || !type) {
    return NextResponse.redirect(
      new URL('/auth/error?error=invalid_request&error_description=Missing confirmation parameters', requestUrl.origin)
    );
  }

  const supabase = createRouteHandlerClient({ cookies });

  if (type === 'signup') {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: 'signup'
      });

      if (error) {
        console.error('Email verification error:', error);
        
        // Handle specific error types
        if (error.message.includes('expired')) {
          return NextResponse.redirect(
            new URL('/auth/error?error_code=otp_expired&error_description=Confirmation link has expired', requestUrl.origin)
          );
        }
        
        return NextResponse.redirect(
          new URL(`/auth/error?error=verification_error&error_description=${encodeURIComponent(error.message)}`, requestUrl.origin)
        );
      }

      // Verification successful - user is now logged in
      // Check if profile exists
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        // If no profile, redirect to onboarding
        if (!profile) {
          return NextResponse.redirect(
            new URL('/onboarding?source=email-confirmation', requestUrl.origin)
          );
        }
      }

      // Profile exists, go to dashboard
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
      
    } catch (error) {
      console.error('Unexpected error during email verification:', error);
      return NextResponse.redirect(
        new URL('/auth/error?error=unexpected_error&error_description=An unexpected error occurred', requestUrl.origin)
      );
    }
  }

  // Handle other verification types (password reset, email change, etc.)
  if (type === 'recovery') {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: 'recovery'
      });

      if (error) {
        return NextResponse.redirect(
          new URL(`/auth/error?error=recovery_error&error_description=${encodeURIComponent(error.message)}`, requestUrl.origin)
        );
      }

      // Redirect to password reset page
      return NextResponse.redirect(new URL('/auth/reset-password', requestUrl.origin));
      
    } catch (error) {
      return NextResponse.redirect(
        new URL('/auth/error?error=unexpected_error', requestUrl.origin)
      );
    }
  }

  // Unknown type
  return NextResponse.redirect(
    new URL('/auth/error?error=invalid_request&error_description=Unknown verification type', requestUrl.origin)
  );
}