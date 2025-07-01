#!/usr/bin/env node

/**
 * Test Database Operations
 * Tests basic CRUD operations on all tables
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🧪 TESTING DATABASE OPERATIONS\n');

// Use existing user for tests
const existingUserId = '284c1874-aef8-41eb-9541-e3776484fd39'; // beta1@bloomtest.com

async function testUserProfile() {
  console.log('1️⃣ Testing User Profile Operations...\n');
  
  try {
    // Check if profile exists
    let { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', existingUserId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, create it
      console.log('   Creating user profile...');
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: existingUserId,
          first_name: 'Beta',
          last_name: 'Tester',
          phone: '+1234567890',
          postpartum_date: '2024-01-01',
          number_of_children: 1,
          total_stars: 0
        })
        .select()
        .single();
      
      if (createError) {
        console.log('❌ Profile creation failed:', createError.message);
        return false;
      }
      
      profile = newProfile;
      console.log('✅ Profile created successfully');
    } else if (error) {
      console.log('❌ Profile query failed:', error.message);
      return false;
    } else {
      console.log('✅ Profile exists');
    }
    
    console.log(`   Name: ${profile.first_name} ${profile.last_name}`);
    console.log(`   Stars: ${profile.total_stars}\n`);
    
    // Update profile
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ total_stars: (profile.total_stars || 0) + 1 })
      .eq('user_id', existingUserId);
    
    if (updateError) {
      console.log('❌ Profile update failed:', updateError.message);
    } else {
      console.log('✅ Profile updated (added 1 star)\n');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Profile test failed:', error.message);
    return false;
  }
}

async function testAchievements() {
  console.log('2️⃣ Testing Achievement System...\n');
  
  try {
    // Try to award achievement
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: existingUserId,
        achievement_id: 'database_test_' + Date.now()
      })
      .select()
      .single();
    
    if (error) {
      console.log('❌ Achievement insert failed:', error.message);
      return false;
    }
    
    console.log('✅ Achievement awarded');
    console.log(`   ID: ${data.achievement_id}`);
    console.log(`   Earned: ${new Date(data.earned_at).toLocaleString()}\n`);
    
    // List all achievements
    const { data: allAchievements, error: listError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', existingUserId);
    
    if (!listError) {
      console.log(`📊 Total achievements: ${allAchievements.length}\n`);
    }
    
    return true;
  } catch (error) {
    console.log('❌ Achievement test failed:', error.message);
    return false;
  }
}

async function testCourseProgress() {
  console.log('3️⃣ Testing Course Progress...\n');
  
  try {
    // Create progress entry
    const { data, error } = await supabase
      .from('course_progress')
      .insert({
        user_id: existingUserId,
        course_id: 'test-course',
        week_number: 1,
        lesson_number: 1,
        status: 'in_progress',
        video_progress_percentage: 50,
        time_spent_minutes: 15
      })
      .select()
      .single();
    
    if (error && error.code === '23505') {
      console.log('⚠️  Progress entry already exists');
      
      // Update existing
      const { error: updateError } = await supabase
        .from('course_progress')
        .update({
          status: 'completed',
          video_progress_percentage: 100,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', existingUserId)
        .eq('course_id', 'test-course')
        .eq('week_number', 1)
        .eq('lesson_number', 1);
      
      if (updateError) {
        console.log('❌ Progress update failed:', updateError.message);
      } else {
        console.log('✅ Progress updated to completed\n');
      }
    } else if (error) {
      console.log('❌ Progress creation failed:', error.message);
      return false;
    } else {
      console.log('✅ Progress entry created');
      console.log(`   Status: ${data.status}`);
      console.log(`   Progress: ${data.video_progress_percentage}%\n`);
    }
    
    return true;
  } catch (error) {
    console.log('❌ Course progress test failed:', error.message);
    return false;
  }
}

async function testAppointments() {
  console.log('4️⃣ Testing Appointment System...\n');
  
  try {
    // Create future appointment
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    
    const { data, error } = await supabase
      .from('appointment_data')
      .insert({
        user_id: existingUserId,
        appointment_type: 'consultation',
        appointment_date: futureDate.toISOString(),
        appointment_end: new Date(futureDate.getTime() + 30 * 60 * 1000).toISOString(),
        status: 'scheduled',
        payment_status: 'pending',
        session_fee_dollars: 150.00
      })
      .select()
      .single();
    
    if (error) {
      console.log('❌ Appointment creation failed:', error.message);
      return false;
    }
    
    console.log('✅ Appointment created');
    console.log(`   Type: ${data.appointment_type}`);
    console.log(`   Date: ${new Date(data.appointment_date).toLocaleDateString()}`);
    console.log(`   Status: ${data.status}\n`);
    
    // List appointments
    const { data: appointments, error: listError } = await supabase
      .from('appointment_data')
      .select('*')
      .eq('user_id', existingUserId)
      .order('appointment_date', { ascending: false });
    
    if (!listError) {
      console.log(`📊 Total appointments: ${appointments.length}\n`);
    }
    
    return true;
  } catch (error) {
    console.log('❌ Appointment test failed:', error.message);
    return false;
  }
}

async function testWorkshops() {
  console.log('5️⃣ Testing Workshop System...\n');
  
  try {
    // Register for workshop
    const workshopDate = new Date();
    workshopDate.setDate(workshopDate.getDate() + 7);
    
    const { data, error } = await supabase
      .from('workshop_registrations')
      .insert({
        user_id: existingUserId,
        workshop_id: 'mindfulness-basics',
        workshop_title: 'Mindfulness for New Moms',
        workshop_date: workshopDate.toISOString(),
        status: 'registered'
      })
      .select()
      .single();
    
    if (error) {
      console.log('❌ Workshop registration failed:', error.message);
      return false;
    }
    
    console.log('✅ Workshop registration created');
    console.log(`   Workshop: ${data.workshop_title}`);
    console.log(`   Date: ${new Date(data.workshop_date).toLocaleDateString()}`);
    console.log(`   Status: ${data.status}\n`);
    
    return true;
  } catch (error) {
    console.log('❌ Workshop test failed:', error.message);
    return false;
  }
}

async function generateReport() {
  console.log('\n📊 DATABASE OPERATIONS REPORT\n');
  
  const tests = [
    { name: 'User Profiles', result: await testUserProfile() },
    { name: 'Achievements', result: await testAchievements() },
    { name: 'Course Progress', result: await testCourseProgress() },
    { name: 'Appointments', result: await testAppointments() },
    { name: 'Workshops', result: await testWorkshops() }
  ];
  
  const passed = tests.filter(t => t.result).length;
  const total = tests.length;
  
  console.log('Test Results:');
  tests.forEach(test => {
    console.log(`  ${test.result ? '✅' : '❌'} ${test.name}`);
  });
  
  console.log(`\n🎯 Score: ${passed}/${total} tests passed (${Math.round(passed/total * 100)}%)`);
  
  if (passed === total) {
    console.log('\n🎉 All database operations working perfectly!');
  } else {
    console.log('\n⚠️  Some operations failed. Check error messages above.');
  }
}

async function main() {
  console.log(`📡 Connected to: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  console.log(`👤 Testing with user: ${existingUserId}\n`);
  
  await generateReport();
  
  console.log('\n✨ Database operations test complete!');
}

main().catch(console.error);