import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Client for public operations (browser-safe)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// DEPRECATED: Admin client should not be used in application code
// Use authenticated clients in API routes instead
export const supabaseAdmin = (() => {
  console.warn('supabaseAdmin is deprecated. Use authenticated clients in API routes.');
  
  // Only create if service key exists (for migration purposes)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    console.warn('Service role key detected. This should only be used for migrations and webhooks.');
    return createClient(supabaseUrl, serviceKey);
  }
  
  // Return regular client as fallback
  return supabase;
})();

// Helper to get the correct client - DEPRECATED
export function getSupabaseClient(isServerSide = false) {
  console.warn('getSupabaseClient is deprecated. Use createSupabaseRouteHandlerClient in API routes.');
  
  // Always return the anon client
  return supabase;
}

// Export types for convenience
export type { User, Session } from '@supabase/supabase-js';