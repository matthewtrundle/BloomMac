import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for public operations (browser-safe)
// Add runtime checks to prevent "supabaseKey is required" error
export const supabase = (() => {
  if (typeof window !== 'undefined') {
    // Client-side: Check if environment variables are available
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
        url: supabaseUrl ? 'present' : 'missing',
        key: supabaseAnonKey ? 'present' : 'missing'
      });
      // Return a dummy client to prevent app crash
      return null as any;
    }
  }
  
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null as any;
  }
})();

// Admin client for server-side operations (never expose to browser)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper to get the correct client
export function getSupabaseClient(isServerSide = false) {
  if (isServerSide && typeof window === 'undefined') {
    return supabaseAdmin;
  }
  return supabase;
}