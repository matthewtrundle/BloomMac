#!/usr/bin/env node
/**
 * Simple test - no external dependencies
 */

const http = require('http');

console.log('\n🧪 Simple Onboarding Test\n');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3027';

// Test cases
const testCases = [
  {
    name: 'Normal user',
    data: {
      firstName: 'Test',
      lastName: 'User',
      childrenCount: 2,
      phone: '5551234567'
    }
  },
  {
    name: 'Special characters',
    data: {
      firstName: "Jean-François",
      lastName: "O'Connor",
      childrenCount: 1,
      phone: '555-123-4567'
    }
  },
  {
    name: 'Expecting mother',
    data: {
      firstName: 'Sarah',
      lastName: 'Smith',
      childrenCount: 0,
      isExpecting: true,
      phone: '5551234567'
    }
  }
];

function makeRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 3027,
      path: '/api/profile/save',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: body
        });
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log(`Testing: ${BASE_URL}/api/profile/save\n`);
  
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      console.log(`Testing: ${testCase.name}`);
      const result = await makeRequest(testCase.data);
      
      if (result.status === 200) {
        console.log('✅ PASS');
        passed++;
      } else {
        console.log(`❌ FAIL (${result.status}): ${result.data}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
      failed++;
    }
    console.log('');
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed!');
  }
}

runTests().catch(console.error);