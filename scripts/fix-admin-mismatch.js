#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixAdminMismatch() {
  console.log('🔧 Fixing admin user mismatches...\n');

  try {
    // Get the actual auth user
    const { data: authData } = await supabase.auth.admin.listUsers();
    const adminAuthUser = authData.users.find(u => u.email === 'admin@bloompsychologynorthaustin.com');

    if (!adminAuthUser) {
      console.log('❌ No admin@bloompsychologynorthaustin.com found in auth');
      return;
    }

    console.log(`✅ Found auth user: ${adminAuthUser.email} (ID: ${adminAuthUser.id})`);

    // Add the auth user to admin_users table
    const { data: insertData, error: insertError } = await supabase
      .from('admin_users')
      .upsert({
        id: adminAuthUser.id,
        email: adminAuthUser.email,
        name: 'Dr. Jana Rundle',
        role: 'super_admin',
        is_active: true
      }, {
        onConflict: 'id'
      })
      .select();

    if (insertError) {
      console.error('❌ Error adding admin user:', insertError);
      return;
    }

    console.log('✅ Added/updated admin user in admin_users table');

    // Remove the mismatched jana@ entry
    const { error: deleteError } = await supabase
      .from('admin_users')
      .delete()
      .eq('email', 'jana@bloompsychologynorthaustin.com');

    if (deleteError) {
      console.error('❌ Error removing mismatched user:', deleteError);
    } else {
      console.log('✅ Removed mismatched jana@bloompsychologynorthaustin.com entry');
    }

    console.log('\n🎉 Admin user mismatch fixed!');
    console.log('You can now use: admin@bloompsychologynorthaustin.com');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixAdminMismatch().catch(console.error);