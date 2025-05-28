#!/usr/bin/env node

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const https = require('https');
const http = require('http');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3004; // Use a different port to avoid conflicts

// Configuration
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

async function testLogin() {
  console.log('🔍 Testing Admin Login Flow\n');
  console.log(`Credentials: ${adminEmail} / ${adminPassword}\n`);
  
  try {
    // Test 1: Test simple-login endpoint
    console.log('1️⃣  Testing POST /api/admin/simple-login');
    const loginData = JSON.stringify({
      email: adminEmail,
      password: adminPassword
    });
    
    const loginOptions = {
      hostname: hostname,
      port: port,
      path: '/api/admin/simple-login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    };
    
    console.log('   Waiting for server to be ready...');
    // Wait a bit for server to be ready
    await new Promise(resolve => setTimeout(resolve, 3000));
    
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
        hostname: hostname,
        port: port,
        path: '/api/analytics',
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
    
    // Test with wrong credentials
    console.log('\n5️⃣  Testing with Invalid Credentials');
    const badLoginData = JSON.stringify({
      email: adminEmail,
      password: 'wrong-password'
    });
    
    const badLoginOptions = {
      ...loginOptions,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': badLoginData.length
      }
    };
    
    const badLoginResponse = await makeRequest(badLoginOptions, badLoginData);
    console.log(`   Status: ${badLoginResponse.statusCode}`);
    
    if (badLoginResponse.statusCode === 401) {
      console.log(`   ✅ Correctly rejected invalid credentials`);
    } else {
      console.log(`   ❌ Unexpected status code for invalid credentials`);
    }
    
  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    console.error(error.stack);
  }
}

// Start Next.js server and run tests
async function main() {
  console.log('🚀 Starting Next.js test server...\n');
  
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();
  
  try {
    await app.prepare();
    
    createServer(async (req, res) => {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    }).listen(port, (err) => {
      if (err) throw err;
      console.log(`✅ Server ready on http://${hostname}:${port}\n`);
      
      // Run tests
      testLogin().then(() => {
        console.log('\n✅ Test completed');
        process.exit(0);
      }).catch(error => {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}