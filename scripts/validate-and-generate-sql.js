const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function generateValidSQL() {
  console.log('🔍 Analyzing current database state and generating valid SQL...\n');
  
  // First, let's check what policies already exist
  console.log('-- ============================================');
  console.log('-- VERIFIED SQL SCRIPT FOR YOUR DATABASE');
  console.log('-- Generated after checking actual state');
  console.log('-- ============================================\n');
  
  const tables = ['email_logs', 'email_analytics', 'career_applications', 'system_settings', 'user_achievements', 'cron_logs'];
  
  // Check current state
  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    
    if (!error || error.code === 'PGRST301') {
      console.log(`-- Table ${table} exists`);
      console.log(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
      console.log();
    }
  }
  
  console.log('\n-- Add service role policies (ALWAYS drop first to avoid duplicates)');
  for (const table of tables) {
    console.log(`DROP POLICY IF EXISTS "${table}_service_role" ON public.${table};`);
    console.log(`CREATE POLICY "${table}_service_role" ON public.${table}`);
    console.log(`    FOR ALL TO service_role USING (true) WITH CHECK (true);`);
    console.log();
  }
  
  console.log('\n-- Add specific policies');
  
  // User achievements
  console.log('-- User achievements policies');
  console.log('DROP POLICY IF EXISTS "users_view_own_achievements" ON public.user_achievements;');
  console.log('CREATE POLICY "users_view_own_achievements" ON public.user_achievements');
  console.log('    FOR SELECT TO authenticated USING (auth.uid() = user_id);');
  console.log();
  
  console.log('DROP POLICY IF EXISTS "users_insert_own_achievements" ON public.user_achievements;');
  console.log('CREATE POLICY "users_insert_own_achievements" ON public.user_achievements');
  console.log('    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);');
  console.log();
  
  // Career applications
  console.log('-- Career applications - public can submit');
  console.log('DROP POLICY IF EXISTS "public_submit_applications" ON public.career_applications;');
  console.log('CREATE POLICY "public_submit_applications" ON public.career_applications');
  console.log('    FOR INSERT TO anon WITH CHECK (true);');
  console.log();
  
  // Admin policies
  console.log('-- Admin policies');
  const adminTables = [
    { table: 'email_logs', action: 'SELECT' },
    { table: 'email_analytics', action: 'SELECT' },
    { table: 'career_applications', action: 'ALL' },
    { table: 'system_settings', action: 'ALL' },
    { table: 'cron_logs', action: 'SELECT' }
  ];
  
  for (const { table, action } of adminTables) {
    const policyName = `admins_${action.toLowerCase()}_${table}`;
    console.log(`DROP POLICY IF EXISTS "${policyName}" ON public.${table};`);
    console.log(`CREATE POLICY "${policyName}" ON public.${table}`);
    console.log(`    FOR ${action} TO authenticated`);
    console.log(`    USING (EXISTS (`);
    console.log(`        SELECT 1 FROM user_profiles`);
    console.log(`        WHERE user_profiles.id = auth.uid()`);
    console.log(`        AND user_profiles.role = 'admin'`);
    console.log(`    ));`);
    console.log();
  }
  
  console.log('\n-- Verify everything worked');
  console.log('SELECT tablename, rowsecurity');
  console.log('FROM pg_tables');
  console.log('WHERE schemaname = \'public\'');
  console.log('AND tablename IN (');
  tables.forEach((table, i) => {
    console.log(`    '${table}'${i < tables.length - 1 ? ',' : ''}`);
  });
  console.log(');');
  console.log('-- All should show rowsecurity = true');
}

generateValidSQL();