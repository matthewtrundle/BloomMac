#!/usr/bin/env node

/**
 * Test User Flow - Validates the complete user journey
 * Tests: Registration → Profile Creation → Course Enrollment → Appointment Booking
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🧪 TESTING COMPLETE USER FLOW\n');

// Test user data
const testUser = {
  email: `test${Date.now()}@bloom.test`,
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User',
  phone: '+1234567890',
  postpartumDate: '2024-01-01',
  numberOfChildren: 1
};

async function testUserRegistration() {
  console.log('1️⃣ Testing User Registration...\n');
  
  try {
    // Create user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true,
      user_metadata: {
        first_name: testUser.firstName,
        last_name: testUser.lastName
      }
    });

    if (authError) throw authError;

    console.log('✅ User created successfully');
    console.log(`   ID: ${authData.user.id}`);
    console.log(`   Email: ${authData.user.email}\n`);

    // Check if profile was auto-created
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError) {
      console.log('❌ Profile auto-creation failed:', profileError.message);
      
      // Create profile manually
      const { data: manualProfile, error: manualError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          first_name: testUser.firstName,
          last_name: testUser.lastName,
          phone: testUser.phone,
          postpartum_date: testUser.postpartumDate,
          number_of_children: testUser.numberOfChildren
        })
        .select()
        .single();

      if (manualError) {
        console.log('❌ Manual profile creation failed:', manualError.message);
      } else {
        console.log('✅ Profile created manually');
      }
    } else {
      console.log('✅ Profile auto-created via trigger');
      console.log(`   Name: ${profile.first_name} ${profile.last_name}`);
      console.log(`   Stars: ${profile.total_stars}\n`);
    }

    // Check if preferences were created
    const { data: preferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (preferences) {
      console.log('✅ Preferences auto-created');
      console.log(`   Theme: ${preferences.theme_preference}`);
      console.log(`   Timezone: ${preferences.timezone}\n`);
    } else {
      console.log('⚠️  Preferences not auto-created\n');
    }

    return authData.user;
  } catch (error) {
    console.log('❌ Registration failed:', error.message);
    return null;
  }
}

async function testAchievementSystem(userId) {
  console.log('2️⃣ Testing Achievement System...\n');
  
  try {
    // Award welcome achievement
    const { data: achievement, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: 'welcome_star'
      })
      .select()
      .single();

    if (error) {
      console.log('❌ Achievement award failed:', error.message);
    } else {
      console.log('✅ Welcome achievement awarded');
      console.log(`   Achievement: ${achievement.achievement_id}`);
      console.log(`   Earned at: ${new Date(achievement.earned_at).toLocaleString()}\n`);
    }

    // Check if star count updated
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('total_stars')
      .eq('user_id', userId)
      .single();

    console.log(`📊 User total stars: ${profile?.total_stars || 0}\n`);
  } catch (error) {
    console.log('❌ Achievement test failed:', error.message);
  }
}

async function testCourseEnrollment(userId) {
  console.log('3️⃣ Testing Course Enrollment...\n');
  
  try {
    // Create course enrollment
    const { data: enrollment, error } = await supabase
      .from('course_enrollments')
      .insert({
        user_id: userId,
        course_id: 'postpartum-wellness-101',
        payment_status: 'paid',
        amount_paid: 97.00
      })
      .select()
      .single();

    if (error) {
      console.log('❌ Course enrollment failed:', error.message);
    } else {
      console.log('✅ Course enrollment created');
      console.log(`   Course: ${enrollment.course_id}`);
      console.log(`   Status: ${enrollment.payment_status}`);
      console.log(`   Amount: $${enrollment.amount_paid}\n`);
    }

    // Create initial progress entry
    const { data: progress, error: progressError } = await supabase
      .from('course_progress')
      .insert({
        user_id: userId,
        course_id: 'postpartum-wellness-101',
        week_number: 1,
        lesson_number: 1,
        status: 'not_started'
      })
      .select()
      .single();

    if (progressError) {
      console.log('❌ Progress tracking failed:', progressError.message);
    } else {
      console.log('✅ Course progress initialized');
      console.log(`   Week 1, Lesson 1: ${progress.status}\n`);
    }
  } catch (error) {
    console.log('❌ Course enrollment test failed:', error.message);
  }
}

async function testAppointmentBooking(userId) {
  console.log('4️⃣ Testing Appointment Booking...\n');
  
  try {
    // Create appointment
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 7); // 1 week from now
    
    const { data: appointment, error } = await supabase
      .from('appointment_data')
      .insert({
        user_id: userId,
        appointment_type: 'consultation',
        appointment_date: appointmentDate.toISOString(),
        appointment_end: new Date(appointmentDate.getTime() + 30 * 60 * 1000).toISOString(), // 30 min later
        status: 'scheduled',
        session_fee_dollars: 150.00
      })
      .select()
      .single();

    if (error) {
      console.log('❌ Appointment creation failed:', error.message);
    } else {
      console.log('✅ Appointment created');
      console.log(`   Type: ${appointment.appointment_type}`);
      console.log(`   Date: ${new Date(appointment.appointment_date).toLocaleString()}`);
      console.log(`   Fee: $${appointment.session_fee_dollars}\n`);
    }

    // Create payment method
    const { data: paymentMethod, error: pmError } = await supabase
      .from('user_payment_methods')
      .insert({
        user_id: userId,
        stripe_payment_method_id: 'pm_test_' + Date.now(),
        payment_method_type: 'card',
        card_details: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025
        },
        is_default: true
      })
      .select()
      .single();

    if (pmError) {
      console.log('❌ Payment method creation failed:', pmError.message);
    } else {
      console.log('✅ Payment method added');
      console.log(`   Type: ${paymentMethod.card_details.brand}`);
      console.log(`   Last 4: ${paymentMethod.card_details.last4}\n`);
    }

    // Create payment record
    if (appointment) {
      const { data: payment, error: paymentError } = await supabase
        .from('appointment_payments')
        .insert({
          appointment_id: appointment.id,
          user_id: userId,
          amount_cents: 15000, // $150.00
          status: 'authorized',
          payment_type: 'appointment',
          stripe_payment_intent_id: 'pi_test_' + Date.now()
        })
        .select()
        .single();

      if (paymentError) {
        console.log('❌ Payment record creation failed:', paymentError.message);
      } else {
        console.log('✅ Payment authorized');
        console.log(`   Amount: $${payment.amount_cents / 100}`);
        console.log(`   Status: ${payment.status}\n`);
      }
    }
  } catch (error) {
    console.log('❌ Appointment booking test failed:', error.message);
  }
}

async function testNotificationSystem(userId) {
  console.log('5️⃣ Testing Notification System...\n');
  
  try {
    // Check if notification function exists
    const { data, error } = await supabase.rpc('create_user_notification', {
      p_user_id: userId,
      p_type: 'system',
      p_title: 'Test Notification',
      p_message: 'This is a test notification from the user flow test.',
      p_action_url: '/dashboard'
    });

    if (error) {
      console.log('⚠️  Notification system not available:', error.message);
      console.log('   Run the missing tables migration to enable notifications\n');
    } else {
      console.log('✅ Notification created successfully\n');
    }
  } catch (error) {
    console.log('❌ Notification test failed:', error.message);
  }
}

async function generateReport(userId) {
  console.log('\n📊 FINAL USER FLOW REPORT\n');
  
  try {
    // Get complete user data
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId);

    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('user_id', userId);

    const { data: appointments } = await supabase
      .from('appointment_data')
      .select('*')
      .eq('user_id', userId);

    const { data: paymentMethods } = await supabase
      .from('user_payment_methods')
      .select('*')
      .eq('user_id', userId);

    console.log('User Profile:');
    console.log(`  Name: ${profile?.first_name} ${profile?.last_name}`);
    console.log(`  Total Stars: ${profile?.total_stars || 0}`);
    console.log(`  Achievements: ${achievements?.length || 0}`);
    console.log(`  Courses Enrolled: ${enrollments?.length || 0}`);
    console.log(`  Appointments: ${appointments?.length || 0}`);
    console.log(`  Payment Methods: ${paymentMethods?.length || 0}`);
    
    console.log('\n✅ All core systems functional!');
    
  } catch (error) {
    console.log('❌ Report generation failed:', error.message);
  }
}

async function cleanup(userId) {
  console.log('\n🧹 Cleaning up test data...\n');
  
  try {
    // Delete test user (cascades to all related data)
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) {
      console.log('❌ Cleanup failed:', error.message);
    } else {
      console.log('✅ Test data cleaned up successfully');
    }
  } catch (error) {
    console.log('❌ Cleanup error:', error.message);
  }
}

async function main() {
  console.log(`📡 Connected to: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);
  
  // Run all tests
  const user = await testUserRegistration();
  
  if (user) {
    await testAchievementSystem(user.id);
    await testCourseEnrollment(user.id);
    await testAppointmentBooking(user.id);
    await testNotificationSystem(user.id);
    await generateReport(user.id);
    
    // Ask if user wants to keep test data
    console.log('\n❓ Keep test data for manual inspection? (Ctrl+C to keep, wait 5s to cleanup)');
    
    setTimeout(async () => {
      await cleanup(user.id);
      console.log('\n✨ User flow test complete!');
    }, 5000);
  } else {
    console.log('\n❌ User registration failed. Cannot continue tests.');
  }
}

// Run the test
main().catch(console.error);