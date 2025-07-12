const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testDirectConnection() {
  const DATABASE_URL = process.env.DATABASE_URL;
  console.log('Attempting direct PostgreSQL connection...');
  console.log('URL:', DATABASE_URL.replace(/:[^:@]+@/, ':****@')); // Hide password
  
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('✅ Connected successfully!');
    
    // Test a simple query
    const result = await client.query('SELECT current_database(), current_user, version()');
    console.log('Database:', result.rows[0]);
    
    // Check our tables
    const tables = await client.query(`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('email_logs', 'career_applications')
      LIMIT 5
    `);
    console.log('\nTable RLS status:', tables.rows);
    
    await client.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    if (err.code === 'ENOTFOUND') {
      console.log('\nDNS resolution failed. Trying alternative approaches...');
    }
  }
}

testDirectConnection();