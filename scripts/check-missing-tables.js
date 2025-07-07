const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Checking for Missing Tables and Relationships\n');

async function checkAchievementsSetup() {
  console.log('1. ACHIEVEMENTS SYSTEM CHECK');
  console.log('----------------------------');
  
  // Try a simple query to check the relationship
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievements!inner(*)')
      .limit(1);
    
    if (error?.message?.includes('relationship')) {
      console.log('❌ Missing foreign key relationship between user_achievements and achievements');
      console.log('\nFIX: Run this SQL:');
      console.log(`
ALTER TABLE user_achievements
ADD CONSTRAINT fk_achievement
FOREIGN KEY (achievement_id) 
REFERENCES achievements(id)
ON DELETE CASCADE;
      `);
    } else {
      console.log('✅ Achievements relationship exists');
    }
}

async function checkMissingTables() {
  console.log('\n2. MISSING TABLES');
  console.log('-----------------');
  
  const missingTables = [
    { name: 'user_workbooks', purpose: 'Track user workbook enrollments' },
    { name: 'workbooks', purpose: 'Store workbook templates' },
    { name: 'user_courses', purpose: 'Track user course enrollments' },
    { name: 'course_stats', purpose: 'Store aggregated course statistics' }
  ];
  
  for (const table of missingTables) {
    const { error } = await supabase
      .from(table.name)
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`❌ Missing table: ${table.name} (${table.purpose})`);
    }
  }
  
  console.log('\nThese tables might be created by database functions instead.');
  console.log('Check if the dashboard functions return data properly.');
}

async function testDashboardFunction() {
  console.log('\n3. TESTING DASHBOARD FUNCTION');
  console.log('-----------------------------');
  
  // Get a real user ID
  const { data: users } = await supabase.auth.admin.listUsers({ perPage: 1 });
  const userId = users?.users?.[0]?.id;
  
  if (!userId) {
    console.log('❌ No users found to test with');
    return;
  }
  
  const { data, error } = await supabase.rpc('get_user_dashboard_data', {
    p_user_id: userId
  });
  
  if (error) {
    console.log('❌ Dashboard function error:', error.message);
  } else {
    console.log('✅ Dashboard function works!');
    console.log('   Returns:', Object.keys(data || {}));
  }
}

async function suggestQuickFix() {
  console.log('\n4. QUICK FIX FOR 500 ERRORS');
  console.log('---------------------------');
  
  console.log(`
The 500 errors are likely because:

1. The achievements table needs a proper foreign key
2. Some tables might be virtual (created by functions)
3. The RPC parameters might be wrong

IMMEDIATE FIX - Update the API routes to handle missing data gracefully:

Example for achievements/get/route.ts:
------------------------------------
// Replace the join query with a simpler approach:
const { data: userAchievements } = await supabase
  .from('user_achievements')
  .select('*')
  .eq('user_id', session.user.id);

const { data: achievements } = await supabase
  .from('achievements')
  .select('*');

// Manually join the data
const formattedAchievements = userAchievements?.map(ua => {
  const achievement = achievements?.find(a => a.id === ua.achievement_id);
  return {
    id: ua.id,
    earnedAt: ua.earned_at,
    ...achievement
  };
}) || [];
  `);
}

// Run all checks
async function runChecks() {
  await checkAchievementsSetup();
  await checkMissingTables();
  await testDashboardFunction();
  await suggestQuickFix();
}

runChecks().catch(console.error);