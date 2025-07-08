import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { supabase, applySetCookies } = createSupabaseRouteHandlerClient(request);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const response = NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
      return applySetCookies(response);
    }
    
    // Get user profile from user_profiles table
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      
      // If profile doesn't exist, create a basic one
      if (error.code === 'PGRST116') {
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: session.user.id,
            first_name: session.user.user_metadata?.first_name || '',
            last_name: session.user.user_metadata?.last_name || '',
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          const response = NextResponse.json(
            { success: false, error: 'Failed to create profile' },
            { status: 500 }
          );
          return applySetCookies(response);
        }
        
        const response = NextResponse.json({
          success: true,
          profile: newProfile
        });
        return applySetCookies(response);
      }
      
      throw error;
    }
    
    // Calculate total stars from achievements
    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('points')
      .eq('user_id', session.user.id);
    
    const totalStars = achievements?.reduce((sum, a) => sum + (a.points || 0), 0) || 0;
    
    const response = NextResponse.json({
      success: true,
      profile: {
        ...profile,
        total_stars: totalStars
      }
    });
    return applySetCookies(response);
    
  } catch (error) {
    console.error('Error in profile API:', error);
    const response = NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
    return applySetCookies(response);
  }
}