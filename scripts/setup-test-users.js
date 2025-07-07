const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.test' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupTestUsers() {
  console.log('🔧 Setting up test users...');

  try {
    // Create standard test user
    const { data: user1, error: error1 } = await supabase.auth.admin.createUser({
      email: 'testuser@example.com',
      password: 'password',
      email_confirm: true,
      user_metadata: {
        first_name: 'Test',
        last_name: 'User'
      }
    });

    if (error1 && error1.message !== 'A user with this email address has already been registered') {
      throw error1;
    }

    console.log('✅ Standard test user created/exists');

    // Create provider test user
    const { data: user2, error: error2 } = await supabase.auth.admin.createUser({
      email: 'testprovider@example.com',
      password: 'password',
      email_confirm: true,
      user_metadata: {
        first_name: 'Test',
        last_name: 'Provider',
        role: 'provider'
      }
    });

    if (error2 && error2.message !== 'A user with this email address has already been registered') {
      throw error2;
    }

    console.log('✅ Provider test user created/exists');

    // Create user profiles if they don't exist
    if (user1) {
      await supabase.from('user_profiles').upsert({
        id: user1.user.id,
        first_name: 'Test',
        last_name: 'User',
        role: 'user'
      }, { onConflict: 'id' });
    }

    if (user2) {
      await supabase.from('user_profiles').upsert({
        id: user2.user.id,
        first_name: 'Test',
        last_name: 'Provider',
        role: 'provider'
      }, { onConflict: 'id' });
    }

    console.log('✅ User profiles created/updated');
    console.log('\nTest users ready:');
    console.log('- Standard user: testuser@example.com / password');
    console.log('- Provider: testprovider@example.com / password');

  } catch (error) {
    console.error('❌ Error setting up test users:', error);
    process.exit(1);
  }
}

setupTestUsers();