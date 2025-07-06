const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function manuallyEnroll(email) {
  console.log(`📧 Manually enrolling ${email} in newsletter sequence\n`);
  
  // Get subscriber
  const { data: subscriber, error: subError } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', email)
    .single();
  
  if (subError || !subscriber) {
    console.error('❌ Subscriber not found');
    return;
  }
  
  console.log(`✅ Found subscriber: ${subscriber.first_name || 'No name'} (${subscriber.email})`);
  
  // Get the newsletter sequence
  const { data: sequence, error: seqError } = await supabase
    .from('email_sequences')
    .select('*')
    .eq('trigger', 'newsletter_signup')
    .eq('status', 'active')
    .single();
  
  if (seqError || !sequence) {
    console.error('❌ Newsletter sequence not found or not active');
    return;
  }
  
  console.log(`✅ Found sequence: ${sequence.name}\n`);
  
  // Check if already enrolled
  const { data: existing } = await supabase
    .from('sequence_enrollments')
    .select('id')
    .eq('subscriber_id', subscriber.id)
    .eq('sequence_id', sequence.id)
    .eq('status', 'active')
    .single();
  
  if (existing) {
    console.log('⚠️  Already enrolled in this sequence');
    return;
  }
  
  // Get first email in sequence
  const { data: firstEmail, error: emailError } = await supabase
    .from('sequence_emails')
    .select('*')
    .eq('sequence_id', sequence.id)
    .eq('position', 1)
    .single();
  
  if (emailError || !firstEmail) {
    console.error('❌ No emails found in sequence');
    return;
  }
  
  // Calculate next send time (5 minutes from now for testing)
  const nextSendAt = new Date();
  nextSendAt.setMinutes(nextSendAt.getMinutes() + 5);
  
  console.log(`📅 Scheduling first email for: ${nextSendAt.toLocaleString()}\n`);
  
  // Create enrollment
  const { data: enrollment, error: enrollError } = await supabase
    .from('sequence_enrollments')
    .insert({
      subscriber_id: subscriber.id,
      sequence_id: sequence.id,
      enrollment_source: 'manual_test',
      status: 'active',
      current_position: 0,
      next_send_at: nextSendAt.toISOString(),
      metadata: {
        manual_enrollment: true,
        enrolled_by: 'test_script'
      }
    })
    .select()
    .single();
  
  if (enrollError) {
    console.error('❌ Failed to create enrollment:', enrollError);
    return;
  }
  
  console.log('✅ Successfully enrolled!');
  console.log(`   Enrollment ID: ${enrollment.id}`);
  console.log(`   First email will be sent at: ${nextSendAt.toLocaleString()}`);
  console.log('\n💡 The cron job will process this in the next run (every 30 minutes)');
  console.log('   Or you can manually trigger it with: node scripts/test-sequence-processor.js');
}

// Get email from command line or use default
const email = process.argv[2] || 'matthewtrundle@gmail.com';
manuallyEnroll(email).catch(console.error);