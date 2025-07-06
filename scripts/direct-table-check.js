const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkTablesDirectly() {
  console.log('Checking database tables directly...\n');
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  // List of tables to check
  const tablesToCheck = [
    'blog_posts',
    'blog_post',
    'posts',
    'blogs',
    'blog',
    'blog_entries',
    'blog_articles',
    'subscribers',
    'contact_submissions',
    'analytics_events'
  ];
  
  console.log('Checking existence of specific tables:');
  
  for (const tableName of tablesToCheck) {
    try {
      const { data, error, count } = await supabaseAdmin
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        if (error.code === '42P01') {
          console.log(`❌ ${tableName} - does not exist`);
        } else {
          console.log(`⚠️  ${tableName} - error: ${error.message}`);
        }
      } else {
        console.log(`✅ ${tableName} - exists (${count} rows)`);
      }
    } catch (err) {
      console.log(`❌ ${tableName} - exception: ${err.message}`);
    }
  }
  
  // Try to create the blog_posts table if it doesn't exist
  console.log('\n\nAttempting to create blog_posts table...');
  
  try {
    // This won't work directly through Supabase client, but let's see the error
    const { data, error } = await supabaseAdmin.rpc('create_blog_posts_table');
    
    if (error) {
      console.log('Cannot create table via RPC (expected):', error.message);
      console.log('\n⚠️  The blog_posts table needs to be created in the Supabase dashboard.');
      console.log('   Run the SQL from supabase/schema.sql to create it.');
    }
  } catch (err) {
    // Expected
  }
}

checkTablesDirectly().then(() => {
  console.log('\nCheck complete.');
  process.exit(0);
}).catch(err => {
  console.error('\nCheck failed:', err);
  process.exit(1);
});