require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProfileTables() {
  console.log('🔍 Checking Profile-Related Tables...\n');

  const profileTables = [
    'user_profiles',
    'profiles', 
    'users',
    'patient_profiles',
    'wellness_profiles',
    'user_profile',
    'profile'
  ];

  for (const table of profileTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`❌ ${table}: Does not exist`);
        } else {
          console.log(`❌ ${table}: ${error.message}`);
        }
      } else {
        if (data && data.length > 0) {
          const columns = Object.keys(data[0]);
          console.log(`✅ ${table}: Exists with columns: ${columns.join(', ')}`);
          console.log(`   Sample data:`, JSON.stringify(data[0], null, 2));
        } else {
          // Try to get columns even if empty
          console.log(`✅ ${table}: Exists but is empty`);
        }
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }

  // Also check auth.users table
  console.log('\n🔍 Checking auth.users table:');
  try {
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    if (error) {
      console.log(`❌ auth.users: ${error.message}`);
    } else {
      console.log(`✅ auth.users: Found ${data.users.length} users`);
      if (data.users.length > 0) {
        const user = data.users[0];
        console.log(`   Sample user fields: ${Object.keys(user).join(', ')}`);
      }
    }
  } catch (err) {
    console.log(`❌ auth.users: ${err.message}`);
  }
}

checkProfileTables().catch(console.error);