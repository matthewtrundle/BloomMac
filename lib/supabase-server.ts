import { createServerClient, type CookieOptions } from '@supabase/ssr';
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
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  return { supabase, response };
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
 * Check if user has specific role
 * Now checks both admin_users and user_profiles tables
 */
export async function checkUserRole(supabase: any, userId: string, requiredRole: string) {
  // Use the unified function that checks both tables
  const { data, error } = await supabase
    .rpc('check_user_role_unified', {
      user_id: userId,
      required_role: requiredRole
    });
  
  if (error) {
    console.error('Error checking user role:', error);
    return false;
  }
  
  return data === true;
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