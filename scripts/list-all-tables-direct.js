const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listAllTables() {
  console.log('Listing all tables in the database...\n');
  
  try {
    // List common tables we expect
    const commonTables = [
      'subscribers', 'email_templates', 'email_sequences', 'sequence_emails',
      'sequence_enrollments', 'user_profiles', 'contact_submissions',
      'courses', 'course_modules', 'course_lessons', 'email_automation_logs',
      'analytics_events', 'blog_posts', 'blog_images'
    ];
    
    console.log('Checking each table individually:\n');
    
    const existingTables = [];
    
    for (const table of commonTables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`✓ ${table}: ${count} rows`);
        existingTables.push(table);
      } else {
        console.log(`✗ ${table}: Does not exist`);
      }
    }
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total tables found: ${existingTables.length}`);
    console.log('Existing tables:', existingTables.join(', '));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

listAllTables();