const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCourseTables() {
  console.log('📋 Checking Course Tables Structure...\n');

  const tables = ['courses', 'course_modules', 'course_lessons'];

  for (const table of tables) {
    console.log(`\n🔍 Table: ${table}`);
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`  ❌ Error: ${error.message}`);
      } else if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        console.log(`  ✅ Columns:`, columns);
        
        // Show sample data structure
        console.log(`  📄 Sample row structure:`);
        for (const [key, value] of Object.entries(data[0])) {
          const valueType = typeof value;
          const valuePreview = valueType === 'string' && value.length > 50 
            ? value.substring(0, 50) + '...' 
            : value;
          console.log(`     - ${key}: ${valueType} (${valuePreview})`);
        }
      } else {
        console.log(`  ⚠️  Table exists but is empty`);
      }
    } catch (err) {
      console.log(`  ❌ Error: ${err.message}`);
    }
  }

  // Now let's check relationships
  console.log('\n\n📊 Checking Relationships:');
  
  try {
    // Get course
    const { data: course } = await supabase
      .from('courses')
      .select('id, title, slug')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();
    
    if (course) {
      console.log(`\n✅ Found course: ${course.title} (${course.id})`);
      
      // Get modules
      const { data: modules } = await supabase
        .from('course_modules')
        .select('id, week_number, title')
        .eq('course_id', course.id)
        .order('week_number');
      
      if (modules) {
        console.log(`\n✅ Found ${modules.length} modules`);
        
        // Check first module's lessons
        if (modules.length > 0) {
          const firstModule = modules[0];
          console.log(`\n📁 Checking lessons for Week ${firstModule.week_number}: ${firstModule.title}`);
          
          // Try different column names
          const possibleColumns = ['course_module_id', 'module_id', 'course_modules_id'];
          
          for (const colName of possibleColumns) {
            const { data: lessons, error } = await supabase
              .from('course_lessons')
              .select('id, lesson_number, title')
              .eq(colName, firstModule.id)
              .order('lesson_number');
            
            if (!error && lessons) {
              console.log(`  ✅ Found ${lessons.length} lessons using column: ${colName}`);
              break;
            } else if (error) {
              console.log(`  ❌ Column ${colName} error: ${error.message}`);
            }
          }
        }
      }
    }
  } catch (err) {
    console.log(`\n❌ Relationship check error: ${err.message}`);
  }
}

checkCourseTables().catch(console.error);