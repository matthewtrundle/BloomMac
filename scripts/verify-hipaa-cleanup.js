const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyHIPAACleanup() {
  console.log('🔍 Verifying HIPAA Cleanup...\n');

  // Tables that should NOT exist after cleanup
  const hipaaRelatedTables = [
    'appointments',
    'appointment_data',
    'appointment_reminders',
    'appointment_no_shows',
    'payment_intents',
    'payment_methods',
    'clinical_notes',
    'provider_profiles',
    'provider_settings',
    'provider_availability',
    'user_workbook_responses',
    'user_week_submissions',
    'treatment_workbooks',
    'patient_workbook_assignments',
    'clinical_audit_logs',
    'patient_activity_logs'
  ];

  // Check which tables still exist
  try {
    const { data: tables } = await supabase.rpc('query', {
      query: `
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename
      `
    }).single();

    const existingTables = JSON.parse(tables).map(t => t.tablename);
    
    console.log('📊 Current tables in database:');
    existingTables.forEach(table => {
      console.log(`  - ${table}`);
    });
    console.log('');

    // Check for HIPAA-related tables that still exist
    const remainingHipaaTables = hipaaRelatedTables.filter(table => 
      existingTables.includes(table)
    );

    if (remainingHipaaTables.length > 0) {
      console.log('⚠️  WARNING: The following HIPAA-related tables still exist:');
      remainingHipaaTables.forEach(table => {
        console.log(`  ❌ ${table}`);
      });
      console.log('\nPlease run the cleanup script to remove these tables.');
    } else {
      console.log('✅ All HIPAA-related tables have been removed successfully!');
    }

    // Check for columns that might contain PHI in remaining tables
    console.log('\n🔍 Checking for potential PHI in remaining tables...\n');
    
    const phiColumns = [
      'appointment_date',
      'clinical_note',
      'diagnosis',
      'treatment_plan',
      'patient_name',
      'provider_notes'
    ];

    for (const table of existingTables) {
      const { data: columns } = await supabase.rpc('query', {
        query: `
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = '${table}' 
          AND table_schema = 'public'
        `
      }).single();

      const tableColumns = JSON.parse(columns).map(c => c.column_name);
      const suspiciousColumns = tableColumns.filter(col => 
        phiColumns.some(phi => col.toLowerCase().includes(phi.toLowerCase()))
      );

      if (suspiciousColumns.length > 0) {
        console.log(`⚠️  Table "${table}" has columns that might contain PHI:`);
        suspiciousColumns.forEach(col => {
          console.log(`    - ${col}`);
        });
      }
    }

    // Summary
    console.log('\n📋 Cleanup Summary:');
    console.log(`  - Total tables: ${existingTables.length}`);
    console.log(`  - HIPAA tables remaining: ${remainingHipaaTables.length}`);
    console.log(`  - Safe tables: ${existingTables.filter(t => !remainingHipaaTables.includes(t)).length}`);

    // Recommended safe tables for a wellness education platform
    const safeTables = [
      'user_profiles',
      'courses',
      'course_modules',
      'course_lessons',
      'course_enrollments',
      'user_lesson_progress',
      'user_achievements',
      'email_templates',
      'email_sequences',
      'sequence_emails',
      'sequence_enrollments',
      'subscribers',
      'newsletter_subscribers',
      'contact_submissions',
      'analytics_events',
      'resources',
      'blog_posts'
    ];

    console.log('\n✅ Recommended tables for wellness education platform:');
    safeTables.forEach(table => {
      if (existingTables.includes(table)) {
        console.log(`  ✓ ${table}`);
      }
    });

  } catch (error) {
    console.error('Error checking database:', error);
    console.log('\n💡 Make sure to create the query function first:');
    console.log(`
CREATE OR REPLACE FUNCTION query(query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  EXECUTE 'SELECT json_agg(row_to_json(t)) FROM (' || query || ') t' INTO result;
  RETURN result;
END;
$$;
    `);
  }
}

// First create the query function if it doesn't exist
async function setupQueryFunction() {
  try {
    await supabase.rpc('query', {
      query: `
        CREATE OR REPLACE FUNCTION query(query text)
        RETURNS json
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result json;
        BEGIN
          EXECUTE 'SELECT json_agg(row_to_json(t)) FROM (' || query || ') t' INTO result;
          RETURN result;
        END;
        $$;
      `
    });
  } catch (error) {
    // Function might already exist, that's okay
  }
}

setupQueryFunction().then(verifyHIPAACleanup);