const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAdminUsers() {
  console.log('🔍 Checking admin users...\n');
  
  try {
    // Check admin_users table
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (adminError) {
      console.error('Error fetching admin users:', adminError);
      return;
    }
    
    console.log(`Found ${adminUsers?.length || 0} admin users:`);
    
    if (adminUsers && adminUsers.length > 0) {
      adminUsers.forEach(admin => {
        console.log(`\n👤 Admin User:`);
        console.log(`   ID: ${admin.id}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Active: ${admin.is_active}`);
        console.log(`   Permissions: ${JSON.stringify(admin.permissions)}`);
        console.log(`   Last Login: ${admin.last_login_at || 'Never'}`);
        console.log(`   Login Count: ${admin.login_count}`);
      });
    }
    
    // Check if we have any super admins
    const superAdmins = adminUsers?.filter(u => u.role === 'super_admin' && u.is_active);
    
    if (!superAdmins || superAdmins.length === 0) {
      console.log('\n⚠️  WARNING: No active super admins found!');
      console.log('You need to set up at least one super admin.');
    } else {
      console.log(`\n✅ Found ${superAdmins.length} active super admin(s)`);
    }
    
    // Check auth.users to see who might need admin access
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (!authError && authUsers) {
      const nonAdminUsers = authUsers.users.filter(
        user => !adminUsers?.some(admin => admin.id === user.id)
      );
      
      if (nonAdminUsers.length > 0) {
        console.log('\n📋 Regular users who could be made admin:');
        nonAdminUsers.forEach(user => {
          console.log(`   - ${user.email} (ID: ${user.id})`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAdminUsers();