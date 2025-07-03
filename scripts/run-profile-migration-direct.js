const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  console.log('🔧 Running profile fields migration...\n');

  // Create Supabase client with service role key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing environment variables!');
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const migrationSQL = `
    -- Fix user_profiles table to ensure all fields needed by profile edit page exist
    -- This migration adds any missing fields without affecting existing data

    -- Add baby_due_date field if it doesn't exist
    ALTER TABLE user_profiles 
    ADD COLUMN IF NOT EXISTS baby_due_date DATE;

    -- Add timezone field if it doesn't exist
    ALTER TABLE user_profiles 
    ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'America/Chicago';

    -- Add avatar field if it doesn't exist (from another migration)
    ALTER TABLE user_profiles 
    ADD COLUMN IF NOT EXISTS avatar_url TEXT;

    -- Ensure all fields allow NULL values except the required ones (first_name, last_name)
    -- This prevents "not-null constraint" errors when saving partial data
    ALTER TABLE user_profiles 
    ALTER COLUMN phone DROP NOT NULL,
    ALTER COLUMN postpartum_date DROP NOT NULL,
    ALTER COLUMN baby_due_date DROP NOT NULL,
    ALTER COLUMN number_of_children DROP NOT NULL,
    ALTER COLUMN emergency_contact_name DROP NOT NULL,
    ALTER COLUMN emergency_contact_phone DROP NOT NULL,
    ALTER COLUMN emergency_contact_relationship DROP NOT NULL,
    ALTER COLUMN timezone DROP NOT NULL;

    -- Set default values for numeric fields to prevent null issues
    ALTER TABLE user_profiles 
    ALTER COLUMN number_of_children SET DEFAULT 0;

    -- Add indexes for commonly queried fields
    CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone) WHERE phone IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_user_profiles_postpartum_date ON user_profiles(postpartum_date) WHERE postpartum_date IS NOT NULL;
  `;

  try {
    console.log('Executing migration...\n');
    
    // Execute the migration using RPC call
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      // If RPC doesn't exist, provide manual instructions
      if (error.message.includes('exec_sql')) {
        console.log('⚠️  The exec_sql function is not available.');
        console.log('\n📋 Please run this SQL directly in your Supabase dashboard:\n');
        console.log('1. Go to https://app.supabase.com/project/YOUR_PROJECT/sql/new');
        console.log('2. Copy and paste the following SQL:\n');
        console.log('=' * 80);
        console.log(migrationSQL);
        console.log('=' * 80);
        console.log('\n3. Click "Run" to execute the migration\n');
      } else {
        console.error('❌ Migration failed:', error.message);
      }
    } else {
      console.log('✅ Migration completed successfully!');
    }

    // Check current table structure
    console.log('\n📊 Checking current user_profiles structure...\n');
    
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'user_profiles' })
      .catch(() => ({ data: null, error: 'Function not available' }));

    if (columns) {
      console.log('Current columns in user_profiles:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}${col.is_nullable === 'NO' ? ', NOT NULL' : ''})`);
      });
    } else {
      // Alternative: Try to fetch a dummy record to see structure
      const { data: sample } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);
      
      if (sample && sample.length > 0) {
        console.log('Available fields in user_profiles:');
        Object.keys(sample[0]).forEach(key => {
          console.log(`  - ${key}`);
        });
      }
    }

    console.log('\n✅ Profile fields should now be properly configured!');
    console.log('\nTo test:');
    console.log('1. Go to https://www.bloompsychologynorthaustin.com/dashboard');
    console.log('2. Click on Edit Profile');
    console.log('3. Try saving your profile\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.log('\n📋 Please run the SQL manually in your Supabase dashboard (see above)');
  }
}

// Run the migration
runMigration();