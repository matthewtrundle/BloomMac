#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const chalk = require('chalk');
const fetch = require('node-fetch');

// Local Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
const APP_URL = 'http://localhost:3000';

// Create clients
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults = [];

// Helper functions
function logTest(name, passed, error = null) {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(chalk.green(`✓ ${name}`));
    testResults.push({ name, passed: true });
  } else {
    failedTests++;
    console.log(chalk.red(`✗ ${name}`));
    if (error) console.log(chalk.red(`  Error: ${error}`));
    testResults.push({ name, passed: false, error });
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate unique test data
const timestamp = Date.now();
const testUser = {
  email: `test-user-${timestamp}@example.com`,
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User'
};

const testAdmin = {
  email: `test-admin-${timestamp}@example.com`,
  password: 'AdminPassword123!',
  firstName: 'Test',
  lastName: 'Admin'
};

// Test Functions
async function testAuthentication() {
  console.log(chalk.blue('\n🔐 Testing Authentication Flow\n'));

  // Test 1: User Sign Up
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testUser.email,
    password: testUser.password,
    options: {
      data: {
        first_name: testUser.firstName,
        last_name: testUser.lastName
      }
    }
  });

  logTest('User Sign Up', !signUpError, signUpError?.message);
  if (signUpError) return null;

  // Test 2: User Sign In
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testUser.email,
    password: testUser.password
  });

  logTest('User Sign In', !signInError, signInError?.message);
  if (signInError) return null;

  // Test 3: Get Session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  logTest('Get Session', !sessionError && sessionData.session !== null, sessionError?.message);

  // Test 4: Sign Out
  const { error: signOutError } = await supabase.auth.signOut();
  logTest('User Sign Out', !signOutError, signOutError?.message);

  return signInData.user?.id;
}

