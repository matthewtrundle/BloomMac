#!/usr/bin/env node

/**
 * Simple test script to verify the admin login flow
 * Run this while your Next.js dev server is running on port 3003
 */

const http = require('http');

// Configuration
const host = 'localhost';
const port = 3003;
const adminEmail = 'admin@bloom.com';
const adminPassword = 'bloom-admin-2024';

// Helper function to make HTTP requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

// Parse cookies from response headers
function parseCookies(headers) {
  const cookies = {};
  const setCookieHeaders = headers['set-cookie'] || [];
  
  setCookieHeaders.forEach(cookie => {
    const parts = cookie.split(';');
    const [name, value] = parts[0].split('=');
    cookies[name.trim()] = {
      value: value,
      full: cookie
    };
  });
  
  return cookies;
}

async function testFlow() {
  console.log('🧪 Admin Login Flow Test\n');
  console.log('Prerequisites:');
  console.log('- Next.js dev server running on port 3003');
  console.log(`- Credentials: ${adminEmail} / ${adminPassword}\n`);
  
  try {
    // Step 1: Test login
    console.log('Step 1: Testing login endpoint');
    const loginData = JSON.stringify({
      email: adminEmail,
      password: adminPassword
    });
    
    const loginResponse = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/admin/simple-login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    }, loginData);
    
    console.log(`✓ Login response: ${loginResponse.statusCode}`);
    
    if (loginResponse.statusCode !== 200) {
      console.log('✗ Login failed:', loginResponse.data);
      return;
    }
    
    const cookies = parseCookies(loginResponse.headers);
    const adminToken = cookies['adminToken'];
    
    if (!adminToken) {
      console.log('✗ No adminToken cookie in response');
      return;
    }
    
    console.log('✓ adminToken cookie received');
    
    // Step 2: Test protected route
    console.log('\nStep 2: Testing protected route access');
    const protectedResponse = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/test-analytics',
      method: 'GET',
      headers: {
        'Cookie': `adminToken=${adminToken.value}`
      }
    });
    
    console.log(`✓ Protected route response: ${protectedResponse.statusCode}`);
    
    if (protectedResponse.statusCode === 200) {
      const data = JSON.parse(protectedResponse.data);
      console.log('✓ Protected route data:', JSON.stringify(data, null, 2));
    }
    
    // Step 3: Test invalid credentials
    console.log('\nStep 3: Testing invalid credentials');
    const badResponse = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/admin/simple-login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, JSON.stringify({
      email: adminEmail,
      password: 'wrong-password'
    }));
    
    console.log(`✓ Invalid login response: ${badResponse.statusCode}`);
    
    if (badResponse.statusCode === 401) {
      console.log('✓ Correctly rejected invalid credentials');
    }
    
    // Step 4: Test admin page redirect
    console.log('\nStep 4: Testing admin page access without cookie');
    const adminPageResponse = await makeRequest({
      hostname: host,
      port: port,
      path: '/admin/analytics',
      method: 'GET'
    });
    
    if (adminPageResponse.statusCode === 307 || adminPageResponse.statusCode === 302) {
      console.log('✓ Correctly redirected to login when not authenticated');
      console.log(`  Redirect location: ${adminPageResponse.headers.location}`);
    }
    
    // Step 5: Test admin page with cookie
    console.log('\nStep 5: Testing admin page access with cookie');
    const adminPageAuthResponse = await makeRequest({
      hostname: host,
      port: port,
      path: '/admin/analytics',
      method: 'GET',
      headers: {
        'Cookie': `adminToken=${adminToken.value}`
      }
    });
    
    if (adminPageAuthResponse.statusCode === 200) {
      console.log('✓ Successfully accessed admin page with valid cookie');
    } else {
      console.log(`✗ Admin page returned status ${adminPageAuthResponse.statusCode}`);
    }
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    console.log('\nMake sure the Next.js dev server is running on port 3003');
  }
}

// Run tests
console.log('='.repeat(50));
testFlow();