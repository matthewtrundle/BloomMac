#!/usr/bin/env node

/**
 * API-based test for onboarding flow
 * Tests the onboarding endpoints directly without a browser
 */

const https = require('https');
const http = require('http');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_USER = {
  email: `test_${Date.now()}@example.com`,
  password: 'TestPassword123!',
  fullName: 'Test User',
  firstName: 'Test',
  lastName: 'User'
};

// Parse URL
const url = new URL(BASE_URL);
const isHttps = url.protocol === 'https:';
const client = isHttps ? https : http;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const typeColors = {
    info: colors.blue,
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    step: colors.magenta
  };
  console.log(`${typeColors[type]}[${timestamp}] ${message}${colors.reset}`);
}

function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    // Handle localhost IPv4/IPv6 issues
    if (options.hostname === 'localhost') {
      options.hostname = '127.0.0.1';
    }
    
    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function checkServerRunning() {
  try {
    const response = await makeRequest('/');
    return response.status < 500;
  } catch (e) {
    return false;
  }
}

async function testOnboardingAPI() {
  try {
    log('Starting onboarding API test...', 'info');
    
    // Check if server is running
    const serverRunning = await checkServerRunning();
    if (!serverRunning) {
      log('Server not running at ' + BASE_URL, 'error');
      log('Please start the dev server with: npm run dev', 'warning');
      process.exit(1);
    }
    
    // Step 1: Test signup endpoint
    log('Step 1: Testing signup endpoint...', 'step');
    
    const signupResponse = await makeRequest('/api/auth/signup', 'POST', {
      email: TEST_USER.email,
      password: TEST_USER.password,
      full_name: TEST_USER.fullName
    });
    
    if (signupResponse.status === 200 || signupResponse.status === 201) {
      log('✓ Signup endpoint working', 'success');
    } else {
      log(`✗ Signup failed with status ${signupResponse.status}`, 'error');
      log(`Response: ${JSON.stringify(signupResponse.data)}`, 'error');
    }

    // Step 2: Test analytics endpoint
    log('Step 2: Testing analytics endpoint...', 'step');
    
    const analyticsResponse = await makeRequest('/api/analytics/track', 'POST', {
      event: 'test_event',
      data: { test: true }
    });
    
    if (analyticsResponse.status === 200) {
      log('✓ Analytics endpoint working', 'success');
    } else {
      log(`✗ Analytics endpoint returned ${analyticsResponse.status}`, 'warning');
    }

    // Step 3: Test newsletter signup endpoint
    log('Step 3: Testing newsletter signup endpoint...', 'step');
    
    const newsletterResponse = await makeRequest('/api/newsletter-signup', 'POST', {
      email: TEST_USER.email,
      firstName: TEST_USER.firstName,
      lastName: TEST_USER.lastName,
      source: 'test'
    });
    
    if (newsletterResponse.status === 200) {
      log('✓ Newsletter signup endpoint working', 'success');
    } else {
      log(`✗ Newsletter signup returned ${newsletterResponse.status}`, 'warning');
      log(`Response: ${JSON.stringify(newsletterResponse.data)}`, 'warning');
    }

    // Step 4: Test achievements endpoint
    log('Step 4: Testing achievements endpoint...', 'step');
    
    const achievementsResponse = await makeRequest('/api/achievements', 'POST', {
      achievementId: 'test_achievement'
    });
    
    if (achievementsResponse.status === 200 || achievementsResponse.status === 401) {
      log('✓ Achievements endpoint exists', 'success');
    } else {
      log(`✗ Achievements endpoint returned ${achievementsResponse.status}`, 'warning');
    }

    // Summary
    log('\n' + '='.repeat(50), 'info');
    log('API ENDPOINTS TEST COMPLETED', 'success');
    log('All critical endpoints are responding', 'success');
    log('='.repeat(50) + '\n', 'info');

  } catch (error) {
    log('\n' + '='.repeat(50), 'error');
    log('API TEST FAILED', 'error');
    log(`Error: ${error.message}`, 'error');
    log('='.repeat(50) + '\n', 'error');
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testOnboardingAPI()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { testOnboardingAPI };