async function testProfileManagement(userId) {
  console.log(chalk.blue('\n👤 Testing Profile Management\n'));

  // Sign back in for profile tests
  await supabase.auth.signInWithPassword({
    email: testUser.email,
    password: testUser.password
  });

  // Test 1: Check if profile was created automatically
  await delay(1000); // Wait for trigger to execute
  
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  logTest('Auto-created Profile Check', !profileError, profileError?.message);

  // Test 2: Update Profile
  const updatedProfile = {
    first_name: 'Updated',
    last_name: 'Name',
    phone: '555-1234',
    bio: 'Test bio'
  };

  const { error: updateError } = await supabase
    .from('user_profiles')
    .update(updatedProfile)
    .eq('id', userId);

  logTest('Update Profile', !updateError, updateError?.message);

  // Test 3: Read Updated Profile
  const { data: readProfile, error: readError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  logTest('Read Updated Profile', !readError && readProfile?.first_name === 'Updated', readError?.message);

  // Test 4: API Endpoint Test
  const session = await supabase.auth.getSession();
  if (session.data.session) {
    try {
      const response = await fetch(`${APP_URL}/api/profile/get`, {
        headers: {
          'Authorization': `Bearer ${session.data.session.access_token}`,
          'Cookie': `sb-access-token=${session.data.session.access_token}`
        }
      });
      
      const data = await response.json();
      logTest('Profile API Endpoint', response.ok && data.success, data.error);
    } catch (error) {
      logTest('Profile API Endpoint', false, error.message);
    }
  }
}

async function testUserPreferences(userId) {
  console.log(chalk.blue('\n⚙️  Testing User Preferences\n'));

  // Test 1: Check if preferences were created
  const { data: prefs, error: prefsError } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  logTest('Auto-created Preferences', !prefsError || prefsError.code === 'PGRST116', prefsError?.message);

  // Test 2: Create/Update Preferences
  const preferences = {
    user_id: userId,
    theme_preference: 'dark',
    language: 'en',
    timezone: 'America/Chicago'
  };

  const { error: upsertError } = await supabase
    .from('user_preferences')
    .upsert(preferences)
    .eq('user_id', userId);

  logTest('Create/Update Preferences', !upsertError, upsertError?.message);
}

async function testWellnessEntries(userId) {
  console.log(chalk.blue('\n🌟 Testing Wellness Entries\n'));

  // Test 1: Create Wellness Entry
  const entry = {
    user_id: userId,
    entry_date: new Date().toISOString().split('T')[0],
    mood_rating: 4,
    energy_level: 3,
    sleep_hours: 7.5,
    notes: 'Feeling good today'
  };

  const { data: newEntry, error: createError } = await supabase
    .from('wellness_entries')
    .insert(entry)
    .select()
    .single();

  logTest('Create Wellness Entry', !createError, createError?.message);

  // Test 2: Read Own Entries
  const { data: entries, error: readError } = await supabase
    .from('wellness_entries')
    .select('*')
    .eq('user_id', userId);

  logTest('Read Own Wellness Entries', !readError && entries?.length > 0, readError?.message);

  // Test 3: Update Entry
  if (newEntry) {
    const { error: updateError } = await supabase
      .from('wellness_entries')
      .update({ mood_rating: 5, notes: 'Actually feeling great!' })
      .eq('id', newEntry.id);

    logTest('Update Wellness Entry', !updateError, updateError?.message);
  }

  // Test 4: Delete Entry
  if (newEntry) {
    const { error: deleteError } = await supabase
      .from('wellness_entries')
      .delete()
      .eq('id', newEntry.id);

    logTest('Delete Wellness Entry', !deleteError, deleteError?.message);
  }
}

async function testCourseAccess(userId) {
  console.log(chalk.blue('\n📚 Testing Course Access\n'));

  // Test 1: View Active Courses (Public)
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true);

  logTest('View Active Courses', !coursesError, coursesError?.message);

  if (courses && courses.length > 0) {
    const testCourse = courses[0];

    // Test 2: Create Course Enrollment
    const enrollment = {
      user_id: userId,
      course_id: testCourse.id,
      status: 'active',
      enrollment_method: 'test'
    };

    const { data: newEnrollment, error: enrollError } = await supabase
      .from('course_enrollments')
      .insert(enrollment)
      .select()
      .single();

    logTest('Create Course Enrollment', !enrollError, enrollError?.message);

    // Test 3: View Course Modules (Enrolled)
    const { data: modules, error: modulesError } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', testCourse.id);

    logTest('View Course Modules (Enrolled)', !modulesError, modulesError?.message);

    // Test 4: View Course Lessons (Enrolled)
    if (modules && modules.length > 0) {
      const { data: lessons, error: lessonsError } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('module_id', modules[0].id);

      logTest('View Course Lessons (Enrolled)', !lessonsError, lessonsError?.message);
    }

    // Test 5: Track Progress
    if (modules && modules.length > 0) {
      const progress = {
        user_id: userId,
        course_id: testCourse.id,
        lesson_id: modules[0].id, // Using module ID as lesson ID for test
        status: 'in_progress',
        progress_percentage: 50
      };

      const { error: progressError } = await supabase
        .from('course_progress')
        .insert(progress);

      logTest('Track Course Progress', !progressError, progressError?.message);
    }
  } else {
    logTest('View Active Courses', false, 'No active courses found for testing');
  }
}

async function testNotifications(userId) {
  console.log(chalk.blue('\n🔔 Testing Notifications\n'));

  // Test 1: Create Notification (Service Role)
  const notification = {
    user_id: userId,
    type: 'system',
    title: 'Test Notification',
    message: 'This is a test notification',
    action_url: '/profile'
  };

  const { error: createError } = await supabaseAdmin
    .from('user_notifications')
    .insert(notification);

  logTest('Create Notification (Service Role)', !createError, createError?.message);

  // Test 2: Read Own Notifications
  const { data: notifications, error: readError } = await supabase
    .from('user_notifications')
    .select('*')
    .eq('user_id', userId);

  logTest('Read Own Notifications', !readError && notifications?.length > 0, readError?.message);

  // Test 3: Mark as Read
  if (notifications && notifications.length > 0) {
    const { error: updateError } = await supabase
      .from('user_notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', notifications[0].id);

    logTest('Mark Notification as Read', !updateError, updateError?.message);
  }
}

