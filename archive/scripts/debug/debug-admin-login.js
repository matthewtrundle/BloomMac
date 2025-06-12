const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfsxhqmwwdqkjapqjdly.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugAdminLogin() {
  console.log('🔍 Debugging Admin Login\n');

  // Step 1: Check if admin users table exists
  console.log('1. Checking admin_users table...');
  const { data: users, error: usersError } = await supabase
    .from('admin_users')
    .select('*');

  if (usersError) {
    console.log('❌ Error accessing admin_users table:', usersError.message);
    return;
  }

  console.log('✅ Found', users.length, 'admin users:');
  users.forEach(user => {
    console.log(`   - ${user.email} (${user.role}) - Active: ${user.is_active}`);
  });

  // Step 2: Test password for admin@bloom.com
  console.log('\n2. Testing password for admin@bloom.com...');
  const adminUser = users.find(u => u.email === 'admin@bloom.com');
  
  if (!adminUser) {
    console.log('❌ admin@bloom.com not found!');
    console.log('\n3. Creating admin@bloom.com user...');
    
    const hashedPassword = await bcrypt.hash('bloom-admin-2024', 12);
    const { data: newUser, error: createError } = await supabase
      .from('admin_users')
      .insert({
        email: 'admin@bloom.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
        is_active: true
      })
      .select()
      .single();

    if (createError) {
      console.log('❌ Error creating admin user:', createError.message);
    } else {
      console.log('✅ Created admin@bloom.com successfully');
    }
  } else {
    // Test password
    const testPassword = 'bloom-admin-2024';
    const isValid = await bcrypt.compare(testPassword, adminUser.password);
    console.log(`   Password test result: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    
    if (!isValid) {
      console.log('\n3. Resetting password for admin@bloom.com...');
      const newHashedPassword = await bcrypt.hash('bloom-admin-2024', 12);
      
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ password: newHashedPassword })
        .eq('email', 'admin@bloom.com');
      
      if (updateError) {
        console.log('❌ Error updating password:', updateError.message);
      } else {
        console.log('✅ Password reset successfully');
      }
    }
  }

  // Step 3: Test login API
  console.log('\n4. Testing login API endpoint...');
  try {
    const response = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@bloom.com',
        password: 'bloom-admin-2024'
      })
    });

    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, data);
    
    if (response.headers.get('set-cookie')) {
      console.log(`   ✅ Cookie set:`, response.headers.get('set-cookie').substring(0, 50) + '...');
    } else {
      console.log(`   ❌ No cookie set`);
    }
  } catch (error) {
    console.log('❌ Error testing login API:', error.message);
  }

  console.log('\n📌 Summary:');
  console.log('- Admin user should exist with email: admin@bloom.com');
  console.log('- Password should be: bloom-admin-2024');
  console.log('- Login API should return status 200 and set adminToken cookie');
  console.log('\nIf login still fails, check browser console for errors.');
}

// Run debug
debugAdminLogin().catch(console.error);