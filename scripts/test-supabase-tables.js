const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// ANSI color codes for better output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Helper function to log with colors
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSupabaseTables() {
  log('\n🔍 Checking Supabase Tables...\n', 'blue');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    log('❌ Missing required environment variables for admin access', 'red');
    return;
  }

  // Create admin client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // List common tables we might expect
  const tablesToCheck = [
    'user_profiles',
    'users',
    'profiles',
    'auth.users',
    'public.user_profiles'
  ];

  log('📊 Checking for common tables:', 'blue');
  for (const tableName of tablesToCheck) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.code === '42P01') {
          log(`   ❌ ${tableName} - does not exist`, 'red');
        } else {
          log(`   ⚠️  ${tableName} - error: ${error.message}`, 'yellow');
        }
      } else {
        log(`   ✅ ${tableName} - exists (${count || 0} rows)`, 'green');
      }
    } catch (err) {
      log(`   ❌ ${tableName} - unexpected error: ${err.message}`, 'red');
    }
  }

  // Try to get schema information
  log('\n🗂️  Attempting to retrieve schema information...', 'blue');
  try {
    // Query the information schema to list all tables
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_schema, table_name')
      .eq('table_schema', 'public');

    if (error) {
      log('⚠️  Cannot access information schema (may need additional permissions)', 'yellow');
    } else if (data && data.length > 0) {
      log('✅ Tables in public schema:', 'green');
      data.forEach(table => {
        log(`   - ${table.table_name}`, 'green');
      });
    } else {
      log('ℹ️  No tables found in public schema', 'yellow');
    }
  } catch (err) {
    log(`⚠️  Schema query error: ${err.message}`, 'yellow');
  }

  // Check auth schema
  log('\n🔐 Checking auth schema...', 'blue');
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      log(`⚠️  Cannot list users: ${error.message}`, 'yellow');
    } else {
      log(`✅ Auth system accessible - ${data.users.length} users found`, 'green');
    }
  } catch (err) {
    log(`⚠️  Auth check error: ${err.message}`, 'yellow');
  }
}

// Run the test
testSupabaseTables().catch(err => {
  log(`\n❌ Fatal error: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});