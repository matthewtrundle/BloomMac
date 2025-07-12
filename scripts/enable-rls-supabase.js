const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Tables that need RLS enabled based on the security audit
const tablesToEnableRLS = [
  // Tables with policies but RLS disabled
  'analytics_events',
  'blog_posts',
  'career_applications',
  'contact_submissions',
  'courses',
  'email_queue',
  'email_templates',
  'subscribers',
  
  // Tables without RLS that need it
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
  'user_course_access',
  'profiles_backup_2025_01_06'
];

async function enableRLS() {
  console.log('🔒 Enabling RLS on Critical Tables\n');
  console.log('⚠️  IMPORTANT: This script cannot directly enable RLS via the Supabase JS client.');
  console.log('You need to run the following SQL commands in your Supabase SQL Editor:\n');
  
  console.log('-- ========================================');
  console.log('-- CRITICAL: Enable RLS on Vulnerable Tables');
  console.log('-- ========================================\n');
  
  console.log('-- Step 1: Enable RLS on tables with existing policies');
  console.log('-- These are HIGH PRIORITY - policies exist but are not enforced!\n');
  
  const tablesWithPolicies = [
    'analytics_events',
    'blog_posts',
    'career_applications',
    'contact_submissions',
    'courses',
    'email_queue',
    'email_templates',
    'subscribers'
  ];
  
  tablesWithPolicies.forEach(table => {
    console.log(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
  });
  
  console.log('\n-- Step 2: Enable RLS on tables without policies');
  console.log('-- These need RLS enabled AND policies added\n');
  
  const tablesWithoutPolicies = [
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
  
  tablesWithoutPolicies.forEach(table => {
    console.log(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
  });
  
  console.log('\n-- Step 3: Add critical policies for service role access');
  console.log('-- This ensures your application can still function\n');
  
  tablesWithoutPolicies.forEach(table => {
    console.log(`-- Ensure service role can access ${table}`);
    console.log(`CREATE POLICY "${table}_service_role_all" ON public.${table}`);
    console.log(`  FOR ALL TO service_role USING (true) WITH CHECK (true);\n`);
  });
  
  console.log('-- Step 4: Verify RLS is enabled');
  console.log(`
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = false
ORDER BY tablename;
`);
  
  console.log('-- This query should return NO ROWS if all tables have RLS enabled\n');
  
  console.log('\n📋 INSTRUCTIONS:');
  console.log('1. Go to your Supabase Dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Copy and paste the SQL commands above');
  console.log('4. Run the commands');
  console.log('5. Verify with the final SELECT query\n');
  
  console.log('⚡ QUICK FIX for critical tables (copy this first):');
  console.log('```sql');
  tablesWithPolicies.forEach(table => {
    console.log(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
  });
  console.log('```\n');
  
  // Let's also check current status
  console.log('Current RLS Status Check:');
  
  for (const table of tablesToEnableRLS) {
    try {
      const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
      if (error && error.message.includes('row-level security')) {
        console.log(`✅ ${table} - RLS is enabled`);
      } else {
        console.log(`❌ ${table} - RLS is DISABLED (vulnerable!)`);
      }
    } catch (e) {
      console.log(`❓ ${table} - Could not check status`);
    }
  }
}

enableRLS();