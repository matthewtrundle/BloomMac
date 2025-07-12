#\!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCourseTables() {
  console.log('🎓 Checking Course-Related Tables...\n');

  const courseTables = [
    'courses',
    'course_modules',
    'course_lessons',
    'course_purchases',
    'user_course_access',
    'course_progress',
    'course_enrollments'
  ];

  for (const table of courseTables) {
    console.log(`\n📊 Checking ${table}:`);
    
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.code === '42P01') {
          console.log(`  ❌ Table does not exist`);
        } else {
          console.log(`  ⚠️  Error: ${error.message}`);
        }
      } else {
        console.log(`  ✅ Table exists with ${count} rows`);
        
        // Get sample data
        const { data: sample } = await supabase
          .from(table)
          .select('*')
          .limit(2);
          
        if (sample && sample.length > 0) {
          console.log('  Sample record:');
          console.log('  ', JSON.stringify(sample[0], null, 2).split('\n').join('\n  '));
        }
      }
    } catch (e) {
      console.log(`  ❌ Error checking table: ${e.message}`);
    }
  }

  // Check for specific course data
  console.log('\n\n🔍 Checking Course Data:');
  
  try {
    const { data: courses } = await supabase
      .from('courses')
      .select('*');
      
    if (courses) {
      console.log(`\nFound ${courses.length} courses:`);
      courses.forEach(course => {
        console.log(`  - ${course.title} (${course.slug}): $${course.price}`);
      });
    }
  } catch (e) {
    console.log('Could not fetch courses');
  }

  try {
    const { data: access } = await supabase
      .from('user_course_access')
      .select('*');
      
    if (access && access.length > 0) {
      console.log(`\n\nFound ${access.length} course access records:`);
      access.forEach(record => {
        console.log(`  - ${record.customer_email} has access to ${record.course_id}`);
      });
    }
  } catch (e) {
    console.log('Could not fetch course access');
  }
}

checkCourseTables().catch(console.error);
EOF < /dev/null