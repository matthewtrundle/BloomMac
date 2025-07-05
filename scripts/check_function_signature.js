const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkFunctionSignature() {
  console.log('Checking submit_contact_form function signature...\n');
  
  // Query to get function parameters
  const query = `
    SELECT 
      p.proname as function_name,
      pg_get_function_arguments(p.oid) as arguments,
      pg_get_function_result(p.oid) as return_type
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' 
      AND p.proname = 'submit_contact_form';
  `;
  
  // First check if we have a query function
  const { data: checkQuery, error: checkError } = await supabase
    .rpc('query', { query: 'SELECT 1' });
  
  if (checkError) {
    console.log('No query function available, trying direct approach...');
    
    // Try calling with minimal params
    console.log('\nTesting with minimal parameters:');
    const { data: minData, error: minError } = await supabase
      .rpc('submit_contact_form', {
        name: 'Test',
        email: 'test@example.com',
        message: 'Test message'
      });
    
    if (minError) {
      console.error('Minimal params error:', minError.message);
      
      // Try with different param names
      console.log('\nTrying without p_ prefix:');
      const { data: noPrefixData, error: noPrefixError } = await supabase
        .rpc('submit_contact_form', {
          name: 'Test',
          email: 'test@example.com',
          phone: null,
          service: 'general',
          message: 'Test message',
          page: '/contact',
          user_agent: 'Test',
          ip_address: '127.0.0.1'
        });
      
      if (noPrefixError) {
        console.error('No prefix error:', noPrefixError.message);
      } else {
        console.log('✅ Success without p_ prefix:', noPrefixData);
      }
    } else {
      console.log('✅ Success with minimal params:', minData);
    }
  } else {
    // We have query function, use it
    const { data, error } = await supabase.rpc('query', { query });
    
    if (error) {
      console.error('Query error:', error);
    } else {
      const result = JSON.parse(data);
      console.log('Function signature:', result);
    }
  }
  
  // Also check RLS policies
  console.log('\nChecking RLS policies on contact_submissions...');
  const rlsQuery = `
    SELECT 
      policyname,
      cmd,
      permissive,
      roles
    FROM pg_policies
    WHERE tablename = 'contact_submissions';
  `;
  
  // Try to get RLS info
  const { data: rlsData, error: rlsError } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'contact_submissions');
  
  if (rlsError) {
    console.log('Could not query RLS policies directly');
  } else {
    console.log('RLS policies:', rlsData);
  }
}

checkFunctionSignature();