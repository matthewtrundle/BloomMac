#!/usr/bin/env node

/**
 * Automated Backend Testing Suite
 * Runs all tests from COMPREHENSIVE_BACKEND_TESTING_PLAN.md
 */

const chalk = require('chalk');
const { spawn } = require('child_process');
const path = require('path');

// Test modules to run
const testModules = [
  { name: 'Database Connection', file: 'test-database-connection.js' },
  { name: 'Contact Form', file: 'test-contact-form-api.js' },
  { name: 'Newsletter Signup', file: 'test-newsletter-api.js' },
  { name: 'Career Applications', file: 'test-career-api.js' },
  { name: 'Email System', file: 'test-email-system-api.js' },
  { name: 'Rate Limiting', file: 'test-rate-limiting.js' },
  { name: 'Admin System', file: 'test-admin-api.js' },
  { name: 'Data Migration', file: 'test-data-migration.js' },
  { name: 'Security', file: 'test-security.js' },
  { name: 'Performance', file: 'test-performance.js' }
];

let passed = 0;
let failed = 0;

console.log(chalk.blue.bold('\n🧪 Running Automated Backend Tests\n'));
console.log(chalk.gray('This will test all functionality from COMPREHENSIVE_BACKEND_TESTING_PLAN.md\n'));

async function runTest(testModule) {
  return new Promise((resolve) => {
    console.log(chalk.yellow(`\n▶️  Running: ${testModule.name}`));
    console.log(chalk.gray('─'.repeat(50)));
    
    const testPath = path.join(__dirname, testModule.file);
    const child = spawn('node', [testPath], {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'test' }
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green(`✅ ${testModule.name} - PASSED`));
        passed++;
      } else {
        console.log(chalk.red(`❌ ${testModule.name} - FAILED`));
        failed++;
      }
      resolve(code);
    });
    
    child.on('error', (error) => {
      console.error(chalk.red(`❌ Error running ${testModule.name}:`, error.message));
      failed++;
      resolve(1);
    });
  });
}

async function runAllTests() {
  const startTime = Date.now();
  
  // Check if running against production
  if (process.env.NEXT_PUBLIC_SITE_URL?.includes('bloompsychologynorthaustin.com') && 
      !process.env.ALLOW_PRODUCTION_TESTS) {
    console.log(chalk.red.bold('\n⚠️  WARNING: About to run tests against PRODUCTION!'));
    console.log(chalk.yellow('Set ALLOW_PRODUCTION_TESTS=true to continue\n'));
    process.exit(1);
  }
  
  // Run tests sequentially to avoid rate limiting
  for (const testModule of testModules) {
    await runTest(testModule);
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  // Summary
  console.log(chalk.blue.bold('\n📊 Test Summary'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.green(`✅ Passed: ${passed}`));
  console.log(chalk.red(`❌ Failed: ${failed}`));
  console.log(chalk.gray(`⏱️  Duration: ${duration}s`));
  
  if (failed === 0) {
    console.log(chalk.green.bold('\n🎉 All tests passed! Backend is fully functional.\n'));
    
    // Generate test report
    const report = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      results: {
        passed,
        failed,
        total: passed + failed,
        duration: `${duration}s`
      },
      modules: testModules.map(m => m.name)
    };
    
    const fs = require('fs');
    const reportPath = path.join(__dirname, '../../test-results/backend-test-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(chalk.gray(`Test report saved to: ${reportPath}`));
  } else {
    console.log(chalk.red.bold(`\n❌ ${failed} tests failed. Please fix issues before deployment.\n`));
    process.exit(1);
  }
}

// Handle cleanup
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\nTests interrupted by user'));
  process.exit(1);
});

// Run tests
runAllTests().catch(error => {
  console.error(chalk.red('Fatal error:', error));
  process.exit(1);
});