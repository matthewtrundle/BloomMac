const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAdminAuth() {
  console.log('🔐 Testing Admin Authentication System\n');

  // Check if we have any users
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('❌ Error listing users:', usersError);
    return;
  }

  console.log(`Found ${users.users.length} users in auth system:`);
  users.users.forEach(user => {
    console.log(`  - ${user.email} (ID: ${user.id})`);
  });

  // Check admin users
  const { data: adminUsers, error: adminError } = await supabase
    .from('admin_users')
    .select('*');

  if (adminError) {
    console.error('❌ Error fetching admin users:', adminError);
    return;
  }

  console.log(`\nFound ${adminUsers.length} admin users:`);
  adminUsers.forEach(admin => {
    console.log(`  - ID: ${admin.id}`);
    console.log(`    Role: ${admin.role}`);
    console.log(`    Active: ${admin.is_active}`);
  });

  // Create a test scenario
  console.log('\n📋 Test Scenarios:');
  console.log('1. Admin users can log in at: /admin/login');
  console.log('2. Use an email from the auth users list above');
  console.log('3. The user must exist in both auth.users AND admin_users tables');
  console.log('4. The admin must have is_active = true');

  // Check for potential issues
  console.log('\n⚠️  Checking for potential issues:');
  
  // Find users who are in auth but not admin
  const adminUserIds = adminUsers.map(a => a.id);
  const nonAdminUsers = users.users.filter(u => !adminUserIds.includes(u.id));
  
  if (nonAdminUsers.length > 0) {
    console.log(`\n📌 Users without admin access:`);
    nonAdminUsers.forEach(user => {
      console.log(`  - ${user.email} (needs admin role added)`);
    });
  }

  // Find admin users without auth accounts
  const authUserIds = users.users.map(u => u.id);
  const orphanedAdmins = adminUsers.filter(a => !authUserIds.includes(a.id));
  
  if (orphanedAdmins.length > 0) {
    console.log(`\n⚠️  Admin records without auth accounts:`);
    orphanedAdmins.forEach(admin => {
      console.log(`  - Admin ID: ${admin.id} (orphaned record)`);
    });
  }

  console.log('\n✅ Admin auth system check complete!');
  
  // Show how to create a test admin
  console.log('\n📝 To create a test admin user:');
  console.log('1. Create user in Supabase Auth (Dashboard > Authentication > Users > Invite)');
  console.log('2. After user sets password, run this SQL in Supabase:');
  console.log(`   SELECT * FROM finalize_admin_setup('user@email.com');`);
}

testAdminAuth().catch(console.error);