import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function auditDatabase() {
  console.log('🔍 Auditing Supabase Database Schema...\n');

  try {
    // Query information schema to get all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .not('table_name', 'like', 'pg_%')
      .order('table_name');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      
      // Try alternative approach - list known tables
      console.log('Trying alternative approach with known tables...\n');
      await checkKnownTables();
      return;
    }

    if (!tables || tables.length === 0) {
      console.log('No tables found in public schema');
      await checkKnownTables();
      return;
    }

    console.log(`Found ${tables.length} tables:\n`);

    // For each table, get column information
    for (const table of tables) {
      console.log(`📊 Table: ${table.table_name}`);
      console.log('─'.repeat(50));

      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', table.table_name)
        .order('ordinal_position');

      if (columnsError) {
        console.error(`Error fetching columns for ${table.table_name}:`, columnsError);
        continue;
      }

      if (columns && columns.length > 0) {
        columns.forEach(col => {
          const nullable = col.is_nullable === 'YES' ? '?' : '';
          const defaultVal = col.column_default ? ` (default: ${col.column_default})` : '';
          console.log(`  - ${col.column_name}${nullable}: ${col.data_type}${defaultVal}`);
        });
      }
      console.log('');
    }
  } catch (error) {
    console.error('Error during audit:', error);
    await checkKnownTables();
  }
}

async function checkKnownTables() {
  console.log('\n🔍 Checking Known Tables...\n');

  const knownTables = [
    'profiles',
    'course_enrollments',
    'user_progress',
    'workbook_responses',
    'workbook_questions',
    'appointments',
    'user_achievements',
    'course_activity_logs',
    'newsletter_signups'
  ];

  for (const tableName of knownTables) {
    console.log(`\n📊 Checking table: ${tableName}`);
    console.log('─'.repeat(50));

    try {
      // Try to query the table
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.code === '42P01') {
          console.log(`  ❌ Table does not exist`);
        } else {
          console.log(`  ⚠️  Table exists but has access issues: ${error.message}`);
        }
      } else {
        console.log(`  ✅ Table exists (${count || 0} rows)`);
        
        // Try to get a sample row to see structure
        const { data: sample } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
          
        if (sample && sample.length > 0) {
          console.log('  Sample columns:', Object.keys(sample[0]).join(', '));
        }
      }
    } catch (err) {
      console.log(`  ❌ Error checking table: ${err}`);
    }
  }
}

// Run the audit
auditDatabase().then(() => {
  console.log('\n✅ Database audit complete!');
  process.exit(0);
}).catch(err => {
  console.error('\n❌ Audit failed:', err);
  process.exit(1);
});