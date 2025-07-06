#!/usr/bin/env node

/**
 * Comprehensive User Flow Test
 * ============================
 * 
 * Tests the complete user journey:
 * 1. User signup
 * 2. Profile creation and editing
 * 3. Privacy settings management
 * 4. Password changes
 * 5. Data persistence verification
 * 
 * Usage: node scripts/comprehensive-user-flow-test.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration
const BASE_URL = 'https://www.bloompsychologynorthaustin.com';
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword123!';
const NEW_PASSWORD = 'NewPassword456!';

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, description) {
  log(`\n${step}. ${description}`, 'bold');
  log('='.repeat(50), 'blue');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Test data
const testProfileData = {
  firstName: 'Test',
  lastName: 'User',
  phone: '555-123-4567',
  dateOfBirth: '1990-01-01',
  emergencyContactName: 'Emergency Contact',
  emergencyContactPhone: '555-987-6543',
  emergencyContactRelationship: 'Spouse'
};

const testPrivacySettings = {
  share_data_research: true,
  profile_visibility: 'public',
  analytics_enabled: false,
  contact_visibility: 'private'
};

const updatedProfileData = {
  firstName: 'Updated',
  lastName: 'TestUser',
  phone: '555-999-8888',
  emergencyContactName: 'New Emergency Contact',
  emergencyContactPhone: '555-111-2222',
  emergencyContactRelationship: 'Parent'
};

const updatedPrivacySettings = {
  share_data_research: false,
  profile_visibility: 'friends',
  analytics_enabled: true,
  contact_visibility: 'friends'
};

class UserFlowTester {
  constructor() {
    this.testResults = {
      signup: false,
      profileCreation: false,
      profileEdit: false,
      privacySettings: false,
      privacyEdit: false,
      passwordChange: false,
      dataVerification: false
    };
    this.authCookies = '';
    this.userId = null;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'UserFlowTester/1.0',
      ...(this.authCookies && { 'Cookie': this.authCookies })
    };

    const response = await fetch(url, {
      headers: { ...defaultHeaders, ...options.headers },
      credentials: 'include', // Important for cookie handling
      ...options
    });

    // Extract and store cookies from response
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      // Parse multiple cookies if present
      const cookies = setCookieHeader.split(',').map(cookie => {
        return cookie.split(';')[0]; // Get just the name=value part
      }).join('; ');
      
      this.authCookies = cookies;
      logSuccess(`Auth cookies updated: ${cookies.substring(0, 50)}...`);
    }

    return response;
  }

  async test1_UserSignup() {
    logStep(1, 'User Signup Test');
    
    try {
      const response = await this.makeRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
          firstName: testProfileData.firstName,
          lastName: testProfileData.lastName,
          phone: testProfileData.phone
        })
      });

      const data = await response.json();
      
      if (response.ok && data.user) {
        this.userId = data.user.id;
        logSuccess(`User created successfully: ${TEST_EMAIL}`);
        logSuccess(`User ID: ${this.userId}`);
        this.testResults.signup = true;
        return true;
      } else {
        logError(`Signup failed: ${data.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      logError(`Signup request failed: ${error.message}`);
      return false;
    }
  }

  async test2_ProfileCreation() {
    logStep(2, 'Profile Creation Test');
    
    try {
      const response = await this.makeRequest('/api/profile/save', {
        method: 'PUT',
        body: JSON.stringify(testProfileData)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        logSuccess('Profile created successfully');
        logSuccess(`First Name: ${testProfileData.firstName}`);
        logSuccess(`Last Name: ${testProfileData.lastName}`);
        logSuccess(`Phone: ${testProfileData.phone}`);
        this.testResults.profileCreation = true;
        return true;
      } else {
        logError(`Profile creation failed: ${data.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      logError(`Profile creation request failed: ${error.message}`);
      return false;
    }
  }

  async test3_ProfileEdit() {
    logStep(3, 'Profile Edit Test');
    
    try {
      const response = await this.makeRequest('/api/profile/save', {
        method: 'PUT',
        body: JSON.stringify(updatedProfileData)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        logSuccess('Profile updated successfully');
        logSuccess(`Updated First Name: ${updatedProfileData.firstName}`);
        logSuccess(`Updated Last Name: ${updatedProfileData.lastName}`);
        logSuccess(`Updated Phone: ${updatedProfileData.phone}`);
        this.testResults.profileEdit = true;
        return true;
      } else {
        logError(`Profile edit failed: ${data.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      logError(`Profile edit request failed: ${error.message}`);
      return false;
    }
  }

  async test4_PrivacySettings() {
    logStep(4, 'Privacy Settings Creation Test');
    
    try {
      const response = await this.makeRequest('/api/user/settings/privacy', {
        method: 'PUT',
        body: JSON.stringify({ privacy_settings: testPrivacySettings })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        logSuccess('Privacy settings created successfully');
        logSuccess(`Share data for research: ${testPrivacySettings.share_data_research}`);
        logSuccess(`Profile visibility: ${testPrivacySettings.profile_visibility}`);
        logSuccess(`Analytics enabled: ${testPrivacySettings.analytics_enabled}`);
        logSuccess(`Contact visibility: ${testPrivacySettings.contact_visibility}`);
        this.testResults.privacySettings = true;
        return true;
      } else {
        logError(`Privacy settings creation failed: ${data.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      logError(`Privacy settings request failed: ${error.message}`);
      return false;
    }
  }

  async test5_PrivacyEdit() {
    logStep(5, 'Privacy Settings Edit Test');
    
    try {
      const response = await this.makeRequest('/api/user/settings/privacy', {
        method: 'PUT',
        body: JSON.stringify({ privacy_settings: updatedPrivacySettings })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        logSuccess('Privacy settings updated successfully');
        logSuccess(`Updated share data: ${updatedPrivacySettings.share_data_research}`);
        logSuccess(`Updated profile visibility: ${updatedPrivacySettings.profile_visibility}`);
        logSuccess(`Updated analytics: ${updatedPrivacySettings.analytics_enabled}`);
        logSuccess(`Updated contact visibility: ${updatedPrivacySettings.contact_visibility}`);
        this.testResults.privacyEdit = true;
        return true;
      } else {
        logError(`Privacy settings edit failed: ${data.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      logError(`Privacy settings edit request failed: ${error.message}`);
      return false;
    }
  }

  async test6_PasswordChange() {
    logStep(6, 'Password Change Test');
    
    try {
      const response = await this.makeRequest('/api/user/settings/security/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: TEST_PASSWORD,
          newPassword: NEW_PASSWORD
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        logSuccess('Password changed successfully');
        logSuccess('User should be logged out after password change');
        this.testResults.passwordChange = true;
        return true;
      } else {
        logError(`Password change failed: ${data.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      logError(`Password change request failed: ${error.message}`);
      return false;
    }
  }

  async test7_DataVerification() {
    logStep(7, 'Database Data Verification');
    
    if (!this.userId) {
      logError('No user ID available for verification');
      return false;
    }

    try {
      // Initialize Supabase client for direct database verification
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      // Verify user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', this.userId)
        .single();

      if (profileError) {
        logError(`Profile verification failed: ${profileError.message}`);
        return false;
      }

      // Verify profile data matches our updates
      if (profileData.first_name === updatedProfileData.firstName &&
          profileData.last_name === updatedProfileData.lastName &&
          profileData.phone === updatedProfileData.phone) {
        logSuccess('Profile data verified in database');
      } else {
        logError('Profile data mismatch in database');
        log(`Expected: ${JSON.stringify(updatedProfileData)}`);
        log(`Found: ${JSON.stringify(profileData)}`);
        return false;
      }

      // Verify privacy settings
      const { data: preferencesData, error: preferencesError } = await supabase
        .from('user_preferences')
        .select('privacy_settings')
        .eq('user_id', this.userId)
        .single();

      if (preferencesError) {
        logError(`Privacy settings verification failed: ${preferencesError.message}`);
        return false;
      }

      const privacySettings = preferencesData.privacy_settings;
      if (privacySettings.share_data_research === updatedPrivacySettings.share_data_research &&
          privacySettings.profile_visibility === updatedPrivacySettings.profile_visibility &&
          privacySettings.analytics_enabled === updatedPrivacySettings.analytics_enabled &&
          privacySettings.contact_visibility === updatedPrivacySettings.contact_visibility) {
        logSuccess('Privacy settings verified in database');
      } else {
        logError('Privacy settings mismatch in database');
        log(`Expected: ${JSON.stringify(updatedPrivacySettings)}`);
        log(`Found: ${JSON.stringify(privacySettings)}`);
        return false;
      }

      this.testResults.dataVerification = true;
      return true;

    } catch (error) {
      logError(`Database verification failed: ${error.message}`);
      return false;
    }
  }

  async cleanup() {
    logStep('Cleanup', 'Removing Test Data');
    
    if (!this.userId) {
      logWarning('No user ID available for cleanup');
      return;
    }

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      // Delete user preferences
      await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', this.userId);

      // Delete user profile
      await supabase
        .from('user_profiles')
        .delete()
        .eq('id', this.userId);

      // Delete auth user
      const { error } = await supabase.auth.admin.deleteUser(this.userId);
      
      if (error) {
        logWarning(`Auth user deletion failed: ${error.message}`);
      } else {
        logSuccess('Test user cleaned up successfully');
      }

    } catch (error) {
      logWarning(`Cleanup failed: ${error.message}`);
    }
  }

  printResults() {
    log('\n' + '='.repeat(60), 'blue');
    log('TEST RESULTS SUMMARY', 'bold');
    log('='.repeat(60), 'blue');

    const tests = [
      { name: 'User Signup', result: this.testResults.signup },
      { name: 'Profile Creation', result: this.testResults.profileCreation },
      { name: 'Profile Edit', result: this.testResults.profileEdit },
      { name: 'Privacy Settings', result: this.testResults.privacySettings },
      { name: 'Privacy Edit', result: this.testResults.privacyEdit },
      { name: 'Password Change', result: this.testResults.passwordChange },
      { name: 'Data Verification', result: this.testResults.dataVerification }
    ];

    let passed = 0;
    let total = tests.length;

    tests.forEach(test => {
      if (test.result) {
        logSuccess(`${test.name}: PASS`);
        passed++;
      } else {
        logError(`${test.name}: FAIL`);
      }
    });

    log('\n' + '='.repeat(60), 'blue');
    
    if (passed === total) {
      logSuccess(`ALL TESTS PASSED! (${passed}/${total})`);
      logSuccess('The user flow is working correctly! 🎉');
    } else {
      logError(`TESTS FAILED: ${total - passed} out of ${total} tests failed`);
      logError('Please check the failed tests and fix any issues.');
    }

    log('='.repeat(60), 'blue');

    return passed === total;
  }

  async runAllTests() {
    log('🚀 STARTING COMPREHENSIVE USER FLOW TEST', 'bold');
    log(`Test Email: ${TEST_EMAIL}`, 'blue');
    log(`Base URL: ${BASE_URL}`, 'blue');
    log(`Timestamp: ${new Date().toISOString()}`, 'blue');

    try {
      // Run all tests in sequence
      await this.test1_UserSignup();
      await this.test2_ProfileCreation();
      await this.test3_ProfileEdit();
      await this.test4_PrivacySettings();
      await this.test5_PrivacyEdit();
      await this.test6_PasswordChange();
      await this.test7_DataVerification();

      // Print results
      const allPassed = this.printResults();
      
      // Cleanup test data
      await this.cleanup();

      // Exit with appropriate code
      process.exit(allPassed ? 0 : 1);

    } catch (error) {
      logError(`Test execution failed: ${error.message}`);
      console.error(error);
      await this.cleanup();
      process.exit(1);
    }
  }
}

// Check if we have required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  logError('Missing required environment variables');
  logError('Please ensure .env.local contains:');
  logError('- NEXT_PUBLIC_SUPABASE_URL');
  logError('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Run the tests
const tester = new UserFlowTester();
tester.runAllTests();