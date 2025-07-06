const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkResourceSequences() {
  console.log('📊 Analyzing Email Sequences\n');

  // Get all sequences with their emails
  const { data: sequences, error } = await supabase
    .from('email_sequences')
    .select(`
      id,
      name, 
      trigger,
      status,
      description,
      sequence_emails (
        position,
        subject,
        delay_days,
        delay_hours
      )
    `)
    .order('created_at');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('SEQUENCE ANALYSIS:');
  console.log('==================\n');

  sequences.forEach(seq => {
    console.log(`📧 ${seq.name}`);
    console.log(`   Trigger: ${seq.trigger}`);
    console.log(`   Status: ${seq.status}`);
    console.log(`   Description: ${seq.description}`);
    
    if (seq.sequence_emails && seq.sequence_emails.length > 0) {
      console.log(`   Emails (${seq.sequence_emails.length}):`);
      seq.sequence_emails
        .sort((a, b) => a.position - b.position)
        .forEach(email => {
          const timing = email.delay_days > 0 ? `${email.delay_days} days` : 
                        email.delay_hours > 0 ? `${email.delay_hours} hours` : 'Immediate';
          console.log(`     ${email.position}. "${email.subject}" (${timing})`);
        });
    } else {
      console.log(`   ⚠️  No emails configured`);
    }
    console.log('');
  });

  // Check for the "Lead Nurture" mentioned by user
  console.log('\n🔍 Looking for "Lead Nurture Campaign" or "4 emails over 14 days"...\n');
  
  const leadNurture = sequences.find(seq => 
    seq.name.toLowerCase().includes('lead') || 
    seq.name.toLowerCase().includes('nurture') ||
    (seq.sequence_emails && seq.sequence_emails.length === 4 && 
     seq.sequence_emails.some(e => e.delay_days === 14))
  );

  if (leadNurture) {
    console.log(`✅ Found potential Lead Nurture: "${leadNurture.name}"`);
    console.log(`   Trigger: ${leadNurture.trigger}`);
    console.log(`   Status: ${leadNurture.status}`);
  } else {
    console.log('❌ No "Lead Nurture Campaign" with 4 emails over 14 days found');
    console.log('   This might be what the resource download page is trying to call');
  }

  // Check what the resource download page is actually calling
  console.log('\n📝 What Resource Download Page Calls:');
  console.log('=====================================');
  console.log('The postpartum checklist page calls:');
  console.log('  sequenceType: "lead_nurture"');
  console.log('  via: /api/email-automation (old endpoint)');
  console.log('');
  console.log('This needs to be updated to use enrollmentManager with trigger: "resource_download"');
}

checkResourceSequences();