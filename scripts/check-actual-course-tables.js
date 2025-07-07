const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Checking Actual Course Tables Structure\n');

const courseTables = [
  'course_lessons',
  'course_modules', 
  'course_discount_codes',
  'courses',
  'user_course_access',
  'course_activity_logs',
  'course_purchases',
  'course_enrollments',
  'course_progress',
  'course_certificates',
  'course_resources',
  'course_announcements',
  'course_discussions'
];

async function checkTableStructure() {
  for (const table of courseTables) {
    console.log(`\n📊 TABLE: ${table}`);
    console.log('------------------------');
    
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`❌ Error: ${error.message}`);
    } else if (data && data[0]) {
      console.log('Columns:', Object.keys(data[0]));
    } else {
      console.log('✅ Table exists but is empty');
      
      // Try to get structure another way
      const { data: emptySelect } = await supabase
        .from(table)
        .select()
        .limit(0);
      
      console.log('Table is ready for data');
    }
  }
}

async function checkCourseProgressStructure() {
  console.log('\n🎯 SPECIAL FOCUS: course_progress table');
  console.log('---------------------------------------');
  
  // Check if it has user_id column
  const { data, error } = await supabase
    .from('course_progress')
    .select('*')
    .limit(5);
  
  if (!error) {
    console.log('✅ course_progress table exists');
    if (data && data[0]) {
      console.log('Columns:', Object.keys(data[0]));
      console.log('Sample data:', data);
    }
  }
  
  // Check course_enrollments too
  console.log('\n🎯 SPECIAL FOCUS: course_enrollments table');
  console.log('------------------------------------------');
  
  const { data: enrollments, error: enrollError } = await supabase
    .from('course_enrollments')
    .select('*')
    .limit(5);
  
  if (!enrollError) {
    console.log('✅ course_enrollments table exists');
    if (enrollments && enrollments[0]) {
      console.log('Columns:', Object.keys(enrollments[0]));
    }
  }
}

async function testCourseFunctions() {
  console.log('\n🔧 Testing Course-Related Functions');
  console.log('-----------------------------------');
  
  // Test with actual table names
  console.log('\nTesting if functions use correct table names...');
  
  const testUserId = '00000000-0000-0000-0000-000000000000';
  
  // Test get_user_course_stats
  const { data: stats, error: statsError } = await supabase
    .rpc('get_user_course_stats', { user_id: testUserId });
  
  if (statsError) {
    console.log('❌ get_user_course_stats error:', statsError.message);
    console.log('   Likely using wrong table name (user_course_progress vs course_progress)');
  } else {
    console.log('✅ get_user_course_stats works');
  }
  
  // Test get_all_courses_with_user_progress  
  const { data: coursesData, error: coursesError } = await supabase
    .rpc('get_all_courses_with_user_progress', { p_user_id: testUserId });
  
  if (coursesError) {
    console.log('❌ get_all_courses_with_user_progress error:', coursesError.message);
  } else {
    console.log('✅ get_all_courses_with_user_progress works');
  }
}

// Run all checks
async function runChecks() {
  await checkTableStructure();
  await checkCourseProgressStructure();
  await testCourseFunctions();
  
  console.log('\n✅ Analysis complete!');
  console.log('\nKey findings:');
  console.log('- You have course_progress, NOT user_course_progress');
  console.log('- You have course_enrollments for tracking enrolled users');
  console.log('- Database functions may need updating to use correct table names');
}

runChecks().catch(console.error);