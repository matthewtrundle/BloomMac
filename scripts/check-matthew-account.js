const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkMatthewAccount() {
  const userId = '2a6835a5-6041-463f-b6bb-f6c5d38bea59';
  console.log('\n=== CHECKING MATTHEW\'S ACCOUNT ===\n');

  try {
    // Test dashboard functions
    console.log('1. Testing get_user_dashboard_data...');
    const { data: dashData, error: dashError } = await supabase
      .rpc('get_user_dashboard_data', { p_user_id: userId });
    
    if (dashError) {
      console.log('❌ Dashboard data error:', dashError);
    } else {
      console.log('✅ Dashboard data retrieved successfully');
      console.log('   Profile:', dashData.profile ? 'Found' : 'Missing');
      console.log('   Achievements:', Array.isArray(dashData.achievements) ? dashData.achievements.length : 'Error');
    }

    console.log('\n2. Testing get_user_course_stats...');
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_user_course_stats', { p_user_id: userId });
    
    if (statsError) {
      console.log('❌ Course stats error:', statsError);
    } else {
      console.log('✅ Course stats:', statsData);
    }

    console.log('\n3. Testing get_all_courses_with_user_progress...');
    const { data: coursesData, error: coursesError } = await supabase
      .rpc('get_all_courses_with_user_progress', { p_user_id: userId });
    
    if (coursesError) {
      console.log('❌ Courses error:', coursesError);
    } else {
      console.log('✅ Courses found:', Array.isArray(coursesData) ? coursesData.length : 'Error');
    }

    // Check for missing data
    console.log('\n=== CHECKING FOR MISSING DATA ===\n');
    
    const { data: prefs } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    console.log('User preferences:', prefs ? 'Found' : 'Missing (could cause settings page errors)');

    const { data: progress } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId);
    
    console.log('Course progress records:', progress?.length || 0);

    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId);
    
    console.log('Achievements:', achievements?.length || 0);

  } catch (error) {
    console.error('Error:', error);
  }
}

checkMatthewAccount();