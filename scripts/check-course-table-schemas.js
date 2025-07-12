const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableSchemas() {
  const tables = ['course_purchases', 'user_course_access', 'course_progress', 'course_enrollments'];
  
  for (const table of tables) {
    console.log(`\n🔍 Checking schema for: ${table}`);
    console.log('─'.repeat(50));
    
    try {
      // Get one row to see the schema
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`❌ Error: ${error.message}`);
        continue;
      }
      
      if (data && data.length > 0) {
        console.log('Columns found:');
        Object.entries(data[0]).forEach(([key, value]) => {
          console.log(`  - ${key}: ${typeof value} (example: ${JSON.stringify(value)?.substring(0, 50)}...)`);
        });
      } else {
        // If no data, try to get columns from a different query
        const { data: emptySelect } = await supabase
          .from(table)
          .select('*')
          .limit(0);
          
        console.log('✅ Table exists but has no data');
        console.log('To see columns, checking with test insert...');
        
        // Special handling for each table type
        if (table === 'course_purchases') {
          console.log('Expected columns: id, user_id, course_id, amount, status, created_at, updated_at');
        } else if (table === 'user_course_access') {
          const { data: accessData } = await supabase
            .from('user_course_access')
            .select('*');
          if (accessData && accessData.length > 0) {
            console.log('Sample data:', accessData[0]);
          }
        } else if (table === 'course_progress') {
          const { data: progressData } = await supabase
            .from('course_progress')
            .select('*');
          if (progressData && progressData.length > 0) {
            console.log('Sample data:', progressData[0]);
          }
        }
      }
      
      // Try to get count
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      console.log(`\nTotal rows: ${count || 0}`);
      
    } catch (err) {
      console.log(`❌ Unexpected error: ${err.message}`);
    }
  }
  
  // Also check what's in user_course_access and course_progress
  console.log('\n\n📊 Checking existing data in access/progress tables...');
  
  const { data: accessData } = await supabase
    .from('user_course_access')
    .select('*, user:auth.users(email)')
    .limit(5);
    
  if (accessData && accessData.length > 0) {
    console.log('\nuser_course_access entries:');
    accessData.forEach(entry => {
      console.log(`  User: ${entry.user_id}, Course: ${entry.course_id}, Granted: ${entry.created_at}`);
    });
  }
  
  const { data: progressData } = await supabase
    .from('course_progress')
    .select('*')
    .limit(5);
    
  if (progressData && progressData.length > 0) {
    console.log('\ncourse_progress entries:');
    progressData.forEach(entry => {
      console.log(`  User: ${entry.user_id}, Lesson: ${entry.lesson_id}, Completed: ${entry.completed_at || 'In Progress'}`);
    });
  }
}

checkTableSchemas().catch(console.error);