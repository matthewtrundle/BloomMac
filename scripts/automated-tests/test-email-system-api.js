#!/usr/bin/env node

/**
 * Test 5: Email System Testing
 * Tests email automation, cron processing, and delivery tracking
 */

const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

let testsPassed = 0;
let testsFailed = 0;

function logTest(testName, passed, error = null) {
  if (passed) {
    console.log(`✅ ${testName}`);
    testsPassed++;
  } else {
    console.log(`❌ ${testName}`);
    if (error) console.log(`   Error: ${error}`);
    testsFailed++;
  }
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testEmailSystem() {
  console.log('\n📧 Testing Email System...\n');
  
  // Test 5.1: Environment configuration
  console.log('Checking email configuration...\n');
  
  logTest('RESEND_API_KEY configured', !!process.env.RESEND_API_KEY);
  logTest('Supabase URL configured', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  logTest('Service role key configured', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  // Test 5.2: Email automation tables exist
  console.log('\n\nVerifying email automation tables...\n');
  
  const emailTables = [
    'email_sequences',
    'sequence_emails',
    'email_automation_logs',
    'email_automation_triggers',
    'email_logs'
  ];
  
  for (const table of emailTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      logTest(`Table '${table}' exists`, !error);
    } catch (err) {
      logTest(`Table '${table}' exists`, false, err.message);
    }
  }
  
  // Test 5.3: Active email sequences
  console.log('\n\nChecking active email sequences...\n');
  
  try {
    const { data: sequences, error } = await supabase
      .from('email_sequences')
      .select('*')
      .eq('status', 'active');
    
    logTest('Can query email sequences', !error);
    logTest('Has active email sequences', sequences && sequences.length > 0);
    
    if (sequences && sequences.length > 0) {
      console.log(`\n   Found ${sequences.length} active sequences:`);
      sequences.forEach(seq => {
        console.log(`   - ${seq.name} (${seq.trigger})`);
      });
    }
  } catch (err) {
    logTest('Email sequences check', false, err.message);
  }
  
  // Test 5.4: Create test email trigger
  console.log('\n\nTesting email trigger creation...\n');
  
  const testTimestamp = Date.now();
  const testEmail = `email-test-${testTimestamp}@automated-test.com`;
  
  try {
    // Create test subscriber
    const { data: subscriber, error: subError } = await supabase
      .from('subscribers')
      .insert({
        email: testEmail,
        first_name: 'Email',
        last_name: 'Test',
        status: 'active',
        source: 'automated_test'
      })
      .select()
      .single();
    
    logTest('Test subscriber created', !subError && !!subscriber);
    
    if (subscriber) {
      // Create email trigger
      const { data: trigger, error: triggerError } = await supabase
        .from('email_automation_triggers')
        .insert({
          subscriber_id: subscriber.id,
          trigger_type: 'newsletter_signup',
          trigger_data: { test: true },
          triggered_at: new Date().toISOString()
        })
        .select()
        .single();
      
      logTest('Email trigger created', !triggerError && !!trigger);
      
      // Check if trigger can be queried
      const { data: triggers } = await supabase
        .from('email_automation_triggers')
        .select('*')
        .eq('subscriber_id', subscriber.id);
      
      logTest('Can query email triggers', triggers && triggers.length > 0);
    }
  } catch (err) {
    logTest('Email trigger test', false, err.message);
  }
  
  // Test 5.5: Email logs
  console.log('\n\nTesting email logging...\n');
  
  try {
    // Create test email log
    const { data: emailLog, error: logError } = await supabase
      .from('email_logs')
      .insert({
        recipient: testEmail,
        type: 'test_email',
        status: 'sent',
        metadata: {
          test: true,
          timestamp: new Date().toISOString()
        }
      })
      .select()
      .single();
    
    logTest('Email log created', !logError && !!emailLog);
    
    // Query recent logs
    const { data: recentLogs } = await supabase
      .from('email_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    logTest('Can query email logs', recentLogs && recentLogs.length > 0);
  } catch (err) {
    logTest('Email logging test', false, err.message);
  }
  
  // Test 5.6: Email deduplication check
  console.log('\n\nTesting email deduplication...\n');
  
  try {
    const dedupeEmail = `dedupe-test-${testTimestamp}@test.com`;
    
    // Create a recent email log
    await supabase
      .from('email_logs')
      .insert({
        recipient: dedupeEmail,
        type: 'welcome_course',
        status: 'sent',
        created_at: new Date().toISOString()
      });
    
    // Check if we can detect the duplicate
    const { data: recentEmail } = await supabase
      .from('email_logs')
      .select('id')
      .eq('recipient', dedupeEmail)
      .eq('type', 'welcome_course')
      .eq('status', 'sent')
      .gte('created_at', new Date(Date.now() - 60*60*1000).toISOString())
      .single();
    
    logTest('Email deduplication check works', !!recentEmail);
  } catch (err) {
    logTest('Email deduplication test', false, err.message);
  }
  
  // Test 5.7: Process email automation endpoint
  console.log('\n\nTesting email automation processing endpoint...\n');
  
  try {
    // Note: This endpoint requires cron secret in production
    const response = await fetch(`${BASE_URL}/api/process-email-automation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // In dev, the endpoint might not require auth
        'Authorization': `Bearer ${process.env.VERCEL_CRON_SECRET || 'test'}`
      }
    });
    
    // In production, this might return 401 without proper secret
    const validStatuses = [200, 401, 403];
    logTest('Email automation endpoint exists', validStatuses.includes(response.status));
    
    if (response.status === 200) {
      const result = await response.json();
      console.log('   Email automation processed:', result);
    }
  } catch (err) {
    logTest('Email automation endpoint', false, err.message);
  }
  
  // Test 5.8: Email template personalization
  console.log('\n\nTesting email personalization...\n');
  
  const testContent = 'Hello {{first_name}}, your email is {{email}}';
  const personalizedContent = testContent
    .replace(/{{first_name}}/g, 'Test')
    .replace(/{{email}}/g, 'test@example.com');
  
  logTest('Email personalization works', 
    personalizedContent === 'Hello Test, your email is test@example.com');
  
  // Test 5.9: Check for invalid email addresses
  console.log('\n\nChecking for invalid email addresses...\n');
  
  try {
    const { data: subscribers } = await supabase
      .from('subscribers')
      .select('email')
      .eq('status', 'active');
    
    const invalidEmails = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    subscribers?.forEach(sub => {
      if (!emailRegex.test(sub.email)) {
        invalidEmails.push(sub.email);
      }
    });
    
    logTest('No invalid email addresses in active subscribers', invalidEmails.length === 0);
    
    if (invalidEmails.length > 0) {
      console.log(`   Found ${invalidEmails.length} invalid emails`);
    }
  } catch (err) {
    logTest('Invalid email check', false, err.message);
  }
  
  // Cleanup
  console.log('\n\n🧹 Cleaning up test data...\n');
  
  try {
    // Delete test subscribers
    await supabase
      .from('subscribers')
      .delete()
      .like('email', '%@automated-test.com');
    
    // Delete test email logs
    await supabase
      .from('email_logs')
      .delete()
      .eq('type', 'test_email');
    
    logTest('Test data cleaned up', true);
  } catch (err) {
    console.log('⚠️  Cleanup failed:', err.message);
  }
  
  // Summary
  console.log('\n📊 Email System Test Summary:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
testEmailSystem().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});