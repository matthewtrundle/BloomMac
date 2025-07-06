const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugReadyEmails() {
  console.log('🔍 Debugging Ready Emails\n');
  
  const now = new Date();
  console.log(`Current time: ${now.toISOString()}`);
  console.log(`Local time: ${now.toLocaleString()}\n`);
  
  // Get the enrollment
  const { data: enrollment, error } = await supabase
    .from('sequence_enrollments')
    .select('*')
    .eq('status', 'active')
    .single();
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Enrollment:');
  console.log(`  ID: ${enrollment.id}`);
  console.log(`  Status: ${enrollment.status}`);
  console.log(`  Position: ${enrollment.current_position}`);
  console.log(`  Next send at: ${enrollment.next_send_at}`);
  console.log(`  Next send local: ${new Date(enrollment.next_send_at).toLocaleString()}`);
  
  const nextSendTime = new Date(enrollment.next_send_at);
  const timeDiff = nextSendTime.getTime() - now.getTime();
  console.log(`  Time difference: ${Math.round(timeDiff / 1000)} seconds`);
  console.log(`  Is past due: ${nextSendTime <= now}\n`);
  
  // Check subscriber
  const { data: subscriber } = await supabase
    .from('subscribers')
    .select('*')
    .eq('id', enrollment.subscriber_id)
    .single();
  
  console.log('Subscriber:');
  console.log(`  Email: ${subscriber.email}`);
  console.log(`  Status: ${subscriber.status}`);
  console.log(`  Is active: ${subscriber.status === 'active'}\n`);
  
  // Check sequence
  const { data: sequence } = await supabase
    .from('email_sequences')
    .select('*')
    .eq('id', enrollment.sequence_id)
    .single();
  
  console.log('Sequence:');
  console.log(`  Name: ${sequence.name}`);
  console.log(`  Status: ${sequence.status}`);
  console.log(`  Is active: ${sequence.status === 'active'}\n`);
  
  // Test the exact query used by processor
  console.log('Testing processor query...');
  const { data: results, error: queryError } = await supabase
    .from('sequence_enrollments')
    .select(`
      *,
      subscriber:subscribers!inner(
        id,
        email,
        first_name,
        last_name,
        status
      ),
      sequence:email_sequences(
        id,
        name,
        status
      )
    `)
    .eq('status', 'active')
    .lte('next_send_at', new Date().toISOString())
    .not('next_send_at', 'is', null)
    .eq('subscriber.status', 'active')
    .eq('sequence.status', 'active');
  
  if (queryError) {
    console.error('Query error:', queryError);
  } else {
    console.log(`Query returned ${results?.length || 0} results`);
  }
}

debugReadyEmails().catch(console.error);