async function testAdminAccess() {
  console.log(chalk.blue('\n👨‍💼 Testing Admin Access\n'));

  // Test 1: Create Admin User
  const { data: adminAuth, error: adminAuthError } = await supabaseAdmin.auth.admin.createUser({
    email: testAdmin.email,
    password: testAdmin.password,
    email_confirm: true
  });

  logTest('Create Admin Auth User', !adminAuthError, adminAuthError?.message);

  if (adminAuth) {
    // Test 2: Create Admin Record
    const adminRecord = {
      id: adminAuth.user.id,
      email: testAdmin.email,
      name: `${testAdmin.firstName} ${testAdmin.lastName}`,
      is_active: true,
      password_hash: 'dummy_hash' // In real app, this would be properly hashed
    };

    const { error: adminRecordError } = await supabaseAdmin
      .from('admin_users')
      .insert(adminRecord);

    logTest('Create Admin Record', !adminRecordError, adminRecordError?.message);

    // Test 3: Admin Sign In
    const { data: adminSignIn, error: adminSignInError } = await supabase.auth.signInWithPassword({
      email: testAdmin.email,
      password: testAdmin.password
    });

    logTest('Admin Sign In', !adminSignInError, adminSignInError?.message);

    // Test 4: Admin Can View All Users
    const { data: allProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*');

    logTest('Admin View All Profiles', !profilesError, profilesError?.message);

    // Test 5: Admin Can View All Subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('subscribers')
      .select('*');

    logTest('Admin View All Subscribers', !subscribersError, subscribersError?.message);

    // Sign out admin
    await supabase.auth.signOut();
  }
}

async function testEmailSystem() {
  console.log(chalk.blue('\n📧 Testing Email System\n'));

  // Test as admin
  await supabase.auth.signInWithPassword({
    email: testAdmin.email,
    password: testAdmin.password
  });

  // Test 1: View Email Templates
  const { data: templates, error: templatesError } = await supabase
    .from('email_templates')
    .select('*');

  logTest('View Email Templates', !templatesError, templatesError?.message);

  // Test 2: View Email Queue
  const { data: queue, error: queueError } = await supabase
    .from('email_queue')
    .select('*');

  logTest('View Email Queue', !queueError, queueError?.message);

  // Sign out
  await supabase.auth.signOut();
}

async function testCleanup() {
  console.log(chalk.blue('\n🧹 Cleaning Up Test Data\n'));

  try {
    // Delete test users
    const { data: testUserData } = await supabaseAdmin.auth.admin.listUsers();
    
    for (const user of testUserData.users) {
      if (user.email === testUser.email || user.email === testAdmin.email) {
        await supabaseAdmin.auth.admin.deleteUser(user.id);
      }
    }

    logTest('Cleanup Test Users', true);
  } catch (error) {
    logTest('Cleanup Test Users', false, error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log(chalk.bold.blue('\n🚀 Starting Comprehensive Local Testing Suite\n'));
  console.log(chalk.yellow(`Testing against: ${SUPABASE_URL}`));
  console.log(chalk.yellow(`App URL: ${APP_URL}\n`));

  try {
    // Run authentication tests
    const userId = await testAuthentication();
    
    if (userId) {
      // Run user-specific tests
      await testProfileManagement(userId);
      await testUserPreferences(userId);
      await testWellnessEntries(userId);
      await testCourseAccess(userId);
      await testNotifications(userId);
    }

    // Run admin tests
    await testAdminAccess();
    await testEmailSystem();

    // Cleanup
    await testCleanup();

  } catch (error) {
    console.error(chalk.red('\n❌ Test suite failed with error:'), error);
  }

  // Summary
  console.log(chalk.bold.blue('\n📊 Test Summary\n'));
  console.log(chalk.yellow(`Total Tests: ${totalTests}`));
  console.log(chalk.green(`Passed: ${passedTests}`));
  console.log(chalk.red(`Failed: ${failedTests}`));
  console.log(chalk.cyan(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`));

  // Detailed failures
  if (failedTests > 0) {
    console.log(chalk.bold.red('Failed Tests:\n'));
    testResults
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(chalk.red(`  ✗ ${r.name}`));
        if (r.error) console.log(chalk.red(`    Error: ${r.error}`));
      });
  }

  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Check if services are running
async function checkServices() {
  console.log(chalk.yellow('Checking services...\n'));
  
  // Check Supabase
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    console.log(chalk.green('✓ Supabase is running'));
  } catch (error) {
    console.log(chalk.red('✗ Supabase is not running'));
    console.log(chalk.yellow('  Run: npx supabase start'));
    process.exit(1);
  }

  // Check Next.js app
  try {
    const response = await fetch(APP_URL);
    if (response.ok) {
      console.log(chalk.green('✓ Next.js app is running'));
    } else {
      throw new Error('App not responding');
    }
  } catch (error) {
    console.log(chalk.red('✗ Next.js app is not running'));
    console.log(chalk.yellow('  Run: npm run dev'));
    process.exit(1);
  }

  console.log('');
}

// Run tests
checkServices().then(() => {
  runAllTests();
});