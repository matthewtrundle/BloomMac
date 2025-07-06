const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkPendingEmails() {
  console.log('📧 Checking Pending Email Sequences\n');
  
  // Check active enrollments
  console.log('1️⃣ Active Enrollments:');
  const { data: enrollments, error: enrollError } = await supabase
    .from('sequence_enrollments')
    .select(`
      id,
      status,
      current_position,
      next_send_at,
      subscriber_id,
      sequence_id
    `)
    .eq('status', 'active')
    .order('next_send_at', { ascending: true });
  
  if (enrollError) {
    console.error('Error:', enrollError);
    return;
  }
  
  if (!enrollments || enrollments.length === 0) {
    console.log('   No active enrollments found\n');
  } else {
    console.log(`   Found ${enrollments.length} active enrollment(s)\n`);
    
    // Get subscriber and sequence details
    for (const enrollment of enrollments.slice(0, 5)) { // Show first 5
      const { data: subscriber } = await supabase
        .from('subscribers')
        .select('email, first_name')
        .eq('id', enrollment.subscriber_id)
        .single();
      
      const { data: sequence } = await supabase
        .from('email_sequences')
        .select('name')
        .eq('id', enrollment.sequence_id)
        .single();
      
      console.log(`   📌 ${subscriber?.email || 'Unknown'}`);
      console.log(`      Sequence: ${sequence?.name || 'Unknown'}`);
      console.log(`      Position: ${enrollment.current_position}`);
      console.log(`      Next send: ${enrollment.next_send_at ? new Date(enrollment.next_send_at).toLocaleString() : 'Not scheduled'}`);
      
      if (enrollment.next_send_at) {
        const now = new Date();
        const sendTime = new Date(enrollment.next_send_at);
        if (sendTime <= now) {
          console.log(`      ⏰ READY TO SEND NOW!`);
        } else {
          const hoursUntil = Math.round((sendTime.getTime() - now.getTime()) / (1000 * 60 * 60));
          console.log(`      ⏱️  Sends in ${hoursUntil} hours`);
        }
      }
      console.log('');
    }
  }
  
  // Check emails ready to send now
  console.log('2️⃣ Emails Ready to Send:');
  const { data: readyEnrollments, error: readyError } = await supabase
    .from('sequence_enrollments')
    .select('id')
    .eq('status', 'active')
    .lte('next_send_at', new Date().toISOString())
    .not('next_send_at', 'is', null);
  
  if (!readyError && readyEnrollments) {
    console.log(`   ${readyEnrollments.length} email(s) ready to send now\n`);
  }
  
  // Check recent sends
  console.log('3️⃣ Recent Email Sends:');
  const { data: recentSends, error: sendsError } = await supabase
    .from('sequence_email_sends')
    .select(`
      id,
      status,
      sent_at,
      created_at
    `)
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (!sendsError && recentSends && recentSends.length > 0) {
    console.log(`   Last ${recentSends.length} sends:\n`);
    recentSends.forEach((send, index) => {
      console.log(`   ${index + 1}. ${send.status}`);
      console.log(`      Created: ${new Date(send.created_at).toLocaleString()}`);
      if (send.sent_at) {
        console.log(`      Sent: ${new Date(send.sent_at).toLocaleString()}`);
      }
      console.log('');
    });
  } else {
    console.log('   No email sends recorded yet\n');
  }
  
  // Show cron schedule
  console.log('⏰ Cron Schedule:');
  console.log('   The email processor runs every 30 minutes');
  console.log('   Next run will process any emails with next_send_at <= current time');
}

checkPendingEmails().catch(console.error);