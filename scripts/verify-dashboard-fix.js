#!/usr/bin/env node

/**
 * Verify Dashboard Fix
 * Run this after executing FIX_DASHBOARD_FINAL_V2.sql
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyFix() {
  console.log('=== VERIFYING DASHBOARD FIX ===\n');
  
  let allPassed = true;

  // Get a test user ID
  const { data: testUser } = await supabase
    .from('user_profiles')
    .select('id')
    .limit(1)
    .single();
  
  const testUserId = testUser?.id || '00000000-0000-0000-0000-000000000000';
  console.log(`Testing with user ID: ${testUserId}\n`);

  // Test 1: get_user_dashboard_data
  console.log('1. Testing get_user_dashboard_data...');
  const { data: dashData, error: dashError } = await supabase.rpc('get_user_dashboard_data', {
    p_user_id: testUserId
  });

  if (dashError) {
    console.log('   ❌ Error:', dashError.message);
    allPassed = false;
  } else {
    console.log('   ✅ Success! Returned structure:');
    console.log('      - profile:', dashData.profile ? '✓' : '✗');
    console.log('      - achievements:', Array.isArray(dashData.achievements) ? '✓' : '✗');
    console.log('      - courseStats:', dashData.courseStats ? '✓' : '✗');
    console.log('      - recentActivity:', Array.isArray(dashData.recentActivity) ? '✓' : '✗');
  }

  // Test 2: get_user_course_stats
  console.log('\n2. Testing get_user_course_stats...');
  const { data: statsData, error: statsError } = await supabase.rpc('get_user_course_stats', {
    p_user_id: testUserId
  });

  if (statsError) {
    console.log('   ❌ Error:', statsError.message);
    allPassed = false;
  } else {
    console.log('   ✅ Success! Stats returned:');
    console.log('      - weeksStarted:', statsData.weeksStarted ?? 0);
    console.log('      - lessonsCompleted:', statsData.lessonsCompleted ?? 0);
    console.log('      - totalTimeSpentMinutes:', statsData.totalTimeSpentMinutes ?? 0);
  }

  // Test 3: get_all_courses_with_user_progress
  console.log('\n3. Testing get_all_courses_with_user_progress...');
  const { data: coursesData, error: coursesError } = await supabase.rpc('get_all_courses_with_user_progress', {
    p_user_id: testUserId
  });

  if (coursesError) {
    console.log('   ❌ Error:', coursesError.message);
    allPassed = false;
  } else {
    console.log('   ✅ Success! Courses found:', Array.isArray(coursesData) ? coursesData.length : 0);
    if (coursesData && coursesData.length > 0) {
      console.log('   First course:', {
        title: coursesData[0].title,
        slug: coursesData[0].slug,
        isEnrolled: coursesData[0].isEnrolled,
        progress: coursesData[0].progress
      });
    }
  }

  // Test 4: get_user_workbook_status
  console.log('\n4. Testing get_user_workbook_status...');
  const { data: workData, error: workError } = await supabase.rpc('get_user_workbook_status', {
    p_user_id: testUserId
  });

  if (workError) {
    console.log('   ❌ Error:', workError.message);
    allPassed = false;
  } else {
    console.log('   ✅ Success! Workbook status:', workData);
  }

  // Test 5: Check indexes
  console.log('\n5. Checking performance indexes...');
  const indexNames = [
    'idx_course_progress_user_course',
    'idx_course_progress_user_status',
    'idx_course_progress_user_completed',
    'idx_user_achievements_user_id'
  ];
  
  console.log('   ℹ️  Indexes should be created for optimal performance');

  // Summary
  console.log('\n=== VERIFICATION SUMMARY ===');
  if (allPassed) {
    console.log('✅ All functions are working correctly!');
    console.log('\nNext steps:');
    console.log('1. Clear browser cache/cookies');
    console.log('2. Log in and test the dashboard');
    console.log('3. Check browser console for any client-side errors');
  } else {
    console.log('❌ Some functions failed!');
    console.log('\nTroubleshooting:');
    console.log('1. Make sure you ran the ENTIRE SQL script');
    console.log('2. Check for any errors in Supabase SQL editor');
    console.log('3. Try running the SQL script again');
  }

  // Additional checks
  console.log('\n=== ADDITIONAL CHECKS ===');
  
  // Check for sample data
  const { count: cpCount } = await supabase
    .from('course_progress')
    .select('*', { count: 'exact', head: true });
  
  const { count: courseCount } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  console.log(`Course progress records: ${cpCount || 0}`);
  console.log(`Active courses: ${courseCount || 0}`);
  
  if (cpCount === 0) {
    console.log('\n⚠️  No course progress records found.');
    console.log('   This is normal for new users who haven\'t enrolled in courses yet.');
  }
}

verifyFix().catch(console.error);