import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Client-side Supabase client for auth
export const supabaseAuth = typeof window !== 'undefined' 
  ? createClientComponentClient() 
  : null as any;

// Types for user data
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseAccess {
  course_id: string;
  user_id: string;
  payment_status: 'paid' | 'test_paid';
  access_granted_at: string;
  expires_at?: string;
}

// Helper functions for auth operations
export const authHelpers = {
  // Sign up new user
  async signUp(email: string, password: string, fullName?: string) {
    if (!supabaseAuth) throw new Error('Supabase client not initialized');
    
    const redirectTo = `${window.location.origin}/auth/callback`;
    console.log('Signup redirect URL:', redirectTo); // Debug log
    
    const { data, error } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: redirectTo.trim(), // Ensure no spaces
      },
    });

    if (error) throw error;
    return data;
  },

  // Sign in existing user
  async signIn(email: string, password: string) {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign in with magic link (passwordless)
  async signInWithMagicLink(email: string) {
    const { data, error } = await supabaseAuth.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabaseAuth.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabaseAuth.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Reset password
  async resetPassword(email: string) {
    const { data, error } = await supabaseAuth.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return data;
  },

  // Update password
  async updatePassword(newPassword: string) {
    const { data, error } = await supabaseAuth.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  },

  // Check if user has access to a course
  async checkCourseAccess(userId: string, courseId: string) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('user_course_access')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .in('payment_status', ['paid', 'test_paid'])
      .single();

    return { hasAccess: !!data, accessData: data, error };
  },

  // Get all courses for a user
  async getUserCourses(userId: string) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('user_course_access')
      .select(`
        *,
        courses (
          id,
          slug,
          title,
          description,
          thumbnail_url
        )
      `)
      .eq('user_id', userId)
      .in('payment_status', ['paid', 'test_paid']);

    if (error) throw error;
    return data;
  },
};