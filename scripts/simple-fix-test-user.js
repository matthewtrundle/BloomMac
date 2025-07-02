#!/usr/bin/env node
/**
 * Simple fix for test user profile - minimal required fields only
 * Run with: node scripts/simple-fix-test-user.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function simpleFixTestUser() {
  console.log('🔧 Simple fix for test user...\n');

  try {
    // Step 1: Find the test user
    console.log('1️⃣ Finding test@bloom.com...');
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const testUser = users.find(u => u.email === 'test@bloom.com');
    
    if (!testUser) {
      console.log('❌ Test user not found in auth system');
      console.log('   Creating new user...');
      
      // Create the user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: 'test@bloom.com',
        password: 'TestBloom123!',
        email_confirm: true
      });
      
      if (createError) {
        console.error('❌ Failed to create user:', createError.message);
        return;
      }
      
      testUser = newUser.user;
      console.log('✅ User created with ID:', testUser.id);
    } else {
      console.log('✅ Found user ID:', testUser.id);
    }
    
    const userId = testUser.id;
    
    // Step 2: Try to create a minimal profile
    console.log('\n2️⃣ Creating minimal profile...');
    
    // First, delete any existing profile
    await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);
    
    // Create with only required fields
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        first_name: 'Sarah',
        last_name: 'Johnson',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
    if (profileError) {
      console.error('❌ Failed to create profile:', profileError.message);
      console.log('\n3️⃣ Trying upsert instead...');
      
      // Try upsert
      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          first_name: 'Sarah',
          last_name: 'Johnson'
        }, {
          onConflict: 'id'
        });
        
      if (upsertError) {
        console.error('❌ Upsert also failed:', upsertError.message);
      } else {
        console.log('✅ Profile upserted successfully');
      }
    } else {
      console.log('✅ Profile created successfully');
    }
    
    // Step 3: Test the login
    console.log('\n4️⃣ Testing login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@bloom.com',
      password: 'TestBloom123!'
    });
    
    if (authError) {
      console.error('❌ Login failed:', authError.message);
      
      // Try to reset password
      console.log('\n5️⃣ Updating password...');
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { password: 'TestBloom123!' }
      );
      
      if (updateError) {
        console.error('❌ Password update failed:', updateError.message);
      } else {
        console.log('✅ Password updated');
        
        // Try login again
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email: 'test@bloom.com',
          password: 'TestBloom123!'
        });
        
        if (retryError) {
          console.error('❌ Login still failing:', retryError.message);
        } else {
          console.log('✅ Login successful after password reset!');
        }
      }
    } else {
      console.log('✅ Login successful!');
      await supabase.auth.signOut();
    }
    
    // Step 4: Show final status
    console.log('\n📊 Final Status:');
    console.log('   Email: test@bloom.com');
    console.log('   Password: TestBloom123!');
    console.log('   User ID:', userId);
    
    // Check what data exists
    const { data: finalProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (finalProfile) {
      console.log('   Profile exists: Yes');
      console.log('   Name:', finalProfile.first_name, finalProfile.last_name);
    } else {
      console.log('   Profile exists: No');
    }
    
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('user_id', userId);
    console.log('   Course enrollments:', enrollments?.length || 0);
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.error(error);
  }
}

// Run the fix
simpleFixTestUser();