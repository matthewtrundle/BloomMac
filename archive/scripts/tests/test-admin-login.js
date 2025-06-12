#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Configuration
const host = 'localhost';
const port = 3003;
const adminEmail = 'admin@bloom.com';
const adminPassword = 'bloom-admin-2024';

// Helper function to make HTTP requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
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
      full: cookie,
      attributes: parts.slice(1).map(attr => attr.trim())
    };
  });
  
  return cookies;
}

// Extract JWT payload
function parseJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { error: 'Invalid JWT format' };
    }
    
    const payload = Buffer.from(parts[1], 'base64').toString('utf8');
    return JSON.parse(payload);
  } catch (error) {
    return { error: error.message };
  }
}

async function testAdminLogin() {
  console.log('🔍 Testing Admin Login Flow\n');
  console.log(`Server: http://${host}:${port}`);
  console.log(`Credentials: ${adminEmail} / ${adminPassword}\n`);
  
  try {
    // Step 1: Test login endpoint
    console.log('1️⃣  Testing POST /api/admin/login');
    const loginData = JSON.stringify({
      email: adminEmail,
      password: adminPassword
    });
    
    const loginOptions = {
      hostname: host,
      port: port,
      path: '/api/admin/simple-login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    };
    
    const loginResponse = await makeRequest(loginOptions, loginData);
    
    console.log(`   Status: ${loginResponse.statusCode}`);
    console.log(`   Response: ${loginResponse.data}`);
    
    // Parse response
    let responseData;
    try {
      responseData = JSON.parse(loginResponse.data);
      console.log(`   Parsed: ${JSON.stringify(responseData, null, 2)}`);
    } catch (e) {
      console.log(`   ❌ Failed to parse response as JSON`);
    }
    
    // Check cookies
    console.log('\n2️⃣  Checking Cookies');
    const cookies = parseCookies(loginResponse.headers);
    console.log(`   Cookies found: ${Object.keys(cookies).join(', ') || 'None'}`);
    
    if (cookies['adminToken']) {
      console.log(`   ✅ adminToken cookie found`);
      console.log(`   Cookie attributes: ${cookies['adminToken'].attributes.join(', ')}`);
      
      // Parse JWT
      console.log('\n3️⃣  Parsing JWT Token');
      const jwtPayload = parseJWT(cookies['adminToken'].value);
      if (jwtPayload.error) {
        console.log(`   ❌ JWT parsing error: ${jwtPayload.error}`);
      } else {
        console.log(`   ✅ JWT payload: ${JSON.stringify(jwtPayload, null, 2)}`);
        
        // Check expiration
        if (jwtPayload.exp) {
          const expDate = new Date(jwtPayload.exp * 1000);
          console.log(`   Expires: ${expDate.toISOString()}`);
          console.log(`   Valid for: ${Math.floor((expDate - new Date()) / 1000 / 60)} minutes`);
        }
      }
      
      // Test protected route with cookie
      console.log('\n4️⃣  Testing Protected Route Access');
      const protectedOptions = {
        hostname: host,
        port: port,
        path: '/api/admin/analytics',
        method: 'GET',
        headers: {
          'Cookie': cookies['adminToken'].full
        }
      };
      
      const protectedResponse = await makeRequest(protectedOptions);
      console.log(`   Status: ${protectedResponse.statusCode}`);
      
      if (protectedResponse.statusCode === 200) {
        console.log(`   ✅ Successfully accessed protected route`);
      } else {
        console.log(`   ❌ Failed to access protected route`);
        console.log(`   Response: ${protectedResponse.data}`);
      }
      
    } else {
      console.log(`   ❌ No adminToken cookie found in response`);
      console.log(`   Available cookies: ${JSON.stringify(cookies, null, 2)}`);
    }
    
    // Check redirect behavior
    console.log('\n5️⃣  Checking Response Headers');
    console.log(`   Location header: ${loginResponse.headers.location || 'None'}`);
    console.log(`   Content-Type: ${loginResponse.headers['content-type']}`);
    
    // Additional debugging info
    console.log('\n6️⃣  Additional Debug Info');
    console.log(`   All response headers: ${JSON.stringify(loginResponse.headers, null, 2)}`);
    
  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    console.error(error.stack);
  }
}

// Run the test
testAdminLogin().then(() => {
  console.log('\n✅ Test completed');
}).catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});