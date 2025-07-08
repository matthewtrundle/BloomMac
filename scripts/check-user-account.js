const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUserAccount(email) {
  console.log(`\n=== CHECKING USER ACCOUNT: ${email} ===\n`);

  try {
    // 1. Check auth.users table
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (authError || !authUsers) {
      console.log('❌ User not found in auth.users table');
      console.log('Error:', authError?.message);
      // Try to find by user_profiles instead
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*');
      console.log('\nAll user_profiles:', profiles?.map(p => ({ id: p.id, email: p.email || 'No email', name: `${p.first_name} ${p.last_name}` })));
      return;
    }

    console.log('✅ Auth user found:');
    console.log(`   ID: ${authUsers.id}`);
    console.log(`   Email: ${authUsers.email}`);
    console.log(`   Created: ${authUsers.created_at}`);
    console.log(`   Confirmed: ${authUsers.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`   Last Sign In: ${authUsers.last_sign_in_at || 'Never'}`);
    
    const userId = authUsers.id;

    // 2. Check user_profiles table
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.log('\n❌ No profile found in user_profiles table');
      console.log('   This could cause 401 errors!');
    } else {
      console.log('\n✅ User profile found:');
      console.log(`   Name: ${profile.first_name} ${profile.last_name}`);
      console.log(`   Role: ${profile.role || 'None'}`);
      console.log(`   Created: ${profile.created_at}`);
    }

    // 3. Check user_preferences table
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!preferences) {
      console.log('\n⚠️  No preferences found in user_preferences table');
    } else {
      console.log('\n✅ User preferences found');
    }

    // 4. Check course_progress
    const { data: progress } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', userId);

    console.log(`\n📚 Course progress records: ${progress?.length || 0}`);

    // 5. Check user_achievements
    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId);

    console.log(`🏆 Achievements: ${achievements?.length || 0}`);

    // 6. Check if user can call dashboard functions
    console.log('\n=== TESTING DASHBOARD FUNCTIONS ===\n');
    
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_user_course_stats', { p_user_id: userId });
    
    if (statsError) {
      console.log('❌ get_user_course_stats failed:', statsError.message);
    } else {
      console.log('✅ get_user_course_stats works:', JSON.stringify(statsData, null, 2));
    }

    const { data: dashboardData, error: dashboardError } = await supabase
      .rpc('get_user_dashboard_data', { p_user_id: userId });
    
    if (dashboardError) {
      console.log('❌ get_user_dashboard_data failed:', dashboardError.message);
    } else {
      console.log('✅ get_user_dashboard_data works');
    }

    // 7. Check for common issues
    console.log('\n=== POTENTIAL ISSUES ===\n');
    
    if (!profile) {
      console.log('🔴 MISSING PROFILE: User exists in auth but not in user_profiles');
      console.log('   FIX: Need to create profile record');
    }
    
    if (authUser.user.email_confirmed_at === null) {
      console.log('🟡 EMAIL NOT CONFIRMED: This might cause auth issues');
    }

  } catch (error) {
    console.error('Error checking user:', error);
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.log('Usage: node scripts/check-user-account.js <email>');
  process.exit(1);
}

checkUserAccount(email);