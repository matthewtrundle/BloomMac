const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkBlogTables() {
  console.log('Checking for blog-related tables in the database...\n');
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Check all tables in public schema
    const { data: tables, error } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (error) {
      // Try alternative approach
      console.log('Trying alternative method to list tables...');
      const { data: pgTables, error: pgError } = await supabaseAdmin
        .rpc('get_tables', { schema_name: 'public' });
      
      if (pgError) {
        console.error('Could not list tables:', pgError);
        return;
      }
      
      console.log('Tables found:', pgTables);
    } else {
      console.log('Tables in public schema:');
      const blogRelated = [];
      const allTables = [];
      
      tables.forEach(table => {
        allTables.push(table.table_name);
        if (table.table_name.includes('blog') || table.table_name.includes('post')) {
          blogRelated.push(table.table_name);
          console.log(`  📝 ${table.table_name} (blog-related)`);
        }
      });
      
      if (blogRelated.length === 0) {
        console.log('\n❌ No blog-related tables found!');
        console.log('\nAll tables in database:');
        allTables.forEach(t => console.log(`  - ${t}`));
      }
    }
    
    // Check if blog_posts exists in any schema
    console.log('\n\nChecking all schemas for blog_posts table:');
    const { data: schemas, error: schemaError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_schema, table_name')
      .eq('table_name', 'blog_posts');
    
    if (!schemaError && schemas) {
      if (schemas.length === 0) {
        console.log('❌ blog_posts table does not exist in any schema');
      } else {
        schemas.forEach(s => {
          console.log(`✅ Found blog_posts in schema: ${s.table_schema}`);
        });
      }
    }
    
  } catch (err) {
    console.error('Error checking tables:', err);
  }
}

checkBlogTables().then(() => {
  console.log('\nCheck complete.');
  process.exit(0);
}).catch(err => {
  console.error('\nCheck failed:', err);
  process.exit(1);
});