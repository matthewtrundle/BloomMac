import { supabaseAuth } from '@/lib/supabase-auth';

/**
 * Refresh the Supabase session to ensure it's valid
 * This helps prevent authentication issues between client and server
 */
export async function refreshSession() {
  if (!supabaseAuth || typeof window === 'undefined') {
    return null;
  }

  try {
    const { data: { session }, error } = await supabaseAuth.auth.refreshSession();
    
    if (error) {
      console.error('Session refresh error:', error);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Session refresh failed:', error);
    return null;
  }
}

/**
 * Check if the current session is valid and refresh if needed
 */
export async function ensureValidSession() {
  if (!supabaseAuth || typeof window === 'undefined') {
    return false;
  }

  try {
    const { data: { session } } = await supabaseAuth.auth.getSession();
    
    if (!session) {
      return false;
    }
    
    // Check if session is about to expire (within 5 minutes)
    const expiresAt = new Date(session.expires_at! * 1000);
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
    
    if (expiresAt <= fiveMinutesFromNow) {
      // Session is about to expire, refresh it
      const newSession = await refreshSession();
      return !!newSession;
    }
    
    return true;
  } catch (error) {
    console.error('Session validation failed:', error);
    return false;
  }
}