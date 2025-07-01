#!/usr/bin/env node

/**
 * Setup admin user for Bloom Psychology platform
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupAdminUser() {
  console.log('🔐 Setting up admin user for Bloom Psychology...\n');

  try {
    // Check if admin_users table exists
    console.log('1. Checking admin_users table...');
    const { data: existingAdmins, error: tableError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (tableError && tableError.code === '42P01') {
      console.log('❌ admin_users table does not exist. Creating it...');
      
      // Create admin tables
      const createTablesSQL = `
        -- Create admin_users table
        CREATE TABLE IF NOT EXISTS admin_users (
          id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          last_login TIMESTAMP WITH TIME ZONE
        );

        -- Create admin activity log
        CREATE TABLE IF NOT EXISTS admin_activity_log (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
          action TEXT NOT NULL,
          entity_type TEXT,
          entity_id TEXT,
          details JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

        -- Add policies
        CREATE POLICY "Admin users can manage themselves" ON admin_users
          FOR ALL TO authenticated
          USING (auth.uid() = id)
          WITH CHECK (auth.uid() = id);

        CREATE POLICY "Service role can manage admin users" ON admin_users
          FOR ALL TO service_role
          USING (true)
          WITH CHECK (true);

        CREATE POLICY "Admin users can view activity logs" ON admin_activity_log
          FOR SELECT TO authenticated
          USING (user_id = auth.uid());

        CREATE POLICY "Service role can manage activity logs" ON admin_activity_log
          FOR ALL TO service_role
          USING (true)
          WITH CHECK (true);

        -- Add indexes
        CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
        CREATE INDEX IF NOT EXISTS idx_admin_activity_user_id ON admin_activity_log(user_id);
        CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity_log(created_at DESC);
      `;

      console.log('📋 Run this SQL in your Supabase SQL Editor:');
      console.log(createTablesSQL);
      console.log('\nThen run this script again.');
      return;
    }

    console.log('✅ admin_users table exists');

    // Check existing admin users
    const { data: admins, error: adminError } = await supabase
      .from('admin_users')
      .select('*');

    if (adminError) {
      console.error('❌ Error checking admin users:', adminError);
      return;
    }

    console.log(`📊 Found ${admins.length} existing admin user(s)`);
    if (admins.length > 0) {
      console.log('👥 Existing admins:');
      admins.forEach(admin => {
        console.log(`   ${admin.email} (${admin.role}) - ${admin.is_active ? 'Active' : 'Inactive'}`);
      });
    }

    // Define default admin credentials
    const defaultAdminEmail = 'admin@bloompsychologynorthaustin.com';
    const defaultAdminPassword = 'BloomAdmin2025!';
    const defaultAdminName = 'Dr. Jana Rundle';

    // Check if default admin exists
    const existingDefaultAdmin = admins.find(admin => admin.email === defaultAdminEmail);
    
    if (existingDefaultAdmin) {
      console.log('\n✅ Default admin user already exists!');
      console.log(`📧 Email: ${defaultAdminEmail}`);
      console.log(`👤 Name: ${existingDefaultAdmin.name}`);
      console.log(`🔐 Role: ${existingDefaultAdmin.role}`);
      console.log(`✅ Status: ${existingDefaultAdmin.is_active ? 'Active' : 'Inactive'}`);
      
      if (!existingDefaultAdmin.is_active) {
        console.log('\n⚠️  Admin user is inactive. Reactivating...');
        await supabase
          .from('admin_users')
          .update({ is_active: true, updated_at: new Date().toISOString() })
          .eq('id', existingDefaultAdmin.id);
        console.log('✅ Admin user reactivated');
      }
      
      console.log('\n🔑 Use these credentials to login:');
      console.log(`Email: ${defaultAdminEmail}`);
      console.log(`Password: ${defaultAdminPassword}`);
      console.log('\n🌐 Admin URL: https://www.bloompsychologynorthaustin.com/admin');
      return;
    }

    // Create new admin user
    console.log('\n🔨 Creating new admin user...');

    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: defaultAdminEmail,
      password: defaultAdminPassword,
      email_confirm: true,
      user_metadata: {
        name: defaultAdminName,
        role: 'admin'
      }
    });

    if (authError) {
      console.error('❌ Error creating auth user:', authError);
      
      if (authError.message.includes('already registered')) {
        console.log('\n⚠️  User already exists in auth. Looking up existing user...');
        
        // Try to find existing user by email
        const { data: users, error: listError } = await supabase.auth.admin.listUsers();
        
        if (listError) {
          console.error('❌ Error listing users:', listError);
          return;
        }
        
        const existingUser = users.users.find(user => user.email === defaultAdminEmail);
        if (existingUser) {
          console.log('✅ Found existing auth user, adding to admin_users...');
          
          // Add to admin_users table
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({
              id: existingUser.id,
              email: defaultAdminEmail,
              name: defaultAdminName,
              role: 'super_admin',
              is_active: true
            });

          if (insertError) {
            console.error('❌ Error adding to admin_users:', insertError);
          } else {
            console.log('✅ Admin user created successfully!');
          }
        }
      }
      return;
    }

    console.log('✅ Auth user created');

    // Add to admin_users table
    const { error: adminInsertError } = await supabase
      .from('admin_users')
      .insert({
        id: authData.user.id,
        email: defaultAdminEmail,
        name: defaultAdminName,
        role: 'super_admin',
        is_active: true
      });

    if (adminInsertError) {
      console.error('❌ Error adding to admin_users table:', adminInsertError);
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('\n🔑 Admin Credentials:');
    console.log(`📧 Email: ${defaultAdminEmail}`);
    console.log(`🔒 Password: ${defaultAdminPassword}`);
    console.log(`👤 Name: ${defaultAdminName}`);
    console.log(`🔐 Role: super_admin`);
    console.log('\n🌐 Login at: https://www.bloompsychologynorthaustin.com/admin');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

setupAdminUser().catch(console.error);