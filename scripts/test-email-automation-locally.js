#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { processScheduledEmails } = require('../lib/email-automation');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ANSI color codes for better readability
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkConfiguration() {
  log('\n📋 Checking Configuration...', 'cyan');
  
  const required = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'RESEND_API_KEY': process.env.RESEND_API_KEY,
    'NEXT_PUBLIC_BASE_URL': process.env.NEXT_PUBLIC_BASE_URL
  };

  let allPresent = true;
  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      log(`  ❌ ${key} is missing`, 'red');
      allPresent = false;
    } else {
      log(`  ✅ ${key} is configured`, 'green');
    }
  }

  return allPresent;
}

async function checkDatabaseTables() {
  log('\n🗄️  Checking Database Tables...', 'cyan');
  
  const tables = [
    'email_sequences',
    'sequence_emails',
    'email_automation_logs',
    'subscribers',
    'email_automation_errors'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        log(`  ❌ Table '${table}' is missing or inaccessible`, 'red');
      } else {
        log(`  ✅ Table '${table}' exists`, 'green');
      }
    } catch (e) {
      log(`  ❌ Error checking table '${table}': ${e.message}`, 'red');
    }
  }
}

async function checkActiveSequences() {
  log('\n📧 Checking Active Email Sequences...', 'cyan');
  
  const { data: sequences, error } = await supabase
    .from('email_sequences')
    .select(`
      *,
      sequence_emails (*)
    `)
    .eq('status', 'active');

  if (error) {
    log(`  ❌ Error fetching sequences: ${error.message}`, 'red');
    return [];
  }

  if (!sequences || sequences.length === 0) {
    log('  ⚠️  No active email sequences found', 'yellow');
    return [];
  }

  log(`  ✅ Found ${sequences.length} active sequence(s):`, 'green');
  
  sequences.forEach(seq => {
    log(`\n  📌 ${seq.name} (${seq.trigger})`, 'magenta');
    log(`     - ${seq.sequence_emails.length} email(s) configured`, 'blue');
    seq.sequence_emails.forEach(email => {
      const delay = email.delay_days > 0 
        ? `${email.delay_days} day(s)` 
        : `${email.delay_hours} hour(s)`;
      log(`       • "${email.subject}" - sends after ${delay}`, 'blue');
    });
  });

  return sequences;
}

async function checkSubscribers() {
  log('\n👥 Checking Subscribers...', 'cyan');
  
  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('status', 'active')
    .not('email', 'is', null)
    .not('email', 'eq', '');

  if (error) {
    log(`  ❌ Error fetching subscribers: ${error.message}`, 'red');
    return 0;
  }

  const validCount = subscribers?.length || 0;
  log(`  ✅ Found ${validCount} active subscriber(s) with valid emails`, 'green');

  // Check for invalid emails
  const { data: invalidEmails, error: invalidError } = await supabase
    .from('subscribers')
    .select('id, email')
    .or('email.is.null,email.eq.');

  if (!invalidError && invalidEmails && invalidEmails.length > 0) {
    log(`  ⚠️  Found ${invalidEmails.length} subscriber(s) with invalid/missing emails`, 'yellow');
  }

  return validCount;
}

async function checkRecentLogs() {
  log('\n📊 Checking Recent Email Logs...', 'cyan');
  
  const { data: recentLogs, error } = await supabase
    .from('email_automation_logs')
    .select('*')
    .order('sent_at', { ascending: false })
    .limit(5);

  if (error) {
    log(`  ❌ Error fetching logs: ${error.message}`, 'red');
    return;
  }

  if (!recentLogs || recentLogs.length === 0) {
    log('  ℹ️  No email automation logs found', 'blue');
    return;
  }

  log(`  📧 Recent email automation activity:`, 'green');
  recentLogs.forEach(log => {
    const date = new Date(log.sent_at).toLocaleString();
    const status = log.status === 'sent' ? '✅' : '❌';
    console.log(`     ${status} ${date} - Status: ${log.status}`);
  });
}

