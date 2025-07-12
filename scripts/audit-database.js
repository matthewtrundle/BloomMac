const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function auditDatabase() {
  console.log('=== DATABASE AUDIT ===\n');

  try {
    // First, let's get all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      // Alternative approach using raw SQL
      const { data, error } = await supabase.rpc('get_all_tables');
      
      if (error) {
        console.log('Creating helper function...');
        // Create the helper function
        await supabase.rpc('query', {
          query: `
            CREATE OR REPLACE FUNCTION get_all_tables()
            RETURNS TABLE(table_name text)
            LANGUAGE sql
            SECURITY DEFINER
            AS $$
              SELECT tablename::text as table_name
              FROM pg_tables
              WHERE schemaname = 'public'
              ORDER BY tablename;
            $$;
          `
        }).catch(() => {});

        // Try direct query
        const { data: directTables } = await supabase
          .from('analytics_events')
          .select('*')
          .limit(0);

        // Get tables from supabase schema query
        console.log('Fetching tables using alternative method...\n');
        
        // List known tables from CLAUDE.md
        const knownTables = [
          'email_templates',
          'email_templates_custom',
          'email_sequences',
          'sequence_emails',
          'sequence_enrollments',
          'subscribers',
          'user_profiles',
          'contact_submissions',
          'courses',
          'course_modules',
          'course_lessons',
          'email_automation_logs',
          'analytics_events',
          'user_preferences',
          'course_enrollments',
          'lesson_progress',
          'achievements',
          'user_achievements'
        ];

        console.log('Checking known tables:\n');
        
        for (const table of knownTables) {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          
          if (!error) {
            console.log(`✅ ${table}: ${count} rows`);
            
            // Get column information
            const { data: sample } = await supabase
              .from(table)
              .select('*')
              .limit(1);
            
            if (sample && sample.length > 0) {
              console.log(`   Columns: ${Object.keys(sample[0]).join(', ')}`);
            }
          } else {
            console.log(`❌ ${table}: Does not exist or error accessing`);
          }
          console.log('');
        }
      }
    } else {
      console.log('Tables found:', tables);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

auditDatabase();