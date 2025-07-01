const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function makeUserAdmin(email) {
  console.log(`🔧 Making ${email} an admin...\n`);

  // First, find the user
  const { data: users, error: searchError } = await supabase.auth.admin.listUsers();
  
  if (searchError) {
    console.error('❌ Error searching for user:', searchError);
    return;
  }

  const user = users.users.find(u => u.email === email);
  
  if (!user) {
    console.error(`❌ User not found: ${email}`);
    console.log('\nAvailable users:');
    users.users.forEach(u => console.log(`  - ${u.email}`));
    return;
  }

  console.log(`✅ Found user: ${user.email} (ID: ${user.id})`);

  // Check if already admin
  const { data: existingAdmin, error: checkError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (existingAdmin) {
    console.log('⚠️  User is already an admin');
    console.log(`   Role: ${existingAdmin.role}`);
    console.log(`   Active: ${existingAdmin.is_active}`);
    
    if (!existingAdmin.is_active) {
      // Reactivate
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ is_active: true })
        .eq('id', user.id);
      
      if (!updateError) {
        console.log('✅ Admin account reactivated');
      }
    }
    return;
  }

  // Create admin record with the existing table structure
  const { data: newAdmin, error: insertError } = await supabase
    .from('admin_users')
    .insert({
      id: user.id,
      email: user.email,
      password: 'supabase_auth', // Placeholder - auth is handled by Supabase
      name: user.user_metadata?.full_name || email.split('@')[0],
      role: 'super_admin',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (insertError) {
    console.error('❌ Error creating admin record:', insertError);
    return;
  }

  console.log('✅ Admin privileges granted!');
  console.log(`   Role: ${newAdmin.role}`);
  console.log(`   Name: ${newAdmin.name}`);

  // Log the action
  await supabase
    .from('admin_activity_log')
    .insert({
      user_id: user.id,
      action: 'admin_created',
      entity_type: 'admin_users',
      entity_id: user.id,
      details: {
        granted_by: 'migration_script',
        role: 'super_admin'
      }
    });

  console.log('\n🎉 Success! User can now log in at /admin/login');
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/make-user-admin.js <email>');
  console.log('Example: node scripts/make-user-admin.js beta1@bloomtest.com');
  process.exit(1);
}

makeUserAdmin(email).catch(console.error);