const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 COMPLETE DATABASE AUDIT\n');
console.log('=========================\n');

async function getAllTables() {
  console.log('1. ALL TABLES IN DATABASE');
  console.log('-------------------------');
  
  try {
    // List known tables and check each
    const knownTables = [
      'achievements',
      'analytics_events', 
      'appointments',
      'blog_posts',
      'contact_submissions',
      'courses',
      'course_lessons',
      'course_modules', 
      'email_analytics',
      'email_automation_logs',
      'email_logs',
      'email_queue',
      'email_sends',
      'email_sequences',
      'email_templates',
      'feedback',
      'newsletter_subscribers',
      'pages',
      'providers',
      'reminder_rules',
      'resources',
      'sequence_emails',
      'sequence_enrollments',
      'service_pages',
      'services',
      'subscribers',
      'user_achievements',
      'user_course_progress',
      'user_courses',
      'user_preferences',
      'user_profiles',
      'user_workbooks',
      'waitlist',
      'workbook_submissions',
      'workbooks'
    ];
    
    for (const table of knownTables) {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (!error) {
        console.log(`✅ ${table}`);
      }
    }
  } catch (err) {
    console.log('Could not enumerate tables automatically');
  }
}

async function checkAchievementsStructure() {
  console.log('\n2. ACHIEVEMENTS TABLES STRUCTURE');
  console.log('--------------------------------');
  
  // Check achievements table
  const { data: achSample } = await supabase
    .from('achievements')
    .select('*')
    .limit(1);
  
  if (achSample?.[0]) {
    console.log('achievements columns:', Object.keys(achSample[0]));
  }
  
  // Check user_achievements table
  const { data: uaSample } = await supabase
    .from('user_achievements')
    .select('*')
    .limit(1);
  
  if (uaSample?.[0]) {
    console.log('user_achievements columns:', Object.keys(uaSample[0]));
  }
  
  // Check if achievement_id column exists
  if (uaSample?.[0] && 'achievement_id' in uaSample[0]) {
    console.log('✅ achievement_id column EXISTS');
  } else {
    console.log('❌ achievement_id column MISSING');
  }
}

async function checkDatabaseFunctions() {
  console.log('\n3. DATABASE FUNCTIONS');
  console.log('--------------------');
  
  const functions = [
    'get_user_dashboard_data',
    'get_provider_dashboard_data',
    'get_user_course_stats',
    'get_all_courses_with_user_progress',
    'get_user_workbook_status',
    'get_analytics_dashboard',
    'get_email_analytics'
  ];
  
  for (const func of functions) {
    try {
      // Try with UUID parameter
      const { error: uuidError } = await supabase.rpc(func, {
        p_user_id: '00000000-0000-0000-0000-000000000000'
      });
      
      if (!uuidError || !uuidError.message.includes('does not exist')) {
        console.log(`✅ ${func} (accepts UUID)`);
        continue;
      }
      
      // Try with different parameter name
      const { error: userIdError } = await supabase.rpc(func, {
        user_id: '00000000-0000-0000-0000-000000000000'
      });
      
      if (!userIdError || !userIdError.message.includes('does not exist')) {
        console.log(`✅ ${func} (accepts user_id)`);
        continue;
      }
      
      console.log(`❌ ${func} - not found or has issues`);
    } catch (err) {
      console.log(`❌ ${func} - error: ${err.message}`);
    }
  }
}

async function checkCourseStructure() {
  console.log('\n4. COURSE RELATED TABLES');
  console.log('------------------------');
  
  const courseTables = [
    'courses',
    'course_modules',
    'course_lessons',
    'user_course_progress',
    'user_courses',
    'course_stats'
  ];
  
  for (const table of courseTables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    if (!error) {
      console.log(`✅ ${table} exists with columns:`, data?.[0] ? Object.keys(data[0]) : 'no data');
    } else {
      console.log(`❌ ${table} - ${error.message}`);
    }
  }
}

async function checkWorkbookStructure() {
  console.log('\n5. WORKBOOK RELATED TABLES');
  console.log('--------------------------');
  
  const workbookTables = [
    'workbooks',
    'user_workbooks',
    'workbook_submissions'
  ];
  
  for (const table of workbookTables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    if (!error) {
      console.log(`✅ ${table} exists with columns:`, data?.[0] ? Object.keys(data[0]) : 'no data');
    } else {
      console.log(`❌ ${table} - ${error.message}`);
    }
  }
}

async function generateSQLFixes() {
  console.log('\n6. RECOMMENDED SQL FIXES');
  console.log('------------------------');
  
  console.log(`
Based on the audit above, here are the SQL commands you need:

-- Only run these if the columns/tables are missing above
`);
}

// Run all audits
async function runFullAudit() {
  await getAllTables();
  await checkAchievementsStructure();
  await checkDatabaseFunctions();
  await checkCourseStructure();
  await checkWorkbookStructure();
  await generateSQLFixes();
  
  console.log('\n✅ Audit complete! Review the results above before running any SQL.');
}

runFullAudit().catch(console.error);