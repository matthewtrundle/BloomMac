require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  console.log('📋 Checking course_lessons table schema...\n');

  try {
    // Get one lesson to see the columns
    const { data, error } = await supabase
      .from('course_lessons')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('Error:', error);
      return;
    }

    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('Columns in course_lessons table:');
      columns.forEach(col => {
        const value = data[0][col];
        const type = value === null ? 'null' : typeof value;
        console.log(`  - ${col} (${type})`);
      });

      console.log('\n📝 Sample data:');
      console.log(`  Title: ${data[0].title}`);
      console.log(`  Lesson Number: ${data[0].lesson_number}`);
      console.log(`  Has slides_html: ${!!data[0].slides_html}`);
      console.log(`  Has video_url: ${!!data[0].video_url}`);
    } else {
      console.log('No data found in course_lessons table');
    }

    // Count total lessons
    const { count } = await supabase
      .from('course_lessons')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\nTotal lessons in database: ${count}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

checkSchema().catch(console.error);