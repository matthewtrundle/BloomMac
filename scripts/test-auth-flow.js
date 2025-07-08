const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAuthFlow() {
  console.log('🔍 Testing Authentication Flow...\n');

  try {
    // 1. Check if we have valid environment variables
    console.log('1. Checking environment variables:');
    console.log('   - Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('   - Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
    console.log('   - Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
    
    // 2. Check auth configuration
    console.log('\n2. Checking Supabase Auth Configuration:');
    const { data: authConfig, error: authError } = await supabase.rpc('get_config', {
      query: `SELECT key, value FROM auth.config WHERE key IN ('external_email_enabled', 'mailer_autoconfirm', 'sms_autoconfirm')`
    }).single();
    
    if (authError) {
      // Try alternative approach
      console.log('   Unable to fetch auth config directly');
    } else {
      console.log('   Auth config:', authConfig);
    }

    // 3. Check for any recent auth sessions
    console.log('\n3. Checking recent auth activity:');
    const { data: recentSessions, error: sessionError } = await supabase
      .from('auth.sessions')
      .select('id, user_id, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (sessionError) {
      console.log('   Unable to query sessions table:', sessionError.message);
    } else {
      console.log(`   Found ${recentSessions?.length || 0} recent sessions`);
      if (recentSessions?.length > 0) {
        console.log('   Most recent session:', new Date(recentSessions[0].created_at).toLocaleString());
      }
    }

    // 4. Check user_profiles table
    console.log('\n4. Checking user_profiles table:');
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (profileError) {
      console.log('   ❌ Error querying user_profiles:', profileError.message);
    } else {
      console.log(`   ✅ Found ${profiles?.length || 0} user profiles`);
    }

    // 5. Check for any auth.users
    console.log('\n5. Checking auth.users table:');
    const { data: authUsers, error: authUsersError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 5
    });
    
    if (authUsersError) {
      console.log('   ❌ Error querying auth.users:', authUsersError.message);
    } else {
      console.log(`   ✅ Found ${authUsers?.users?.length || 0} auth users`);
      if (authUsers?.users?.length > 0) {
        console.log('   Most recent user:', new Date(authUsers.users[0].created_at).toLocaleString());
        console.log('   Email confirmed:', authUsers.users[0].email_confirmed_at ? 'Yes' : 'No');
      }
    }

    // 6. Check if email confirmation is required
    console.log('\n6. Checking email confirmation requirement:');
    console.log('   NOTE: If email confirmation is enabled in Supabase, users won\'t get a session until they confirm their email.');
    console.log('   This could cause the redirect loop you\'re experiencing.');
    
    // 7. Recommendations
    console.log('\n📋 RECOMMENDATIONS:');
    console.log('   1. Check Supabase Dashboard > Authentication > Email settings');
    console.log('   2. For development, consider disabling "Confirm email" requirement');
    console.log('   3. Ensure your middleware is properly handling Supabase session refresh');
    console.log('   4. Check browser DevTools > Application > Cookies for sb-* cookies');
    
  } catch (error) {
    console.error('❌ Error during auth flow test:', error);
  }
}

// Run the test
testAuthFlow();