#!/usr/bin/env node

/**
 * Test 2: Contact Form Testing
 * Tests form submission, data storage, email triggers, and rate limiting
 */

const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API_ENDPOINT = `${BASE_URL}/api/contact/submit`;

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

async function testContactForm() {
  console.log('\n📝 Testing Contact Form API...\n');
  
  const testTimestamp = Date.now();
  const testEmail = `contact-test-${testTimestamp}@automated-test.com`;
  
  // Test 2.1: Valid submission
  console.log('Testing valid form submission...\n');
  
  const validData = {
    name: 'Test User',
    email: testEmail,
    phone: '555-0123',
    service: 'General Inquiry',
    message: `Automated test submission at ${new Date().toISOString()}`
  };
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validData)
    });
    
    const result = await response.json();
    
    logTest('Form submission returns 200', response.status === 200);
    logTest('Response has success property', result.success === true);
    logTest('Response has submission_id', !!result.submission_id);
    
    // Verify data in database
    await wait(1000); // Give DB time to process
    
    const { data: submission, error: dbError } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('email', testEmail)
      .single();
    
    logTest('Submission saved to database', !dbError && !!submission);
    logTest('Name saved correctly', submission?.name === validData.name);
    logTest('Email saved correctly', submission?.email === validData.email);
    logTest('Phone saved correctly', submission?.phone === validData.phone);
    logTest('Service saved correctly', submission?.service === validData.service);
    logTest('Message saved correctly', submission?.message === validData.message);
    logTest('Status is "new"', submission?.status === 'new');
    
    // Check email automation trigger
    const { data: trigger, error: triggerError } = await supabase
      .from('email_automation_triggers')
      .select('*')
      .eq('trigger_type', 'contact_form')
      .order('triggered_at', { ascending: false })
      .limit(1)
      .single();
    
    logTest('Email automation trigger created', !triggerError && !!trigger);
    
    // Check subscriber was created/updated
    const { data: subscriber } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', testEmail)
      .single();
    
    logTest('Subscriber record created', !!subscriber);
    logTest('Subscriber source is contact_form', subscriber?.source === 'contact_form');
    
  } catch (err) {
    logTest('Valid submission test', false, err.message);
  }
  
  // Test 2.2: Invalid submissions
  console.log('\n\nTesting form validation...\n');
  
  const invalidTests = [
    {
      name: 'Missing name',
      data: { email: 'test@test.com', message: 'Test' },
      expectedStatus: 400
    },
    {
      name: 'Missing email',
      data: { name: 'Test', message: 'Test' },
      expectedStatus: 400
    },
    {
      name: 'Missing message',
      data: { name: 'Test', email: 'test@test.com' },
      expectedStatus: 400
    },
    {
      name: 'Invalid email format',
      data: { name: 'Test', email: 'notanemail', message: 'Test' },
      expectedStatus: 400
    }
  ];
  
  for (const test of invalidTests) {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.data)
      });
      
      logTest(`Validation: ${test.name}`, response.status === test.expectedStatus);
    } catch (err) {
      logTest(`Validation: ${test.name}`, false, err.message);
    }
  }
  
  // Test 2.3: Rate limiting
  console.log('\n\nTesting rate limiting (3 per hour)...\n');
  
  const rateLimitEmail = `ratelimit-${Date.now()}@test.com`;
  let rateLimitHit = false;
  
  for (let i = 1; i <= 5; i++) {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Forwarded-For': `rate-limit-test-${testTimestamp}` // Unique IP for this test
        },
        body: JSON.stringify({
          name: `Rate Test ${i}`,
          email: rateLimitEmail,
          phone: '555-0124',
          service: 'Rate Limit Test',
          message: `Rate limit test ${i}`
        })
      });
      
      if (response.status === 429) {
        logTest(`Rate limit enforced after ${i-1} requests`, i === 4);
        rateLimitHit = true;
        
        // Check rate limit headers
        const retryAfter = response.headers.get('retry-after');
        const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
        
        logTest('Rate limit headers present', !!retryAfter && rateLimitRemaining === '0');
        break;
      }
      
      await wait(100); // Small delay between requests
    } catch (err) {
      logTest('Rate limiting test', false, err.message);
      break;
    }
  }
  
  if (!rateLimitHit) {
    logTest('Rate limit enforced', false, 'Rate limit not triggered after 5 attempts');
  }
  
  // Test 2.4: Concurrent submissions
  console.log('\n\nTesting concurrent submissions...\n');
  
  const concurrentPromises = [];
  for (let i = 0; i < 3; i++) {
    concurrentPromises.push(
      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Concurrent Test ${i}`,
          email: `concurrent-${i}-${testTimestamp}@test.com`,
          phone: '555-0125',
          service: 'Concurrent Test',
          message: `Concurrent submission ${i}`
        })
      })
    );
  }
  
  try {
    const responses = await Promise.all(concurrentPromises);
    const successCount = responses.filter(r => r.status === 200).length;
    logTest('Handles concurrent submissions', successCount >= 2);
  } catch (err) {
    logTest('Handles concurrent submissions', false, err.message);
  }
  
  // Cleanup test data
  console.log('\n\n🧹 Cleaning up test data...\n');
  
  try {
    // Delete test submissions
    const { error: deleteError } = await supabase
      .from('contact_submissions')
      .delete()
      .like('email', '%@automated-test.com');
    
    // Delete test subscribers
    const { error: deleteSubError } = await supabase
      .from('subscribers')
      .delete()
      .like('email', '%@automated-test.com');
    
    logTest('Test data cleaned up', !deleteError && !deleteSubError);
  } catch (err) {
    console.log('⚠️  Cleanup failed:', err.message);
  }
  
  // Summary
  console.log('\n📊 Contact Form Test Summary:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
testContactForm().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});