import { createClient } from '@supabase/supabase-js';

// Lazy initialization to handle client-side hydration properly
let _supabase: any = null;

function createSupabaseClient() {
  if (_supabase) return _supabase;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      url: supabaseUrl ? 'present' : 'missing',
      key: supabaseAnonKey ? 'present' : 'missing',
      isClient: typeof window !== 'undefined'
    });
    return null;
  }
  
  try {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
    return _supabase;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}

// Export a getter that creates the client lazily
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const client = createSupabaseClient();
    if (!client) {
      throw new Error('Supabase client not available - check environment variables');
    }
    return client[prop];
  }
});

// Admin client for server-side operations (never expose to browser)
function createAdminClient() {
  // Only allow admin client creation on server-side
  if (typeof window !== 'undefined') {
    throw new Error('Admin client cannot be used in browser environment');
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing admin Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Lazy-loaded admin client to prevent browser initialization
let _supabaseAdmin: any = null;

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createAdminClient();
  }
  return _supabaseAdmin;
}

// Legacy export for backward compatibility - DO NOT USE IN NEW CODE
export const supabaseAdmin = new Proxy({} as any, {
  get(target, prop) {
    console.warn('DEPRECATED: Use getSupabaseAdmin() instead of supabaseAdmin');
    const client = getSupabaseAdmin();
    return client[prop];
  }
});

// Helper to get the correct client
export function getSupabaseClient(isServerSide = false) {
  if (isServerSide && typeof window === 'undefined') {
    return supabaseAdmin;
  }
  return supabase;
}