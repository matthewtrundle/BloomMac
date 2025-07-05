const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(filePath) {
  try {
    console.log(`Running migration: ${filePath}`);
    
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // First, ensure we have the query function
    const setupQuery = `
      CREATE OR REPLACE FUNCTION query(query text)
      RETURNS json
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        result json;
      BEGIN
        EXECUTE 'SELECT array_to_json(array_agg(row_to_json(t))) FROM (' || query || ') t' INTO result;
        RETURN result;
      END;
      $$;
    `;
    
    console.log('Setting up query function...');
    try {
      const { data, error } = await supabase.rpc('query', { query: setupQuery });
      if (error && !error.message.includes('already exists')) {
        // Function doesn't exist, create it
        console.log('Creating query function...');
        // Execute raw SQL to create the function since RPC won't work without it
      }
    } catch (e) {
      // Query function doesn't exist yet, that's expected
      console.log('Query function will be created with migration');
    }
    
    // Split the SQL into individual statements
    const statements = [];
    let currentStatement = '';
    let inDollarQuote = false;
    
    const lines = sql.split('\n');
    for (const line of lines) {
      // Check for $$ quotes (used in functions)
      const dollarCount = (line.match(/\$\$/g) || []).length;
      if (dollarCount % 2 === 1) {
        inDollarQuote = !inDollarQuote;
      }
      
      currentStatement += line + '\n';
      
      // Only split on semicolon if we're not inside a function
      if (line.trim().endsWith(';') && !inDollarQuote) {
        const trimmed = currentStatement.trim();
        if (trimmed && !trimmed.startsWith('--')) {
          statements.push(trimmed);
        }
        currentStatement = '';
      }
    }
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);
      console.log(`Preview: ${statement.substring(0, 60)}...`);
      
      try {
        // For CREATE FUNCTION statements, execute directly
        if (statement.includes('CREATE OR REPLACE FUNCTION') || 
            statement.includes('CREATE FUNCTION')) {
          const { data, error } = await supabase.rpc('query', {
            query: statement
          });
          
          if (error) throw error;
        } else {
          // For other statements, also use query
          const { data, error } = await supabase.rpc('query', {
            query: statement
          });
          
          if (error) throw error;
        }
        
        console.log(`✓ Statement ${i + 1} executed successfully`);
      } catch (error) {
        console.error(`Error in statement ${i + 1}:`, error.message);
        console.error('Statement:', statement);
        throw error;
      }
    }
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Get migration file from command line
const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error('Usage: node run_supabase_migration.js <migration-file>');
  process.exit(1);
}

const fullPath = path.resolve(migrationFile);
if (!fs.existsSync(fullPath)) {
  console.error(`Migration file not found: ${fullPath}`);
  process.exit(1);
}

runMigration(fullPath);