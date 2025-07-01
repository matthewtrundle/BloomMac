#!/usr/bin/env node

/**
 * Test 3: Newsletter Signup Testing
 * Tests subscription, duplicate prevention, welcome emails, and rate limiting
 */

const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API_ENDPOINT = `${BASE_URL}/api/newsletter-signup`;

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

async function testNewsletterSignup() {
  console.log('\n📧 Testing Newsletter Signup API...\n');
  
  const testTimestamp = Date.now();
  const testEmail = `newsletter-test-${testTimestamp}@automated-test.com`;
  
  // Test 3.1: Valid newsletter signup
  console.log('Testing valid newsletter signup...\n');
  
  const validData = {
    email: testEmail,
    firstName: 'Newsletter',
    lastName: 'Tester',
    source: 'automated_test',
    interests: ['wellness', 'parenting']
  };
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validData)
    });
    
    const result = await response.json();
    
    logTest('Newsletter signup returns 200', response.status === 200);
    logTest('Response indicates success', result.success === true);
    logTest('Response includes subscriber ID', !!result.subscriberId);
    
    // Verify data in database
    await wait(1000);
    
    const { data: subscriber, error: dbError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', testEmail.toLowerCase())
      .single();
    
    logTest('Subscriber saved to database', !dbError && !!subscriber);
    logTest('Email saved correctly', subscriber?.email === testEmail.toLowerCase());
    logTest('First name saved correctly', subscriber?.first_name === validData.firstName);
    logTest('Last name saved correctly', subscriber?.last_name === validData.lastName);
    logTest('Status is active', subscriber?.status === 'active');
    logTest('Signup source recorded', subscriber?.signup_source === validData.source);
    
    // Check if welcome email sequence was triggered
    const { data: emailLog } = await supabase
      .from('email_logs')
      .select('*')
      .eq('recipient', testEmail.toLowerCase())
      .eq('type', 'newsletter_welcome')
      .single();
    
    logTest('Welcome email logged', !!emailLog);
    
  } catch (err) {
    logTest('Valid newsletter signup', false, err.message);
  }
  
  // Test 3.2: Duplicate prevention
  console.log('\n\nTesting duplicate prevention...\n');
  
  try {
    const duplicateResponse = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        firstName: 'Duplicate',
        lastName: 'Test'
      })
    });
    
    const duplicateResult = await duplicateResponse.json();
    
    logTest('Duplicate signup returns 409', duplicateResponse.status === 409);
    logTest('Error message mentions already subscribed', 
      duplicateResult.error?.includes('already subscribed'));
    
  } catch (err) {
    logTest('Duplicate prevention', false, err.message);
  }
  
  // Test 3.3: Reactivation of unsubscribed user
  console.log('\n\nTesting reactivation flow...\n');
  
  const reactivateEmail = `reactivate-${testTimestamp}@automated-test.com`;
  
  try {
    // First create and then deactivate a subscriber
    await supabase
      .from('subscribers')
      .insert({
        email: reactivateEmail,
        first_name: 'Inactive',
        last_name: 'User',
        status: 'unsubscribed'
      });
    
    // Try to sign up again
    const reactivateResponse = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: reactivateEmail,
        firstName: 'Reactivated',
        lastName: 'User'
      })
    });
    
    const reactivateResult = await reactivateResponse.json();
    
    logTest('Reactivation returns 200', reactivateResponse.status === 200);
    logTest('Response indicates reactivation', 
      reactivateResult.message?.includes('reactivated'));
    
    // Verify status updated
    const { data: reactivated } = await supabase
      .from('subscribers')
      .select('status')
      .eq('email', reactivateEmail)
      .single();
    
    logTest('Status updated to active', reactivated?.status === 'active');
    
  } catch (err) {
    logTest('Reactivation flow', false, err.message);
  }
  
  // Test 3.4: Email validation
  console.log('\n\nTesting email validation...\n');
  
  const invalidEmails = [
    'notanemail',
    'missing@domain',
    '@nodomain.com',
    'spaces in@email.com',
    'double@@at.com'
  ];
  
  for (const invalidEmail of invalidEmails) {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: invalidEmail,
          firstName: 'Test'
        })
      });
      
      logTest(`Rejects invalid email: ${invalidEmail}`, response.status === 400);
    } catch (err) {
      logTest(`Email validation for ${invalidEmail}`, false, err.message);
    }
  }
  
  // Test 3.5: Rate limiting (5 per hour)
  console.log('\n\nTesting rate limiting...\n');
  
  let rateLimitHit = false;
  const rateLimitIP = `newsletter-test-${testTimestamp}`;
  
  for (let i = 1; i <= 7; i++) {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Forwarded-For': rateLimitIP
        },
        body: JSON.stringify({
          email: `ratelimit-${i}-${testTimestamp}@test.com`,
          firstName: 'Rate',
          lastName: 'Test'
        })
      });
      
      if (response.status === 429) {
        logTest(`Rate limit enforced after ${i-1} requests`, i === 6);
        rateLimitHit = true;
        break;
      }
      
      await wait(100);
    } catch (err) {
      logTest('Rate limiting test', false, err.message);
      break;
    }
  }
  
  if (!rateLimitHit) {
    logTest('Rate limit enforced', false, 'Rate limit not triggered');
  }
  
  // Test 3.6: Field sanitization
  console.log('\n\nTesting field sanitization...\n');
  
  const sanitizationEmail = `sanitize-${testTimestamp}@test.com`;
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `  ${sanitizationEmail}  `, // Extra spaces
        firstName: '<script>alert("xss")</script>',
        lastName: 'Test\n\rNewlines'
      })
    });
    
    logTest('Accepts data needing sanitization', response.status === 200);
    
    const { data: sanitized } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', sanitizationEmail)
      .single();
    
    logTest('Email trimmed correctly', sanitized?.email === sanitizationEmail);
    logTest('XSS attempt sanitized', !sanitized?.first_name?.includes('<script>'));
    
  } catch (err) {
    logTest('Field sanitization', false, err.message);
  }
  
  // Cleanup
  console.log('\n\n🧹 Cleaning up test data...\n');
  
  try {
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .like('email', '%@automated-test.com')
      .like('email', '%@test.com');
    
    logTest('Test data cleaned up', !error);
  } catch (err) {
    console.log('⚠️  Cleanup failed:', err.message);
  }
  
  // Summary
  console.log('\n📊 Newsletter Signup Test Summary:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
testNewsletterSignup().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});