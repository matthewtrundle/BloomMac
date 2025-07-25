import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Create a Supabase client for server-side operations with proper auth
 * This replaces direct service role usage in API routes
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

/**
 * Create a Supabase client for route handlers with proper auth
 */
export function createSupabaseRouteHandlerClient(request: NextRequest) {
  // Store cookies that need to be set
  const cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookiesToSet.push({ name, value, options });
        },
        remove(name: string, options: CookieOptions) {
          cookiesToSet.push({ name, value: '', options });
        },
      },
    }
  );

  // Helper function to apply cookies to a response
  const applySetCookies = (response: NextResponse) => {
    cookiesToSet.forEach(({ name, value, options }) => {
      if (value) {
        response.cookies.set(name, value, options);
      } else {
        response.cookies.delete(name);
      }
    });
    return response;
  };

  return { supabase, applySetCookies };
}

/**
 * Get authenticated user from request
 * Returns user or null if not authenticated
 */
export async function getAuthenticatedUser(supabase: any) {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

/**
 * Create a service client ONLY for specific server-side operations
 * that truly need elevated permissions (webhooks, cron jobs, etc)
 * 
 * WARNING: Use this ONLY when absolutely necessary!
 * Always prefer user-authenticated clients.
 */
export function createSupabaseServiceClient() {
  // Log usage for auditing
  console.warn('Service role client created - ensure this is necessary!', {
    stack: new Error().stack
  });
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() { return ''; },
        set() {},
        remove() {},
      },
    }
  );
}

/**
 * Validate webhook signatures for secure endpoints
 */
export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Create a public Supabase client for anonymous operations
 * This is used for public endpoints like contact forms
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
