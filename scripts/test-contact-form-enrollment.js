const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testContactFormEnrollment() {
  console.log('🧪 Testing Contact Form Email Enrollment\n');

  // Create a test email
  const testEmail = `test-contact-${Date.now()}@example.com`;
  const testData = {
    name: 'Test User',
    email: testEmail,
    message: 'This is a test contact form submission',
    service: 'general'
  };

  console.log('📧 Submitting contact form with:', testData);

  try {
    // Submit contact form
    const response = await fetch('http://localhost:3000/api/contact/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Contact form submission failed:', result);
      return;
    }

    console.log('✅ Contact form submitted successfully:', result);
    console.log('\n🔍 Checking enrollment...\n');

    // Wait a moment for the enrollment to process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if subscriber was created
    const { data: subscriber, error: subError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', testEmail)
      .single();

    if (subError || !subscriber) {
      console.error('❌ Subscriber not found:', subError);
      return;
    }

    console.log('✅ Subscriber created:', {
      id: subscriber.id,
      email: subscriber.email,
      status: subscriber.status,
      source: subscriber.source
    });

    // Check if enrollment was created
    const { data: enrollment, error: enrollError } = await supabase
      .from('sequence_enrollments')
      .select(`
        *,
        email_sequences (name, trigger)
      `)
      .eq('subscriber_id', subscriber.id)
      .single();

    if (enrollError || !enrollment) {
      console.error('❌ Enrollment not found:', enrollError);
      return;
    }

    console.log('\n✅ Enrollment created:', {
      id: enrollment.id,
      sequence: enrollment.email_sequences.name,
      trigger: enrollment.email_sequences.trigger,
      status: enrollment.status,
      next_send_at: enrollment.next_send_at
    });

    // Check if first email is scheduled
    const { data: pendingEmails } = await supabase
      .from('sequence_emails')
      .select(`
        *,
        sequence_enrollments!inner(
          subscriber_id,
          status,
          next_send_at
        )
      `)
      .eq('sequence_enrollments.subscriber_id', subscriber.id)
      .eq('position', enrollment.current_position + 1);

    if (pendingEmails && pendingEmails.length > 0) {
      console.log('\n📬 Next email scheduled:', {
        subject: pendingEmails[0].subject,
        position: pendingEmails[0].position,
        scheduled_for: enrollment.next_send_at
      });
    }

    console.log('\n🎉 Contact form enrollment test successful!');

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await supabase.from('sequence_enrollments').delete().eq('subscriber_id', subscriber.id);
    await supabase.from('subscribers').delete().eq('id', subscriber.id);
    console.log('✅ Test data cleaned up');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testContactFormEnrollment();