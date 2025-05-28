const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ensureAdminUser() {
  console.log('🔐 Ensuring admin user exists...\n');

  try {
    // Check if admin@bloom.com exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'admin@bloom.com')
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('❌ Error checking for admin user:', fetchError.message);
      return;
    }

    if (existingUser) {
      console.log('✅ Admin user already exists: admin@bloom.com');
      
      // Update password to ensure it's correct
      const hashedPassword = await bcrypt.hash('bloom-admin-2024', 12);
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ 
          password: hashedPassword,
          is_active: true 
        })
        .eq('email', 'admin@bloom.com');

      if (updateError) {
        console.error('❌ Error updating password:', updateError.message);
      } else {
        console.log('✅ Password updated successfully');
      }
    } else {
      // Create new admin user
      console.log('Creating new admin user...');
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
        console.error('❌ Error creating admin user:', createError.message);
      } else {
        console.log('✅ Admin user created successfully');
      }
    }

    console.log('\n📌 Admin Login Credentials:');
    console.log('   Email: admin@bloom.com');
    console.log('   Password: bloom-admin-2024');
    console.log('   URL: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

ensureAdminUser();