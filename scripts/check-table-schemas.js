require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableSchemas() {
  console.log('📋 Checking Table Schemas...\n');

  const tablesToCheck = ['blog_posts', 'analytics_events', 'admin_users'];

  for (const table of tablesToCheck) {
    console.log(`\n🔍 ${table}:`);
    try {
      // Get one row to see the columns
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`  ❌ Error: ${error.message}`);
      } else if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        console.log(`  ✅ Columns: ${columns.join(', ')}`);
      } else {
        // Try to get column info even if table is empty
        const { data: emptyData, error: emptyError } = await supabase
          .from(table)
          .select('*')
          .limit(0);
        
        if (!emptyError) {
          console.log(`  ✅ Table exists but is empty`);
        }
      }
    } catch (err) {
      console.log(`  ❌ Error: ${err.message}`);
    }
  }

  // Also check the actual columns we need
  console.log('\n📊 Checking Required Columns:');
  
  // Check blog_posts for is_published instead of status
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('is_published')
      .limit(1);
    
    if (!error) {
      console.log('  ✅ blog_posts has is_published column');
    }
  } catch (err) {
    console.log('  ❌ blog_posts.is_published not found');
  }

  // Check analytics_events structure
  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .limit(1);
    
    if (!error && data) {
      console.log('  ✅ analytics_events structure:', Object.keys(data[0] || {}).join(', '));
    }
  } catch (err) {
    console.log('  ❌ Could not check analytics_events structure');
  }

  // Check admin_users structure
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);
    
    if (!error && data) {
      console.log('  ✅ admin_users structure:', Object.keys(data[0] || {}).join(', '));
    }
  } catch (err) {
    console.log('  ❌ Could not check admin_users structure');
  }
}

checkTableSchemas().catch(console.error);