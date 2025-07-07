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
    
    // Get user achievements - the table already has all the data we need!
    const { data: userAchievements, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', session.user.id)
      .order('earned_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user achievements:', error);
      // Return empty array instead of throwing
      return NextResponse.json({
        success: true,
        achievements: []
      });
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
    
    return NextResponse.json({
      success: true,
      achievements: formattedAchievements
    });
    
  } catch (error) {
    console.error('Error in achievements API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}
