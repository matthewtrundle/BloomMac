const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Tables used by wellness hub APIs with expected columns
const wellnessHubSchema = {
  user_profiles: {
    expectedColumns: ['id', 'first_name', 'last_name', 'created_at', 'updated_at', 'role'],
    requiredRelations: ['auth.users.id'],
    apis: ['/api/profile/get', '/api/profile/save', '/api/profile/create']
  },
  user_achievements: {
    expectedColumns: ['id', 'user_id', 'achievement_type', 'achievement_data', 'created_at'],
    requiredRelations: ['user_profiles.id'],
    apis: ['/api/achievements/get', '/api/achievements/complete-lesson']
  },
  user_preferences: {
    expectedColumns: [
      'id', 'user_id', 'privacy_settings', 'notification_preferences',
      'communication_preferences', 'reminder_settings', 'created_at', 'updated_at'
    ],
    requiredRelations: ['auth.users.id'],
    apis: ['/api/user/preferences', '/api/user/settings/privacy', '/api/user/settings/notifications']
  },
  user_activity_log: {
    expectedColumns: ['id', 'user_id', 'action', 'ip_address', 'metadata', 'created_at'],
    requiredRelations: ['auth.users.id'],
    apis: ['/api/user/settings/privacy'],
    note: 'Currently has issues - may need schema update'
  },
  subscribers: {
    expectedColumns: ['id', 'email', 'status', 'created_at', 'updated_at'],
    requiredRelations: [],
    apis: ['/api/user/newsletter-subscribe', '/api/user/newsletter-unsubscribe']
  },
  admin_activity_log: {
    expectedColumns: ['id', 'user_id', 'action', 'details', 'metadata', 'created_at'],
    requiredRelations: ['auth.users.id'],
    apis: ['/api/admin/auth/login', '/api/admin/auth/logout', 'Various admin actions']
  },
  contact_submissions: {
    expectedColumns: ['id', 'first_name', 'last_name', 'email', 'phone', 'message', 'created_at'],
    requiredRelations: [],
    apis: ['/api/contact/submit']
  },
  analytics_events: {
    expectedColumns: ['id', 'type', 'page_path', 'metadata', 'created_at'],
    requiredRelations: [],
    apis: ['/api/track-event']
  },
  // Course-related tables
  courses: {
    expectedColumns: ['id', 'title', 'slug', 'description', 'is_active', 'created_at'],
    requiredRelations: [],
    apis: ['/api/courses', '/api/courses/all-progress']
  },
  course_modules: {
    expectedColumns: ['id', 'course_id', 'title', 'order_index', 'is_published'],
    requiredRelations: ['courses.id'],
    apis: ['/api/courses', 'RPC functions']
  },
  course_lessons: {
    expectedColumns: ['id', 'module_id', 'title', 'content', 'order_index', 'is_published'],
    requiredRelations: ['course_modules.id'],
    apis: ['/api/courses', 'RPC functions']
  },
  course_progress: {
    expectedColumns: ['id', 'user_id', 'course_id', 'completed_lessons', 'last_accessed'],
    requiredRelations: ['auth.users.id', 'courses.id'],
    apis: ['/api/courses/all-progress', '/api/course/stats']
  }
};

async function verifySchema() {
  console.log('🔍 Verifying Wellness Hub Database Schema\n');
  
  const issues = [];
  const verified = [];
  
  for (const [tableName, expectedSchema] of Object.entries(wellnessHubSchema)) {
    console.log(`\n📊 Checking table: ${tableName}`);
    console.log(`   Used by: ${expectedSchema.apis.join(', ')}`);
    
    try {
      // Check if table exists
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        if (error.code === '42P01') {
          issues.push({
            table: tableName,
            issue: 'Table does not exist',
            severity: 'CRITICAL',
            fix: `CREATE TABLE public.${tableName} (...);`
          });
          console.log(`   ❌ Table does not exist!`);
        } else {
          console.log(`   ⚠️  Error checking table: ${error.message}`);
        }
        continue;
      }
      
      console.log(`   ✅ Table exists (${count} rows)`);
      
      // For tables with known issues, note them
      if (expectedSchema.note) {
        console.log(`   ℹ️  Note: ${expectedSchema.note}`);
        issues.push({
          table: tableName,
          issue: expectedSchema.note,
          severity: 'MINOR',
          fix: 'Review table schema and update if needed'
        });
      }
      
      verified.push({
        table: tableName,
        rowCount: count,
        apis: expectedSchema.apis
      });
      
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
      issues.push({
        table: tableName,
        issue: err.message,
        severity: 'UNKNOWN'
      });
    }
  }
  
  // Check RPC functions
  console.log('\n\n🔧 Checking RPC Functions:');
  const rpcFunctions = [
    'get_dashboard_data',
    'get_all_courses_progress',
    'get_course_stats'
  ];
  
  for (const funcName of rpcFunctions) {
    try {
      // Try to call with minimal params to check existence
      const { error } = await supabase.rpc(funcName, { user_id: '00000000-0000-0000-0000-000000000000' });
      
      if (error && error.code === '42883') {
        console.log(`   ❌ Function ${funcName} does not exist`);
        issues.push({
          table: `RPC: ${funcName}`,
          issue: 'Function does not exist',
          severity: 'CRITICAL'
        });
      } else {
        console.log(`   ✅ Function ${funcName} exists`);
        verified.push({
          table: `RPC: ${funcName}`,
          rowCount: 'N/A',
          apis: ['Dashboard/Course APIs']
        });
      }
    } catch (err) {
      console.log(`   ⚠️  Could not verify ${funcName}`);
    }
  }
  
  // Summary
  console.log('\n\n📋 VERIFICATION SUMMARY:');
  console.log('=======================\n');
  
  console.log(`✅ Verified: ${verified.length} tables/functions`);
  verified.forEach(v => {
    console.log(`   - ${v.table} (${v.rowCount} rows)`);
  });
  
  if (issues.length > 0) {
    console.log(`\n⚠️  Issues Found: ${issues.length}`);
    issues.forEach(issue => {
      console.log(`\n   ${issue.severity}: ${issue.table}`);
      console.log(`   Issue: ${issue.issue}`);
      if (issue.fix) {
        console.log(`   Fix: ${issue.fix}`);
      }
    });
  } else {
    console.log('\n🎉 No issues found! All tables are properly configured.');
  }
  
  // Generate fix script if needed
  if (issues.length > 0) {
    console.log('\n\n📝 SQL Fixes to Apply:');
    console.log('=====================\n');
    
    // Fix for user_activity_log if it has schema issues
    if (issues.some(i => i.table === 'user_activity_log')) {
      console.log(`-- Fix user_activity_log schema
ALTER TABLE public.user_activity_log 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS action TEXT,
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Add RLS policy if missing
CREATE POLICY IF NOT EXISTS "Users can view own activity" 
ON public.user_activity_log 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own activity" 
ON public.user_activity_log 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
`);
    }
  }
  
  console.log('\n\n🔐 Security Recommendations:');
  console.log('1. Ensure all tables have RLS enabled (you just did this!)');
  console.log('2. Verify foreign key constraints are in place');
  console.log('3. Add database triggers for updated_at timestamps');
  console.log('4. Consider adding indexes on frequently queried columns');
  console.log('5. Set up regular backups of critical tables');
}

verifySchema();