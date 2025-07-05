const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(migrationFile) {
  try {
    console.log(`Running migration: ${migrationFile}`);
    
    const sql = fs.readFileSync(migrationFile, 'utf8');
    
    // Split SQL by semicolons but preserve those within functions
    const statements = [];
    let currentStatement = '';
    let inFunction = false;
    
    const lines = sql.split('\n');
    for (const line of lines) {
      if (line.trim().startsWith('CREATE OR REPLACE FUNCTION') || 
          line.trim().startsWith('CREATE FUNCTION')) {
        inFunction = true;
      }
      
      currentStatement += line + '\n';
      
      if (line.trim().endsWith('$$;') && inFunction) {
        inFunction = false;
        statements.push(currentStatement.trim());
        currentStatement = '';
      } else if (line.trim().endsWith(';') && !inFunction) {
        statements.push(currentStatement.trim());
        currentStatement = '';
      }
    }
    
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement || statement.startsWith('--')) continue;
      
      console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);
      
      const { data, error } = await supabase.rpc('query', {
        query: statement
      });
      
      if (error) {
        console.error(`Error in statement ${i + 1}:`, error);
        throw error;
      }
      
      console.log(`✓ Statement ${i + 1} executed successfully`);
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
  console.error('Usage: node run_migration.js <migration-file>');
  process.exit(1);
}

const fullPath = path.resolve(migrationFile);
if (!fs.existsSync(fullPath)) {
  console.error(`Migration file not found: ${fullPath}`);
  process.exit(1);
}

runMigration(fullPath);