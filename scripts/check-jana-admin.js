const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAndUpdateJana() {
  const targetEmail = 'jana@bloompsychologynorthaustin.com';
  console.log(`\nChecking user: ${targetEmail}`);
  console.log('='.repeat(50));
  
  try {
    // Step 1: Check if user exists in auth.users
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error accessing auth.users:', authError);
      return;
    }
    
    const janaUser = authData.users.find(u => u.email === targetEmail);
    
    if (!janaUser) {
      console.log('\n❌ User NOT found in auth.users');
      console.log('   This user needs to sign up first before we can make them admin.');
      return;
    }
    
    console.log('\n✅ User found in auth.users:');
    console.log(`   - User ID: ${janaUser.id}`);
    console.log(`   - Email: ${janaUser.email}`);
    console.log(`   - Created: ${janaUser.created_at}`);
    
    // Step 2: Check user_profiles for current role
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', janaUser.id)
      .single();
    
    if (profileError) {
      console.log('\n⚠️  No profile found in user_profiles');
      console.log('   Need to create profile entry first');
      
      // Create profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          id: janaUser.id,
          first_name: 'Jana',
          last_name: 'Rundle',
          role: 'admin'
        })
        .select()
        .single();
        
      if (createError) {
        console.error('Error creating profile:', createError);
        return;
      }
      
      console.log('\n✅ Profile created with admin role!');
      return;
    }
    
    console.log('\n✅ Profile found in user_profiles:');
    console.log(`   - First Name: ${profile.first_name || 'Not set'}`);
    console.log(`   - Last Name: ${profile.last_name || 'Not set'}`);
    console.log(`   - Current Role: ${profile.role || 'Not set'}`);
    
    // Step 3: Check if already admin
    if (profile.role === 'admin') {
      console.log('\n✅ User is ALREADY an admin! No changes needed.');
      return;
    }
    
    // Step 4: Show what we'll do
    console.log('\n📋 PLAN:');
    console.log(`   - Current role: ${profile.role || 'none'}`);
    console.log('   - New role: admin');
    console.log('\n   Ready to update? (This is just showing the plan)');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkAndUpdateJana();