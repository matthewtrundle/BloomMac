'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabaseAuth, authHelpers } from '@/lib/supabase-auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Always start with null user and loading true
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Skip on server
    if (!supabaseAuth || typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        // Ensure we start clean
        setUser(null);
        setLoading(true);
        
        const { data: { session }, error } = await supabaseAuth.auth.getSession();
        
        if (error) {
          console.error('Auth session error:', error);
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signUp: async (email: string, password: string, fullName?: string) => {
      try {
        setLoading(true);
        const result = await authHelpers.signUp(email, password, fullName);
        
        // Check if email confirmation is required
        if (result?.user && !result?.session) {
          // User was created but no session (email confirmation required)
          setLoading(false);
          router.push(`/auth/check-email?type=signup&email=${encodeURIComponent(email)}`);
          return;
        }
        
        // Wait for the auth state to update
        if (result?.user && result?.session) {
          setUser(result.user);
          // Small delay to ensure session is established
          await new Promise(resolve => setTimeout(resolve, 500));
          setLoading(false);
          // Redirect to onboarding flow for confirmed users
          router.push('/onboarding?source=signup');
        } else {
          setLoading(false);
          throw new Error('Signup failed - no user data returned');
        }
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    signIn: async (email: string, password: string) => {
      try {
        setLoading(true);
        console.log('[AuthContext] Starting sign in for:', email);
        
        const result = await authHelpers.signIn(email, password);
        console.log('[AuthContext] Sign in result:', result);
        
        // Wait for auth state to update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get the session to verify it's established
        const { data: { session }, error } = await supabaseAuth.auth.getSession();
        console.log('[AuthContext] Session after sign in:', session);
        console.log('[AuthContext] Session error:', error);
        
        if (session?.user) {
          setUser(session.user);
          console.log('[AuthContext] User set, redirecting to dashboard');
          // Ensure loading is false before redirect
          setLoading(false);
          // Use replace to prevent back button issues
          router.replace('/dashboard');
        } else {
          console.error('[AuthContext] No session after sign in');
          setLoading(false);
          throw new Error('Login successful but session not established');
        }
      } catch (error) {
        console.error('[AuthContext] Sign in error:', error);
        setLoading(false);
        throw error;
      }
    },
    signInWithMagicLink: async (email: string) => {
      try {
        setLoading(true);
        await authHelpers.signInWithMagicLink(email);
        // Show success message
        router.push('/auth/check-email');
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    signOut: async () => {
      try {
        setLoading(true);
        await authHelpers.signOut();
        router.push('/');
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    resetPassword: async (email: string) => {
      try {
        setLoading(true);
        await authHelpers.resetPassword(email);
        // Show success message
        router.push('/auth/check-email');
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}