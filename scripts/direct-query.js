#!/usr/bin/env node

/**
 * Direct Supabase SQL Query Tool
 * Usage: node scripts/direct-query.js "SELECT * FROM subscribers LIMIT 5"
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function executeQuery(query) {
  console.log('Executing query:', query);
  console.log('---');

  try {
    // Execute raw SQL query using RPC
    const { data, error } = await supabase.rpc('query', { query_text: query });

    if (error) {
      // If the query function doesn't exist, try to execute directly
      console.error('RPC error:', error);
      
      // Try alternative approach for simple queries
      if (query.trim().toUpperCase().startsWith('SELECT')) {
        console.log('Attempting alternative query method...');
        
        // For information_schema queries
        if (query.includes('information_schema') || query.includes('pg_catalog')) {
          const { data: result, error: directError } = await supabase
            .from('_prisma_migrations') // Use any table just to get a connection
            .select()
            .limit(0);
            
          if (!directError) {
            console.log('Database connection successful, but direct SQL queries require RPC function.');
            console.log('Please create the query function in your database first.');
          }
        }
      }
      return;
    }

    console.log('Results:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Execution error:', error);
  }
}

// Get query from command line
const query = process.argv[2];

if (!query) {
  console.log('Usage: node scripts/direct-query.js "YOUR SQL QUERY"');
  console.log('Example: node scripts/direct-query.js "SELECT * FROM courses LIMIT 5"');
  process.exit(1);
}

executeQuery(query);