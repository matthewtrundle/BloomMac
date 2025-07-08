const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addAdminUser(email, password) {
  console.log(`\n=== ADDING ADMIN USER: ${email} ===\n`);

  try {
    // 1. First check if user exists in auth.users
    const { data: existingAuth } = await supabase.auth.admin.listUsers();
    const authUser = existingAuth?.users?.find(u => u.email === email);
    
    let userId;
    
    if (authUser) {
      console.log('✅ User already exists in auth.users');
      userId = authUser.id;
    } else {
      console.log('Creating new auth user...');
      // Create auth user
      const { data: newAuth, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true
      });

      if (authError) {
        console.error('❌ Error creating auth user:', authError);
        return;
      }

      userId = newAuth.user.id;
      console.log('✅ Auth user created with ID:', userId);
    }

    // 2. Check if admin_users record exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('   Current role:', existingAdmin.role);
      console.log('   Active:', existingAdmin.is_active);
      
      // Update to ensure they're active
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({
          role: 'super_admin',
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ Error updating admin user:', updateError);
      } else {
        console.log('✅ Updated admin user to super_admin and active');
      }
    } else {
      console.log('Creating admin_users record...');
      
      // Hash the password for admin table
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create admin_users record
      const { data: newAdmin, error: adminError } = await supabase
        .from('admin_users')
        .insert({
          id: userId,
          email: email,
          role: 'super_admin',
          is_active: true,
          password_hash: hashedPassword,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (adminError) {
        console.error('❌ Error creating admin user:', adminError);
        return;
      }

      console.log('✅ Admin user created successfully');
    }

    // 3. Also ensure user_profiles exists (for consistency)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) {
      console.log('Creating user_profiles record...');
      await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          first_name: 'Matthew',
          last_name: 'Trundle',
          role: 'admin',
          created_at: new Date().toISOString()
        });
      console.log('✅ User profile created');
    }

    console.log('\n🎉 Admin setup complete!');
    console.log(`\nYou can now log in at /admin/login with:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Get credentials from command line or use defaults
const email = process.argv[2] || 'matthewtrundle@gmail.com';
const password = process.argv[3] || 'TempPassword123!';

if (!process.argv[3]) {
  console.log('\n⚠️  Using default password: TempPassword123!');
  console.log('   You should change this after first login!');
}

addAdminUser(email, password);