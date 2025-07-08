#!/usr/bin/env node

/**
 * Test the email templates API to verify all templates are loading
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testEmailTemplates() {
  console.log('=== EMAIL TEMPLATES TEST ===\n');

  // 1. Check email_templates table
  console.log('1. Checking email_templates table:');
  const { data: templates, error: templatesError } = await supabase
    .from('email_templates')
    .select('id, name, category')
    .order('name');

  if (templatesError) {
    console.log('   ❌ Error:', templatesError.message);
  } else {
    console.log(`   ✅ Found ${templates.length} templates`);
    templates.forEach(t => {
      console.log(`      - ${t.name} (${t.category})`);
    });
  }

  // 2. Check email_templates_custom table
  console.log('\n2. Checking email_templates_custom table:');
  const { data: customTemplates, error: customError } = await supabase
    .from('email_templates_custom')
    .select('id, sequence, step, subject')
    .order('sequence')
    .order('step');

  if (customError) {
    console.log('   ❌ Error:', customError.message);
  } else {
    console.log(`   ✅ Found ${customTemplates.length} custom templates`);
    customTemplates.forEach(t => {
      console.log(`      - ${t.sequence} - ${t.step}: ${t.subject}`);
    });
  }

  // 3. Check sequence_emails table
  console.log('\n3. Checking sequence_emails table:');
  const { data: sequenceEmails, error: sequenceError } = await supabase
    .from('sequence_emails')
    .select(`
      id,
      position,
      subject,
      email_sequences (
        name,
        trigger
      )
    `)
    .order('position');

  if (sequenceError) {
    console.log('   ❌ Error:', sequenceError.message);
  } else {
    console.log(`   ✅ Found ${sequenceEmails.length} sequence emails`);
    const grouped = {};
    sequenceEmails.forEach(e => {
      const sequenceName = e.email_sequences?.name || 'Unknown';
      if (!grouped[sequenceName]) grouped[sequenceName] = [];
      grouped[sequenceName].push(e);
    });
    
    Object.keys(grouped).forEach(seq => {
      console.log(`      ${seq}:`);
      grouped[seq].forEach(e => {
        console.log(`         - Position ${e.position}: ${e.subject}`);
      });
    });
  }

  // Summary
  console.log('\n=== SUMMARY ===');
  console.log(`Total templates across all tables: ${
    (templates?.length || 0) + 
    (customTemplates?.length || 0) + 
    (sequenceEmails?.length || 0)
  }`);
  console.log('\nThe API should now show all these templates in the Email Center.');
}

testEmailTemplates().catch(console.error);