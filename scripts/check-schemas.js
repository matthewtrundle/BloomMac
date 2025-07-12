const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getTableSchema(tableName) {
  try {
    // Get one row to see the structure
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      return { table: tableName, error: error.message };
    }
    
    if (data && data.length > 0) {
      return { 
        table: tableName, 
        columns: Object.keys(data[0]),
        sample: data[0]
      };
    } else {
      // Try to get column info even if no data
      const { data: emptySelect, error: emptyError } = await supabase
        .from(tableName)
        .select()
        .limit(0);
        
      if (!emptyError) {
        return { 
          table: tableName, 
          columns: [],
          note: 'Table exists but is empty'
        };
      }
    }
    
    return { table: tableName, columns: [], note: 'No data' };
  } catch (err) {
    return { table: tableName, error: err.message };
  }
}

async function checkAllSchemas() {
  const tables = [
    'user_profiles', 'subscribers', 'email_templates', 'email_sequences',
    'sequence_emails', 'sequence_enrollments', 'contact_submissions',
    'courses', 'course_modules', 'course_lessons', 'email_automation_logs',
    'analytics_events', 'admin_activity_log', 'careers_postings', 'user_preferences',
    'course_enrollments', 'lesson_progress', 'email_queue', 'admin_sessions',
    'blog_posts', 'blog_images', 'careers_applications'
  ];
  
  console.log('=== TABLE SCHEMAS ===\n');
  
  for (const table of tables) {
    const schema = await getTableSchema(table);
    
    if (schema.error) {
      console.log(`❌ ${table}: ${schema.error}`);
    } else if (schema.columns && schema.columns.length > 0) {
      console.log(`✅ ${table}:`);
      console.log(`   Columns: ${schema.columns.join(', ')}`);
      if (schema.sample) {
        console.log(`   Sample: ${JSON.stringify(schema.sample).substring(0, 200)}...`);
      }
    } else {
      console.log(`⚠️  ${table}: ${schema.note || 'No columns found'}`);
    }
    console.log('');
  }
}

checkAllSchemas().catch(console.error);