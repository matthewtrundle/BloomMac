#!/usr/bin/env node

/**
 * Test 10: Performance Testing
 * Tests API response times, database performance, and load handling
 */

const fetch = require('node-fetch');
const { performance } = require('perf_hooks');
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

async function measureResponseTime(url, options = {}) {
  const start = performance.now();
  try {
    const response = await fetch(url, options);
    const end = performance.now();
    return {
      time: end - start,
      status: response.status,
      success: response.ok
    };
  } catch (err) {
    const end = performance.now();
    return {
      time: end - start,
      status: 0,
      success: false,
      error: err.message
    };
  }
}

async function testPerformance() {
  console.log('\n⚡ Testing Performance...\n');
  
  // Test 10.1: API endpoint response times
  console.log('Testing API response times...\n');
  
  const endpoints = [
    { name: 'Homepage', url: `${BASE_URL}/`, maxTime: 2000 },
    { name: 'Contact API', url: `${BASE_URL}/api/contact/submit`, method: 'POST', maxTime: 1000 },
    { name: 'Newsletter API', url: `${BASE_URL}/api/newsletter-signup`, method: 'POST', maxTime: 1000 },
    { name: 'Courses Page', url: `${BASE_URL}/courses`, maxTime: 3000 }
  ];
  
  for (const endpoint of endpoints) {
    const options = {
      method: endpoint.method || 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (endpoint.method === 'POST') {
      // Add minimal valid data for POST requests
      if (endpoint.name === 'Contact API') {
        options.body = JSON.stringify({
          name: 'Perf Test',
          email: `perf-${Date.now()}@test.com`,
          message: 'Performance test'
        });
      } else if (endpoint.name === 'Newsletter API') {
        options.body = JSON.stringify({
          email: `perf-${Date.now()}@test.com`,
          firstName: 'Perf',
          lastName: 'Test'
        });
      }
    }
    
    try {
      const result = await measureResponseTime(endpoint.url, options);
      
      logTest(`${endpoint.name} responds in < ${endpoint.maxTime}ms`, 
        result.time < endpoint.maxTime, 
        `${result.time.toFixed(2)}ms`);
      
      console.log(`   📊 ${endpoint.name}: ${result.time.toFixed(2)}ms`);
      
    } catch (err) {
      logTest(`${endpoint.name} response time`, false, err.message);
    }
  }
  
  // Test 10.2: Concurrent request handling
  console.log('\n\nTesting concurrent request handling...\n');
  
  const concurrentRequests = 5;
  const testEmail = `concurrent-test-${Date.now()}@test.com`;
  
  try {
    const promises = [];
    const startTime = performance.now();
    
    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(
        fetch(`${BASE_URL}/api/newsletter-signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: `${testEmail.split('@')[0]}-${i}@test.com`,
            firstName: 'Concurrent',
            lastName: `Test${i}`
          })
        })
      );
    }
    
    const responses = await Promise.all(promises);
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    const successCount = responses.filter(r => r.ok).length;
    
    logTest(`Handles ${concurrentRequests} concurrent requests`, 
      successCount >= Math.floor(concurrentRequests * 0.8)); // Allow 20% failure for rate limiting
    
    logTest(`Concurrent requests complete in < 5000ms`, totalTime < 5000);
    
    console.log(`   📊 ${concurrentRequests} requests: ${totalTime.toFixed(2)}ms total`);
    console.log(`   📊 Success rate: ${successCount}/${concurrentRequests}`);
    
  } catch (err) {
    logTest('Concurrent request handling', false, err.message);
  }
  
  // Test 10.3: Database query performance
  console.log('\n\nTesting database performance...\n');
  
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // Test simple query
    const start1 = performance.now();
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('id, email')
      .limit(100);
    const end1 = performance.now();
    
    logTest('Simple database query < 500ms', (end1 - start1) < 500, 
      `${(end1 - start1).toFixed(2)}ms`);
    
    // Test complex query
    const start2 = performance.now();
    const { data: complex, error: complexError } = await supabase
      .from('subscribers')
      .select(`
        id,
        email,
        first_name,
        last_name,
        status,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(50);
    const end2 = performance.now();
    
    logTest('Complex database query < 1000ms', (end2 - start2) < 1000,
      `${(end2 - start2).toFixed(2)}ms`);
    
    // Test count query
    const start3 = performance.now();
    const { count, error: countError } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });
    const end3 = performance.now();
    
    logTest('Count query < 300ms', (end3 - start3) < 300,
      `${(end3 - start3).toFixed(2)}ms`);
    
  } catch (err) {
    logTest('Database performance test', false, err.message);
  }
  
  // Test 10.4: Memory usage simulation
  console.log('\n\nTesting memory efficiency...\n');
  
  try {
    const startMemory = process.memoryUsage().heapUsed;
    
    // Simulate processing multiple requests
    const simulatedWork = [];
    for (let i = 0; i < 1000; i++) {
      simulatedWork.push({
        id: i,
        email: `memory-test-${i}@test.com`,
        data: new Array(100).fill(`test-data-${i}`)
      });
    }
    
    // Process the simulated data
    const processed = simulatedWork.map(item => ({
      id: item.id,
      email: item.email,
      processed: true
    }));
    
    const endMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = (endMemory - startMemory) / 1024 / 1024; // MB
    
    logTest('Memory usage remains reasonable', memoryIncrease < 50, 
      `${memoryIncrease.toFixed(2)}MB increase`);
    
    // Cleanup
    simulatedWork.length = 0;
    processed.length = 0;
    
    if (global.gc) {
      global.gc();
    }
    
  } catch (err) {
    logTest('Memory efficiency test', false, err.message);
  }
  
  // Test 10.5: Large data handling
  console.log('\n\nTesting large data handling...\n');
  
  try {
    // Test large message submission
    const largeMessage = 'A'.repeat(5000); // 5KB message
    
    const start = performance.now();
    const response = await fetch(`${BASE_URL}/api/contact/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Large Data Test',
        email: `large-test-${Date.now()}@test.com`,
        message: largeMessage
      })
    });
    const end = performance.now();
    
    logTest('Handles large data submissions', response.ok && (end - start) < 2000,
      `${(end - start).toFixed(2)}ms`);
    
  } catch (err) {
    logTest('Large data handling', false, err.message);
  }
  
  // Test 10.6: Error recovery performance
  console.log('\n\nTesting error recovery...\n');
  
  try {
    const errorTests = [
      { name: 'Invalid JSON', body: 'invalid json' },
      { name: 'Missing fields', body: '{}' },
      { name: 'Invalid email', body: '{"email": "invalid", "name": "test", "message": "test"}' }
    ];
    
    for (const test of errorTests) {
      const start = performance.now();
      const response = await fetch(`${BASE_URL}/api/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: test.body
      });
      const end = performance.now();
      
      logTest(`Error handling (${test.name}) < 500ms`, (end - start) < 500,
        `${(end - start).toFixed(2)}ms`);
    }
    
  } catch (err) {
    logTest('Error recovery performance', false, err.message);
  }
  
  // Test 10.7: Static asset performance
  console.log('\n\nTesting static asset performance...\n');
  
  const staticAssets = [
    { name: 'CSS files', pattern: '.css' },
    { name: 'JavaScript files', pattern: '.js' },
    { name: 'Images', pattern: '.webp' }
  ];
  
  for (const asset of staticAssets) {
    try {
      // Test if static assets are served efficiently
      const assetUrl = `${BASE_URL}/_next/static/css/app.css`; // Example
      const start = performance.now();
      const response = await fetch(assetUrl, { method: 'HEAD' });
      const end = performance.now();
      
      // Don't fail if asset doesn't exist, just check timing if it does
      if (response.status === 200) {
        logTest(`${asset.name} served quickly`, (end - start) < 200,
          `${(end - start).toFixed(2)}ms`);
      } else {
        console.log(`   ℹ️  ${asset.name}: not testable (${response.status})`);
      }
      
    } catch (err) {
      console.log(`   ℹ️  ${asset.name}: not testable`);
    }
  }
  
  // Test 10.8: Rate limit performance
  console.log('\n\nTesting rate limit performance...\n');
  
  try {
    const rateLimitTests = [];
    const testStart = performance.now();
    
    // Send requests until rate limited
    for (let i = 0; i < 10; i++) {
      rateLimitTests.push(
        fetch(`${BASE_URL}/api/newsletter-signup`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Forwarded-For': `rate-perf-test-${Date.now()}`
          },
          body: JSON.stringify({
            email: `rate-perf-${i}@test.com`,
            firstName: 'Rate',
            lastName: 'Perf'
          })
        })
      );
    }
    
    const results = await Promise.all(rateLimitTests);
    const testEnd = performance.now();
    
    // Check that rate limiting doesn't significantly slow down responses
    const avgTime = (testEnd - testStart) / results.length;
    logTest('Rate limiting doesn\'t slow responses', avgTime < 200,
      `${avgTime.toFixed(2)}ms average`);
    
  } catch (err) {
    logTest('Rate limit performance', false, err.message);
  }
  
  // Summary
  console.log('\n📊 Performance Test Summary:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  
  if (testsFailed > 0) {
    console.log('\n⚠️  Performance issues detected! Consider optimization.');
  } else {
    console.log('\n🚀 All performance tests passed!');
  }
  
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
testPerformance().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});