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
    
    // Get user achievements - the table already has all the data we need!
    const { data: userAchievements, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', session.user.id)
      .order('earned_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user achievements:', error);
      // Return empty array instead of throwing
      const response = NextResponse.json({
        success: true,
        achievements: []
      });
      return applySetCookies(response);
    }
    
    // The user_achievements table already has name, description, icon, points!
    const formattedAchievements = userAchievements?.map(ua => ({
      id: ua.id,
      earnedAt: ua.earned_at,
      points: ua.points || 0,
      name: ua.name || 'Achievement',
      description: ua.description || '',
      icon: ua.icon || '🏆'
    })) || [];
    
    const response = NextResponse.json({
      success: true,
      achievements: formattedAchievements
    });
    return applySetCookies(response);
    
  } catch (error) {
    console.error('Error in achievements API:', error);
    const response = NextResponse.json(
      { success: false, error: 'Failed to fetch achievements' },
      { status: 500 }
    );
    return applySetCookies(response);
  }
}
