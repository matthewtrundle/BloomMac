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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabaseAuth.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error checking auth session:', error);
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

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signUp: async (email: string, password: string, fullName?: string) => {
      try {
        setLoading(true);
        await authHelpers.signUp(email, password, fullName);
        // Redirect to email verification page
        router.push('/auth/verify-email');
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    signIn: async (email: string, password: string) => {
      try {
        setLoading(true);
        await authHelpers.signIn(email, password);
        // Redirect to dashboard or previous page
        router.push('/my-courses');
      } catch (error) {
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