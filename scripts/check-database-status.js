#!/usr/bin/env node

/**
 * Database Status Checker
 * Run this script to see what tables and data exist in your Supabase database
 * 
 * Usage: node scripts/check-database-status.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Checking Supabase Database Status...\n');
console.log(`📡 Connecting to: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);

// Tables we expect to exist after our migrations
const expectedTables = [
  // Core Supabase tables (should always exist)
  { name: 'auth.users', description: 'User authentication data' },
  
  // User platform tables (from our first migration)
  { name: 'user_profiles', description: 'User profile information' },
  { name: 'user_achievements', description: 'User achievement/star system' },
  { name: 'wellness_entries', description: 'User wellness check-ins' },
  { name: 'user_preferences', description: 'User settings and preferences' },
  
  // Course platform tables
  { name: 'course_enrollments', description: 'Course enrollment data' },
  { name: 'course_progress', description: 'Course lesson progress tracking' },
  { name: 'lesson_completion_details', description: 'Detailed lesson completion data' },
  { name: 'course_certificates', description: 'Course completion certificates' },
  
  // Workshop tables
  { name: 'workshop_registrations', description: 'Workshop signup data' },
  { name: 'workshop_attendance', description: 'Workshop attendance tracking' },
  { name: 'workshop_feedback', description: 'Workshop feedback and ratings' },
  
  // Appointment system tables
  { name: 'appointment_data', description: 'Appointment scheduling data' },
  { name: 'appointment_payments', description: 'Payment tracking for appointments' },
  { name: 'user_payment_methods', description: 'Stored payment methods' }
];

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      // Check if it's a "relation does not exist" error
      if (error.message.includes('does not exist') || error.code === '42P01') {
        return { exists: false, count: 0, error: 'Table does not exist' };
      }
      return { exists: false, count: 0, error: error.message };
    }
    
    return { exists: true, count: data?.length || 0, error: null };
  } catch (err) {
    return { exists: false, count: 0, error: err.message };
  }
}

async function checkConnection() {
  try {
    // Test basic connection by checking auth users
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase');
    console.log(`👥 Total users in auth: ${data.users?.length || 0}\n`);
    return true;
  } catch (err) {
    console.log('❌ Connection error:', err.message);
    return false;
  }
}

async function checkAllTables() {
  console.log('📋 Checking table status:\n');
  
  const results = [];
  
  for (const table of expectedTables) {
    const status = await checkTableExists(table.name);
    results.push({ ...table, ...status });
    
    const statusIcon = status.exists ? '✅' : '❌';
    const countInfo = status.exists ? `(${status.count} rows)` : '';
    const errorInfo = status.error && !status.exists ? ` - ${status.error}` : '';
    
    console.log(`${statusIcon} ${table.name.padEnd(30)} ${countInfo}${errorInfo}`);
    console.log(`   ${table.description}`);
    console.log('');
  }
  
  return results;
}

async function generateReport(results) {
  console.log('\n📊 SUMMARY REPORT\n');
  
  const existing = results.filter(r => r.exists);
  const missing = results.filter(r => !r.exists);
  
  console.log(`✅ Tables found: ${existing.length}/${results.length}`);
  console.log(`❌ Tables missing: ${missing.length}/${results.length}\n`);
  
  if (missing.length > 0) {
    console.log('🚨 MISSING TABLES:');
    missing.forEach(table => {
      console.log(`   - ${table.name} (${table.description})`);
    });
    console.log('\n💡 You need to run SQL migrations for missing tables.\n');
  }
  
  if (existing.length > 0) {
    console.log('✅ EXISTING TABLES:');
    existing.forEach(table => {
      console.log(`   - ${table.name} (${table.count} rows)`);
    });
    console.log('');
  }
  
  // Determine what migrations are needed
  const needsUserPlatform = !results.find(r => r.name === 'user_profiles')?.exists;
  const needsCourseProgress = !results.find(r => r.name === 'course_progress')?.exists;
  const needsWorkshops = !results.find(r => r.name === 'workshop_registrations')?.exists;
  const needsPayments = !results.find(r => r.name === 'appointment_payments')?.exists;
  
  console.log('📋 MIGRATION CHECKLIST:\n');
  console.log(`${needsUserPlatform ? '❌' : '✅'} User Platform Tables (user_profiles, achievements, etc.)`);
  console.log(`${needsCourseProgress ? '❌' : '✅'} Course Progress Tables (course_progress, certificates, etc.)`);
  console.log(`${needsWorkshops ? '❌' : '✅'} Workshop Tables (registrations, attendance, etc.)`);
  console.log(`${needsPayments ? '❌' : '✅'} Payment Tables (appointment_payments, user_payment_methods)`);
  
  if (needsUserPlatform || needsCourseProgress || needsWorkshops || needsPayments) {
    console.log('\n🔧 NEXT STEPS:');
    if (needsUserPlatform) console.log('   1. Run: 20250101_create_user_platform_tables.sql');
    if (needsCourseProgress) console.log('   2. Run: 20250101_create_course_progress_tables.sql');
    if (needsWorkshops) console.log('   3. Run: 20250101_create_workshop_tables.sql');
    if (needsPayments) console.log('   4. Run: 20250101_create_payment_tables.sql');
  } else {
    console.log('\n🎉 All tables exist! Your database is ready for the appointment system.');
  }
}

async function main() {
  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('❌ Missing environment variables!');
    console.log('Make sure you have:');
    console.log('   - NEXT_PUBLIC_SUPABASE_URL');
    console.log('   - SUPABASE_SERVICE_ROLE_KEY');
    console.log('');
    console.log('Create a .env.local file with your Supabase credentials.');
    process.exit(1);
  }
  
  // Test connection
  const connected = await checkConnection();
  if (!connected) {
    console.log('\n❌ Cannot connect to Supabase. Check your credentials.');
    process.exit(1);
  }
  
  // Check all tables
  const results = await checkAllTables();
  
  // Generate report
  await generateReport(results);
  
  console.log('\n✨ Database check complete!');
}

// Run the script
main().catch(console.error);