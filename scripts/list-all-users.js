const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listAllUsers() {
  console.log('\n=== ALL USER PROFILES ===\n');

  try {
    // Get all user profiles
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }

    console.log(`Found ${profiles?.length || 0} user profiles:\n`);

    profiles?.forEach((profile, index) => {
      console.log(`${index + 1}. User Profile:`);
      console.log(`   ID: ${profile.id}`);
      console.log(`   Name: ${profile.first_name} ${profile.last_name}`);
      console.log(`   Role: ${profile.role || 'None'}`);
      console.log(`   Phone: ${profile.phone || 'None'}`);
      console.log(`   Created: ${profile.created_at}`);
      console.log('');
    });

    // Check for users with course progress
    const { data: progressUsers } = await supabase
      .from('course_progress')
      .select('user_id')
      .limit(10);

    console.log('\n=== USERS WITH COURSE PROGRESS ===');
    console.log('User IDs:', progressUsers?.map(p => p.user_id).filter((v, i, a) => a.indexOf(v) === i));

    // Check for users with achievements
    const { data: achievementUsers } = await supabase
      .from('user_achievements')
      .select('user_id, name')
      .limit(10);

    console.log('\n=== USERS WITH ACHIEVEMENTS ===');
    achievementUsers?.forEach(a => {
      console.log(`User ${a.user_id}: ${a.name}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

listAllUsers();