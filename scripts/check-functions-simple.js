const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkFunctions() {
  console.log('Checking database functions...\n');
  
  // List of functions we're checking
  const functionsToCheck = [
    'handle_newsletter_signup',
    'handle_email_unsubscribe', 
    'validate_unsubscribe_token',
    'get_analytics_summary',
    'get_analytics_dashboard',
    'create_user_profile',
    'subscribe_to_newsletter'
  ];
  
  console.log('Testing function existence by trying to get their definitions:\n');
  
  for (const funcName of functionsToCheck) {
    try {
      // Try to call the function with dummy parameters to see if it exists
      // We'll use a special SQL query that won't actually execute the function
      const { data, error } = await supabase.rpc('query', {
        query: `
          SELECT EXISTS (
            SELECT 1 
            FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = 'public' 
            AND p.proname = '${funcName}'
          ) as exists
        `
      }).single();
      
      if (error) {
        console.log(`${funcName}: ✗ ERROR checking`);
      } else {
        const result = typeof data === 'string' ? JSON.parse(data) : data;
        const exists = result && result[0] && result[0].exists;
        console.log(`${funcName}: ${exists ? '✓ EXISTS' : '✗ DOES NOT EXIST'}`);
      }
    } catch (e) {
      console.log(`${funcName}: ✗ ERROR - ${e.message}`);
    }
  }
  
  console.log('\nNow checking if we can see all functions in public schema...');
  
  try {
    const { data, error } = await supabase.rpc('query', {
      query: `
        SELECT COUNT(*) as function_count
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.prokind = 'f'
      `
    }).single();
    
    if (!error && data) {
      const result = typeof data === 'string' ? JSON.parse(data) : data;
      console.log(`\nTotal functions in public schema: ${result[0].function_count}`);
    }
  } catch (e) {
    console.log('Error counting functions:', e.message);
  }
}

// First ensure the query function exists
async function setupQueryFunction() {
  try {
    // Check if query function exists first
    const { data: checkData } = await supabase.rpc('query', {
      query: "SELECT 1 as test"
    });
    
    console.log('Query function already exists\n');
  } catch (error) {
    console.log('Creating query function...');
    
    // Create it using raw SQL through Supabase
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
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
    
    if (createError) {
      console.log('Note: Could not create query function. It may need to be created manually.');
      console.log('Continuing with direct checks...\n');
    }
  }
}

setupQueryFunction().then(checkFunctions).catch(console.error);