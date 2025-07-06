const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCourses() {
  console.log('=== CHECKING COURSE TABLES ===\n');
  
  // Check for course-related tables
  const tables = ['courses', 'course_modules', 'course_lessons', 'course_weeks'];
  
  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`❌ ${table}: ${error.message}`);
    } else {
      console.log(`✅ ${table}: exists with ${count} rows`);
    }
  }
  
  // Try to get actual data from courses
  console.log('\n=== COURSE DATA ===\n');
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (coursesError) {
    console.log('Error fetching courses:', coursesError);
  } else if (courses && courses.length > 0) {
    console.log(`Found ${courses.length} courses:`);
    courses.forEach(c => {
      console.log(`\nCourse: ${c.title || c.name || 'Untitled'}`);
      console.log(`  ID: ${c.id}`);
      console.log(`  Active: ${c.is_active}`);
      console.log(`  Status: ${c.status || 'N/A'}`);
      console.log(`  Description: ${(c.description || '').substring(0, 50)}...`);
    });
  } else {
    console.log('No courses found in database');
  }
  
  // Check course modules
  console.log('\n=== COURSE MODULES ===\n');
  const { data: modules, error: modulesError } = await supabase
    .from('course_modules')
    .select('*')
    .limit(10);
    
  if (modulesError) {
    console.log('Error fetching modules:', modulesError);
  } else if (modules && modules.length > 0) {
    console.log(`Found ${modules.length} modules`);
  } else {
    console.log('No modules found');
  }
  
  // Check course weeks
  console.log('\n=== COURSE WEEKS ===\n');
  const { data: weeks, error: weeksError } = await supabase
    .from('course_weeks')
    .select('*')
    .limit(10);
    
  if (weeksError) {
    console.log('Error fetching weeks:', weeksError);
  } else if (weeks && weeks.length > 0) {
    console.log(`Found ${weeks.length} weeks`);
  } else {
    console.log('No weeks found');
  }
}

checkCourses().catch(console.error);