#!/usr/bin/env node

/**
 * Direct Supabase Query Tool
 * Usage: node scripts/supabase-query.js "SELECT * FROM subscribers LIMIT 5"
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
    // For SELECT queries
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      const tableName = extractTableName(query);
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' });

      if (error) {
        console.error('Query error:', error);
        return;
      }

      console.log(`Results (${count} total):`);
      console.table(data);
      
      // Also show as JSON for complex data
      if (data.length > 0) {
        console.log('\nFirst row as JSON:');
        console.log(JSON.stringify(data[0], null, 2));
      }
    } else {
      console.log('Only SELECT queries are supported in safe mode');
    }
  } catch (error) {
    console.error('Execution error:', error);
  }
}

function extractTableName(query) {
  const match = query.match(/FROM\s+(\w+)/i);
  return match ? match[1] : null;
}

// Get query from command line
const query = process.argv[2];

if (!query) {
  console.log('Usage: node scripts/supabase-query.js "YOUR SQL QUERY"');
  console.log('Example: node scripts/supabase-query.js "SELECT * FROM subscribers LIMIT 5"');
  process.exit(1);
}

executeQuery(query);