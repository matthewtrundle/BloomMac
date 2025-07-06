#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Expected schema based on CLAUDE.md
const EXPECTED_SCHEMA = {
  subscribers: {
    columns: ['id', 'email', 'status', 'source', 'created_at', 'updated_at'],
    forbidden: ['subscribed'], // Columns that should NOT exist
  },
  email_templates: {
    columns: ['id', 'name', 'subject', 'content', 'category', 'variables'],
    forbidden: [],
  },
  admin_users: {
    columns: ['id', 'email', 'role', 'is_active'],
    forbidden: [],
  },
  user_profiles: {
    columns: ['id', 'first_name', 'last_name'],
    forbidden: ['email'], // Email should be in auth.users
  }
};

async function validateSchema() {
  console.log('=== SCHEMA VALIDATION ===\n');
  
  let hasErrors = false;

  for (const [tableName, expected] of Object.entries(EXPECTED_SCHEMA)) {
    console.log(`Validating table: ${tableName}`);
    
    // Get actual columns
    const { data: columns } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);
    
    if (!columns || columns.length === 0) {
      console.log(`  ❌ Table ${tableName} does not exist!`);
      hasErrors = true;
      continue;
    }

    const actualColumns = columns.map(c => c.column_name);
    
    // Check for required columns
    for (const col of expected.columns) {
      if (!actualColumns.includes(col)) {
        console.log(`  ❌ Missing required column: ${col}`);
        hasErrors = true;
      }
    }
    
    // Check for forbidden columns
    for (const col of expected.forbidden) {
      if (actualColumns.includes(col)) {
        console.log(`  ❌ FORBIDDEN column exists: ${col} (This causes bugs!)`);
        hasErrors = true;
      }
    }
    
    if (!hasErrors) {
      console.log('  ✅ Schema is correct');
    }
  }
  
  if (hasErrors) {
    console.log('\n⚠️  SCHEMA VALIDATION FAILED - Fix these issues before proceeding!');
    process.exit(1);
  } else {
    console.log('\n✅ All schema validations passed!');
  }
}

validateSchema().catch(console.error);