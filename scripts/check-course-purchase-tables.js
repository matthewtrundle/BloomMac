const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  const tablesToCheck = [
    'course_purchases',
    'user_course_access', 
    'course_progress',
    'course_enrollments',
    'course_completion',
    'user_courses'
  ];

  console.log('Checking course-related tables...\n');
  
  for (const table of tablesToCheck) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
      
    if (error && error.code === '42P01') {
      console.log(`❌ ${table}: Table does not exist`);
    } else if (error) {
      console.log(`⚠️  ${table}: Error - ${error.message}`);
    } else {
      console.log(`✅ ${table}: EXISTS (${count} rows)`);
    }
  }
  
  // Also check the main courses table for existing data
  console.log('\n📊 Checking existing course data...\n');
  
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, title, slug, price, is_active');
    
  if (!coursesError && courses) {
    console.log('Found courses:', courses.length);
    courses.forEach(course => {
      console.log(`  - ${course.title} (slug: ${course.slug}, price: $${course.price}, active: ${course.is_active})`);
    });
  }
  
  // Check course_enrollments structure if it exists
  console.log('\n📋 Checking course_enrollments table structure...\n');
  
  const { data: enrollmentSample, error: enrollmentError } = await supabase
    .from('course_enrollments')
    .select('*')
    .limit(1);
    
  if (!enrollmentError && enrollmentSample && enrollmentSample.length > 0) {
    console.log('course_enrollments columns:', Object.keys(enrollmentSample[0]));
  }
}

checkTables().catch(console.error);