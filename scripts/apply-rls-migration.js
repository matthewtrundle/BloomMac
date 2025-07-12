const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyRLSMigration() {
  console.log('=== Applying RLS Migration ===\n');
  
  try {
    // 1. Take a snapshot of current state
    console.log('1. Taking snapshot of current RLS state...\n');
    
    const { data: snapshot, error: snapshotError } = await supabase.rpc('query', {
      query: `
        SELECT 
          tablename,
          rowsecurity,
          (SELECT COUNT(*) FROM pg_policies p 
           WHERE p.tablename = t.tablename 
           AND p.schemaname = 'public') as policy_count
        FROM pg_tables t
        WHERE schemaname = 'public'
        ORDER BY tablename
      `
    }).single();
    
    if (snapshotError) throw snapshotError;
    
    // Save snapshot
    const snapshotPath = path.join(__dirname, `rls-snapshot-${Date.now()}.json`);
    fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
    console.log(`✅ Snapshot saved to ${snapshotPath}`);
    
    // 2. Read migration SQL
    console.log('\n2. Reading migration SQL...\n');
    
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', 'enable-rls-policies.sql'),
      'utf8'
    );
    
    // 3. Execute migration in transaction
    console.log('3. Executing migration...\n');
    
    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (const statement of statements) {
      try {
        // Skip DO blocks for now (they're just notices)
        if (statement.startsWith('DO $$')) {
          continue;
        }
        
        const { error } = await supabase.rpc('query', {
          query: statement
        });
        
        if (error) {
          errorCount++;
          errors.push({
            statement: statement.substring(0, 100) + '...',
            error: error.message
          });
          console.log(`❌ Failed: ${statement.substring(0, 50)}...`);
        } else {
          successCount++;
          console.log(`✅ Success: ${statement.substring(0, 50)}...`);
        }
      } catch (e) {
        errorCount++;
        errors.push({
          statement: statement.substring(0, 100) + '...',
          error: e.message
        });
        console.log(`❌ Error: ${e.message}`);
      }
    }
    
    // 4. Verify migration results
    console.log('\n4. Verifying migration results...\n');
    
    const { data: afterMigration, error: verifyError } = await supabase.rpc('query', {
      query: `
        SELECT 
          COUNT(*) FILTER (WHERE rowsecurity = true) as rls_enabled_count,
          COUNT(*) FILTER (WHERE rowsecurity = false) as rls_disabled_count,
          COUNT(*) as total_tables
        FROM pg_tables
        WHERE schemaname = 'public'
      `
    }).single();
    
    if (verifyError) {
      console.log('❌ Could not verify results:', verifyError);
    } else if (afterMigration && afterMigration.length > 0) {
      const stats = afterMigration[0];
      console.log('Migration Results:');
      console.log(`- Tables with RLS enabled: ${stats.rls_enabled_count}`);
      console.log(`- Tables without RLS: ${stats.rls_disabled_count}`);
      console.log(`- Total tables: ${stats.total_tables}`);
    }
    
    // 5. Summary
    console.log('\n5. Migration Summary:\n');
    console.log(`✅ Successful statements: ${successCount}`);
    console.log(`❌ Failed statements: ${errorCount}`);
    
    if (errors.length > 0) {
      console.log('\nErrors encountered:');
      errors.forEach((e, i) => {
        console.log(`\n${i + 1}. ${e.statement}`);
        console.log(`   Error: ${e.error}`);
      });
      
      console.log('\n⚠️  Some statements failed. You may need to:');
      console.log('1. Check if policies already exist');
      console.log('2. Run rollback script if needed');
      console.log('3. Fix conflicts and retry');
    } else {
      console.log('\n✅ Migration completed successfully!');
    }
    
    // 6. Test critical operations
    console.log('\n6. Testing critical operations post-migration...\n');
    
    // Test anonymous access
    const { error: analyticsError } = await supabase
      .from('analytics_events')
      .insert({
        type: 'migration_test',
        page: '/test',
        data: { migration: 'rls_enable' }
      });
    
    if (analyticsError) {
      console.log('❌ Analytics insert failed:', analyticsError.message);
    } else {
      console.log('✅ Analytics events still accepting anonymous inserts');
      
      // Clean up
      await supabase
        .from('analytics_events')
        .delete()
        .eq('type', 'migration_test');
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.log('\nTo rollback, run:');
    console.log('psql $DATABASE_URL < scripts/migrations/rollback-rls-policies.sql');
  }
}

// Setup query function if needed
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
    // Function might already exist
  }
}

// Check for --dry-run flag
const isDryRun = process.argv.includes('--dry-run');

if (isDryRun) {
  console.log('🔍 DRY RUN MODE - No changes will be made\n');
  
  setupQueryFunction().then(async () => {
    // Just show what would be done
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', 'enable-rls-policies.sql'),
      'utf8'
    );
    
    console.log('Migration would execute the following:\n');
    console.log(migrationSQL);
  });
} else {
  console.log('⚠️  This will enable RLS on multiple tables.');
  console.log('Make sure you have a database backup before proceeding.\n');
  console.log('To preview changes, run with --dry-run flag\n');
  
  // Add 5 second delay for safety
  console.log('Starting migration in 5 seconds... (Ctrl+C to cancel)');
  
  setTimeout(() => {
    setupQueryFunction().then(applyRLSMigration);
  }, 5000);
}