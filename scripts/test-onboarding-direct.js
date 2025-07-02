#!/usr/bin/env node

/**
 * Direct API Testing for Onboarding Flow
 * No browser required - tests the backend directly
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for testing
);

// Test cases with various scenarios
const TEST_CASES = [
  {
    name: 'Valid Profile - Expecting Mother',
    profile: {
      first_name: 'Jane',
      last_name: 'Doe',
      phone: '(555) 123-4567',
      number_of_children: 0,
      baby_due_date: '2024-12-25',
      emergency_contact_name: 'John Doe',
      emergency_contact_phone: '(555) 987-6543',
      emergency_contact_relationship: 'spouse',
      timezone: 'America/Chicago'
    }
  },
  {
    name: 'Special Characters',
    profile: {
      first_name: "Mary-Jane",
      last_name: "O'Connor",
      phone: '+1-555-123-4567',
      number_of_children: 2,
      emergency_contact_name: "Jean-François",
      emergency_contact_phone: '555.123.4567',
      emergency_contact_relationship: 'parent'
    }
  },
  {
    name: 'Minimal Fields',
    profile: {
      first_name: 'Min',
      last_name: 'User',
      number_of_children: 1
    }
  },
  {
    name: 'Max Children',
    profile: {
      first_name: 'Max',
      last_name: 'Family',
      number_of_children: 7
    }
  },
  {
    name: 'Empty Optional Fields',
    profile: {
      first_name: 'Empty',
      last_name: 'Optional',
      phone: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship: ''
    }
  }
];

// Validation test cases
const VALIDATION_TESTS = [
  {
    name: 'Empty First Name',
    profile: { first_name: '', last_name: 'User' },
    shouldFail: true
  },
  {
    name: 'Invalid Phone',
    profile: { 
      first_name: 'Test', 
      last_name: 'User',
      phone: 'invalid-phone-123'
    },
    shouldValidate: 'phone'
  },
  {
    name: 'Partial Emergency Contact',
    profile: {
      first_name: 'Test',
      last_name: 'User',
      emergency_contact_name: 'Contact Name',
      // Missing phone and relationship
    },
    shouldValidate: 'emergency'
  }
];

const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[FAIL]\x1b[0m ${msg}`),
  section: (msg) => console.log(`\n\x1b[35m${'='.repeat(50)}\n${msg}\n${'='.repeat(50)}\x1b[0m`)
};

async function createTestUser() {
  const email = `test_${Date.now()}@example.com`;
  const password = 'TestPass123!';
  
  // For testing, we'll create a user directly in the database
  // to bypass email confirmation
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      full_name: 'Test User'
    }
  });
  
  if (authError) {
    // Fallback to regular signup if admin API not available
    log.warning('Admin API not available, using regular signup');
    const { data: user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: 'Test User'
        },
        emailRedirectTo: 'http://localhost:3000' // Prevent email send
      }
    });
    
    if (error) throw error;
    return user.user;
  }
  
  return authUser.user;
}

async function testProfileSave(testCase, userId) {
  try {
    const profileData = {
      id: userId,
      ...testCase.profile,
      updated_at: new Date().toISOString()
    };
    
    log.info(`Testing: ${testCase.name}`);
    
    // Try to save profile
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profileData);
    
    if (error) {
      if (testCase.shouldFail) {
        log.success(`Correctly failed validation: ${error.message}`);
        return { success: true, validationWorking: true };
      } else {
        throw error;
      }
    }
    
    if (testCase.shouldFail) {
      log.error('Should have failed but succeeded');
      return { success: false };
    }
    
    log.success(`Profile saved successfully`);
    
    // Verify the save
    const { data: saved, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Check specific fields
    if (saved.first_name !== testCase.profile.first_name) {
      throw new Error('First name not saved correctly');
    }
    
    if (testCase.profile.phone !== undefined && saved.phone !== testCase.profile.phone) {
      log.warning(`Phone saved as: ${saved.phone}`);
    }
    
    return { success: true, data: saved };
    
  } catch (error) {
    log.error(`Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log.section('Direct Database Testing');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    log.error('Missing environment variables. Please check .env.local');
    process.exit(1);
  }
  
  const results = [];
  
  // Test with a single user
  try {
    const user = await createTestUser();
    log.success(`Created test user: ${user.id}`);
    
    // Run all test cases
    for (const testCase of [...TEST_CASES, ...VALIDATION_TESTS]) {
      const result = await testProfileSave(testCase, user.id);
      results.push({ name: testCase.name, ...result });
    }
    
  } catch (error) {
    log.error(`Setup failed: ${error.message}`);
    return;
  }
  
  // Summary
  log.section('Test Summary');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  log.info(`Total: ${results.length}, Passed: ${passed}, Failed: ${failed}`);
  
  if (failed > 0) {
    log.error('\nFailed tests:');
    results.filter(r => !r.success).forEach(r => {
      log.error(`- ${r.name}: ${r.error}`);
    });
  }
}

// Run the tests
runTests().catch(console.error);