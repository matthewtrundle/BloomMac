const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRLS() {
  console.log('Checking RLS status for tables mentioned in security lints...\n');

  // Tables from the security lint report
  const tablesWithPoliciesButNoRLS = [
    'analytics_events',
    'blog_posts',
    'career_applications',
    'contact_submissions',
    'courses',
    'email_queue',
    'email_templates',
    'subscribers'
  ];

  const tablesWithNoRLSNoPolicies = [
    'click_heatmap',
    'user_course_access',
    'course_purchases',
    'admin_sessions',
    'email_templates_history',
    'email_automation_errors',
    'system_settings',
    'profiles_backup_2025_01_06',
    'achievements',
    'sequence_enrollments',
    'sequence_email_sends',
    'reminder_rules'
  ];

  console.log('=== CRITICAL: Tables with policies but RLS disabled ===');
  console.log('These need RLS enabled immediately:\n');
  
  console.log('-- SQL to fix these tables:');
  tablesWithPoliciesButNoRLS.forEach(table => {
    console.log(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
  });

  console.log('\n=== CRITICAL: Tables with no RLS and no policies ===');
  console.log('These tables are completely unprotected!\n');
  
  tablesWithNoRLSNoPolicies.forEach(table => {
    console.log(`- ${table}`);
  });

  console.log('\n=== SECURITY ANALYSIS ===\n');
  console.log('1. Tables with policies but RLS disabled:');
  console.log(`   Count: ${tablesWithPoliciesButNoRLS.length} tables`);
  console.log('   Risk: HIGH - Policies exist but are not enforced!');
  console.log('   Action: Enable RLS immediately\n');

  console.log('2. Tables with no RLS and no policies:');
  console.log(`   Count: ${tablesWithNoRLSNoPolicies.length} tables`);
  console.log('   Risk: CRITICAL - Anyone can read/write these tables!');
  console.log('   Action: Review each table and add appropriate policies\n');

  console.log('3. Special concern - heatmap_aggregated view:');
  console.log('   Issue: SECURITY DEFINER view');
  console.log('   Risk: Bypasses RLS of underlying tables');
  console.log('   Action: Review if this view needs SECURITY DEFINER\n');

  console.log('=== RECOMMENDED ACTIONS ===\n');
  console.log('1. IMMEDIATE: Run the SQL above to enable RLS on tables with policies');
  console.log('2. URGENT: Review tables without any protection and add policies');
  console.log('3. IMPORTANT: Audit the SECURITY DEFINER view');
  console.log('4. ONGOING: Set up alerts for new tables without RLS');
}

checkRLS();