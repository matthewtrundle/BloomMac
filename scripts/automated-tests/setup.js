#!/usr/bin/env node

/**
 * Setup script for automated tests
 * Installs dependencies and prepares test environment
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up automated test environment...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ No package.json found. Make sure you\'re in the scripts/automated-tests directory');
  process.exit(1);
}

// Install dependencies
console.log('📦 Installing test dependencies...');

const npmInstall = spawn('npm', ['install'], {
  stdio: 'inherit',
  cwd: __dirname
});

npmInstall.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Dependencies installed successfully!\n');
    
    console.log('🧪 Available test commands:');
    console.log('   npm run test                 - Run all tests');
    console.log('   npm run test:database        - Test database connection');
    console.log('   npm run test:contact         - Test contact form API');
    console.log('   npm run test:newsletter      - Test newsletter signup');
    console.log('   npm run test:career          - Test career applications');
    console.log('   npm run test:email           - Test email system');
    console.log('   npm run test:rate-limit      - Test rate limiting');
    console.log('   npm run test:admin           - Test admin system');
    console.log('   npm run test:migration       - Test data migration');
    console.log('   npm run test:security        - Test security measures');
    console.log('   npm run test:performance     - Test performance');
    
    console.log('\n🚀 You can also run individual tests directly:');
    console.log('   node run-all-tests.js');
    console.log('   node test-database-connection.js');
    
    console.log('\n⚠️  Make sure your .env.local file is configured with:');
    console.log('   NEXT_PUBLIC_SUPABASE_URL');
    console.log('   SUPABASE_SERVICE_ROLE_KEY');
    console.log('   RESEND_API_KEY');
    console.log('   JWT_SECRET');
    
    console.log('\n🎯 To run all tests: npm run test\n');
    
  } else {
    console.error('\n❌ Failed to install dependencies');
    process.exit(1);
  }
});

npmInstall.on('error', (error) => {
  console.error('❌ Error running npm install:', error.message);
  process.exit(1);
});