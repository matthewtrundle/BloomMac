#!/usr/bin/env node

/**
 * Test 6: Rate Limiting Testing
 * Comprehensive tests for all rate-limited endpoints
 */

const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

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

async function testRateLimit(endpoint, method, body, limit, testName) {
  console.log(`\nTesting ${testName} (limit: ${limit} per hour)...\n`);
  
  const testIP = `rate-limit-test-${Date.now()}-${Math.random()}`;
  let hitLimit = false;
  let successCount = 0;
  
  for (let i = 1; i <= limit + 2; i++) {
    try {
      // Modify body for each request to avoid other validations
      const requestBody = { ...body };
      if (requestBody.email) {
        requestBody.email = `test-${i}-${Date.now()}@ratelimit.com`;
      }
      
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': testIP
        },
        body: JSON.stringify(requestBody)
      });
      
      if (response.status === 429) {
        logTest(`${testName}: Rate limit hit after ${successCount} requests`, successCount === limit);
        
        // Check rate limit headers
        const retryAfter = response.headers.get('retry-after');
        const remaining = response.headers.get('x-ratelimit-remaining');
        const resetTime = response.headers.get('x-ratelimit-reset');
        
        logTest(`${testName}: Rate limit headers present`, 
          !!retryAfter && remaining === '0' && !!resetTime);
        
        // Test that subsequent requests also get rate limited
        const response2 = await fetch(`${BASE_URL}${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'X-Forwarded-For': testIP
          },
          body: JSON.stringify(requestBody)
        });
        
        logTest(`${testName}: Continues to rate limit`, response2.status === 429);
        
        hitLimit = true;
        break;
      } else if (response.status === 200 || response.status === 201) {
        successCount++;
      }
      
      await wait(50); // Small delay between requests
    } catch (err) {
      logTest(`${testName}: Request ${i}`, false, err.message);
    }
  }
  
  if (!hitLimit) {
    logTest(`${testName}: Rate limit enforcement`, false, 'Limit not reached');
  }
}

async function testRateLimiting() {
  console.log('\n🚦 Testing Rate Limiting on All Endpoints...\n');
  
  const testTimestamp = Date.now();
  
  // Test configurations
  const endpoints = [
    {
      name: 'Contact Form',
      endpoint: '/api/contact/submit',
      method: 'POST',
      body: {
        name: 'Rate Test',
        email: `test@example.com`,
        message: 'Testing rate limits'
      },
      limit: 3
    },
    {
      name: 'Newsletter Signup',
      endpoint: '/api/newsletter-signup',
      method: 'POST',
      body: {
        email: `test@example.com`,
        firstName: 'Rate',
        lastName: 'Test'
      },
      limit: 5
    },
    {
      name: 'Email Send',
      endpoint: '/api/send-email',
      method: 'POST',
      body: {
        email: `test@example.com`,
        name: 'Rate Test',
        message: 'Testing'
      },
      limit: 10 // Per minute, so we'll test quickly
    }
  ];
  
  // Test each endpoint
  for (const config of endpoints) {
    await testRateLimit(
      config.endpoint,
      config.method,
      config.body,
      config.limit,
      config.name
    );
  }
  
  // Test 6.1: Rate limit reset after time window
  console.log('\n\nTesting rate limit reset (this will take 1 minute)...\n');
  
  // Skip this test in CI or if SKIP_LONG_TESTS is set
  if (process.env.CI || process.env.SKIP_LONG_TESTS) {
    console.log('⏭️  Skipping rate limit reset test (long duration)');
  } else {
    const resetTestIP = `reset-test-${testTimestamp}`;
    
    // Hit the rate limit
    for (let i = 0; i < 12; i++) {
      await fetch(`${BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': resetTestIP
        },
        body: JSON.stringify({
          email: `reset-${i}@test.com`,
          name: 'Reset Test',
          message: 'Testing reset'
        })
      });
    }
    
    console.log('   Waiting 61 seconds for rate limit window to reset...');
    await wait(61000);
    
    // Try again after window reset
    const resetResponse = await fetch(`${BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': resetTestIP
      },
      body: JSON.stringify({
        email: 'afterreset@test.com',
        name: 'After Reset',
        message: 'Should work now'
      })
    });
    
    logTest('Rate limit resets after time window', resetResponse.status === 200);
  }
  
  // Test 6.2: Different IPs have separate limits
  console.log('\n\nTesting separate rate limits per IP...\n');
  
  const ip1 = `ip1-${testTimestamp}`;
  const ip2 = `ip2-${testTimestamp}`;
  
  // Hit limit on IP1
  for (let i = 0; i < 4; i++) {
    await fetch(`${BASE_URL}/api/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': ip1
      },
      body: JSON.stringify({
        name: 'IP1 Test',
        email: `ip1-${i}@test.com`,
        message: 'Testing IP1'
      })
    });
  }
  
  // IP2 should still work
  const ip2Response = await fetch(`${BASE_URL}/api/contact/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-For': ip2
    },
    body: JSON.stringify({
      name: 'IP2 Test',
      email: 'ip2@test.com',
      message: 'Testing IP2'
    })
  });
  
  logTest('Different IPs have separate rate limits', ip2Response.status === 200);
  
  // Test 6.3: Rate limit error messages
  console.log('\n\nTesting rate limit error messages...\n');
  
  const errorTestIP = `error-test-${testTimestamp}`;
  
  // Hit the limit
  for (let i = 0; i < 4; i++) {
    await fetch(`${BASE_URL}/api/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': errorTestIP
      },
      body: JSON.stringify({
        name: 'Error Test',
        email: `error-${i}@test.com`,
        message: 'Testing errors'
      })
    });
  }
  
  // Get the error response
  const errorResponse = await fetch(`${BASE_URL}/api/contact/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-For': errorTestIP
    },
    body: JSON.stringify({
      name: 'Error Test',
      email: 'error-final@test.com',
      message: 'Should get error'
    })
  });
  
  const errorData = await errorResponse.json();
  
  logTest('Rate limit returns proper error message', 
    errorData.error && errorData.error.includes('Too many'));
  logTest('Error message includes retry time', 
    errorData.message && (errorData.message.includes('Try again') || errorData.message.includes('wait')));
  
  // Summary
  console.log('\n📊 Rate Limiting Test Summary:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
testRateLimiting().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});