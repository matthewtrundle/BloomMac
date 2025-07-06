import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get user profile from user_profiles table with better error handling
    let profile = null;
    let profileError = null;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      profile = data;
      profileError = error;
    } catch (e) {
      console.error('Profile query error:', e);
      profileError = e;
    }
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      
      // If it's an RLS error, log it clearly
      if (profileError.message?.includes('infinite recursion')) {
        console.error('RLS POLICY ERROR: Infinite recursion detected. Fix your RLS policies!');
        
        // Try to create a basic profile without querying first
        try {
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
          
          if (!insertError && newProfile) {
            return NextResponse.json({
              success: true,
              profile: newProfile,
              total_stars: 0
            });
          }
        } catch (insertErr) {
          console.error('Profile creation also failed:', insertErr);
        }
        
        // Return a minimal profile to prevent complete failure
        return NextResponse.json({
          success: true,
          profile: {
            id: session.user.id,
            first_name: session.user.user_metadata?.first_name || '',
            last_name: session.user.user_metadata?.last_name || '',
            email: session.user.email,
            total_stars: 0
          },
          warning: 'Profile data limited due to database policy error'
        });
      }
      
      // If profile doesn't exist, create a basic one
      if (profileError.code === 'PGRST116') {
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
          return NextResponse.json(
            { success: false, error: 'Failed to create profile' },
            { status: 500 }
          );
        }
        
        return NextResponse.json({
          success: true,
          profile: newProfile,
          total_stars: 0
        });
      }
      
      // Other errors
      return NextResponse.json(
        { success: false, error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }
    
    // Try to get achievements, but don't fail if it errors
    let totalStars = 0;
    try {
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('points')
        .eq('user_id', session.user.id);
      
      totalStars = achievements?.reduce((sum, a) => sum + (a.points || 0), 0) || 0;
    } catch (e) {
      console.error('Failed to fetch achievements (non-critical):', e);
    }
    
    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        total_stars: totalStars
      }
    });
    
  } catch (error) {
    console.error('Error in profile API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}