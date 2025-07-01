const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableStructure() {
  console.log('🔍 Checking admin_users table structure...\n');

  // Try to fetch one record to see what columns exist
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Columns found in admin_users table:');
    Object.keys(data[0]).forEach(column => {
      console.log(`  - ${column}: ${typeof data[0][column]}`);
    });
    
    console.log('\nSample record:');
    console.log(JSON.stringify(data[0], null, 2));
  } else {
    console.log('No records found, but table exists');
  }
}

checkTableStructure();