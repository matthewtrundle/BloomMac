const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateJanaToAdmin() {
  const userId = '02f54bb5-ccae-4006-aabd-3c66b8f551b0';
  const targetEmail = 'jana@bloompsychologynorthaustin.com';
  
  console.log('\n🔄 UPDATING JANA TO ADMIN');
  console.log('='.repeat(50));
  console.log(`Email: ${targetEmail}`);
  console.log(`User ID: ${userId}`);
  
  try {
    // Update the role in user_profiles
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role: 'admin' })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('\n❌ Error updating role:', error);
      return;
    }
    
    console.log('\n✅ Successfully updated role to admin!');
    console.log('\nUpdated profile:');
    console.log(`   - ID: ${data.id}`);
    console.log(`   - Role: ${data.role}`);
    console.log(`   - First Name: ${data.first_name || 'Not set'}`);
    console.log(`   - Last Name: ${data.last_name || 'Not set'}`);
    
    // Verify the update
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (!verifyError && verifyData.role === 'admin') {
      console.log('\n✅ VERIFIED: Role is now admin');
      console.log('\n📝 Next steps:');
      console.log('   1. Jana can now log in at: /admin/login');
      console.log('   2. Use email: jana@bloompsychologynorthaustin.com');
      console.log('   3. Use her regular password');
      console.log('\n   The admin dashboard will be accessible after login.');
    } else {
      console.error('\n⚠️  Verification failed:', verifyError);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Add confirmation
console.log('\n⚠️  CONFIRMATION REQUIRED');
console.log('This will update jana@bloompsychologynorthaustin.com to admin role.');
console.log('\nPress Ctrl+C to cancel, or wait 3 seconds to continue...\n');

setTimeout(() => {
  updateJanaToAdmin();
}, 3000);