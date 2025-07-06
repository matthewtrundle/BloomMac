const { createClient } = require('@supabase/supabase-js');
const chalk = require('chalk');
require('dotenv').config({ path: '.env.staging' });

// Initialize Supabase client with staging credentials
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Test results tracker
const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0
};

async function logTest(testName, passed, message = '') {
  if (passed) {
    console.log(chalk.green(`✅ ${testName}`));
    testResults.passed++;
  } else {
    console.log(chalk.red(`❌ ${testName}`));
    if (message) console.log(chalk.gray(`   ${message}`));
    testResults.failed++;
  }
}

async function logWarning(message) {
  console.log(chalk.yellow(`⚠️  ${message}`));
  testResults.warnings++;
}

// Test 1: Database Connection
async function testDatabaseConnection() {
  console.log(chalk.blue('\n🔌 Testing Database Connection\n'));
  
  try {
    const { data, error } = await supabase.from('courses').select('count').single();
    await logTest('Database connection', !error, error?.message);
    
    // Check if we have essential data
    const { count } = await supabase.from('courses').select('*', { count: 'exact', head: true });
    if (count === 0) {
      await logWarning('No courses found - you may need to copy essential data from production');
    } else {
      await logTest(`Essential data present (${count} courses)`, true);
    }
  } catch (err) {
    await logTest('Database connection', false, err.message);
  }
}

// Test 2: Authentication Flow
async function testAuthentication() {
  console.log(chalk.blue('\n🔐 Testing Authentication\n'));
  
  const testEmail = `test-${Date.now()}@staging.bloom.com`;
  const testPassword = 'TestPassword123!';
  
  // Sign up
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword
  });
  
  await logTest('User registration', !signUpError, signUpError?.message);
  
  if (!signUpError) {
    // Check if profile was created
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', signUpData.user.id)
      .single();
    
    await logTest('Auto profile creation', !profileError, profileError?.message);
    
    // Sign out and sign back in
    await supabase.auth.signOut();
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    await logTest('User sign in', !signInError, signInError?.message);
    
    // Clean up
    await supabase.auth.signOut();
  }
}

// Test 3: RLS Policies
async function testRLSPolicies() {
  console.log(chalk.blue('\n🛡️  Testing RLS Policies\n'));
  
  // Create two test users
  const user1Email = `user1-${Date.now()}@staging.bloom.com`;
  const user2Email = `user2-${Date.now()}@staging.bloom.com`;
  const password = 'TestPassword123!';
  
  // Create user 1
  const { data: user1Data } = await supabase.auth.signUp({
    email: user1Email,
    password: password
  });
  
  // Create user 2
  const { data: user2Data } = await supabase.auth.signUp({
    email: user2Email,
    password: password
  });
  
  if (user1Data && user2Data) {
    // Sign in as user 1
    await supabase.auth.signInWithPassword({
      email: user1Email,
      password: password
    });
    
    // Try to read user 2's profile (should fail)
    const { data: otherProfile, error: rlsError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user2Data.user.id)
      .single();
    
    await logTest('RLS blocks unauthorized access', rlsError !== null);
    
    // Read own profile (should succeed)
    const { error: ownError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user1Data.user.id)
      .single();
    
    await logTest('RLS allows own data access', ownError === null, ownError?.message);
    
    await supabase.auth.signOut();
  }
}

// Test 4: API Endpoints
async function testAPIEndpoints() {
  console.log(chalk.blue('\n🌐 Testing API Endpoints\n'));
  
  // This would require the Next.js server to be running
  console.log(chalk.gray('   Note: Start your staging server with "npm run dev:staging" to test API endpoints'));
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/courses`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });
    
    await logTest('REST API accessible', response.ok);
  } catch (err) {
    await logTest('REST API accessible', false, 'Could not reach API');
  }
}

// Test 5: Schema Completeness
async function testSchemaCompleteness() {
  console.log(chalk.blue('\n📊 Testing Schema Completeness\n'));
  
  const criticalTables = [
    'user_profiles',
    'user_preferences',
    'courses',
    'course_modules',
    'course_lessons',
    'enrollments',
    'payments',
    'email_templates',
    'appointments',
    'notifications'
  ];
  
  for (const table of criticalTables) {
    const { error } = await supabase.from(table).select('*').limit(0);
    await logTest(`Table '${table}' exists`, !error || !error.message.includes('does not exist'));
  }
}

// Test 6: Functions and Triggers
async function testFunctionsAndTriggers() {
  console.log(chalk.blue('\n⚡ Testing Functions and Triggers\n'));
  
  // Check if handle_new_user function exists
  const { data: functions, error: funcError } = await supabase.rpc('pg_get_functiondef', {
    function_name: 'handle_new_user'
  }).single();
  
  if (funcError && funcError.message.includes('pg_get_functiondef')) {
    // Try alternative check
    const { error: testError } = await supabase.rpc('handle_new_user', {});
    await logTest('handle_new_user function exists', 
      !testError || !testError.message.includes('does not exist'));
  } else {
    await logTest('handle_new_user function exists', !funcError);
  }
}

// Run all tests
async function runAllTests() {
  console.log(chalk.bold.blue('\n🧪 Bloom Staging Environment Test Suite\n'));
  console.log(chalk.gray(`Testing: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`));
  
  await testDatabaseConnection();
  await testAuthentication();
  await testRLSPolicies();
  await testAPIEndpoints();
  await testSchemaCompleteness();
  await testFunctionsAndTriggers();
  
  // Summary
  console.log(chalk.blue('\n📊 Test Summary\n'));
  console.log(chalk.green(`   Passed: ${testResults.passed}`));
  console.log(chalk.red(`   Failed: ${testResults.failed}`));
  console.log(chalk.yellow(`   Warnings: ${testResults.warnings}`));
  
  const total = testResults.passed + testResults.failed;
  const percentage = total > 0 ? Math.round((testResults.passed / total) * 100) : 0;
  
  console.log(chalk.bold(`\n   Success Rate: ${percentage}%`));
  
  if (testResults.failed === 0) {
    console.log(chalk.green.bold('\n✨ All tests passed! Your staging environment is ready.'));
  } else {
    console.log(chalk.yellow.bold('\n⚠️  Some tests failed. Review the output above.'));
  }
  
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(console.error);