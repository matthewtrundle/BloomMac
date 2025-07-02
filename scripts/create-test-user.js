#!/usr/bin/env node
/**
 * Creates a test user with completed onboarding
 * Run with: node scripts/create-test-user.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const testUser = {
  email: 'test@bloom.com',
  password: 'TestBloom123!',
  profile: {
    first_name: 'Sarah',
    last_name: 'Johnson',
    phone: '(555) 123-4567',
    postpartum_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    number_of_children: 2,
    emergency_contact_name: 'John Johnson',
    emergency_contact_phone: '(555) 987-6543',
    emergency_contact_relationship: 'spouse',
    timezone: 'America/New_York'
  }
};

async function createTestUser() {
  console.log('🚀 Creating test user with completed onboarding...\n');

  try {
    // Step 1: Create user account
    console.log('1️⃣ Creating user account...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true,
      user_metadata: {
        full_name: `${testUser.profile.first_name} ${testUser.profile.last_name}`
      }
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log('⚠️  User already exists, fetching existing user...');
        
        // Get existing user
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const existingUser = users.find(u => u.email === testUser.email);
        
        if (existingUser) {
          authData.user = existingUser;
        } else {
          throw new Error('Could not find existing user');
        }
      } else {
        throw authError;
      }
    } else {
      console.log('✅ User account created successfully');
    }

    const userId = authData.user.id;
    console.log(`   User ID: ${userId}`);

    // Step 2: Create user profile
    console.log('\n2️⃣ Creating user profile...');
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        ...testUser.profile,
        onboarding_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error('❌ Profile creation error:', profileError);
      // Continue anyway - profile might already exist
    } else {
      console.log('✅ User profile created successfully');
    }

    // Step 3: Enroll in course
    console.log('\n3️⃣ Enrolling user in course...');
    const { error: enrollmentError } = await supabase
      .from('course_enrollments')
      .upsert({
        user_id: userId,
        course_id: 'postpartum-wellness-foundations',
        enrollment_date: new Date().toISOString(),
        progress_percentage: 25,
        last_accessed: new Date().toISOString()
      }, {
        onConflict: 'user_id,course_id'
      });

    if (enrollmentError) {
      console.error('❌ Enrollment error:', enrollmentError);
      // Continue anyway
    } else {
      console.log('✅ Course enrollment created');
    }

    // Step 4: Create some course progress
    console.log('\n4️⃣ Creating course progress...');
    const lessonsCompleted = [
      { week: 1, lesson: 1 },
      { week: 1, lesson: 2 },
      { week: 1, lesson: 3 },
      { week: 2, lesson: 1 }
    ];

    for (const lesson of lessonsCompleted) {
      await supabase
        .from('lesson_completions')
        .upsert({
          user_id: userId,
          course_id: 'postpartum-wellness-foundations',
          week_number: lesson.week,
          lesson_number: lesson.lesson,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id,week_number,lesson_number'
        });
    }
    console.log('✅ Lesson progress created');

    // Step 5: Add some workbook responses (Week 1 partial completion)
    console.log('\n5️⃣ Creating sample workbook responses...');
    const workbookResponses = [
      {
        question_id: 'epds_1',
        response_data: { value: 1, response_type: 'scale' },
        week_number: 1
      },
      {
        question_id: 'epds_2',
        response_data: { value: 0, response_type: 'scale' },
        week_number: 1
      },
      {
        question_id: 'sleep_quality',
        response_data: { value: 3, response_type: 'scale' },
        week_number: 1
      },
      {
        question_id: 'support_level',
        response_data: { value: 7, response_type: 'scale' },
        week_number: 1
      },
      {
        question_id: 'w1_before_pregnancy',
        response_data: { 
          value: 'I was very active, worked full-time as a marketing manager, loved hiking on weekends.',
          response_type: 'text',
          word_count: 15
        },
        week_number: 1
      }
    ];

    for (const response of workbookResponses) {
      await supabase
        .from('user_workbook_responses')
        .upsert({
          user_id: userId,
          course_id: 'postpartum-wellness-foundations',
          week_number: response.week_number,
          question_id: response.question_id,
          response_data: response.response_data,
          is_draft: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id,week_number,question_id'
        });
    }
    console.log('✅ Workbook responses created');

    // Step 6: Add some achievements
    console.log('\n6️⃣ Adding achievements...');
    const achievements = ['welcome_star', 'first_lesson', 'week_warrior'];
    
    for (const achievementId of achievements) {
      await supabase
        .from('user_achievements')
        .upsert({
          user_id: userId,
          achievement_id: achievementId,
          earned_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,achievement_id'
        });
    }
    console.log('✅ Achievements added');

    // Step 7: Add a test appointment
    console.log('\n7️⃣ Creating upcoming appointment...');
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 3); // 3 days from now
    appointmentDate.setHours(14, 0, 0, 0); // 2:00 PM

    await supabase
      .from('provider_appointments')
      .insert({
        provider_id: '00000000-0000-0000-0000-000000000000', // Placeholder provider ID
        user_id: userId,
        appointment_date: appointmentDate.toISOString(),
        appointment_type: 'initial-consultation',
        duration_minutes: 60,
        status: 'scheduled',
        notes: 'First appointment with new client'
      });
    console.log('✅ Appointment created');

    // Summary
    console.log('\n✨ Test user created successfully!\n');
    console.log('📧 Email:', testUser.email);
    console.log('🔑 Password:', testUser.password);
    console.log('👤 Name:', `${testUser.profile.first_name} ${testUser.profile.last_name}`);
    console.log('📅 Days postpartum:', 45);
    console.log('📚 Course progress: 25% (Week 1 mostly complete)');
    console.log('📝 Workbook: Week 1 partially complete (5 responses)');
    console.log('🏆 Achievements: 3 earned');
    console.log('📅 Next appointment: In 3 days');
    
    console.log('\n🚀 You can now log in and see:');
    console.log('   - Completed onboarding profile');
    console.log('   - Course progress on dashboard');
    console.log('   - Workbook progress widget');
    console.log('   - Upcoming appointment');
    console.log('   - Achievement badges');

  } catch (error) {
    console.error('\n❌ Error creating test user:', error.message);
    console.error(error);
  }
}

// Run the script
createTestUser();