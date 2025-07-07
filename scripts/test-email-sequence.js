const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testEmailSequence() {
  const testEmail = `test-${Date.now()}@example.com`;

  console.log(`Using test email: ${testEmail}`);

  // 1. Sign up for the newsletter
  console.log('Signing up for the newsletter...');
  const { data: subscriber, error: signupError } = await supabase
    .from('subscribers')
    .insert({ email: testEmail, status: 'active', source: 'e2e-test' })
    .select()
    .single();

  if (signupError) {
    console.error('Error signing up for newsletter:', signupError);
    return;
  }

  console.log('Subscriber created:', subscriber);

  // 2. Enroll in the newsletter sequence
  console.log('Enrolling in newsletter sequence...');
  const { error: enrollError } = await supabase
    .rpc('enroll_subscriber', {
      p_subscriber_id: subscriber.id,
      p_trigger: 'newsletter_signup'
    });

  if (enrollError) {
    console.error('Error enrolling in sequence:', enrollError);
    return;
  }

  console.log('Enrolled in sequence.');

  // 3. Check for enrollment
  console.log('Checking for enrollment...');
  const { data: enrollment, error: enrollmentError } = await supabase
    .from('sequence_enrollments')
    .select('*')
    .eq('subscriber_id', subscriber.id)
    .limit(1)
    .single();

  if (enrollmentError) {
    console.error('Error checking for enrollment:', enrollmentError);
    return;
  }

  console.log('Enrollment found:', enrollment);

  // 4. Manually trigger the email processor
  console.log('Manually triggering email processor...');
  const { error: processorError } = await supabase
    .rpc('process_email_sequences');

  if (processorError) {
    console.error('Error triggering email processor:', processorError);
    return;
  }

  console.log('Email processor triggered.');

  // 5. Check the email logs
  console.log('Checking email logs...');
  const { data: emailLog, error: logError } = await supabase
    .from('email_sends')
    .select('*')
    .eq('to_email', testEmail)
    .limit(1)
    .single();

  if (logError) {
    console.error('Error checking email logs:', logError);
    return;
  }

  console.log('Email log found:', emailLog);

  console.log('Test complete.');
}

testEmailSequence();
