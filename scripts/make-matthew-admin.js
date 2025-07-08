const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function makeMatthewAdmin() {
  const email = 'matthewtrundle@gmail.com';
  const userId = '2a6835a5-6041-463f-b6bb-f6c5d38bea59';
  
  console.log(`\n=== MAKING ${email} AN ADMIN ===\n`);

  try {
    // Update user_profiles to have admin role
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        role: 'admin',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('❌ Error updating user role:', error);
      return;
    }

    console.log('✅ Successfully updated user role to admin');
    console.log('Updated profile:', data);

    // Log this admin promotion
    await supabase
      .from('admin_activity_log')
      .insert({
        user_id: userId,
        action: 'role_change',
        entity_type: 'user',
        entity_id: userId,
        details: {
          old_role: 'student',
          new_role: 'admin',
          changed_by: 'script'
        }
      });

    console.log('\n🎉 Success! You can now log in at /admin/login with:');
    console.log(`Email: ${email}`);
    console.log('Password: [your regular password]');

  } catch (error) {
    console.error('Error:', error);
  }
}

makeMatthewAdmin();