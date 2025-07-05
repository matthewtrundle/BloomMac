const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Parse DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in environment');
  process.exit(1);
}

// Check if we need SSL (Supabase requires it)
const isSupabase = DATABASE_URL.includes('supabase');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: isSupabase ? { rejectUnauthorized: false } : false
});

async function runSQLFile(filePath) {
  const client = await pool.connect();
  
  try {
    console.log(`Running SQL file: ${filePath}`);
    
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Execute the entire SQL file as a single transaction
    await client.query('BEGIN');
    
    try {
      await client.query(sql);
      await client.query('COMMIT');
      console.log('✅ SQL file executed successfully!');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error running SQL file:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Get SQL file from command line
const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error('Usage: node run_sql_file.js <sql-file>');
  process.exit(1);
}

const fullPath = path.resolve(sqlFile);
if (!fs.existsSync(fullPath)) {
  console.error(`SQL file not found: ${fullPath}`);
  process.exit(1);
}

runSQLFile(fullPath);