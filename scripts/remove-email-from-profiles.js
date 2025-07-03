import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function removeEmailColumn() {
  console.log('🔍 Checking user_profiles table structure...\n');

  try {
    // First, check if email column exists
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'user_profiles' });

    if (columnsError) {
      // Fallback query if the RPC doesn't exist
      console.log('Using direct query to check columns...');
      const { data, error } = await supabase.rpc('sql', {
        query: `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_name = 'user_profiles' 
          ORDER BY ordinal_position
        `
      });

      if (error) {
        console.error('❌ Error checking columns:', error);
        console.log('\n📋 Please run this SQL in your Supabase dashboard:\n');
        console.log(`-- Check if email column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'email';

-- If email column exists, remove it:
ALTER TABLE user_profiles DROP COLUMN IF EXISTS email;

-- Verify it's gone:
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;`);
        return;
      }
      columns = data;
    }

    // Check if email column exists
    const hasEmailColumn = columns?.some(col => col.column_name === 'email');

    if (hasEmailColumn) {
      console.log('⚠️  Found email column in user_profiles table!');
      console.log('This is incorrect - email should only be in auth.users\n');

      // Check if any profiles have email data
      const { data: profilesWithEmail, error: checkError } = await supabase
        .from('user_profiles')
        .select('id, email')
        .not('email', 'is', null)
        .limit(5);

      if (!checkError && profilesWithEmail && profilesWithEmail.length > 0) {
        console.log('📧 Found profiles with email data:');
        profilesWithEmail.forEach(profile => {
          console.log(`  - Profile ${profile.id}: ${profile.email}`);
        });
        console.log('\nNote: These emails are already stored in auth.users\n');
      }

      console.log('🔧 To fix this issue, run this SQL in your Supabase dashboard:\n');
      console.log('ALTER TABLE user_profiles DROP COLUMN IF EXISTS email;');
      console.log('\n✅ This will remove the duplicate email column from user_profiles');
      console.log('Emails will continue to be stored correctly in auth.users\n');
    } else {
      console.log('✅ Good news! No email column found in user_profiles table.');
      console.log('The schema is correct - emails are only stored in auth.users\n');
      
      // Show current columns
      console.log('Current user_profiles columns:');
      columns?.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\n📋 Please manually check your schema in Supabase dashboard');
  }
}

// Run the check
console.log('🌸 Bloom Psychology - User Profiles Schema Check\n');
removeEmailColumn();