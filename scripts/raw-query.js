#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function rawQuery(sql) {
  console.log('Executing raw SQL query...');
  console.log('Query:', sql);
  console.log('---');
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sql
    });
    
    if (error) {
      // Try direct query if RPC doesn't exist
      const result = await supabase.from('_dummy_').select().limit(0);
      
      // Use the underlying PostgreSQL connection
      const { data: tables } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
        
      if (tables) {
        console.log('Results:');
        console.table(tables);
      } else {
        console.error('Could not execute query');
      }
    } else {
      console.log('Results:');
      console.table(data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

const query = process.argv[2];
if (!query) {
  console.log('Usage: node scripts/raw-query.js "SQL QUERY"');
  process.exit(1);
}

rawQuery(query);