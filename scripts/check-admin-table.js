const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAdminTable() {
  console.log('\n=== CHECKING ADMIN_USERS TABLE ===\n');

  try {
    // Get one row to see structure
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error querying admin_users:', error);
      return;
    }

    console.log('Sample admin_users row:', data);

    // Get Matthews user ID
    const email = 'matthewtrundle@gmail.com';
    const userId = '2a6835a5-6041-463f-b6bb-f6c5d38bea59'; // From earlier check

    // Try to insert with minimal fields
    console.log('\nTrying to insert admin user...');
    const { data: newAdmin, error: insertError } = await supabase
      .from('admin_users')
      .insert({
        id: userId,
        email: email,
        role: 'super_admin',
        is_active: true
      })
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      
      // Try upsert instead
      console.log('\nTrying upsert...');
      const { data: upsertData, error: upsertError } = await supabase
        .from('admin_users')
        .upsert({
          id: userId,
          email: email,
          role: 'super_admin',
          is_active: true
        })
        .select();

      if (upsertError) {
        console.error('Upsert error:', upsertError);
      } else {
        console.log('✅ Upsert successful:', upsertData);
      }
    } else {
      console.log('✅ Insert successful:', newAdmin);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkAdminTable();