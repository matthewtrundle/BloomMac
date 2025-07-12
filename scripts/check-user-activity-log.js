const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUserActivityLog() {
  console.log('🔍 Checking user_activity_log table structure\n');
  
  try {
    // Get table info using information_schema
    const { data: columns, error } = await supabase.rpc('query', {
      query: `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = 'user_activity_log'
        ORDER BY ordinal_position
      `
    }).single();
    
    if (error) {
      console.error('Error querying table structure:', error);
      return;
    }
    
    const columnData = JSON.parse(columns || '[]');
    
    console.log('Current columns in user_activity_log:');
    console.log('=====================================');
    columnData.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });
    
    // Check what the API expects vs what exists
    const expectedColumns = ['user_id', 'action', 'ip_address', 'metadata', 'created_at'];
    const actualColumns = columnData.map(c => c.column_name);
    
    console.log('\n\nColumn Analysis:');
    console.log('================');
    
    const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
    if (missingColumns.length > 0) {
      console.log('❌ Missing columns:', missingColumns.join(', '));
    } else {
      console.log('✅ All expected columns exist');
    }
    
    const extraColumns = actualColumns.filter(col => !expectedColumns.includes(col) && col !== 'id');
    if (extraColumns.length > 0) {
      console.log('ℹ️  Extra columns:', extraColumns.join(', '));
    }
    
    // Check a sample insert to see what works
    console.log('\n\nTesting insert capability:');
    console.log('=========================');
    
    const testData = {
      user_id: '00000000-0000-0000-0000-000000000000',
      action: 'test_action',
      ip_address: '127.0.0.1',
      metadata: { test: true },
      created_at: new Date().toISOString()
    };
    
    const { error: insertError } = await supabase
      .from('user_activity_log')
      .insert(testData);
    
    if (insertError) {
      console.log('❌ Insert test failed:', insertError.message);
      console.log('\nThis confirms the schema mismatch!');
    } else {
      console.log('✅ Insert test succeeded - schema appears correct');
      
      // Clean up test data
      await supabase
        .from('user_activity_log')
        .delete()
        .eq('action', 'test_action');
    }
    
  } catch (err) {
    console.error('Error:', err);
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
    // Function might already exist
  }
}

setupQueryFunction().then(checkUserActivityLog);