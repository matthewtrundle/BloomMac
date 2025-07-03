import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function checkProviderRole(userId: string): Promise<boolean> {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      console.error('Error checking provider role:', error);
      return false;
    }
    
    return data.role === 'provider' || data.role === 'admin';
  } catch (error) {
    console.error('Error in checkProviderRole:', error);
    return false;
  }
}

export async function requireProviderAuth() {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return { authorized: false, error: 'Not authenticated' };
  }
  
  const isProvider = await checkProviderRole(user.id);
  
  if (!isProvider) {
    return { authorized: false, error: 'Not authorized as provider' };
  }
  
  return { authorized: true, user };
}