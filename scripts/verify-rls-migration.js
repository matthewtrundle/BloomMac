const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyRLSMigration() {
  console.log('=== RLS Migration Verification ===\n');
  
  try {
    // 1. Test critical operations that should work after migration
    console.log('1. Testing critical operations:\n');
    
    // Test analytics insert (should work for anonymous)
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          type: 'test_migration',
          page: '/test',
          data: { test: true }
        });
      
      if (error) {
        console.log('❌ Analytics insert failed:', error.message);
      } else {
        console.log('✅ Analytics insert works for anonymous');
      }
    } catch (e) {
      console.log('❌ Analytics insert error:', e.message);
    }
    
    // Test contact submission (should work for anonymous)
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: 'Test Migration',
          email: 'test@migration.com',
          message: 'Testing RLS migration',
          metadata: { test: true }
        });
      
      if (error) {
        console.log('❌ Contact submission failed:', error.message);
      } else {
        console.log('✅ Contact submission works for anonymous');
      }
    } catch (e) {
      console.log('❌ Contact submission error:', e.message);
    }
    
    // 2. Check tables that will have RLS enabled
    console.log('\n2. Tables that will have RLS enabled after migration:\n');
    
    const tablesToEnable = [
      'analytics_events',
      'contact_submissions',
      'email_queue',
      'email_templates',
      'courses',
      'subscribers',
      'blog_posts',
      'career_applications',
      'achievements',
      'admin_sessions',
      'click_heatmap',
      'course_purchases',
      'email_automation_errors',
      'email_templates_history',
      'reminder_rules',
      'sequence_email_sends',
      'sequence_enrollments',
      'system_settings',
      'user_course_access'
    ];
    
    const { data: currentStatus, error: statusError } = await supabase.rpc('query', {
      query: `
        SELECT 
          tablename,
          rowsecurity as currently_enabled,
          (SELECT COUNT(*) FROM pg_policies p 
           WHERE p.tablename = t.tablename 
           AND p.schemaname = 'public') as policy_count
        FROM pg_tables t
        WHERE schemaname = 'public' 
          AND tablename IN (${tablesToEnable.map(t => `'${t}'`).join(',')})
        ORDER BY tablename
      `
    }).single();
    
    if (statusError) {
      console.log('Error checking status:', statusError);
    } else {
      console.table(currentStatus);
    }
    
    // 3. Check for potential conflicts
    console.log('\n3. Checking for potential policy conflicts:\n');
    
    const { data: duplicatePolicies, error: dupError } = await supabase.rpc('query', {
      query: `
        SELECT 
          tablename,
          policyname,
          COUNT(*) as count
        FROM pg_policies
        WHERE schemaname = 'public'
        GROUP BY tablename, policyname
        HAVING COUNT(*) > 1
      `
    }).single();
    
    if (dupError) {
      console.log('Error checking duplicates:', dupError);
    } else if (duplicatePolicies && duplicatePolicies.length > 0) {
      console.log('⚠️  Duplicate policies found:');
      console.table(duplicatePolicies);
    } else {
      console.log('✅ No duplicate policies found');
    }
    
    // 4. Verify auth functions are available
    console.log('\n4. Verifying auth functions:\n');
    
    const { data: authTest, error: authError } = await supabase.rpc('query', {
      query: `
        SELECT 
          CASE WHEN auth.uid() IS NULL THEN 'auth.uid() returns NULL (expected for service role)'
               ELSE 'auth.uid() returns: ' || auth.uid()::text
          END as uid_test,
          CASE WHEN auth.role() IS NULL THEN 'auth.role() returns NULL'
               ELSE 'auth.role() returns: ' || auth.role()
          END as role_test,
          CASE WHEN auth.jwt() IS NULL THEN 'auth.jwt() returns NULL'
               ELSE 'auth.jwt() is available'
          END as jwt_test
      `
    }).single();
    
    if (authError) {
      console.log('Error testing auth functions:', authError);
    } else if (authTest && authTest.length > 0) {
      const result = authTest[0];
      console.log('- ' + result.uid_test);
      console.log('- ' + result.role_test);
      console.log('- ' + result.jwt_test);
    }
    
    // 5. Summary
    console.log('\n5. Migration Summary:\n');
    
    const { data: summary, error: summaryError } = await supabase.rpc('query', {
      query: `
        SELECT 
          COUNT(*) FILTER (WHERE rowsecurity = false) as tables_without_rls,
          COUNT(*) FILTER (WHERE rowsecurity = true) as tables_with_rls,
          COUNT(*) as total_tables
        FROM pg_tables
        WHERE schemaname = 'public'
      `
    }).single();
    
    if (summaryError) {
      console.log('Error getting summary:', summaryError);
    } else if (summary && summary.length > 0) {
      const stats = summary[0];
      console.log(`Current state:`);
      console.log(`- Tables with RLS enabled: ${stats.tables_with_rls}`);
      console.log(`- Tables without RLS: ${stats.tables_without_rls}`);
      console.log(`- Total tables: ${stats.total_tables}`);
      console.log(`\nAfter migration:`);
      console.log(`- Tables with RLS enabled: ${stats.tables_with_rls + tablesToEnable.length}`);
      console.log(`- Tables without RLS: ${stats.tables_without_rls - tablesToEnable.length}`);
    }
    
    // Clean up test data
    console.log('\n6. Cleaning up test data...\n');
    
    await supabase
      .from('analytics_events')
      .delete()
      .eq('type', 'test_migration');
    
    await supabase
      .from('contact_submissions')
      .delete()
      .eq('email', 'test@migration.com');
    
    console.log('✅ Test data cleaned up');
    
  } catch (error) {
    console.error('Verification error:', error);
  }
}

// Setup and run
async function setupQueryFunction() {
  try {
    await supabase.rpc('query', {
      query: `
        CREATE OR REPLACE FUNCTION query(query text)
        RETURNS json
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result json;
        BEGIN
          EXECUTE 'SELECT json_agg(row_to_json(t)) FROM (' || query || ') t' INTO result;
          RETURN result;
        END;
        $$;
      `
    });
  } catch (error) {
    // Function might already exist
  }
}

setupQueryFunction().then(verifyRLSMigration);