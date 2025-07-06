#!/usr/bin/env node

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3002';

// Test admin credentials
const adminCredentials = {
  email: 'testadmin@bloom.local',
  password: 'admin123!@#'
};

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
          body,
          cookies: res.headers['set-cookie'] || []
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

// Extract admin token from cookies
function extractAdminToken(cookies) {
  for (const cookie of cookies) {
    if (cookie.includes('adminToken=')) {
      return cookie.split('adminToken=')[1].split(';')[0];
    }
  }
  return null;
}

// Test functions
async function testAdminLogin() {
  console.log('\n🔐 Testing Admin Login...\n');
  
  const response = await makeRequest('/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(adminCredentials)
  });
  
  if (response.status === 200) {
    const data = JSON.parse(response.body);
    const adminToken = extractAdminToken(response.cookies);
    
    console.log('✅ Admin login successful');
    console.log(`   Email: ${data.email}`);
    console.log(`   Role: ${data.role}`);
    console.log(`   Token received: ${!!adminToken}`);
    
    return { success: true, adminToken };
  } else {
    console.log(`❌ Admin login failed: ${response.status}`);
    console.log(response.body);
    return { success: false };
  }
}

async function testAdminSession(adminToken) {
  console.log('\n👤 Testing Admin Session...\n');
  
  const response = await makeRequest('/api/admin/auth/session', {
    headers: {
      'Cookie': `adminToken=${adminToken}`
    }
  });
  
  if (response.status === 200) {
    const data = JSON.parse(response.body);
    console.log('✅ Admin session valid');
    console.log(`   User: ${data.email}`);
    console.log(`   Role: ${data.role}`);
    return { success: true };
  } else {
    console.log(`❌ Session check failed: ${response.status}`);
    return { success: false };
  }
}

async function testProtectedEndpoints(adminToken) {
  console.log('\n🔒 Testing Protected Endpoints...\n');
  
  const endpoints = [
    { path: '/api/admin/contacts', name: 'Contacts' },
    { path: '/api/admin/careers', name: 'Careers' },
    { path: '/api/admin/analytics', name: 'Analytics' }
  ];
  
  let allPassed = true;
  
  for (const endpoint of endpoints) {
    const response = await makeRequest(endpoint.path, {
      headers: {
        'Cookie': `adminToken=${adminToken}`
      }
    });
    
    if (response.status === 200 || response.status === 404) {
      console.log(`✅ ${endpoint.name} endpoint accessible`);
    } else {
      console.log(`❌ ${endpoint.name} endpoint returned ${response.status}`);
      allPassed = false;
    }
  }
  
  return { success: allPassed };
}

async function testUnauthorizedAccess() {
  console.log('\n🚫 Testing Unauthorized Access...\n');
  
  const response = await makeRequest('/api/admin/contacts');
  
  if (response.status === 401) {
    console.log('✅ Unauthorized access properly blocked');
    return { success: true };
  } else {
    console.log(`❌ Expected 401, got ${response.status}`);
    return { success: false };
  }
}

async function testAdminLogout(adminToken) {
  console.log('\n🚪 Testing Admin Logout...\n');
  
  const response = await makeRequest('/api/admin/auth/logout', {
    method: 'POST',
    headers: {
      'Cookie': `adminToken=${adminToken}`
    }
  });
  
  if (response.status === 200) {
    console.log('✅ Admin logout successful');
    
    // Verify token is cleared
    const hasTokenClear = response.headers['set-cookie']?.some(cookie => 
      cookie.includes('adminToken=') && cookie.includes('Max-Age=0')
    );
    
    if (hasTokenClear) {
      console.log('✅ Admin token properly cleared');
    }
    
    return { success: true };
  } else {
    console.log(`❌ Logout failed: ${response.status}`);
    return { success: false };
  }
}

async function testClientManagement(adminToken) {
  console.log('\n📋 Testing Client Management Access...\n');
  
  const response = await makeRequest('/api/admin/contacts', {
    headers: {
      'Cookie': `adminToken=${adminToken}`
    }
  });
  
  if (response.status === 200) {
    const data = JSON.parse(response.body);
    console.log('✅ Client data accessible');
    console.log(`   Total contacts: ${data.length}`);
    return { success: true };
  } else {
    console.log(`❌ Client management failed: ${response.status}`);
    return { success: false };
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Provider Dashboard Testing Suite');
  console.log('=' .repeat(50));
  console.log(`Target: ${BASE_URL}`);
  console.log(`Date: ${new Date().toISOString()}`);
  
  let results = {
    passed: 0,
    failed: 0
  };
  
  // Test 1: Unauthorized access
  const unauth = await testUnauthorizedAccess();
  unauth.success ? results.passed++ : results.failed++;
  
  // Test 2: Admin login
  const login = await testAdminLogin();
  if (!login.success) {
    console.log('\n❌ Cannot continue without successful login');
    return;
  }
  results.passed++;
  
  const { adminToken } = login;
  
  // Test 3: Admin session
  const session = await testAdminSession(adminToken);
  session.success ? results.passed++ : results.failed++;
  
  // Test 4: Protected endpoints
  const protected = await testProtectedEndpoints(adminToken);
  protected.success ? results.passed++ : results.failed++;
  
  // Test 5: Client management
  const clients = await testClientManagement(adminToken);
  clients.success ? results.passed++ : results.failed++;
  
  // Test 6: Admin logout
  const logout = await testAdminLogout(adminToken);
  logout.success ? results.passed++ : results.failed++;
  
  // Summary
  console.log('\n📊 Test Summary');
  console.log('=' .repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  
  const successRate = Math.round((results.passed / (results.passed + results.failed)) * 100);
  console.log(`\n🎯 Success Rate: ${successRate}%`);
  
  if (successRate === 100) {
    console.log('🎉 All tests passed!');
  } else if (successRate >= 80) {
    console.log('✅ Most tests passed');
  } else {
    console.log('❌ Several tests failed');
  }
  
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run the tests
runTests().catch(console.error);