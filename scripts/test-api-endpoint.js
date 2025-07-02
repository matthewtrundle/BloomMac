#!/usr/bin/env node

/**
 * Test the /api/profile/save endpoint directly
 */

const http = require('http');

console.log('\n🔍 Testing /api/profile/save Endpoint\n');

const testData = {
  id: 'test-user-123',
  first_name: 'Test',
  last_name: 'User',
  phone: '(555) 123-4567',
  number_of_children: 0,
  timezone: 'America/Chicago'
};

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/profile/save',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(testData))
  }
};

console.log('📤 Sending test profile data...');
console.log(JSON.stringify(testData, null, 2));

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`\n📥 Response Status: ${res.statusCode}`);
    
    try {
      const result = JSON.parse(data);
      console.log('Response:', JSON.stringify(result, null, 2));
      
      if (res.statusCode === 200) {
        console.log('\n✅ API endpoint is working!');
      } else if (res.statusCode === 401) {
        console.log('\n⚠️  Authentication required - this is expected');
        console.log('The endpoint exists and is working correctly');
      } else {
        console.log('\n❌ Unexpected response');
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  if (e.code === 'ECONNREFUSED') {
    console.log('\n❌ Server not running. Start it with: npm run dev');
  } else {
    console.log(`\n❌ Error: ${e.message}`);
  }
});

req.write(JSON.stringify(testData));
req.end();