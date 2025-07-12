const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDatabaseFunctions() {
  console.log('Checking database functions...\n');
  
  // List of functions we expect to exist
  const expectedFunctions = [
    'handle_newsletter_signup',
    'handle_email_unsubscribe',
    'validate_unsubscribe_token',
    'get_analytics_summary',
    'get_analytics_dashboard',
    'create_user_profile',
    'subscribe_to_newsletter',
    'get_email_analytics',
    'get_subscriber_stats',
    'get_email_engagement_patterns',
    'get_subscriber_growth_trend',
    'get_career_applications',
    'get_contact_submissions'
  ];
  
  try {
    // Query for all functions in the public schema
    const { data: functions, error } = await supabase.rpc('query', {
      query: `
        SELECT 
          p.proname as function_name,
          pg_get_function_identity_arguments(p.oid) as arguments,
          pg_get_functiondef(p.oid) as definition
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.prokind = 'f'
        ORDER BY p.proname
      `
    }).single();
    
    if (error) {
      console.error('Error checking functions:', error);
      
      // Fallback: try a simpler query
      console.log('\nTrying simpler query...');
      const { data: simpleFunctions, error: simpleError } = await supabase.rpc('query', {
        query: `
          SELECT routine_name as function_name
          FROM information_schema.routines
          WHERE routine_schema = 'public'
          AND routine_type = 'FUNCTION'
          ORDER BY routine_name
        `
      }).single();
      
      if (simpleError) {
        console.error('Simple query also failed:', simpleError);
        return;
      }
      
      const functionList = simpleFunctions ? (typeof simpleFunctions === 'string' ? JSON.parse(simpleFunctions) : simpleFunctions) : [];
      console.log(`Found ${functionList.length} functions in database\n`);
      
      // Check which expected functions exist
      console.log('Checking expected functions:');
      for (const funcName of expectedFunctions) {
        const exists = functionList.some(f => f.function_name === funcName);
        console.log(`  ${funcName}: ${exists ? '✓ EXISTS' : '✗ MISSING'}`);
      }
      
      return;
    }
    
    const functionList = functions ? (typeof functions === 'string' ? JSON.parse(functions) : functions) : [];
    console.log(`Found ${functionList.length} functions in database\n`);
    
    // Check which expected functions exist
    console.log('Checking expected functions:');
    for (const funcName of expectedFunctions) {
      const func = functionList.find(f => f.function_name === funcName);
      if (func) {
        console.log(`  ${funcName}: ✓ EXISTS`);
        console.log(`    Arguments: ${func.arguments || 'none'}`);
      } else {
        console.log(`  ${funcName}: ✗ MISSING`);
      }
    }
    
    // List all other functions
    console.log('\nOther functions in database:');
    const otherFunctions = functionList.filter(f => 
      !expectedFunctions.includes(f.function_name)
    );
    for (const func of otherFunctions) {
      console.log(`  - ${func.function_name}(${func.arguments || ''})`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// First create the query function if it doesn't exist
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
    // Function might already exist, that's ok
  }
}

setupQueryFunction().then(checkDatabaseFunctions).catch(console.error);