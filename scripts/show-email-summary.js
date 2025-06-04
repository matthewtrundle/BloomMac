const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function showFinalSummary() {
  console.log('\n📊 FINAL EMAIL AUTOMATION SUMMARY\n');
  
  // Get all sequences
  const { data: sequences } = await supabase
    .from('email_sequences')
    .select(`
      *,
      sequence_emails (
        subject,
        delay_days,
        position
      )
    `)
    .order('status', { ascending: false });
    
  console.log('=== ACTIVE EMAIL SEQUENCES ===\n');
  
  const activeSeqs = sequences.filter(s => s.status === 'active');
  activeSeqs.forEach(seq => {
    console.log(`📧 ${seq.name}`);
    console.log(`   Trigger: ${seq.trigger}`);
    console.log(`   Emails: ${seq.sequence_emails.length}`);
    
    const sortedEmails = seq.sequence_emails.sort((a, b) => a.position - b.position);
    sortedEmails.forEach(email => {
      const timing = email.delay_days === 0 ? 'Immediate' : `Day ${email.delay_days}`;
      console.log(`   - ${timing}: ${email.subject}`);
    });
    console.log('');
  });
  
  console.log('\n=== INACTIVE/DRAFT SEQUENCES ===\n');
  
  const inactiveSeqs = sequences.filter(s => s.status !== 'active');
  inactiveSeqs.forEach(seq => {
    console.log(`⏸️  ${seq.name} (${seq.status})`);
  });
  
  console.log('\n✅ SUMMARY:');
  console.log(`- ${activeSeqs.length} active sequences`);
  console.log(`- ${inactiveSeqs.length} inactive/draft sequences`);
  console.log('\n🔧 KEY POINTS:');
  console.log('- Newsletter Signup Sequence: Active with 5 emails (includes $25 offer)');
  console.log('- Resource Download Follow-Up: Active with 4 emails');
  console.log('- Legacy Welcome Series: Deactivated');
  console.log('- Cron job runs hourly to process emails');
  console.log('\n📝 IMPLEMENTATION NOTES:');
  console.log('- Newsletter signups trigger automatically');
  console.log('- For resource downloads, use ResourceDownloadForm component');
  console.log('- Or call /api/trigger-resource-download endpoint');
  console.log('- Booking confirmations are handled by Calendly');
}

showFinalSummary();