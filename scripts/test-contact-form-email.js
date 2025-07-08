#!/usr/bin/env node

/**
 * Test script to verify contact form email functionality
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testContactFormEmail() {
  console.log('=== CONTACT FORM EMAIL TEST ===\n');

  // 1. Check Resend configuration
  console.log('1. Checking Resend configuration:');
  console.log('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Not set');
  
  if (!process.env.RESEND_API_KEY) {
    console.log('\n❌ RESEND_API_KEY is not set. Emails cannot be sent.');
    return;
  }

  // 2. Check contact_form email sequence
  console.log('\n2. Checking contact_form email sequence:');
  const { data: sequence, error: seqError } = await supabase
    .from('email_sequences')
    .select('*')
    .eq('trigger', 'contact_form')
    .single();

  let emails = [];
  if (seqError) {
    console.log('   ❌ Error fetching sequence:', seqError.message);
  } else {
    console.log('   ✅ Sequence found:', sequence.name);
    console.log('   Status:', sequence.status);
    
    // Check emails in sequence
    const { data: sequenceEmails } = await supabase
      .from('sequence_emails')
      .select('*')
      .eq('sequence_id', sequence.id)
      .order('position');
    
    emails = sequenceEmails || [];
    console.log('   Emails configured:', emails.length);
    if (emails.length === 0) {
      console.log('   ⚠️  No emails configured in sequence!');
    }
  }

  // 3. Check recent contact submissions
  console.log('\n3. Recent contact submissions:');
  const { data: submissions } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { desc: true })
    .limit(5);

  if (submissions) {
    submissions.forEach(sub => {
      console.log(`   - ${sub.created_at}: ${sub.email} (${sub.status})`);
    });
  }

  // 4. Test sending an email directly
  console.log('\n4. Testing direct email send:');
  try {
    const { sendEmail } = require('../lib/resend-client');
    
    const result = await sendEmail({
      from: 'Bloom Test <noreply@bloompsychologynorthaustin.com>',
      to: 'test@example.com',
      subject: 'Test Email from Contact Form Script',
      html: '<p>This is a test email to verify Resend is working.</p>',
      tags: [{ name: 'type', value: 'test' }]
    });
    
    console.log('   ✅ Test email sent successfully:', result);
  } catch (error) {
    console.log('   ❌ Error sending test email:', error.message);
  }

  // 5. Check if RPC function exists
  console.log('\n5. Checking submit_contact_form RPC function:');
  try {
    const { data, error } = await supabase.rpc('submit_contact_form', {
      contact_data: {
        p_name: 'Test Script',
        p_email: 'test@script.com',
        p_phone: null,
        p_service: 'test',
        p_message: 'Testing RPC function',
        p_page: '/test',
        p_user_agent: 'test-script',
        p_ip_address: '127.0.0.1'
      }
    });
    
    if (error) {
      console.log('   ❌ RPC function error:', error.message);
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        console.log('   ℹ️  The submit_contact_form function needs to be created in the database');
      }
    } else {
      console.log('   ✅ RPC function works, submission ID:', data?.id);
    }
  } catch (error) {
    console.log('   ❌ RPC test error:', error.message);
  }

  // 6. Summary and recommendations
  console.log('\n=== SUMMARY ===');
  console.log('\nIssues found:');
  
  if (!sequence || sequence.status !== 'active') {
    console.log('- Contact form email sequence is not active');
  }
  
  if (emails.length === 0) {
    console.log('- No follow-up emails configured in the contact_form sequence');
    console.log('  → You need to add emails to the sequence for automated follow-ups');
  }
  
  console.log('\nThe contact form is configured to:');
  console.log('1. Send immediate notification to jana@ and matt@ when someone submits');
  console.log('2. Send immediate confirmation to the customer');
  console.log('3. Enroll customer in contact_form sequence (now has ' + emails.length + ' emails)');
  
  console.log('\nTo fix email issues:');
  console.log('1. Ensure RESEND_API_KEY is set correctly');
  console.log('2. Add follow-up emails to the contact_form sequence if needed');
  console.log('3. Check the admin panel email automation section to configure sequences');
}

testContactFormEmail().catch(console.error);