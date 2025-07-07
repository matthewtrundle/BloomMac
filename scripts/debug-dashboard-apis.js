const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Dashboard API Debug Script\n');
console.log('================================\n');

async function checkTables() {
  console.log('1. CHECKING REQUIRED TABLES');
  console.log('---------------------------');
  
  const tables = [
    'user_profiles',
    'user_achievements', 
    'achievements',
    'user_workbooks',
    'workbooks',
    'courses',
    'user_courses',
    'course_stats'
  ];
  
  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`❌ Table '${table}' - ${error.message}`);
    } else {
      console.log(`✅ Table '${table}' exists`);
    }
  }
}

async function checkUserData() {
  console.log('\n2. CHECKING USER DATA');
  console.log('---------------------');
  
  // Get a test user
  const { data: users } = await supabase.auth.admin.listUsers({ perPage: 1 });
  
  if (!users?.users?.length) {
    console.log('❌ No users found');
    return;
  }
  
  const userId = users.users[0].id;
  console.log(`Testing with user: ${users.users[0].email} (${userId})`);
  
  // Check user profile
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (profileError) {
    console.log(`❌ User profile error: ${profileError.message}`);
  } else {
    console.log(`✅ User profile found:`, {
      name: `${profile.first_name} ${profile.last_name}`,
      role: profile.role
    });
  }
  
  // Check achievements
  const { data: achievements, error: achievError } = await supabase
    .from('user_achievements')
    .select('*, achievements(*)')
    .eq('user_id', userId);
  
  if (achievError) {
    console.log(`❌ Achievements error: ${achievError.message}`);
  } else {
    console.log(`✅ User has ${achievements?.length || 0} achievements`);
  }
}

async function checkDatabaseFunctions() {
  console.log('\n3. CHECKING DATABASE FUNCTIONS');
  console.log('------------------------------');
  
  const functions = [
    'get_user_dashboard_data',
    'get_user_course_stats',
    'get_all_courses_with_user_progress',
    'get_user_workbook_status'
  ];
  
  for (const func of functions) {
    try {
      // Try to call with dummy data
      const { error } = await supabase.rpc(func, {
        user_id: '00000000-0000-0000-0000-000000000000'
      });
      
      if (error && error.message.includes('does not exist')) {
        console.log(`❌ Function '${func}' not found`);
      } else {
        console.log(`✅ Function '${func}' exists`);
      }
    } catch (err) {
      console.log(`❌ Function '${func}' error: ${err.message}`);
    }
  }
}

async function suggestFixes() {
  console.log('\n4. SUGGESTED FIXES');
  console.log('------------------');
  
  console.log(`
Based on the errors, here are the likely issues:

1. **401 Unauthorized on /api/profile/get**
   - The auth cookie might not be properly set
   - Try logging out and back in
   - Check if cookies are being blocked

2. **500 Errors on other endpoints**
   - Missing database tables (check above)
   - Different Supabase client methods in use
   - Missing database functions

3. **Quick Fixes to Try:**
   
   a) Update all API routes to use consistent auth:
      Replace: createRouteHandlerClient({ cookies })
      With: createSupabaseRouteHandlerClient(request)
   
   b) Create missing tables:
      - user_achievements
      - achievements
      - user_workbooks
      - workbooks
   
   c) Apply database migrations:
      Check if V6_FINAL_MIGRATION.sql includes these tables
  `);
}

async function testAuthCookie() {
  console.log('\n5. AUTH CONFIGURATION CHECK');
  console.log('---------------------------');
  
  console.log('Expected cookie names:');
  console.log(`- sb-${process.env.NEXT_PUBLIC_SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token`);
  console.log(`- sb-${process.env.NEXT_PUBLIC_SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token.0`);
  console.log(`- sb-${process.env.NEXT_PUBLIC_SUPABASE_URL.split('//')[1].split('.')[0]}-auth-token.1`);
  
  console.log('\nMake sure these cookies are set after login!');
}

// Run all checks
async function runDebug() {
  await checkTables();
  await checkUserData();
  await checkDatabaseFunctions();
  await testAuthCookie();
  await suggestFixes();
}

runDebug().catch(console.error);