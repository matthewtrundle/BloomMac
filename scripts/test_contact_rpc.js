const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Use anon key to test public access
);

async function testContactRPC() {
  console.log('Testing submit_contact_form RPC function...\n');
  
  const testData = {
    contact_data: {
      p_name: 'Test User',
      p_email: 'test@example.com',
      p_phone: '555-1234',
      p_service: 'general',
      p_message: 'Test message from RPC test',
      p_page: '/contact',
      p_user_agent: 'Test Script',
      p_ip_address: '127.0.0.1'
    }
  };
  
  console.log('Calling submit_contact_form with:', JSON.stringify(testData, null, 2));
  
  const { data, error } = await supabase
    .rpc('submit_contact_form', testData);
  
  if (error) {
    console.error('❌ Error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
  } else {
    console.log('✅ Success:', data);
  }
  
  // Also test if we can directly insert (for comparison)
  console.log('\nTesting direct insert to contact_submissions...');
  const { data: directData, error: directError } = await supabase
    .from('contact_submissions')
    .insert({
      name: 'Direct Test',
      email: 'direct@test.com',
      message: 'Direct insert test',
      status: 'new',
      source: 'test'
    })
    .select();
  
  if (directError) {
    console.error('❌ Direct insert error:', directError.message);
  } else {
    console.log('✅ Direct insert success:', directData);
  }
}

testContactRPC();