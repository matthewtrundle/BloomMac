#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase service client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestAdmin() {
  const testAdmin = {
    email: 'testadmin@bloom.local',
    password: 'admin123!@#',
    name: 'Test Admin',
    role: 'admin'
  };

  try {
    console.log('🔧 Creating test admin user...\n');

    // Create or update user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testAdmin.email,
      password: testAdmin.password,
      email_confirm: true,
      user_metadata: {
        name: testAdmin.name,
        role: testAdmin.role
      }
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log('⚠️  User already exists in auth, updating password...');
        
        // Update existing user's password
        const { data: users } = await supabase.auth.admin.listUsers();
        const existingUser = users?.users?.find(u => u.email === testAdmin.email);
        
        if (existingUser) {
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: testAdmin.password }
          );
          
          if (updateError) {
            throw updateError;
          }
          
          console.log('✅ Password updated for existing user');
          
          // Use existing user data
          authData.user = existingUser;
        }
      } else {
        throw authError;
      }
    } else {
      console.log('✅ Auth user created');
    }

    if (!authData?.user) {
      throw new Error('Failed to get user data');
    }

    // Create or update admin_users record
    const { error: adminError } = await supabase
      .from('admin_users')
      .upsert({
        id: authData.user.id,
        email: testAdmin.email,
        name: testAdmin.name,
        role: testAdmin.role,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (adminError) {
      console.error('Admin user creation error:', adminError);
      throw adminError;
    }

    console.log('✅ Admin user record created/updated');

    console.log('\n🎉 Test admin user ready!');
    console.log('   Email:', testAdmin.email);
    console.log('   Password:', testAdmin.password);
    console.log('   Role:', testAdmin.role);
    console.log('\nYou can now use these credentials to log into the admin dashboard.');

  } catch (error) {
    console.error('❌ Error creating test admin:', error.message);
    process.exit(1);
  }
}

// Run the script
createTestAdmin().then(() => {
  console.log('\n✅ Done!');
  process.exit(0);
});