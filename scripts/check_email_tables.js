const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkEmailTables() {
  // First check what email-related tables exist
  const { data: tables, error: tablesError } = await supabase.rpc('query', {
    query: `
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename LIKE 'email_%'
      ORDER BY tablename
    `
  }).single();
  
  if (tablesError) {
    console.error('Error querying tables:', tablesError);
    // Try creating the query function
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
    
    // Retry
    const retryResult = await supabase.rpc('query', {
      query: `
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename LIKE 'email_%'
        ORDER BY tablename
      `
    }).single();
    
    if (retryResult.error) {
      console.error('Still failed:', retryResult.error);
      return;
    }
    
    console.log('Email tables:', JSON.parse(retryResult.data));
  } else {
    console.log('Email tables:', JSON.parse(tables));
  }
  
  // Check specific table structures
  const tablesToCheck = [
    'email_templates',
    'email_templates_custom', 
    'email_analytics',
    'email_campaign_metrics',
    'email_queue'
  ];
  
  for (const tableName of tablesToCheck) {
    console.log(`\n\nChecking structure of ${tableName}:`);
    
    const { data: columns, error: colError } = await supabase.rpc('query', {
      query: `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = '${tableName}'
        ORDER BY ordinal_position
      `
    }).single();
    
    if (colError) {
      console.error(`Error checking ${tableName}:`, colError);
    } else if (columns) {
      console.log(JSON.parse(columns));
    } else {
      console.log(`Table ${tableName} does not exist`);
    }
  }
}

checkEmailTables().catch(console.error);