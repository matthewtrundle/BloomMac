const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCourseProgressSchema() {
  console.log('🔍 Checking course_progress table schema...\n');
  
  try {
    // Get a sample row to see the actual columns
    const { data, error } = await supabase
      .from('course_progress')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('Sample row from course_progress:');
      console.log(JSON.stringify(data[0], null, 2));
      console.log('\nColumns found:');
      console.log(Object.keys(data[0]).join(', '));
    } else {
      console.log('No data in course_progress table');
      
      // Try to get column info another way
      const { data: emptySelect, error: emptyError } = await supabase
        .from('course_progress')
        .select()
        .limit(0);
      
      if (!emptyError) {
        console.log('Table exists but is empty');
      }
    }
    
    // Also check other course-related tables
    console.log('\n\nChecking related tables:');
    
    const tables = ['courses', 'course_modules', 'course_lessons', 'user_lesson_progress'];
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`✅ ${table}: ${count} rows`);
      } else {
        console.log(`❌ ${table}: ${error.message}`);
      }
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

checkCourseProgressSchema();