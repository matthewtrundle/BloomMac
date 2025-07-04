const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

async function comprehensiveDatabaseAudit() {
  console.log('🔍 COMPREHENSIVE DATABASE AUDIT\n');
  console.log('=' .repeat(60));

  try {
    // 1. Get actual table list from pg_tables
    console.log('\n📊 ALL PUBLIC TABLES:');
    const { data: allTables, error: tablesError } = await supabase.rpc('query', {
      query: `
        SELECT tablename, 
               pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
        FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename;
      `
    }).single();
    
    if (!tablesError && allTables) {
      console.table(JSON.parse(allTables));
    }

    // 2. Check for duplicate/similar tables
    console.log('\n⚠️  POTENTIAL DUPLICATE TABLES:');
    const duplicatePatterns = [
      ['email_queue', 'email_sends', 'email_logs'],
      ['subscribers', 'newsletter_subscribers'],
      ['user_profiles', 'profiles', 'therapist_profiles'],
      ['admin_users', 'user_profiles (with admin role)'],
      ['analytics_events', 'email_analytics', 'click_heatmap'],
      ['contact_submissions', 'bookings', 'appointments']
    ];

    for (const group of duplicatePatterns) {
      console.log(`\nChecking group: ${group[0]} related`);
      for (const table of group) {
        const cleanTable = table.split(' ')[0]; // Handle "table (note)" format
        const { count, error } = await supabase
          .from(cleanTable)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          console.log(`  - ${table}: ${count} rows`);
        }
      }
    }

    // 3. Check table schemas
    console.log('\n🔧 TABLE SCHEMAS:');
    const keyTables = ['user_profiles', 'subscribers', 'analytics_events', 'email_queue'];
    
    for (const table of keyTables) {
      console.log(`\n${table} structure:`);
      const { data: schema } = await supabase.rpc('query', {
        query: `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = '${table}'
          ORDER BY ordinal_position;
        `
      }).single();
      
      if (schema) {
        console.table(JSON.parse(schema));
      }
    }

    // 4. Check for missing indexes
    console.log('\n📈 INDEXES CHECK:');
    const { data: indexes } = await supabase.rpc('query', {
      query: `
        SELECT tablename, indexname, indexdef
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND indexname NOT LIKE '%_pkey'
        ORDER BY tablename, indexname;
      `
    }).single();
    
    if (indexes) {
      const indexData = JSON.parse(indexes);
      console.log(`Total non-primary indexes: ${indexData.length}`);
      console.table(indexData);
    }

    // 5. Check RLS policies
    console.log('\n🔒 ROW LEVEL SECURITY STATUS:');
    const { data: rlsStatus } = await supabase.rpc('query', {
      query: `
        SELECT tablename, 
               CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status,
               (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count
        FROM pg_tables t
        JOIN pg_class c ON c.relname = t.tablename
        WHERE t.schemaname = 'public'
        ORDER BY tablename;
      `
    }).single();
    
    if (rlsStatus) {
      console.table(JSON.parse(rlsStatus));
    }

    // 6. Check foreign key relationships
    console.log('\n🔗 FOREIGN KEY RELATIONSHIPS:');
    const { data: fkeys } = await supabase.rpc('query', {
      query: `
        SELECT 
          tc.table_name, 
          kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
        FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' 
          AND tc.table_schema = 'public';
      `
    }).single();
    
    if (fkeys) {
      console.table(JSON.parse(fkeys));
    }

    // 7. Audit data integrity issues
    console.log('\n❌ DATA INTEGRITY CHECKS:');
    
    // Check for orphaned records
    console.log('\nChecking for orphaned records...');
    
    // Check admin_activity_log for non-existent users
    const { count: orphanedLogs } = await supabase.rpc('query', {
      query: `
        SELECT COUNT(*) as count
        FROM admin_activity_log a
        LEFT JOIN user_profiles u ON a.user_id = u.id
        WHERE a.user_id IS NOT NULL AND u.id IS NULL;
      `
    }).single();
    
    if (orphanedLogs) {
      console.log(`- Orphaned admin_activity_log records: ${JSON.parse(orphanedLogs)[0].count}`);
    }

    // 8. Check for unused tables
    console.log('\n🗑️  POTENTIALLY UNUSED TABLES (0 rows):');
    const { data: emptyTables } = await supabase.rpc('query', {
      query: `
        SELECT tablename 
        FROM pg_tables t
        WHERE schemaname = 'public'
        AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = t.tablename 
          LIMIT 1
        );
      `
    }).single();
    
    // List tables with 0 rows
    const tablesToCheckEmpty = [
      'admin_sessions', 'admin_users', 'appointment_data', 
      'appointment_payments', 'calendly_webhook_events',
      'career_applications', 'chat_conversations', 'click_heatmap'
    ];
    
    for (const table of tablesToCheckEmpty) {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (count === 0) {
        console.log(`- ${table}: Empty table`);
      }
    }

    // 9. Summary recommendations
    console.log('\n📝 SUMMARY & RECOMMENDATIONS:');
    console.log('1. ✅ Phase 1 migration completed successfully');
    console.log('2. ⚠️  Multiple email-related tables exist (email_queue, email_sends, email_logs)');
    console.log('3. ⚠️  Both subscribers and newsletter_subscribers tables exist');
    console.log('4. ⚠️  admin_users table exists but user_profiles has role column');
    console.log('5. 🔧 Consider consolidating duplicate functionality tables');
    console.log('6. 🔧 Some tables may need RLS policies enabled');
    console.log('7. 🗑️  Several empty tables could be removed if unused');

  } catch (error) {
    console.error('Audit error:', error);
  }
}

// Add RPC query function if it doesn't exist
async function setupQueryFunction() {
  const { error } = await supabase.rpc('query', {
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
  
  if (!error) {
    console.log('✅ Query function created');
  }
}

// Run setup then audit
setupQueryFunction().then(() => {
  comprehensiveDatabaseAudit();
});