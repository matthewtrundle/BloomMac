const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAdminLogin() {
  console.log('=== Testing Admin Login ===\n');
  
  // 1. Check if admin_users table exists
  console.log('1. Checking if admin_users table exists...');
  const { data: tableCheck, error: tableError } = await supabase
    .from('admin_users')
    .select('id')
    .limit(1);
  
  if (tableError && tableError.code === '42P01') {
    console.log('❌ admin_users table does not exist!');
    console.log('   Please run the SQL in create-admin-tables.js in Supabase dashboard.');
    return;
  }
  
  console.log('✅ admin_users table exists\n');
  
  // 2. List all admin users
  console.log('2. Listing all admin users...');
  const { data: adminUsers, error: listError } = await supabase
    .from('admin_users')
    .select('id, email, name, role, is_active, created_at');
  
  if (listError) {
    console.error('Error listing admin users:', listError);
    return;
  }
  
  if (!adminUsers || adminUsers.length === 0) {
    console.log('❌ No admin users found in database!');
    console.log('   Let\'s create one...\n');
    
    // Create admin user
    const password = 'bloom-admin-2024';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const { data: newAdmin, error: createError } = await supabase
      .from('admin_users')
      .insert({
        email: 'admin@bloom.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'super_admin',
        is_active: true
      })
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating admin user:', createError);
      return;
    }
    
    console.log('✅ Created admin user:');
    console.log('   Email:', newAdmin.email);
    console.log('   Password: bloom-admin-2024');
    console.log('   Role:', newAdmin.role);
  } else {
    console.log(`Found ${adminUsers.length} admin user(s):`);
    adminUsers.forEach((user, index) => {
      console.log(`\n   User ${index + 1}:`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Name: ${user.name}`);
      console.log(`   - Role: ${user.role}`);
      console.log(`   - Active: ${user.is_active}`);
      console.log(`   - Created: ${new Date(user.created_at).toLocaleString()}`);
    });
  }
  
  console.log('\n3. Testing password verification...');
  
  // Test with the reported credentials
  const testEmail = 'admin@bloom.com';
  const testPassword = 'bloom-admin-2024';
  
  const { data: testUser, error: fetchError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', testEmail)
    .single();
  
  if (fetchError || !testUser) {
    console.log(`❌ User with email "${testEmail}" not found`);
    console.log('   Available emails:', adminUsers?.map(u => u.email).join(', '));
  } else {
    console.log(`✅ Found user: ${testUser.email}`);
    
    // Test password
    const isValid = await bcrypt.compare(testPassword, testUser.password);
    console.log(`   Password test: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    
    if (!isValid) {
      console.log('\n   Resetting password to "bloom-admin-2024"...');
      const newHashedPassword = await bcrypt.hash(testPassword, 12);
      
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ password: newHashedPassword })
        .eq('id', testUser.id);
      
      if (updateError) {
        console.error('   Error updating password:', updateError);
      } else {
        console.log('   ✅ Password reset successful!');
      }
    }
  }
  
  console.log('\n4. Creating/updating admin user for reported email...');
  
  // Ensure we have the exact admin user they're trying to use
  const { data: existingAdmin } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', 'admin@bloom.com')
    .single();
  
  if (!existingAdmin) {
    const hashedPwd = await bcrypt.hash('bloom-admin-2024', 12);
    const { error: insertError } = await supabase
      .from('admin_users')
      .insert({
        email: 'admin@bloom.com',
        password: hashedPwd,
        name: 'Admin User',
        role: 'super_admin',
        is_active: true
      });
    
    if (insertError) {
      console.error('Error creating admin@bloom.com:', insertError);
    } else {
      console.log('✅ Created admin@bloom.com with password: bloom-admin-2024');
    }
  } else {
    // Update password to ensure it matches
    const hashedPwd = await bcrypt.hash('bloom-admin-2024', 12);
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ 
        password: hashedPwd,
        is_active: true 
      })
      .eq('email', 'admin@bloom.com');
    
    if (updateError) {
      console.error('Error updating admin@bloom.com:', updateError);
    } else {
      console.log('✅ Updated admin@bloom.com password to: bloom-admin-2024');
    }
  }
  
  console.log('\n=== Login Credentials ===');
  console.log('Email: admin@bloom.com');
  console.log('Password: bloom-admin-2024');
  console.log('\nMake sure you have a login page at /admin/login or similar!');
}

testAdminLogin();