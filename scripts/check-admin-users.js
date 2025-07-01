#!/usr/bin/env node

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
    console.log('1. Admin users in database:');
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*');

    if (adminError) {
      console.error('❌ Error fetching admin users:', adminError);
      return;
    }

    console.log(`Found ${adminUsers.length} admin users in database:`);
    adminUsers.forEach(user => {
      console.log(`  ${user.email} (${user.role}) - ${user.is_active ? 'Active' : 'Inactive'}`);
    });

    // Check auth users
    console.log('\n2. Users in Supabase Auth:');
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }

    console.log(`Found ${authData.users.length} users in auth:`);
    authData.users.forEach(user => {
      console.log(`  ${user.email} - ${user.email_confirmed_at ? 'Confirmed' : 'Unconfirmed'}`);
    });

    // Find mismatches
    console.log('\n3. Checking for mismatches:');
    const adminEmails = new Set(adminUsers.map(u => u.email));
    const authEmails = new Set(authData.users.map(u => u.email));

    const adminOnlyEmails = [...adminEmails].filter(email => !authEmails.has(email));
    const authOnlyEmails = [...authEmails].filter(email => !adminEmails.has(email));

    if (adminOnlyEmails.length > 0) {
      console.log('⚠️  Admin users without auth accounts:');
      adminOnlyEmails.forEach(email => console.log(`  ${email}`));
    }

    if (authOnlyEmails.length > 0) {
      console.log('⚠️  Auth users without admin records:');
      authOnlyEmails.forEach(email => console.log(`  ${email}`));
    }

    if (adminOnlyEmails.length === 0 && authOnlyEmails.length === 0) {
      console.log('✅ All admin users have matching auth accounts');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkAdminUsers().catch(console.error);