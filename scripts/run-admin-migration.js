const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration(migrationPath, description) {
  console.log(`\n📋 Running migration: ${description}`);
  
  try {
    // Read the SQL file
    const sql = await fs.readFile(migrationPath, 'utf8');
    
    // For now, we'll output the SQL for manual execution
    // In production, you might use a proper migration tool
    console.log('⚠️  Please run the following SQL in Supabase SQL Editor:');
    console.log('📂 File:', migrationPath);
    console.log('\n--- SQL Preview (first 500 chars) ---');
    console.log(sql.substring(0, 500) + '...\n');
    
    return true;
  } catch (error) {
    console.error(`❌ Error reading migration file: ${error.message}`);
    return false;
  }
}

async function checkExistingTables() {
  console.log('🔍 Checking existing tables...');
  
  const tablesToCheck = [
    'contact_submissions',
    'career_applications',
    'admin_users',
    'email_templates',
    'admin_settings'
  ];
  
  for (const table of tablesToCheck) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Table ${table} does not exist`);
      } else {
        console.log(`✅ Table ${table} exists (${count || 0} records)`);
      }
    } catch (error) {
      console.log(`❌ Table ${table} does not exist`);
    }
  }
}

async function createMigrationInstructions() {
  const instructions = `
# Admin Migration Instructions

## Step 1: Create Admin Tables

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy and paste the contents of: /supabase/migrations/20250101_create_admin_tables.sql
5. Run the query
6. Verify success message

## Step 2: Set Up Initial Admin User

1. In SQL Editor, create another new query
2. Copy and paste the contents of: /supabase/migrations/20250101_create_initial_admin.sql
3. Run the query
4. Follow the instructions in the output to create your admin user

## Step 3: Update Your Admin Email

Run this in SQL Editor (replace with your email):
\`\`\`sql
SELECT * FROM setup_initial_admin('your-admin@email.com');
\`\`\`

## Step 4: After Creating User in Auth

Once you've created the user through Supabase Auth, run:
\`\`\`sql
SELECT * FROM finalize_admin_setup('your-admin@email.com');
\`\`\`

## Step 5: Verify Setup

Run the verification script:
\`\`\`bash
node scripts/verify-admin-setup.js
\`\`\`

## Important Notes

- The old hardcoded admin authentication will be disabled after migration
- All admin actions will be logged to admin_activity_log
- Email templates are created for automatic responses
- RLS policies ensure only authenticated admins can access admin data
`;

  await fs.writeFile(
    path.join(__dirname, '..', 'ADMIN_MIGRATION_INSTRUCTIONS.md'),
    instructions
  );
  
  console.log('\n📄 Created ADMIN_MIGRATION_INSTRUCTIONS.md');
}

async function main() {
  console.log('🚀 Starting Admin Migration Process...');
  
  // Check current state
  await checkExistingTables();
  
  // Show migration files
  const migrations = [
    {
      path: path.join(__dirname, '..', 'supabase', 'migrations', '20250101_create_admin_tables.sql'),
      description: 'Create admin tables (contact_submissions, career_applications, etc.)'
    },
    {
      path: path.join(__dirname, '..', 'supabase', 'migrations', '20250101_create_initial_admin.sql'),
      description: 'Set up initial admin user and email templates'
    }
  ];
  
  console.log('\n📁 Migration files ready:');
  for (const migration of migrations) {
    await runMigration(migration.path, migration.description);
  }
  
  // Create instructions file
  await createMigrationInstructions();
  
  console.log('\n✅ Migration preparation complete!');
  console.log('📋 Please follow the instructions in ADMIN_MIGRATION_INSTRUCTIONS.md');
  console.log('\n⚠️  IMPORTANT: Do not proceed with code changes until database migrations are complete!');
}

main().catch(console.error);