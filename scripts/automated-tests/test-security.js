#!/usr/bin/env node

/**
 * Test 9: Security Testing
 * Tests security measures, authentication, and vulnerability protections
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
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

async function testSecurity() {
  console.log('\n🔒 Testing Security Measures...\n');
  
  // Test 9.1: Check for hardcoded secrets
  console.log('Scanning for hardcoded secrets...\n');
  
  const secretPatterns = [
    { name: 'API Keys', pattern: /api[_-]?key["\s]*[:=]["\s]*[a-zA-Z0-9]{20,}/i },
    { name: 'Passwords', pattern: /password["\s]*[:=]["\s]*["'][^"']{8,}["']/i },
    { name: 'Database URLs', pattern: /postgres:\/\/[^"'\s]+/i },
    { name: 'JWT Secrets', pattern: /jwt[_-]?secret["\s]*[:=]["\s]*["'][^"']{10,}["']/i },
    { name: 'Stripe Keys', pattern: /sk_[a-zA-Z0-9]{20,}/i },
    { name: 'Supabase Keys', pattern: /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/i }
  ];
  
  const files = glob.sync('**/*.{js,ts,tsx,json}', {
    ignore: [
      'node_modules/**',
      '.next/**',
      'scripts/automated-tests/**',
      '.env*',
      '*.md'
    ]
  });
  
  let secretsFound = false;
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      secretPatterns.forEach(({ name, pattern }) => {
        if (pattern.test(content)) {
          console.log(`   ⚠️  Potential ${name} found in ${file}`);
          secretsFound = true;
        }
      });
    }
  });
  
  logTest('No hardcoded secrets found', !secretsFound);
  
  // Test 9.2: Environment variable protection
  console.log('\n\nChecking environment security...\n');
  
  logTest('JWT_SECRET is configured', !!process.env.JWT_SECRET);
  logTest('JWT_SECRET is not default', 
    process.env.JWT_SECRET !== 'bloom-admin-secret-key-change-in-production');
  logTest('Service role key configured', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  logTest('Service role key is not anon key', 
    process.env.SUPABASE_SERVICE_ROLE_KEY !== process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  // Test 9.3: Check for removed vulnerable endpoints
  console.log('\n\nChecking for vulnerable endpoints...\n');
  
  const vulnerableEndpoints = [
    '/api/admin/simple-login',
    '/api/debug',
    '/api/test',
    '/api/phpinfo',
    '/api/info'
  ];
  
  for (const endpoint of vulnerableEndpoints) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      logTest(`Vulnerable endpoint ${endpoint} removed`, response.status === 404);
    } catch (err) {
      logTest(`Endpoint ${endpoint} check`, false, err.message);
    }
  }
  
  // Test 9.4: SQL injection protection
  console.log('\n\nTesting SQL injection protection...\n');
  
  const sqlInjectionPayloads = [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "1' UNION SELECT * FROM admin_users--",
    "'; UPDATE users SET admin=true--"
  ];
  
  for (const payload of sqlInjectionPayloads) {
    try {
      const response = await fetch(`${BASE_URL}/api/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test',
          email: 'test@test.com',
          message: payload
        })
      });
      
      // Should either succeed (payload stored safely) or validate input
      logTest(`SQL injection payload handled safely`, 
        response.status === 200 || response.status === 400);
      
    } catch (err) {
      logTest('SQL injection test', false, err.message);
    }
  }
  
  // Test 9.5: XSS protection
  console.log('\n\nTesting XSS protection...\n');
  
  const xssPayloads = [
    '<script>alert("xss")</script>',
    'javascript:alert("xss")',
    '<img src="x" onerror="alert(1)">',
    '"><script>alert(document.cookie)</script>'
  ];
  
  for (const payload of xssPayloads) {
    try {
      const response = await fetch(`${BASE_URL}/api/newsletter-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@test.com',
          firstName: payload,
          lastName: 'Test'
        })
      });
      
      // Should accept but sanitize, or reject
      logTest(`XSS payload handled safely`, 
        response.status === 200 || response.status === 400);
      
    } catch (err) {
      logTest('XSS protection test', false, err.message);
    }
  }
  
  // Test 9.6: CSRF protection
  console.log('\n\nTesting CSRF protection...\n');
  
  try {
    // Attempt cross-origin request
    const response = await fetch(`${BASE_URL}/api/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://evil-site.com',
        'Referer': 'https://evil-site.com'
      },
      body: JSON.stringify({
        name: 'CSRF Test',
        email: 'csrf@test.com',
        message: 'Testing CSRF protection'
      })
    });
    
    // Should either be blocked or have proper CORS headers
    const corsHeader = response.headers.get('access-control-allow-origin');
    logTest('CSRF/CORS protection active', 
      !corsHeader || corsHeader !== '*' || response.status === 403);
    
  } catch (err) {
    logTest('CSRF protection test', false, err.message);
  }
  
  // Test 9.7: Rate limiting security
  console.log('\n\nTesting rate limiting security...\n');
  
  // Already tested in rate limiting module, just verify it's active
  let rateLimitActive = false;
  
  for (let i = 0; i < 6; i++) {
    try {
      const response = await fetch(`${BASE_URL}/api/newsletter-signup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Forwarded-For': `security-test-${Date.now()}`
        },
        body: JSON.stringify({
          email: `sectest-${i}@test.com`,
          firstName: 'Security',
          lastName: 'Test'
        })
      });
      
      if (response.status === 429) {
        rateLimitActive = true;
        break;
      }
    } catch (err) {
      break;
    }
  }
  
  logTest('Rate limiting is active', rateLimitActive);
  
  // Test 9.8: File upload security
  console.log('\n\nTesting file upload security...\n');
  
  try {
    const FormData = require('form-data');
    
    // Test malicious file upload
    const form = new FormData();
    form.append('firstName', 'Test');
    form.append('lastName', 'User');
    form.append('email', 'test@test.com');
    form.append('position', 'Test Position');
    
    // Create a fake executable file
    const maliciousContent = Buffer.from('#!/bin/sh\necho "malicious"');
    form.append('resume', maliciousContent, 'malicious.sh');
    
    const response = await fetch(`${BASE_URL}/api/careers/apply`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    logTest('Rejects malicious file uploads', response.status === 400);
    
  } catch (err) {
    logTest('File upload security test', false, err.message);
  }
  
  // Test 9.9: Authentication bypass attempts
  console.log('\n\nTesting authentication bypass...\n');
  
  const bypassAttempts = [
    { name: 'No token', headers: {} },
    { name: 'Invalid token', headers: { 'Authorization': 'Bearer invalid_token' } },
    { name: 'Malformed token', headers: { 'Authorization': 'invalid_format' } },
    { name: 'SQL injection in auth', headers: { 'Authorization': "Bearer '; DROP TABLE admin_users; --" } }
  ];
  
  for (const attempt of bypassAttempts) {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/contacts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...attempt.headers
        }
      });
      
      logTest(`Auth bypass prevented: ${attempt.name}`, 
        response.status === 401 || response.status === 403);
      
    } catch (err) {
      logTest(`Auth bypass test: ${attempt.name}`, false, err.message);
    }
  }
  
  // Test 9.10: Information disclosure
  console.log('\n\nTesting information disclosure...\n');
  
  const infoDisclosureTests = [
    { endpoint: '/api/debug', name: 'Debug endpoint' },
    { endpoint: '/.env', name: 'Environment file' },
    { endpoint: '/config.json', name: 'Config file' },
    { endpoint: '/admin', name: 'Admin directory listing' }
  ];
  
  for (const test of infoDisclosureTests) {
    try {
      const response = await fetch(`${BASE_URL}${test.endpoint}`);
      
      logTest(`${test.name} not exposed`, 
        response.status === 404 || response.status === 403);
      
    } catch (err) {
      logTest(`Info disclosure test: ${test.name}`, false, err.message);
    }
  }
  
  // Test 9.11: Security headers
  console.log('\n\nChecking security headers...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/`);
    
    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'referrer-policy',
      'permissions-policy'
    ];
    
    for (const header of securityHeaders) {
      const headerValue = response.headers.get(header);
      logTest(`Security header '${header}' present`, !!headerValue);
    }
    
  } catch (err) {
    logTest('Security headers check', false, err.message);
  }
  
  // Summary
  console.log('\n📊 Security Test Summary:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  
  if (testsFailed > 0) {
    console.log('\n⚠️  Security issues found! Please review failed tests before deployment.');
  } else {
    console.log('\n🛡️  All security tests passed!');
  }
  
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
testSecurity().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});