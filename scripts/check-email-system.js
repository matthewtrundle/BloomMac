#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkEmailSystem() {
  console.log('=== EMAIL SYSTEM ANALYSIS ===\n');

  // Check for sequence-related tables
  const sequenceTables = [
    'sequence_steps',
    'sequence_emails',
    'email_sequence_steps',
    'automation_rules',
    'email_campaigns',
    'campaign_steps',
    'drip_campaigns',
    'email_automations'
  ];

  console.log('Checking for sequence/automation tables...\n');
  
  for (const table of sequenceTables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        console.log(`✅ Found: ${table} (${count} rows)`);
        
        // Get structure
        const { data } = await supabase.from(table).select('*').limit(1);
        if (data && data.length > 0) {
          console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);
        }
      }
    } catch (e) {
      // Table doesn't exist
    }
  }

  // Check email_sequences structure in detail
  console.log('\n=== EMAIL SEQUENCES DETAILS ===');
  const { data: sequences } = await supabase
    .from('email_sequences')
    .select('*')
    .order('created_at');

  if (sequences) {
    console.table(sequences.map(s => ({
      name: s.name,
      trigger: s.trigger,
      status: s.status,
      description: s.description
    })));
  }

  // Check if there's any enrollment tracking
  console.log('\n=== CHECKING ENROLLMENT TRACKING ===');
  const { data: enrollments, error: enrollError } = await supabase
    .from('sequence_enrollments')
    .select('*')
    .limit(5);

  if (!enrollError) {
    console.log('sequence_enrollments table exists but is empty');
    
    // Try to get column info differently
    const { data: singleRow } = await supabase
      .from('sequence_enrollments')
      .select('*')
      .limit(1);
      
    if (singleRow) {
      console.log('Table structure would have columns:', Object.keys(singleRow[0] || {}));
    }
  }

  // Check email_queue structure
  console.log('\n=== EMAIL QUEUE STRUCTURE ===');
  const { data: queueSample } = await supabase
    .from('email_queue')
    .insert({
      to: 'test@example.com',
      subject: 'Test',
      template_id: '95f25e78-90cb-439d-97c5-84be86f36993',
      status: 'pending'
    })
    .select();

  if (queueSample) {
    console.log('email_queue columns:', Object.keys(queueSample[0]));
    // Clean up test data
    await supabase.from('email_queue').delete().eq('id', queueSample[0].id);
  }

  // Check for any cron job tables
  console.log('\n=== CHECKING FOR CRON/SCHEDULING TABLES ===');
  const cronTables = ['cron_jobs', 'scheduled_tasks', 'email_schedules', 'automation_logs'];
  
  for (const table of cronTables) {
    const { error } = await supabase.from(table).select('*', { head: true });
    if (!error) {
      console.log(`✅ Found: ${table}`);
    }
  }
}

checkEmailSystem().catch(console.error);