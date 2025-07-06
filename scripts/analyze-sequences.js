#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analyzeSequences() {
  console.log('=== EMAIL AUTOMATION ANALYSIS ===\n');

  // Get all active sequences with their emails
  const { data: sequences } = await supabase
    .from('email_sequences')
    .select(`
      *,
      sequence_emails(*)
    `)
    .eq('status', 'active')
    .order('name');

  if (sequences) {
    sequences.forEach(seq => {
      console.log(`\n📧 SEQUENCE: ${seq.name}`);
      console.log(`Trigger: ${seq.trigger}`);
      console.log(`Description: ${seq.description}`);
      console.log(`\nEmail Schedule:`);
      
      const emails = seq.sequence_emails || [];
      emails.sort((a, b) => a.position - b.position);
      
      emails.forEach(email => {
        const totalDays = email.delay_days + (email.delay_hours / 24);
        console.log(`  ${email.position}. Day ${totalDays}: "${email.subject}"`);
      });
    });
  }

  // Check enrollment tracking structure
  console.log('\n\n=== ENROLLMENT TRACKING ANALYSIS ===');
  
  // Try to insert a test enrollment to see the structure
  try {
    const { data: testEnroll, error } = await supabase
      .from('sequence_enrollments')
      .insert({
        subscriber_id: '511dfa10-1b4a-47b1-8a33-30f6941b402a',
        sequence_id: 'c8f5fb8f-dad1-46c4-84e4-3464310354e6',
        status: 'active',
        current_position: 0
      })
      .select()
      .single();

    if (testEnroll) {
      console.log('Enrollment table columns:', Object.keys(testEnroll));
      console.log('Sample enrollment:', JSON.stringify(testEnroll, null, 2));
      
      // Clean up
      await supabase.from('sequence_enrollments').delete().eq('id', testEnroll.id);
    } else if (error) {
      console.log('Enrollment error:', error.message);
    }
  } catch (e) {
    console.log('Could not test enrollment structure');
  }

  // Check for any existing automations
  console.log('\n\n=== EXISTING AUTOMATION IMPLEMENTATION ===');
  
  // Check for cron jobs
  const { data: cronJobs } = await supabase
    .from('cron_jobs')
    .select('*')
    .order('created_at');

  if (cronJobs && cronJobs.length > 0) {
    console.log('\nCron Jobs:');
    cronJobs.forEach(job => {
      console.log(`- ${job.name}: ${job.schedule} (${job.status})`);
    });
  } else {
    console.log('No cron jobs found');
  }

  // Check for any automation logs
  const { data: automationLogs } = await supabase
    .from('automation_logs')
    .select('*')
    .limit(5)
    .order('created_at', { ascending: false });

  if (automationLogs && automationLogs.length > 0) {
    console.log('\nRecent Automation Activity:');
    console.table(automationLogs);
  } else {
    console.log('No automation logs found');
  }

  // Check email queue
  console.log('\n\n=== EMAIL QUEUE STATUS ===');
  const { count: queueCount } = await supabase
    .from('email_queue')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Emails in queue: ${queueCount || 0}`);

  // Check email sends
  const { count: sendsCount } = await supabase
    .from('email_sends')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Total emails sent: ${sendsCount || 0}`);
}

analyzeSequences().catch(console.error);