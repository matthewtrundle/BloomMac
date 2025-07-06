const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testEnrollment() {
  console.log('🧪 Testing Email Automation Enrollment\n');
  
  // Get a test subscriber (you from earlier)
  const testEmail = 'matthewtrundle@gmail.com';
  
  console.log(`1️⃣ Checking subscriber: ${testEmail}`);
  const { data: subscriber, error: subError } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', testEmail)
    .single();
  
  if (subError || !subscriber) {
    console.error('❌ Subscriber not found');
    return;
  }
  
  console.log(`✅ Found subscriber: ${subscriber.first_name || 'No name'} (ID: ${subscriber.id})`);
  console.log(`   Status: ${subscriber.status}`);
  console.log(`   Created: ${new Date(subscriber.created_at).toLocaleDateString()}\n`);
  
  // Check enrollments
  console.log('2️⃣ Checking sequence enrollments...');
  const { data: enrollments, error: enrollError } = await supabase
    .from('sequence_enrollments')
    .select('*')
    .eq('subscriber_id', subscriber.id);
  
  // Get sequence details separately
  let enrichedEnrollments = [];
  if (enrollments && enrollments.length > 0) {
    for (const enrollment of enrollments) {
      const { data: sequence } = await supabase
        .from('email_sequences')
        .select('name, trigger')
        .eq('id', enrollment.sequence_id)
        .single();
      
      enrichedEnrollments.push({
        ...enrollment,
        sequence: sequence || { name: 'Unknown', trigger: 'unknown' }
      });
    }
  }
  
  if (enrollError) {
    console.error('❌ Error checking enrollments:', enrollError);
    return;
  }
  
  if (!enrollments || enrollments.length === 0) {
    console.log('⚠️  No enrollments found for this subscriber');
    console.log('\n💡 This means they signed up before automation was implemented.');
    console.log('   New signups will be automatically enrolled.\n');
  } else {
    console.log(`✅ Found ${enrollments.length} enrollment(s):\n`);
    
    enrichedEnrollments.forEach((enrollment, index) => {
      console.log(`   ${index + 1}. ${enrollment.sequence.name}`);
      console.log(`      - Status: ${enrollment.status}`);
      console.log(`      - Position: ${enrollment.current_position}`);
      console.log(`      - Enrolled: ${new Date(enrollment.enrolled_at).toLocaleDateString()}`);
      if (enrollment.next_send_at) {
        console.log(`      - Next email: ${new Date(enrollment.next_send_at).toLocaleString()}`);
      }
      console.log('');
    });
  }
  
  // Check scheduled emails
  console.log('3️⃣ Checking scheduled emails...');
  if (enrollments && enrollments.length > 0) {
    const enrollmentIds = enrollments.map(e => e.id);
    
    const { data: scheduledEmails, error: emailError } = await supabase
      .from('sequence_email_sends')
      .select(`
        *,
        email:sequence_emails(
          subject,
          position,
          delay_hours,
          delay_days
        )
      `)
      .in('enrollment_id', enrollmentIds)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (!emailError && scheduledEmails && scheduledEmails.length > 0) {
      console.log(`✅ Found ${scheduledEmails.length} scheduled/sent email(s):\n`);
      
      scheduledEmails.forEach((send, index) => {
        console.log(`   ${index + 1}. Email #${send.email.position}: ${send.email.subject}`);
        console.log(`      - Status: ${send.status}`);
        if (send.sent_at) {
          console.log(`      - Sent: ${new Date(send.sent_at).toLocaleString()}`);
        }
        console.log('');
      });
    } else {
      console.log('⚠️  No emails scheduled/sent yet\n');
    }
  }
  
  // Show next steps
  console.log('📋 Next Steps:');
  console.log('1. The cron job needs to be set up to process scheduled emails');
  console.log('2. New subscribers will be automatically enrolled');
  console.log('3. Emails will be sent based on the sequence timing');
}

testEnrollment().catch(console.error);