const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Production Readiness Test\n');
console.log('================================\n');

async function testDatabaseConnection() {
  console.log('1. DATABASE CONNECTION TEST');
  console.log('---------------------------');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection FAILED:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (err) {
    console.log('❌ Database connection error:', err.message);
    return false;
  }
}

async function checkCriticalTables() {
  console.log('\n2. CRITICAL TABLES CHECK');
  console.log('------------------------');
  
  const criticalTables = [
    'user_profiles',
    'subscribers',
    'email_sequences',
    'sequence_emails',
    'sequence_enrollments',
    'appointments',
    'providers',
    'courses',
    'workbook_submissions'
  ];
  
  let allTablesExist = true;
  
  for (const table of criticalTables) {
    const { error } = await supabase
      .from(table)
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`❌ Table '${table}' - NOT FOUND or NO ACCESS`);
      allTablesExist = false;
    } else {
      console.log(`✅ Table '${table}' - EXISTS`);
    }
  }
  
  return allTablesExist;
}

async function testUserFlow() {
  console.log('\n3. USER AUTHENTICATION FLOW TEST');
  console.log('--------------------------------');
  
  try {
    // Check if test user exists
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', 'testuser@example.com')
      .single();
    
    if (error) {
      // Try to find by joining with auth.users
      const { data: authUser } = await supabase.auth.admin.listUsers();
      const testUser = authUser?.users?.find(u => u.email === 'testuser@example.com');
      
      if (testUser) {
        console.log('✅ Test user exists in auth.users');
        console.log(`   User ID: ${testUser.id}`);
        
        // Check profile
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', testUser.id)
          .single();
        
        if (userProfile) {
          console.log('✅ User profile exists');
        } else {
          console.log('❌ User profile missing');
        }
      } else {
        console.log('❌ Test user not found');
      }
    } else {
      console.log('✅ Test user profile found');
    }
  } catch (err) {
    console.log('❌ Error testing user flow:', err.message);
  }
}

async function testEmailAutomation() {
  console.log('\n4. EMAIL AUTOMATION TEST');
  console.log('------------------------');
  
  try {
    // Check email sequences
    const { data: sequences, error: seqError } = await supabase
      .from('email_sequences')
      .select('*')
      .eq('status', 'active');
    
    if (seqError) {
      console.log('❌ Cannot access email_sequences:', seqError.message);
    } else {
      console.log(`✅ Found ${sequences?.length || 0} active email sequences`);
      sequences?.forEach(seq => {
        console.log(`   - ${seq.name} (trigger: ${seq.trigger})`);
      });
    }
    
    // Check pending emails
    const { data: enrollments, error: enrollError } = await supabase
      .from('sequence_enrollments')
      .select('*')
      .eq('status', 'active')
      .limit(5);
    
    if (!enrollError && enrollments) {
      console.log(`✅ Found ${enrollments.length} active enrollments`);
    }
  } catch (err) {
    console.log('❌ Error testing email automation:', err.message);
  }
}

async function testProviderDashboard() {
  console.log('\n5. PROVIDER DASHBOARD TEST');
  console.log('--------------------------');
  
  try {
    // Check if provider functions exist
    const { data: funcData, error: funcError } = await supabase.rpc('get_provider_dashboard_data', {
      provider_id: '00000000-0000-0000-0000-000000000000' // dummy ID
    });
    
    if (funcError && funcError.message.includes('does not exist')) {
      console.log('❌ Provider dashboard function not found');
    } else if (funcError) {
      console.log('⚠️  Provider dashboard function exists but returned error');
    } else {
      console.log('✅ Provider dashboard function exists');
    }
  } catch (err) {
    console.log('❌ Error testing provider dashboard:', err.message);
  }
}

async function checkProductionURLs() {
  console.log('\n6. PRODUCTION URL CHECK');
  console.log('-----------------------');
  
  const productionUrl = 'https://bloompsychologynorthaustin.com';
  const criticalEndpoints = [
    '/',
    '/auth/login',
    '/dashboard',
    '/provider/dashboard',
    '/api/health'
  ];
  
  console.log(`Testing ${productionUrl}...`);
  
  for (const endpoint of criticalEndpoints) {
    try {
      const response = await fetch(`${productionUrl}${endpoint}`, {
        method: 'GET',
        headers: { 'User-Agent': 'Production-Test-Script' }
      });
      
      if (response.ok || response.status === 401) { // 401 is OK for protected routes
        console.log(`✅ ${endpoint} - ${response.status} ${response.statusText}`);
      } else {
        console.log(`❌ ${endpoint} - ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.log(`❌ ${endpoint} - Failed to connect`);
    }
  }
}

// Run all tests
async function runAllTests() {
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    console.log('\n⚠️  Cannot proceed with other tests without database connection');
    console.log('\nPossible issues:');
    console.log('1. Check SUPABASE_SERVICE_ROLE_KEY in .env.local');
    console.log('2. Verify Supabase project is active');
    console.log('3. Check network connectivity');
    return;
  }
  
  await checkCriticalTables();
  await testUserFlow();
  await testEmailAutomation();
  await testProviderDashboard();
  await checkProductionURLs();
  
  console.log('\n================================');
  console.log('✅ Production readiness test complete');
  console.log('\nNext steps:');
  console.log('1. Fix any ❌ items above');
  console.log('2. Run E2E tests against staging');
  console.log('3. Perform manual testing of critical flows');
}

runAllTests().catch(console.error);