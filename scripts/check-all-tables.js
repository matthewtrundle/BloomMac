const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// List of all possible tables
const knownTables = [
  'user_profiles', 'subscribers', 'email_templates', 'email_sequences',
  'sequence_emails', 'sequence_enrollments', 'contact_submissions',
  'courses', 'course_modules', 'course_lessons', 'email_automation_logs',
  'analytics_events', 'admin_activity_log', 'careers_postings', 'user_preferences',
  'course_enrollments', 'lesson_progress', 'email_queue', 'admin_sessions',
  'blog_posts', 'blog_images', 'careers_applications'
];

async function checkTables() {
  console.log('Checking known tables:');
  
  const results = await Promise.all(knownTables.map(async (table) => {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    return { table, exists: !error, count };
  }));
  
  console.log('\nExisting tables:');
  results.forEach(r => {
    if (r.exists) console.log(`  ✓ ${r.table}: ${r.count} rows`);
  });
  
  console.log('\nMissing tables:');
  results.forEach(r => {
    if (!r.exists) console.log(`  ✗ ${r.table}`);
  });
}

checkTables().catch(console.error);