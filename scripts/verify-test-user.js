#!/usr/bin/env node
/**
 * Verifies test user is working properly
 * Run with: node scripts/verify-test-user.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verifyTestUser() {
  console.log('✅ Verifying test user setup...\n');

  try {
    // Test login
    console.log('1️⃣ Testing login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@bloom.com',
      password: 'TestBloom123!'
    });

    if (authError) {
      console.error('❌ Login failed:', authError.message);
      return;
    }

    console.log('✅ Login successful!');
    console.log('   User ID:', authData.user.id);

    // Check profile
    console.log('\n2️⃣ Checking profile...');
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profile) {
      console.log('✅ Profile found:');
      console.log('   Name:', profile.first_name, profile.last_name);
      console.log('   Email:', profile.email);
      console.log('   Phone:', profile.phone);
    } else {
      console.log('❌ No profile found');
      if (profileError) console.error('   Error:', profileError.message);
    }

    // Check course enrollment
    console.log('\n3️⃣ Checking course enrollment...');
    const { data: enrollment } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (enrollment) {
      console.log('✅ Enrolled in course:', enrollment.course_id);
      console.log('   Progress:', enrollment.progress_percentage + '%');
    }

    // Check workbook responses
    console.log('\n4️⃣ Checking workbook data...');
    const { data: responses } = await supabase
      .from('user_workbook_responses')
      .select('*')
      .eq('user_id', authData.user.id);

    console.log(`✅ Workbook responses: ${responses?.length || 0}`);

    // Sign out
    await supabase.auth.signOut();
    
    console.log('\n✨ Everything looks good! Test user is ready to use.');
    console.log('\n📝 Login credentials:');
    console.log('   Email: test@bloom.com');
    console.log('   Password: TestBloom123!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

verifyTestUser();