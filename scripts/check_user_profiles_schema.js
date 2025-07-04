const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  console.log('Checking user_profiles table schema...\n');
  
  // Try to select all columns from user_profiles (limit 1)
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  // If we get data (even empty array), we can see the columns
  console.log('user_profiles columns:');
  if (data && data.length > 0) {
    console.log(Object.keys(data[0]));
  } else {
    // Try a different approach - select with no results
    const { data: emptyData, error: emptyError } = await supabase
      .from('user_profiles')
      .select()
      .eq('id', '00000000-0000-0000-0000-000000000000') // Non-existent ID
      .single();
    
    // Even with no results, we can sometimes see the structure
    console.log('Table exists but is empty. Trying to infer structure...');
    
    // Let's check what columns we're trying to select in our migration
    console.log('\nColumns our migration expects:');
    console.log('- id (UUID)');
    console.log('- email');
    console.log('- full_name');
    console.log('- role');
    console.log('- last_login_at');
  }
  
  // Also check admin_users for comparison
  console.log('\n\nFor comparison, admin_users columns:');
  const { data: adminData } = await supabase
    .from('admin_users')
    .select('*')
    .limit(1);
  
  if (adminData && adminData.length > 0) {
    console.log(Object.keys(adminData[0]));
  }
}

checkSchema();