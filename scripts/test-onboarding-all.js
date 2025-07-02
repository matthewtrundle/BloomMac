#!/usr/bin/env node
/**
 * Comprehensive Onboarding Test Runner
 * Tests all edge cases, validation, and multiple user scenarios
 */

const chalk = require('chalk');
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Test scenarios
const testScenarios = [
  {
    name: 'Expecting mother with 0 children',
    data: {
      firstName: "Sarah-Jane",
      lastName: "O'Connor",
      childrenCount: 0,
      isExpecting: true,
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      phone: '(555) 123-4567',
      emergencyName: 'John Smith',
      emergencyPhone: '555-987-6543'
    }
  },
  {
    name: 'Special characters in names',
    data: {
      firstName: "Jean-François",
      lastName: "D'Amico-López",
      childrenCount: 2,
      isExpecting: false,
      phone: '555.234.5678',
      emergencyName: "Anne-Marie O'Brien",
      emergencyPhone: '(555) 345-6789'
    }
  },
  {
    name: 'Maximum children (7+)',
    data: {
      firstName: "Max",
      lastName: "Children",
      childrenCount: 8,
      isExpecting: true,
      dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      phone: '5551234567'
    }
  },
  {
    name: 'International phone numbers',
    data: {
      firstName: "International",
      lastName: "User",
      childrenCount: 1,
      isExpecting: false,
      phone: '+44 20 7946 0958',
      emergencyName: 'Emergency Contact',
      emergencyPhone: '+33 1 42 86 82 00'
    }
  },
  {
    name: 'Minimal required fields',
    data: {
      firstName: "Min",
      lastName: "User",
      childrenCount: 1,
      isExpecting: false,
      phone: '5559999999'
    }
  }
];

// Validation test cases
const validationTests = [
  {
    name: 'Empty first name',
    data: { firstName: '', lastName: 'Test', childrenCount: 1, phone: '5551234567' },
    shouldFail: true,
    expectedError: 'First name is required'
  },
  {
    name: 'Empty last name',
    data: { firstName: 'Test', lastName: '', childrenCount: 1, phone: '5551234567' },
    shouldFail: true,
    expectedError: 'Last name is required'
  },
  {
    name: 'Invalid phone',
    data: { firstName: 'Test', lastName: 'User', childrenCount: 1, phone: '123' },
    shouldFail: true,
    expectedError: 'Invalid phone number'
  },
  {
    name: 'Negative children count',
    data: { firstName: 'Test', lastName: 'User', childrenCount: -1, phone: '5551234567' },
    shouldFail: true,
    expectedError: 'Invalid children count'
  },
  {
    name: 'SQL injection attempt',
    data: { 
      firstName: "'; DROP TABLE profiles; --", 
      lastName: 'User', 
      childrenCount: 1, 
      phone: '5551234567' 
    },
    shouldFail: false // Should be sanitized, not fail
  },
  {
    name: 'XSS attempt',
    data: { 
      firstName: '<script>alert("xss")</script>', 
      lastName: 'User', 
      childrenCount: 1, 
      phone: '5551234567' 
    },
    shouldFail: false // Should be sanitized, not fail
  }
];

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  errors: []
};

// Helper functions
async function testProfileSave(testCase) {
  try {
    console.log(chalk.blue(`\n🧪 Testing: ${testCase.name}`));
    console.log(chalk.gray('Data:', JSON.stringify(testCase.data, null, 2)));

    const response = await axios.post(`${BASE_URL}/api/profile/save`, testCase.data, {
      headers: {
        'Content-Type': 'application/json',
        // Note: In real test, you'd need to handle auth properly
        'Cookie': 'sb-access-token=test-token'
      },
      validateStatus: () => true // Don't throw on error status
    });

    const success = response.status === 200;
    const shouldSucceed = !testCase.shouldFail;

    if (success === shouldSucceed) {
      console.log(chalk.green(`✅ Test passed`));
      results.passed++;
      return true;
    } else {
      console.log(chalk.red(`❌ Test failed`));
      console.log(chalk.red(`   Expected: ${shouldSucceed ? 'success' : 'failure'}`));
      console.log(chalk.red(`   Got: ${success ? 'success' : 'failure'}`));
      console.log(chalk.red(`   Response:`, response.data));
      results.failed++;
      results.errors.push({
        test: testCase.name,
        expected: shouldSucceed ? 'success' : 'failure',
        got: success ? 'success' : 'failure',
        response: response.data
      });
      return false;
    }
  } catch (error) {
    console.log(chalk.red(`❌ Test error: ${error.message}`));
    results.failed++;
    results.errors.push({
      test: testCase.name,
      error: error.message
    });
    return false;
  }
}

