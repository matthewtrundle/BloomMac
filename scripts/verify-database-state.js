const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function verifyDatabaseState() {
  console.log('🔍 Verifying Database State...\n');

  // Create Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // First, let's test the connection
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection test failed:', error.message);
      console.log('\nTrying to get all tables...');
      
      // Try a different approach - get tables from information schema
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_all_tables');
      
      if (tablesError) {
        console.log('Could not get tables via RPC. Let me check what tables exist...\n');
        
        // List some critical tables we expect
        const expectedTables = [
          'user_profiles',
          'courses',
          'course_modules', 
          'course_lessons',
          'course_enrollments',
          'email_sequences',
          'sequence_emails',
          'subscribers',
          'contact_submissions'
        ];

        for (const table of expectedTables) {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          
          if (error) {
            console.log(`❌ ${table}: Not accessible (${error.message})`);
          } else {
            console.log(`✅ ${table}: Exists (${count} rows)`);
          }
        }
      }
    } else {
      console.log('✅ Database connection successful!\n');
      
      // Now check all the tables mentioned in CLAUDE.md
      const tablesToCheck = [
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
        // Tables that should NOT exist after HIPAA cleanup
        'appointments',
        'appointment_data',
        'clinical_notes',
        'provider_profiles',
        'user_workbook_responses',
        'user_week_submissions'
      ];

      console.log('📊 Checking tables from CLAUDE.md:\n');
      
      for (const table of tablesToCheck) {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          if (error.code === '42P01') {
            console.log(`❌ ${table}: Does not exist (Good if it's a HIPAA table)`);
          } else {
            console.log(`⚠️  ${table}: Error - ${error.message}`);
          }
        } else {
          console.log(`✅ ${table}: Exists with ${count} rows`);
        }
      }
    }

    // Check for any APIs that might be broken
    console.log('\n🔍 Checking critical API endpoints:\n');
    
    // Test course enrollments
    const { data: enrollments, error: enrollError } = await supabase
      .from('course_enrollments')
      .select('*')
      .limit(1);
    
    console.log(`Course enrollments API: ${enrollError ? '❌ Broken' : '✅ Working'}`);
    
    // Test user profiles
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    console.log(`User profiles API: ${profileError ? '❌ Broken' : '✅ Working'}`);
    
    // Test email sequences
    const { data: sequences, error: sequenceError } = await supabase
      .from('email_sequences')
      .select('*');
    
    console.log(`Email sequences API: ${sequenceError ? '❌ Broken' : '✅ Working'}`);
    
    if (sequences && !sequenceError) {
      console.log(`  Active sequences: ${sequences.filter(s => s.status === 'active').map(s => s.trigger).join(', ')}`);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

verifyDatabaseState();