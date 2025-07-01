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

async function testSupabaseConnection() {
  log('\n🔍 Testing Supabase Connection...\n', 'blue');

  // Check if environment variables are loaded
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    log('❌ Missing required environment variables:', 'red');
    if (!supabaseUrl) log('   - NEXT_PUBLIC_SUPABASE_URL is not set', 'red');
    if (!supabaseAnonKey) log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY is not set', 'red');
    return;
  }

  log('✅ Environment variables loaded:', 'green');
  log(`   - SUPABASE_URL: ${supabaseUrl}`, 'green');
  log(`   - ANON_KEY: ${supabaseAnonKey.substring(0, 20)}...`, 'green');
  if (supabaseServiceKey) {
    log(`   - SERVICE_ROLE_KEY: ${supabaseServiceKey.substring(0, 20)}...`, 'green');
  }

  // Create Supabase client with anon key
  log('\n📡 Creating Supabase client...', 'blue');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  log('✅ Supabase client created successfully', 'green');

  // Test 1: Check if we can connect to the database
  log('\n🔗 Testing database connection...', 'blue');
  try {
    // Try to query a simple table or check tables exist
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count', { count: 'exact', head: true });

    if (error) {
      // If table doesn't exist, try another approach
      if (error.code === '42P01') {
        log('⚠️  user_profiles table does not exist', 'yellow');
        
        // Try to list tables using service role key if available
        if (supabaseServiceKey) {
          const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);
          const { data: tablesData, error: tablesError } = await adminSupabase
            .rpc('get_tables', {}, { get: true })
            .single();
          
          if (!tablesError && tablesData) {
            log('📊 Available tables:', 'blue');
            console.log(tablesData);
          }
        }
      } else {
        log(`❌ Database connection error: ${error.message}`, 'red');
        log(`   Error code: ${error.code}`, 'red');
      }
    } else {
      log('✅ Database connection successful!', 'green');
      if (data !== null) {
        log(`   - user_profiles table exists with ${data} records`, 'green');
      }
    }
  } catch (err) {
    log(`❌ Unexpected error: ${err.message}`, 'red');
  }

  // Test 2: Check authentication status
  log('\n🔐 Testing authentication...', 'blue');
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      log(`❌ Auth error: ${error.message}`, 'red');
    } else if (session) {
      log('✅ Active session found:', 'green');
      log(`   - User ID: ${session.user.id}`, 'green');
      log(`   - Email: ${session.user.email}`, 'green');
    } else {
      log('ℹ️  No active session (this is normal if not logged in)', 'yellow');
    }
  } catch (err) {
    log(`❌ Auth test error: ${err.message}`, 'red');
  }

  // Test 3: Test if we can make a simple RPC call or query
  log('\n🧪 Testing basic query capability...', 'blue');
  try {
    // Try a simple select that should work even on empty database
    const { data, error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        log('ℹ️  Test table does not exist (this is normal)', 'yellow');
      } else {
        log(`⚠️  Query test returned: ${error.message}`, 'yellow');
      }
    } else {
      log('✅ Query capability working!', 'green');
    }
  } catch (err) {
    log(`⚠️  Query test error: ${err.message}`, 'yellow');
  }

  // Test 4: Check Supabase project health
  log('\n🏥 Checking Supabase project health...', 'blue');
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });

    if (response.ok) {
      log('✅ Supabase REST API is accessible', 'green');
      log(`   - Status: ${response.status} ${response.statusText}`, 'green');
    } else {
      log(`⚠️  REST API returned status: ${response.status}`, 'yellow');
    }
  } catch (err) {
    log(`❌ Health check error: ${err.message}`, 'red');
  }

  // Summary
  log('\n📋 Connection Test Summary:', 'blue');
  log('================================', 'blue');
  log('- Environment variables: ✅ Loaded', 'green');
  log('- Supabase client: ✅ Created', 'green');
  log('- Database connection: Check logs above', 'yellow');
  log('- Authentication: Check logs above', 'yellow');
  log('- REST API: Check logs above', 'yellow');
  log('================================\n', 'blue');
}

// Run the test
testSupabaseConnection().catch(err => {
  log(`\n❌ Fatal error: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});