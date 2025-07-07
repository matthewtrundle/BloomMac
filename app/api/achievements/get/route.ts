import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get user achievements from database, joining with the achievements table
    const { data: userAchievements, error } = await supabase
      .from('user_achievements')
      .select(`
        id,
        earned_at,
        achievements (
          id,
          name,
          description,
          icon,
          points
        )
      `)
      .eq('user_id', session.user.id)
      .order('earned_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
    
    // Format achievements with proper structure
    const formattedAchievements = userAchievements?.map(ua => ({
      id: ua.id,
      earnedAt: ua.earned_at,
      ...ua.achievements
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
