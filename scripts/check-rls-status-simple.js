const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRLSStatus() {
  console.log('=== RLS Status Summary ===\n');
  
  try {
    // 1. Tables WITHOUT RLS enabled
    console.log('Tables WITHOUT RLS enabled:\n');
    const { data: noRLS, error: noRLSError } = await supabase.rpc('query', {
      query: `
        SELECT tablename, 
               (SELECT COUNT(*) FROM pg_policies p 
                WHERE p.tablename = t.tablename 
                AND p.schemaname = 'public') as policy_count
        FROM pg_tables t
        WHERE schemaname = 'public' 
          AND rowsecurity = false
        ORDER BY tablename
      `
    }).single();
    
    if (noRLSError) throw noRLSError;
    
    const tablesWithoutRLS = noRLS || [];
    tablesWithoutRLS.forEach(table => {
      console.log(`- ${table.tablename} (${table.policy_count} policies defined)`);
    });
    
    // 2. Check specific tables for column existence
    console.log('\n\nColumn check for key tables:\n');
    
    const tablesToCheck = [
      { table: 'user_profiles', columns: ['id', 'role'] },
      { table: 'courses', columns: ['id', 'is_active'] },
      { table: 'subscribers', columns: ['id', 'status'] },
      { table: 'email_templates', columns: ['id', 'is_public'] },
      { table: 'contact_submissions', columns: ['id'] },
      { table: 'analytics_events', columns: ['id'] }
    ];
    
    for (const { table, columns } of tablesToCheck) {
      const { data: cols, error: colError } = await supabase.rpc('query', {
        query: `
          SELECT column_name
          FROM information_schema.columns
          WHERE table_schema = 'public' 
            AND table_name = '${table}'
            AND column_name IN (${columns.map(c => `'${c}'`).join(',')})
        `
      }).single();
      
      if (colError) {
        console.log(`${table}: Error checking columns`);
      } else {
        const foundColumns = (cols || []).map(c => c.column_name);
        const missingColumns = columns.filter(c => !foundColumns.includes(c));
        if (missingColumns.length > 0) {
          console.log(`${table}: Missing columns: ${missingColumns.join(', ')}`);
        } else {
          console.log(`${table}: ✓ All required columns exist`);
        }
      }
    }
    
    // 3. Check tables that supposedly have policies but RLS disabled
    console.log('\n\nTables with policies but RLS disabled:\n');
    
    const problematicTables = [
      'admin_activity_log',
      'admin_sessions',
      'analytics_events',
      'contact_submissions',
      'course_enrollments',
      'course_progress',
      'email_automation_logs',
      'email_sends'
    ];
    
    for (const table of problematicTables) {
      const { data: status, error: statusError } = await supabase.rpc('query', {
        query: `
          SELECT 
            t.rowsecurity as rls_enabled,
            COUNT(p.policyname) as policy_count,
            STRING_AGG(p.policyname, ', ') as policies
          FROM pg_tables t
          LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
          WHERE t.schemaname = 'public' 
            AND t.tablename = '${table}'
          GROUP BY t.tablename, t.rowsecurity
        `
      }).single();
      
      if (statusError || !status || status.length === 0) {
        console.log(`${table}: Not found or error`);
      } else {
        const info = status[0];
        console.log(`${table}: RLS=${info.rls_enabled}, Policies=${info.policy_count}`);
        if (info.policies) {
          console.log(`  Policies: ${info.policies}`);
        }
      }
    }
    
    // 4. Check service role setup
    console.log('\n\nChecking auth functions:\n');
    
    // Test if auth.uid() and auth.role() functions exist
    const { data: authFuncs, error: authError } = await supabase.rpc('query', {
      query: `
        SELECT 
          p.proname as function_name,
          n.nspname as schema_name
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname IN ('uid', 'role', 'jwt')
          AND n.nspname = 'auth'
      `
    }).single();
    
    if (authError) {
      console.log('Error checking auth functions:', authError.message);
    } else if (authFuncs && authFuncs.length > 0) {
      console.log('Auth functions available:');
      authFuncs.forEach(f => console.log(`- auth.${f.function_name}()`));
    } else {
      console.log('No auth functions found');
    }
    
  } catch (error) {
    console.error('Error:', error);
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

setupQueryFunction().then(checkRLSStatus);