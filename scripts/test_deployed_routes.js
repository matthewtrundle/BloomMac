#!/usr/bin/env node

/**
 * Test deployed routes to ensure they're working
 * Run with: node scripts/test_deployed_routes.js [local|staging|production]
 */

const fetch = require('node-fetch');

const ENV = process.argv[2] || 'local';
const BASE_URL = {
  local: 'http://localhost:3000',
  staging: 'https://bloom-staging.vercel.app', // Update with your staging URL
  production: 'https://bloompsychologynorthaustin.com'
}[ENV];

if (!BASE_URL) {
  console.error('Invalid environment. Use: local, staging, or production');
  process.exit(1);
}

console.log(`🧪 Testing routes on: ${BASE_URL}\n`);

// Test configurations
const tests = [
  {
    name: 'Contact Form (Public)',
    endpoint: '/api/contact/submit',
    method: 'POST',
    body: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '555-0123',
      service: 'Individual Therapy',
      message: 'This is a test message',
      source: 'test-script'
    },
    expectedStatus: [200, 201],
    requiresAuth: false
  },
  {
    name: 'Newsletter Signup (Public)',
    endpoint: '/api/newsletter-signup',
    method: 'POST',
    body: {
      email: `test+${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User'
    },
    expectedStatus: [200],
    requiresAuth: false
  },
  {
    name: 'Track Event (Public)',
    endpoint: '/api/track-event',
    method: 'POST',
    body: {
      type: 'page_view',
      page: '/test',
      sessionId: 'test-session'
    },
    expectedStatus: [200],
    requiresAuth: false
  },
  {
    name: 'Admin Session Check',
    endpoint: '/api/admin/auth/session',
    method: 'GET',
    expectedStatus: [401, 200], // 401 if not logged in, 200 if logged in
    requiresAuth: true
  },
  {
    name: 'Analytics Dashboard',
    endpoint: '/api/analytics?range=7d',
    method: 'GET',
    expectedStatus: [200],
    requiresAuth: false
  },
  {
    name: 'Profile Update (Requires Auth)',
    endpoint: '/api/profile/update',
    method: 'POST',
    body: {
      firstName: 'Test',
      lastName: 'User'
    },
    expectedStatus: [401], // Should fail without auth
    requiresAuth: true
  }
];

// Test runner
async function runTest(test) {
  console.log(`\n🔍 Testing: ${test.name}`);
  console.log(`   ${test.method} ${test.endpoint}`);
  
  try {
    const options = {
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (test.body) {
      options.body = JSON.stringify(test.body);
    }
    
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}${test.endpoint}`, options);
    const duration = Date.now() - startTime;
    
    const body = await response.text();
    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch {
      parsedBody = body;
    }
    
    const success = test.expectedStatus.includes(response.status);
    const emoji = success ? '✅' : '❌';
    
    console.log(`   ${emoji} Status: ${response.status} (expected: ${test.expectedStatus.join(' or ')})`);
    console.log(`   ⏱️  Duration: ${duration}ms`);
    
    if (!success) {
      console.log(`   📋 Response:`, parsedBody);
    }
    
    return {
      test: test.name,
      success,
      status: response.status,
      duration,
      error: success ? null : parsedBody
    };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return {
      test: test.name,
      success: false,
      error: error.message
    };
  }
}

// Main execution
async function main() {
  const results = [];
  
  console.log('━'.repeat(50));
  console.log(`Testing ${tests.length} endpoints...`);
  console.log('━'.repeat(50));
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
  }
  
  // Summary
  console.log('\n' + '━'.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('━'.repeat(50));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${results.length}`);
  
  if (failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`\n- ${r.test}`);
      console.log(`  Status: ${r.status}`);
      console.log(`  Error:`, r.error);
    });
  }
  
  // Performance summary
  const avgDuration = results
    .filter(r => r.duration)
    .reduce((sum, r) => sum + r.duration, 0) / results.filter(r => r.duration).length;
    
  console.log(`\n⏱️  Average response time: ${Math.round(avgDuration)}ms`);
  
  // Exit code
  process.exit(failed > 0 ? 1 : 0);
}

// Check if we have node-fetch
try {
  require('node-fetch');
} catch {
  console.error('Please install node-fetch: npm install node-fetch@2');
  process.exit(1);
}

main().catch(console.error);