async function checkErrors() {
  log('\n⚠️  Checking Recent Errors...', 'cyan');
  
  const { data: errors, error } = await supabase
    .from('email_automation_errors')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    log(`  ❌ Error fetching error logs: ${error.message}`, 'red');
    return;
  }

  if (!errors || errors.length === 0) {
    log('  ✅ No recent errors found', 'green');
    return;
  }

  log(`  ❌ Found ${errors.length} recent error(s):`, 'red');
  errors.forEach(err => {
    const date = new Date(err.created_at).toLocaleString();
    log(`     • ${date}: ${err.error}`, 'yellow');
    if (err.error_details) {
      log(`       Details: ${JSON.stringify(err.error_details)}`, 'yellow');
    }
  });
}

async function simulateEmailAutomation() {
  log('\n🚀 Simulating Email Automation Process...', 'bright');
  
  try {
    log('  🔄 Running processScheduledEmails()...', 'blue');
    await processScheduledEmails();
    log('  ✅ Email automation process completed!', 'green');
  } catch (error) {
    log(`  ❌ Error during email automation: ${error.message}`, 'red');
    console.error(error);
  }
}

async function createTestData() {
  log('\n🧪 Creating Test Data...', 'cyan');
  
  const response = await prompt('Do you want to create test data? (y/n): ');
  if (response.toLowerCase() !== 'y') {
    return;
  }

  try {
    // Create a test sequence
    const { data: sequence, error: seqError } = await supabase
      .from('email_sequences')
      .insert({
        name: 'Test Welcome Sequence',
        description: 'Test sequence for email automation',
        trigger: 'newsletter_signup',
        status: 'active'
      })
      .select()
      .single();

    if (seqError) throw seqError;
    log('  ✅ Created test email sequence', 'green');

    // Create test emails for the sequence
    const emails = [
      {
        sequence_id: sequence.id,
        position: 1,
        subject: 'Welcome to Bloom Psychology!',
        content: '<h1>Welcome!</h1><p>Thank you for joining our newsletter.</p>',
        delay_hours: 0,
        delay_days: 0
      },
      {
        sequence_id: sequence.id,
        position: 2,
        subject: 'Your First Mental Health Tip',
        content: '<h1>Mental Health Tip #1</h1><p>Remember to take breaks throughout your day.</p>',
        delay_hours: 24,
        delay_days: 0
      }
    ];

    const { error: emailsError } = await supabase
      .from('sequence_emails')
      .insert(emails);

    if (emailsError) throw emailsError;
    log('  ✅ Created test emails for sequence', 'green');

    // Create a test subscriber
    const testEmail = `test-${Date.now()}@example.com`;
    const { error: subError } = await supabase
      .from('subscribers')
      .insert({
        email: testEmail,
        first_name: 'Test',
        last_name: 'User',
        status: 'active',
        source: 'test',
        created_at: new Date().toISOString()
      });

    if (subError) throw subError;
    log(`  ✅ Created test subscriber: ${testEmail}`, 'green');
    
    log('\n  ℹ️  Test data created! Run the automation test to see it in action.', 'blue');
    
  } catch (error) {
    log(`  ❌ Error creating test data: ${error.message}`, 'red');
  }
}

function prompt(question) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  log('\n🧪 Email Automation Testing Tool', 'bright');
  log('================================\n', 'bright');

  // Check configuration
  const configOk = await checkConfiguration();
  if (!configOk) {
    log('\n❌ Missing required configuration. Please check your .env.local file.', 'red');
    process.exit(1);
  }

  // Check database tables
  await checkDatabaseTables();

  // Check active sequences
  const sequences = await checkActiveSequences();

  // Check subscribers
  const subscriberCount = await checkSubscribers();

  // Check recent logs
  await checkRecentLogs();

  // Check errors
  await checkErrors();

  // Offer to create test data if needed
  if (sequences.length === 0 || subscriberCount === 0) {
    await createTestData();
  }

  // Ask if user wants to run the automation
  log('\n' + '='.repeat(50), 'bright');
  const runTest = await prompt('\nDo you want to run the email automation process now? (y/n): ');
  
  if (runTest.toLowerCase() === 'y') {
    await simulateEmailAutomation();
    
    // Check logs again after running
    log('\n📊 Checking logs after automation run...', 'cyan');
    await checkRecentLogs();
    await checkErrors();
  }

  log('\n✅ Testing complete!', 'green');
  process.exit(0);
}

// Run the main function
main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});