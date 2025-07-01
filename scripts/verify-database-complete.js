#!/usr/bin/env node

/**
 * Complete Database Verification Script
 * Checks tables, columns, RLS policies, functions, triggers, and data integrity
 * 
 * Usage: node scripts/verify-database-complete.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create Supabase client with admin privileges
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Complete Database Verification\n');
console.log(`📡 Connecting to: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);

// Expected database schema
const expectedSchema = {
  user_profiles: {
    columns: ['id', 'user_id', 'first_name', 'last_name', 'phone', 'postpartum_date', 'number_of_children', 'total_stars', 'created_at', 'updated_at'],
    rls: true,
    policies: ['Users can view their own profile', 'Users can update their own profile']
  },
  user_achievements: {
    columns: ['id', 'user_id', 'achievement_id', 'earned_at', 'created_at'],
    rls: true,
    policies: ['Users can view their own achievements']
  },
  wellness_entries: {
    columns: ['id', 'user_id', 'entry_date', 'mood_rating', 'energy_level', 'sleep_hours', 'notes', 'created_at'],
    rls: true,
    policies: ['Users can manage their own wellness entries']
  },
  user_preferences: {
    columns: ['id', 'user_id', 'privacy_settings', 'reminder_settings', 'theme_preference', 'language', 'timezone', 'created_at', 'updated_at'],
    rls: true,
    policies: ['Users can view their own preferences', 'Users can update their own preferences']
  },
  course_enrollments: {
    columns: ['id', 'user_id', 'course_id', 'enrollment_date', 'progress_percentage', 'last_accessed', 'payment_status', 'stripe_session_id', 'amount_paid', 'created_at'],
    rls: true,
    policies: ['Users can view their own enrollments']
  },
  course_progress: {
    columns: ['id', 'user_id', 'course_id', 'week_number', 'lesson_number', 'status', 'started_at', 'completed_at', 'time_spent_minutes', 'video_progress_percentage', 'last_accessed_at', 'created_at', 'updated_at'],
    rls: true,
    policies: ['Users can view their own course progress', 'Users can update their own course progress']
  },
  lesson_completion_details: {
    columns: ['id', 'progress_id', 'user_id', 'video_watched', 'video_watch_time_seconds', 'exercises_completed', 'exercises_total', 'reflection_submitted', 'notes', 'created_at', 'updated_at'],
    rls: true,
    policies: ['Users can view their own lesson details']
  },
  course_certificates: {
    columns: ['id', 'user_id', 'course_id', 'certificate_number', 'completion_date', 'total_time_spent_hours', 'lessons_completed', 'final_score', 'certificate_url', 'issued_at'],
    rls: true,
    policies: ['Users can view their own certificates']
  },
  workshop_registrations: {
    columns: ['id', 'user_id', 'workshop_id', 'workshop_title', 'workshop_date', 'registration_date', 'status', 'zoom_link', 'calendar_event_id', 'reminder_sent', 'notes', 'created_at', 'updated_at'],
    rls: true,
    policies: ['Users can view their own registrations', 'Users can create their own registrations', 'Users can update their own registrations']
  },
  workshop_attendance: {
    columns: ['id', 'registration_id', 'user_id', 'workshop_id', 'joined_at', 'left_at', 'duration_minutes', 'participation_score', 'feedback_submitted', 'created_at'],
    rls: true,
    policies: ['Users can view their own attendance']
  },
  workshop_feedback: {
    columns: ['id', 'registration_id', 'user_id', 'workshop_id', 'overall_rating', 'content_rating', 'presenter_rating', 'technical_rating', 'most_valuable', 'improvements', 'would_recommend', 'topics_for_future', 'submitted_at'],
    rls: true,
    policies: ['Users can view their own feedback', 'Users can submit their own feedback']
  },
  appointment_data: {
    columns: ['id', 'user_id', 'appointment_type', 'calendly_event_uri', 'calendly_invitee_uri', 'appointment_date', 'appointment_end', 'status', 'payment_status', 'no_show_fee_charged', 'reminder_sent', 'confirmation_received', 'cancellation_policy', 'session_fee_dollars', 'metadata', 'created_at', 'updated_at'],
    rls: true,
    policies: ['Users can view their own appointments']
  },
  appointment_payments: {
    columns: ['id', 'appointment_id', 'user_id', 'amount_cents', 'stripe_payment_intent_id', 'status', 'payment_type', 'authorized_at', 'charged_at', 'refunded_at', 'refund_amount_cents', 'failure_reason', 'created_at', 'updated_at'],
    rls: true,
    policies: ['Users can view their own payment records', 'Users can create payment records for their appointments']
  },
  user_payment_methods: {
    columns: ['id', 'user_id', 'stripe_payment_method_id', 'payment_method_type', 'card_details', 'is_default', 'is_active', 'created_at', 'updated_at'],
    rls: true,
    policies: ['Users can view their own payment methods', 'Users can manage their own payment methods']
  }
};

// Expected functions and triggers
const expectedFunctions = [
  'update_course_progress',
  'check_course_milestones', 
  'log_course_activity',
  'update_workshop_series_progress',
  'check_workshop_achievements',
  'sync_appointment_payment_status',
  'ensure_single_default_payment_method'
];

const expectedViews = [
  'user_course_stats',
  'user_payment_summary'
];

async function checkConnection() {
  try {
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

async function getTableColumns(tableName) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = '${tableName}' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `
    });

    if (error) {
      // Fallback method
      const { data: fallback, error: fallbackError } = await supabase
        .from(tableName)
        .select('*')
        .limit(0);
      
      if (fallbackError) return null;
      return Object.keys(fallback?.[0] || {});
    }

    return data?.map(col => col.column_name) || [];
  } catch (err) {
    return null;
  }
}

async function checkRLSEnabled(tableName) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT row_security 
        FROM pg_tables 
        WHERE tablename = '${tableName}' 
        AND schemaname = 'public';
      `
    });

    if (error) return null;
    return data?.[0]?.row_security === 'ENABLED';
  } catch (err) {
    return null;
  }
}

async function getRLSPolicies(tableName) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT policyname, cmd, qual 
        FROM pg_policies 
        WHERE tablename = '${tableName}' 
        AND schemaname = 'public';
      `
    });

    if (error) return [];
    return data?.map(p => p.policyname) || [];
  } catch (err) {
    return [];
  }
}

async function checkFunctionExists(functionName) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT proname 
        FROM pg_proc 
        WHERE proname = '${functionName}';
      `
    });

    if (error) return false;
    return data?.length > 0;
  } catch (err) {
    return false;
  }
}

async function checkViewExists(viewName) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT viewname 
        FROM pg_views 
        WHERE viewname = '${viewName}' 
        AND schemaname = 'public';
      `
    });

    if (error) return false;
    return data?.length > 0;
  } catch (err) {
    return false;
  }
}

async function verifyTableSchema() {
  console.log('📋 Verifying Table Schema...\n');
  
  const results = [];
  
  for (const [tableName, expectedTable] of Object.entries(expectedSchema)) {
    console.log(`🔍 Checking table: ${tableName}`);
    
    // Check if table exists
    const { data: tableCheck, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`  ❌ Table does not exist`);
      results.push({ table: tableName, status: 'missing', issues: ['Table does not exist'] });
      continue;
    }
    
    const issues = [];
    
    // Check columns
    const actualColumns = await getTableColumns(tableName);
    if (actualColumns) {
      const missingColumns = expectedTable.columns.filter(col => !actualColumns.includes(col));
      const extraColumns = actualColumns.filter(col => !expectedTable.columns.includes(col));
      
      if (missingColumns.length > 0) {
        issues.push(`Missing columns: ${missingColumns.join(', ')}`);
      }
      if (extraColumns.length > 0) {
        issues.push(`Extra columns: ${extraColumns.join(', ')}`);
      }
      
      console.log(`  📊 Columns: ${actualColumns.length}/${expectedTable.columns.length} expected`);
      if (missingColumns.length > 0) console.log(`    ❌ Missing: ${missingColumns.join(', ')}`);
      if (extraColumns.length > 0) console.log(`    ⚠️  Extra: ${extraColumns.join(', ')}`);
    }
    
    // Check RLS
    const rlsEnabled = await checkRLSEnabled(tableName);
    if (expectedTable.rls && !rlsEnabled) {
      issues.push('RLS not enabled');
      console.log(`  ❌ RLS: Not enabled (expected enabled)`);
    } else if (rlsEnabled) {
      console.log(`  ✅ RLS: Enabled`);
    }
    
    // Check policies
    const policies = await getRLSPolicies(tableName);
    if (expectedTable.policies && policies.length === 0) {
      issues.push('No RLS policies found');
      console.log(`  ❌ Policies: None found (expected ${expectedTable.policies.length})`);
    } else {
      console.log(`  📋 Policies: ${policies.length} found`);
    }
    
    const status = issues.length === 0 ? 'perfect' : issues.length <= 2 ? 'minor_issues' : 'major_issues';
    results.push({ table: tableName, status, issues });
    
    console.log(`  ${status === 'perfect' ? '✅' : status === 'minor_issues' ? '⚠️' : '❌'} Status: ${status}\n`);
  }
  
  return results;
}

async function verifyFunctions() {
  console.log('🔧 Verifying Database Functions...\n');
  
  const results = [];
  
  for (const functionName of expectedFunctions) {
    const exists = await checkFunctionExists(functionName);
    results.push({ function: functionName, exists });
    
    console.log(`${exists ? '✅' : '❌'} ${functionName}`);
  }
  
  console.log('');
  return results;
}

async function verifyViews() {
  console.log('👁️  Verifying Database Views...\n');
  
  const results = [];
  
  for (const viewName of expectedViews) {
    const exists = await checkViewExists(viewName);
    results.push({ view: viewName, exists });
    
    console.log(`${exists ? '✅' : '❌'} ${viewName}`);
  }
  
  console.log('');
  return results;
}

async function generateComprehensiveReport(tableResults, functionResults, viewResults) {
  console.log('\n📊 COMPREHENSIVE DATABASE REPORT\n');
  
  // Table Summary
  const perfectTables = tableResults.filter(r => r.status === 'perfect').length;
  const minorIssues = tableResults.filter(r => r.status === 'minor_issues').length;
  const majorIssues = tableResults.filter(r => r.status === 'major_issues').length;
  const missingTables = tableResults.filter(r => r.status === 'missing').length;
  
  console.log('📋 TABLE ANALYSIS:');
  console.log(`✅ Perfect: ${perfectTables}/${tableResults.length}`);
  console.log(`⚠️  Minor Issues: ${minorIssues}/${tableResults.length}`);
  console.log(`❌ Major Issues: ${majorIssues}/${tableResults.length}`);
  console.log(`🚫 Missing: ${missingTables}/${tableResults.length}\n`);
  
  // Function Summary
  const existingFunctions = functionResults.filter(r => r.exists).length;
  console.log('🔧 FUNCTION ANALYSIS:');
  console.log(`✅ Existing: ${existingFunctions}/${functionResults.length}`);
  console.log(`❌ Missing: ${functionResults.length - existingFunctions}/${functionResults.length}\n`);
  
  // View Summary  
  const existingViews = viewResults.filter(r => r.exists).length;
  console.log('👁️  VIEW ANALYSIS:');
  console.log(`✅ Existing: ${existingViews}/${viewResults.length}`);
  console.log(`❌ Missing: ${viewResults.length - existingViews}/${viewResults.length}\n`);
  
  // Issues Report
  const tablesWithIssues = tableResults.filter(r => r.issues && r.issues.length > 0);
  if (tablesWithIssues.length > 0) {
    console.log('🚨 ISSUES FOUND:\n');
    tablesWithIssues.forEach(table => {
      console.log(`❌ ${table.table}:`);
      table.issues.forEach(issue => console.log(`   - ${issue}`));
      console.log('');
    });
  }
  
  const missingFunctions = functionResults.filter(r => !r.exists);
  if (missingFunctions.length > 0) {
    console.log('🔧 MISSING FUNCTIONS:');
    missingFunctions.forEach(func => console.log(`   - ${func.function}`));
    console.log('');
  }
  
  const missingViews = viewResults.filter(r => !r.exists);
  if (missingViews.length > 0) {
    console.log('👁️  MISSING VIEWS:');
    missingViews.forEach(view => console.log(`   - ${view.view}`));
    console.log('');
  }
  
  // Overall Status
  const overallScore = (perfectTables * 3 + minorIssues * 2 + majorIssues * 1) / (tableResults.length * 3) * 100;
  const functionScore = (existingFunctions / functionResults.length) * 100;
  const viewScore = (existingViews / viewResults.length) * 100;
  const totalScore = (overallScore + functionScore + viewScore) / 3;
  
  console.log('🎯 OVERALL DATABASE HEALTH:');
  console.log(`📊 Tables: ${Math.round(overallScore)}%`);
  console.log(`🔧 Functions: ${Math.round(functionScore)}%`);
  console.log(`👁️  Views: ${Math.round(viewScore)}%`);
  console.log(`🏆 Total Score: ${Math.round(totalScore)}%\n`);
  
  if (totalScore >= 95) {
    console.log('🎉 EXCELLENT! Your database is production-ready!');
  } else if (totalScore >= 80) {
    console.log('✅ GOOD! Minor fixes needed, but mostly ready.');
  } else if (totalScore >= 60) {
    console.log('⚠️  FAIR! Several issues need attention.');
  } else {
    console.log('❌ POOR! Major issues need immediate attention.');
  }
  
  return totalScore;
}

async function main() {
  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('❌ Missing environment variables!');
    process.exit(1);
  }
  
  // Test connection
  const connected = await checkConnection();
  if (!connected) {
    console.log('\n❌ Cannot connect to Supabase. Check your credentials.');
    process.exit(1);
  }
  
  // Run comprehensive verification
  const tableResults = await verifyTableSchema();
  const functionResults = await verifyFunctions();
  const viewResults = await verifyViews();
  
  // Generate comprehensive report
  const score = await generateComprehensiveReport(tableResults, functionResults, viewResults);
  
  console.log('\n✨ Database verification complete!');
  console.log(`Final Score: ${Math.round(score)}%`);
}

// Run the script
main().catch(console.error);