async function runConcurrentTests() {
  console.log(chalk.yellow('\n🚀 Running concurrent user simulation...'));
  
  const concurrentUsers = 5;
  const promises = [];
  
  for (let i = 0; i < concurrentUsers; i++) {
    const userData = {
      firstName: `Concurrent${i}`,
      lastName: 'User',
      childrenCount: i + 1,
      isExpecting: false,
      phone: `555123456${i}`
    };
    
    promises.push(
      axios.post(`${BASE_URL}/api/profile/save`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `sb-access-token=test-token-${i}`
        },
        validateStatus: () => true
      })
    );
  }
  
  try {
    const responses = await Promise.all(promises);
    const allSuccessful = responses.every(r => r.status === 200);
    
    if (allSuccessful) {
      console.log(chalk.green(`✅ All ${concurrentUsers} concurrent requests succeeded`));
      results.passed++;
    } else {
      console.log(chalk.red(`❌ Some concurrent requests failed`));
      results.failed++;
    }
  } catch (error) {
    console.log(chalk.red(`❌ Concurrent test error: ${error.message}`));
    results.failed++;
  }
}

async function runAllTests() {
  console.log(chalk.bold.cyan('\n🏁 Starting Comprehensive Onboarding Tests\n'));
  console.log(chalk.gray(`Testing against: ${BASE_URL}`));
  console.log(chalk.gray('=' .repeat(50)));

  // Test successful scenarios
  console.log(chalk.bold.yellow('\n📋 Testing Success Scenarios:'));
  for (const scenario of testScenarios) {
    await testProfileSave(scenario);
  }

  // Test validation scenarios
  console.log(chalk.bold.yellow('\n🛡️  Testing Validation Scenarios:'));
  for (const validation of validationTests) {
    await testProfileSave(validation);
  }

  // Test concurrent users
  await runConcurrentTests();

  // Print summary
  console.log(chalk.bold.cyan('\n📊 Test Summary:'));
  console.log(chalk.gray('=' .repeat(50)));
  console.log(chalk.green(`✅ Passed: ${results.passed}`));
  console.log(chalk.red(`❌ Failed: ${results.failed}`));
  console.log(chalk.blue(`📝 Total: ${results.passed + results.failed}`));
  
  if (results.errors.length > 0) {
    console.log(chalk.red('\n❌ Errors:'));
    results.errors.forEach((error, index) => {
      console.log(chalk.red(`\n${index + 1}. ${error.test}`));
      console.log(chalk.gray(JSON.stringify(error, null, 2)));
    });
  }

  // Save detailed report
  const fs = require('fs');
  const reportPath = 'test-results/onboarding-test-report.json';
  fs.mkdirSync('test-results', { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      passed: results.passed,
      failed: results.failed,
      total: results.passed + results.failed
    },
    scenarios: testScenarios,
    validationTests,
    errors: results.errors
  }, null, 2));
  
  console.log(chalk.gray(`\n📄 Detailed report saved to: ${reportPath}`));
  
  // Exit with proper code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Check if API is running
async function checkAPIHealth() {
  try {
    await axios.get(`${BASE_URL}/api/health`);
    return true;
  } catch (error) {
    console.log(chalk.yellow('⚠️  API health check failed, continuing anyway...'));
    return true; // Continue anyway
  }
}

// Main execution
(async () => {
  try {
    // Check if the API is running
    const apiHealthy = await checkAPIHealth();
    if (!apiHealthy) {
      console.log(chalk.red('❌ API is not running. Please start the server first.'));
      console.log(chalk.gray('Run: npm run dev'));
      process.exit(1);
    }

    // Run all tests
    await runAllTests();
  } catch (error) {
    console.error(chalk.red('Fatal error:', error));
    process.exit(1);
  }
})();