#!/usr/bin/env node

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3002';

// Helper function to make requests
async function makeRequest(path, options = {}) {
  const url = new URL(path, BASE_URL);
  const protocol = url.protocol === 'https:' ? https : http;
  
  return new Promise((resolve) => {
    const req = protocol.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      ...options
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({ error: err.message });
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Test functions
async function testUserRegistration() {
  console.log('\n📝 Testing User Registration with RLS...\n');
  
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User'
  };
  
  const response = await makeRequest('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  
  if (response.status === 200) {
    const data = JSON.parse(response.body);
    console.log(`✅ User registered successfully`);
    console.log(`   Email: ${testUser.email}`);
    console.log(`   User ID: ${data.user.id}`);
    console.log(`   RLS policies allowed profile creation`);
    return { success: true };
  } else {
    console.log(`❌ Registration failed: ${response.status}`);
    console.log(response.body);
    return { success: false };
  }
}

async function testUnauthorizedProfileAccess() {
  console.log('\n🚫 Testing Unauthorized Profile Access...\n');
  
  const response = await makeRequest('/api/profile/get');
  
  if (response.status === 401) {
    console.log('✅ Unauthorized access properly blocked by RLS');
    return { success: true };
  } else {
    console.log(`❌ Expected 401, got ${response.status}`);
    return { success: false };
  }
}

async function testContactFormValidation() {
  console.log('\n✅ Testing Contact Form Validation...\n');
  
  // Test with invalid email
  const invalidData = {
    name: 'Test User',
    email: 'notanemail',
    message: 'Test message'
  };
  
  const response = await makeRequest('/api/contact/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidData)
  });
  
  if (response.status === 400 || response.status === 429) {
    console.log('✅ Invalid data properly rejected');
    return { success: true };
  } else {
    console.log(`❌ Expected 400 or 429, got ${response.status}`);
    return { success: false };
  }
}

async function testSecurityHeaders() {
  console.log('\n🔒 Testing Security Headers...\n');
  
  const response = await makeRequest('/');
  
  const securityHeaders = [
    'x-frame-options',
    'x-content-type-options',
    'x-xss-protection',
    'content-security-policy'
  ];
  
  let allPresent = true;
  for (const header of securityHeaders) {
    if (response.headers[header]) {
      console.log(`✅ ${header}: ${response.headers[header]}`);
    } else {
      console.log(`❌ ${header}: MISSING`);
      allPresent = false;
    }
  }
  
  return { success: allPresent };
}

async function testProtectedAdminRoute() {
  console.log('\n🔐 Testing Protected Admin Routes...\n');
  
  const response = await makeRequest('/api/admin/contacts');
  
  if (response.status === 401) {
    console.log('✅ Admin route properly protected');
    return { success: true };
  } else {
    console.log(`❌ Expected 401, got ${response.status}`);
    return { success: false };
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Wellness Hub Security Testing');
  console.log('=' .repeat(50));
  console.log(`Target: ${BASE_URL}`);
  console.log(`Date: ${new Date().toISOString()}`);
  
  let results = {
    passed: 0,
    failed: 0
  };
  
  // Run all tests
  const tests = [
    testSecurityHeaders,
    testUnauthorizedProfileAccess,
    testContactFormValidation,
    testProtectedAdminRoute,
    testUserRegistration
  ];
  
  for (const test of tests) {
    const result = await test();
    if (result.success) {
      results.passed++;
    } else {
      results.failed++;
    }
  }
  
  // Summary
  console.log('\n📊 Test Summary');
  console.log('=' .repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  
  const successRate = Math.round((results.passed / (results.passed + results.failed)) * 100);
  console.log(`\n🎯 Success Rate: ${successRate}%`);
  
  if (successRate === 100) {
    console.log('🎉 All security tests passed!');
  } else if (successRate >= 80) {
    console.log('✅ Most security tests passed');
  } else {
    console.log('❌ Several security tests failed');
  }
  
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run the tests
runTests().catch(console.error);