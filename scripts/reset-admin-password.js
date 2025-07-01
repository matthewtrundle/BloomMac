#!/usr/bin/env node

/**
 * Reset admin user password
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function resetAdminPassword() {
  console.log('🔒 Admin Password Reset Tool\n');

  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log('Usage: node reset-admin-password.js <email> <new-password>');
    console.log('\nExample: node reset-admin-password.js jana@bloompsychologynorthaustin.com NewPassword123!');
    console.log('\nAvailable admin accounts:');
    
    // List admin accounts
    const { data: admins } = await supabase
      .from('admin_users')
      .select('email, role, is_active');
    
    admins?.forEach(admin => {
      console.log(`  ${admin.email} (${admin.role}) - ${admin.is_active ? 'Active' : 'Inactive'}`);
    });
    return;
  }

  try {
    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (!adminUser) {
      console.log(`❌ ${email} is not an admin user`);
      return;
    }

    // Reset password
    const { data, error } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { password: newPassword }
    );

    if (error) {
      console.error('❌ Error resetting password:', error);
      return;
    }

    console.log('✅ Password reset successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔒 New Password: ${newPassword}`);
    console.log('\n🌐 Login at: https://www.bloompsychologynorthaustin.com/admin');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

resetAdminPassword().catch(console.error);