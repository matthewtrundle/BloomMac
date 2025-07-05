const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testConnections() {
  console.log('Testing database connections...\n');
  
  // Test 1: Supabase client connection
  console.log('1. Testing Supabase client connection:');
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    const { count } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true });
    
    console.log('✅ Supabase client connected successfully');
    console.log(`   Found ${count} admin users\n`);
  } catch (error) {
    console.log('❌ Supabase client connection failed:', error.message, '\n');
  }
  
  // Test 2: Direct PostgreSQL connection
  console.log('2. Testing direct PostgreSQL connection:');
  const connectionString = `postgresql://postgres.utetcmirepwdxbtrcczv:F13aUlrMdMFDpSkg@aws-0-us-east-2.pooler.supabase.com:5432/postgres`;
  
  try {
    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
    
    const result = await pool.query('SELECT current_database()');
    console.log('✅ Direct PostgreSQL connected successfully');
    console.log(`   Connected to database: ${result.rows[0].current_database}\n`);
    
    await pool.end();
  } catch (error) {
    console.log('❌ Direct PostgreSQL connection failed:', error.message);
    console.log('   This might be why supabase db pull is failing\n');
  }
  
  // Test 3: Check if we can list tables
  console.log('3. Listing tables via Supabase:');
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Get table list
    const { data, error } = await supabase
      .from('_supabase_migrations')
      .select('version')
      .limit(5)
      .order('version', { ascending: false });
    
    if (error) throw error;
    
    console.log('✅ Can query tables successfully');
    console.log('   Recent migrations:', data?.map(m => m.version).join(', ') || 'none');
  } catch (error) {
    console.log('❌ Failed to query tables:', error.message);
  }
}

testConnections();