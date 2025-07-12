const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRLSPolicies() {
  console.log('=== RLS Policy Check ===\n');
  
  try {
    // 1. Check which tables have RLS enabled
    console.log('1. Tables with RLS status:\n');
    const { data: rlsStatus, error: rlsError } = await supabase.rpc('query', {
      query: `
        SELECT 
          schemaname,
          tablename,
          rowsecurity
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY tablename
      `
    }).single();
    
    if (rlsError) throw rlsError;
    
    const tables = rlsStatus;
    if (tables) {
      console.table(tables);
    } else {
      console.log('No tables found');
    }
    
    // 2. Check existing policies for all tables
    console.log('\n2. Existing RLS Policies:\n');
    const { data: policies, error: policiesError } = await supabase.rpc('query', {
      query: `
        SELECT 
          schemaname,
          tablename,
          policyname,
          permissive,
          roles,
          cmd,
          qual,
          with_check
        FROM pg_policies
        WHERE schemaname = 'public'
        ORDER BY tablename, policyname
      `
    }).single();
    
    if (policiesError) throw policiesError;
    
    const policyList = policies;
    if (policyList && policyList.length > 0) {
      // Group policies by table
      const policiesByTable = {};
      policyList.forEach(policy => {
        if (!policiesByTable[policy.tablename]) {
          policiesByTable[policy.tablename] = [];
        }
        policiesByTable[policy.tablename].push(policy);
      });
      
      Object.entries(policiesByTable).forEach(([table, tablePolicies]) => {
        console.log(`\nTable: ${table}`);
        tablePolicies.forEach(policy => {
          console.log(`  Policy: ${policy.policyname}`);
          console.log(`    Command: ${policy.cmd}`);
          console.log(`    Roles: ${policy.roles}`);
          console.log(`    Permissive: ${policy.permissive}`);
          console.log(`    Qual: ${policy.qual || 'None'}`);
          console.log(`    With Check: ${policy.with_check || 'None'}`);
        });
      });
    } else {
      console.log('No policies found.');
    }
    
    // 3. Check table structures for important tables
    console.log('\n\n3. Table Structures for Key Tables:\n');
    
    const keyTables = [
      'user_profiles',
      'courses',
      'course_enrollments',
      'course_progress',
      'subscribers',
      'email_templates',
      'email_sequences',
      'sequence_emails',
      'sequence_enrollments',
      'email_automation_logs',
      'contact_submissions',
      'analytics_events'
    ];
    
    for (const table of keyTables) {
      console.log(`\n=== ${table} ===`);
      
      const { data: columns, error: columnsError } = await supabase.rpc('query', {
        query: `
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default
          FROM information_schema.columns
          WHERE table_schema = 'public' 
            AND table_name = '${table}'
          ORDER BY ordinal_position
        `
      }).single();
      
      if (columnsError) {
        console.log(`  Error checking table: ${columnsError.message}`);
        continue;
      }
      
      const columnList = columns;
      if (columnList && columnList.length > 0) {
        console.table(columnList);
      } else {
        console.log('  Table does not exist');
      }
    }
    
    // 4. Check auth configuration
    console.log('\n\n4. Auth Configuration Check:\n');
    
    // Check if auth.uid() function works
    const { data: authCheck, error: authError } = await supabase.rpc('query', {
      query: `
        SELECT 
          current_user,
          session_user,
          current_setting('request.jwt.claims', true) as jwt_claims,
          current_setting('request.jwt.claim.sub', true) as jwt_sub,
          current_setting('request.jwt.claim.role', true) as jwt_role
      `
    }).single();
    
    if (authError) {
      console.log('Auth check error:', authError);
    } else {
      console.log('Current auth context:');
      console.log(authCheck);
    }
    
    // 5. Check for service role usage
    console.log('\n\n5. Service Role Check:\n');
    
    const { data: roleCheck, error: roleError } = await supabase.rpc('query', {
      query: `
        SELECT 
          rolname,
          rolsuper,
          rolinherit,
          rolcreaterole,
          rolcreatedb,
          rolcanlogin
        FROM pg_roles
        WHERE rolname IN ('anon', 'authenticated', 'service_role', 'authenticator')
      `
    }).single();
    
    if (roleError) {
      console.log('Role check error:', roleError);
    } else {
      console.log('Database roles:');
      console.table(roleCheck);
    }
    
    // 6. Check specific tables that claim to have policies
    console.log('\n\n6. Tables with RLS disabled but policies defined:\n');
    
    const tablesWithPoliciesButDisabled = [
      'admin_activity_log',
      'admin_sessions',
      'analytics_events',
      'contact_submissions',
      'course_enrollments',
      'course_progress',
      'email_automation_logs',
      'email_sends'
    ];
    
    for (const table of tablesWithPoliciesButDisabled) {
      const { data: tableCheck, error: tableError } = await supabase.rpc('query', {
        query: `
          SELECT 
            t.tablename,
            t.rowsecurity as rls_enabled,
            COUNT(p.policyname) as policy_count
          FROM pg_tables t
          LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
          WHERE t.schemaname = 'public' 
            AND t.tablename = '${table}'
          GROUP BY t.tablename, t.rowsecurity
        `
      }).single();
      
      if (tableError) {
        console.log(`${table}: Error - ${tableError.message}`);
      } else {
        const result = tableCheck;
        if (result && result.length > 0) {
          const info = result[0];
          console.log(`${table}: RLS=${info.rls_enabled}, Policies=${info.policy_count}`);
        } else {
          console.log(`${table}: Does not exist`);
        }
      }
    }
    
    // 7. Sample data check for user_profiles
    console.log('\n\n7. Sample user_profiles data:\n');
    
    const { data: sampleUsers, error: sampleError } = await supabase.rpc('query', {
      query: `
        SELECT 
          up.id,
          up.role,
          up.created_at,
          au.email
        FROM user_profiles up
        LEFT JOIN auth.users au ON au.id = up.id
        ORDER BY up.created_at DESC
        LIMIT 5
      `
    }).single();
    
    if (sampleError) {
      console.log('Sample users error:', sampleError);
    } else {
      console.log('Recent users:');
      console.table(sampleUsers);
    }
    
  } catch (error) {
    console.error('Error checking RLS policies:', error);
  }
}

// First setup the query function if needed
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

// Run the check
setupQueryFunction().then(checkRLSPolicies);