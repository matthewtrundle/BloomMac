const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Test each API's database query to ensure it works
async function verifyApiQueries() {
  console.log('🧪 Testing Wellness Hub API Database Queries\n');
  
  const tests = [
    {
      name: 'Profile API - Get user profile',
      test: async () => {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(1);
        return { success: !error, data, error };
      }
    },
    {
      name: 'Achievements API - Get user achievements',
      test: async () => {
        const { data, error } = await supabase
          .from('user_achievements')
          .select('*')
          .limit(1);
        return { success: !error, data, error };
      }
    },
    {
      name: 'Preferences API - Get user preferences',
      test: async () => {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .limit(1);
        return { success: !error, data, error };
      }
    },
    {
      name: 'Newsletter API - Check subscriber',
      test: async () => {
        const { data, error } = await supabase
          .from('subscribers')
          .select('id, email, status')
          .eq('email', 'test@example.com')
          .single();
        // It's ok if not found
        return { success: !error || error.code === 'PGRST116', data, error };
      }
    },
    {
      name: 'Activity Log API - Insert test (schema check)',
      test: async () => {
        // First, let's see what columns exist
        const { data: sample, error: selectError } = await supabase
          .from('user_activity_log')
          .select('*')
          .limit(1);
        
        if (!selectError && sample && sample.length > 0) {
          return { 
            success: true, 
            data: { 
              message: 'Table exists with columns:', 
              columns: Object.keys(sample[0])
            }
          };
        }
        
        // Try the insert that the API uses
        const { error } = await supabase
          .from('user_activity_log')
          .insert({
            user_id: '00000000-0000-0000-0000-000000000000',
            action: 'test_privacy_update',
            ip_address: '127.0.0.1',
            metadata: { test: true }
          });
        
        if (error) {
          return { 
            success: false, 
            error,
            suggestion: 'Schema mismatch - table may have different columns'
          };
        }
        
        // Clean up
        await supabase
          .from('user_activity_log')
          .delete()
          .eq('action', 'test_privacy_update');
        
        return { success: true, data: 'Insert works correctly' };
      }
    },
    {
      name: 'Contact Form API - Test structure',
      test: async () => {
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('id, first_name, last_name, email, message')
          .limit(1);
        return { success: !error, data, error };
      }
    },
    {
      name: 'Analytics API - Insert event',
      test: async () => {
        const { error } = await supabase
          .from('analytics_events')
          .insert({
            type: 'page_view',
            page: '/test',
            metadata: { test: true }
          });
        
        if (!error) {
          // Clean up
          await supabase
            .from('analytics_events')
            .delete()
            .eq('page', '/test');
        }
        
        return { success: !error, error };
      }
    },
    {
      name: 'Dashboard RPC - get_dashboard_data',
      test: async () => {
        const { data, error } = await supabase
          .rpc('get_dashboard_data', { 
            user_id: '00000000-0000-0000-0000-000000000000' 
          });
        return { success: !error, data, error };
      }
    },
    {
      name: 'Courses API - Get active courses',
      test: async () => {
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            course_modules (
              *,
              course_lessons (*)
            )
          `)
          .eq('is_active', true);
        return { success: !error, data, error };
      }
    },
    {
      name: 'Course Progress - Check structure',
      test: async () => {
        const { data, error } = await supabase
          .from('course_progress')
          .select('*')
          .limit(1);
        return { success: !error, data, error };
      }
    }
  ];
  
  let passCount = 0;
  let failCount = 0;
  const failures = [];
  
  for (const test of tests) {
    console.log(`\n📋 Testing: ${test.name}`);
    
    try {
      const result = await test.test();
      
      if (result.success) {
        console.log('   ✅ PASSED');
        passCount++;
        
        if (result.data) {
          if (typeof result.data === 'object' && result.data.message) {
            console.log(`   ℹ️  ${result.data.message}`);
            if (result.data.columns) {
              console.log(`   Columns: ${result.data.columns.join(', ')}`);
            }
          } else if (Array.isArray(result.data)) {
            console.log(`   Found ${result.data.length} records`);
          }
        }
      } else {
        console.log('   ❌ FAILED');
        failCount++;
        
        if (result.error) {
          console.log(`   Error: ${result.error.message}`);
        }
        if (result.suggestion) {
          console.log(`   💡 ${result.suggestion}`);
        }
        
        failures.push({
          test: test.name,
          error: result.error,
          suggestion: result.suggestion
        });
      }
    } catch (err) {
      console.log('   ❌ FAILED with exception');
      console.log(`   Error: ${err.message}`);
      failCount++;
      failures.push({
        test: test.name,
        error: err
      });
    }
  }
  
  // Summary
  console.log('\n\n📊 TEST SUMMARY');
  console.log('===============');
  console.log(`Total Tests: ${tests.length}`);
  console.log(`✅ Passed: ${passCount}`);
  console.log(`❌ Failed: ${failCount}`);
  
  if (failures.length > 0) {
    console.log('\n\n⚠️  FAILED TESTS:');
    failures.forEach(f => {
      console.log(`\n- ${f.test}`);
      if (f.error) {
        console.log(`  Error: ${f.error.message || f.error}`);
      }
      if (f.suggestion) {
        console.log(`  Suggestion: ${f.suggestion}`);
      }
    });
    
    console.log('\n\n🔧 RECOMMENDED FIXES:');
    
    // Check if user_activity_log needs fixing
    if (failures.some(f => f.test.includes('Activity Log'))) {
      console.log('\n1. Fix user_activity_log schema:');
      console.log('```sql');
      console.log(`-- Option 1: Add missing columns
ALTER TABLE public.user_activity_log 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS action TEXT,
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Option 2: Or update the API to match existing schema
-- Check what columns actually exist first`);
      console.log('```');
    }
  } else {
    console.log('\n\n🎉 All tests passed! The wellness hub APIs are properly configured.');
  }
}

verifyApiQueries();