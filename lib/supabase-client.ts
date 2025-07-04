import { createClient } from '@supabase/supabase-js';

// Client-safe supabase initialization with proper error handling
function createSafeSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey
    });
    
    // In production, we should throw an error
    // For development, we'll return null and handle it gracefully
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Supabase configuration is missing');
    }
    
    return null;
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}

// Export the client
export const supabase = createSafeSupabaseClient();

// Export a hook to check if supabase is initialized
export function useSupabaseClient() {
  if (!supabase) {
    throw new Error(
      'Supabase client is not initialized. Please check your environment variables.'
    );
  }
  return supabase;
}