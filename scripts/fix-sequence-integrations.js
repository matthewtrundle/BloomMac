const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSequenceStatus() {
  console.log('📊 Checking Email Sequence Status\n');

  // Get all sequences
  const { data: sequences, error } = await supabase
    .from('email_sequences')
    .select('*')
    .order('trigger');

  if (error) {
    console.error('Error fetching sequences:', error);
    return;
  }

  console.log('Current Sequences:');
  console.log('==================\n');

  const triggers = {
    'newsletter_signup': { implemented: true, location: '/app/api/user/newsletter-subscribe/route.ts' },
    'contact_form': { implemented: false, location: '/app/api/contact/submit/route.ts (using old system)' },
    'resource_download': { implemented: false, location: 'Not found' },
    'new_mom_program': { implemented: false, location: 'Not found' }
  };

  for (const seq of sequences) {
    const impl = triggers[seq.trigger] || { implemented: false, location: 'Unknown' };
    console.log(`📧 ${seq.name}`);
    console.log(`   Trigger: ${seq.trigger}`);
    console.log(`   Status: ${seq.status}`);
    console.log(`   Implementation: ${impl.implemented ? '✓' : '✗'} ${impl.location}`);
    
    // Check if it has emails
    const { data: emails, error: emailError } = await supabase
      .from('sequence_emails')
      .select('id, position, subject')
      .eq('sequence_id', seq.id)
      .order('position');
    
    if (emails && emails.length > 0) {
      console.log(`   Emails: ${emails.length} configured`);
    } else {
      console.log(`   Emails: ⚠️  No emails configured`);
    }
    console.log('');
  }

  console.log('\n📝 Summary:');
  console.log('===========\n');
  console.log('✓ Newsletter Signup - WORKING (uses enrollmentManager)');
  console.log('✗ Contact Form - NOT WORKING (uses old sendEmail system)');
  console.log('✗ Resource Download - NOT IMPLEMENTED');
  console.log('✗ New Mom Program - NOT IMPLEMENTED');
  console.log('? Booking Confirmation - Via Calendly (external)\n');

  console.log('\n🔧 To Fix Contact Form:');
  console.log('========================\n');
  console.log('1. Activate the "Contact Follow-up" sequence (currently draft)');
  console.log('2. Update /app/api/contact/submit/route.ts to use enrollmentManager');
  console.log('3. Remove the old sendEmail call\n');

  // Check if contact form sequence needs activation
  const contactSeq = sequences.find(s => s.trigger === 'contact_form');
  if (contactSeq && contactSeq.status === 'draft') {
    console.log('Would you like to activate the Contact Follow-up sequence? (Run with --activate flag)');
    
    if (process.argv.includes('--activate')) {
      const { error: updateError } = await supabase
        .from('email_sequences')
        .update({ status: 'active' })
        .eq('id', contactSeq.id);
      
      if (!updateError) {
        console.log('✓ Contact Follow-up sequence activated!');
      } else {
        console.error('Error activating sequence:', updateError);
      }
    }
  }
}

checkSequenceStatus();