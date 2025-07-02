#!/usr/bin/env node

/**
 * Test script for the onboarding flow
 * This simulates the complete signup and onboarding process
 */

const { chromium } = require('playwright');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_USER = {
  email: `test_${Date.now()}@example.com`,
  password: 'TestPassword123!',
  fullName: 'Test User',
  firstName: 'Test',
  lastName: 'User',
  phone: '(555) 123-4567',
  emergencyContactName: 'Emergency Contact',
  emergencyContactPhone: '(555) 987-6543',
  emergencyContactRelationship: 'spouse'
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
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

async function testOnboardingFlow() {
  let browser;
  let context;
  let page;

  try {
    log('Starting onboarding flow test...', 'info');
    
    // Launch browser
    browser = await chromium.launch({
      headless: false, // Set to true for CI/CD
      slowMo: 500 // Slow down actions to see what's happening
    });

    context = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    });

    // Enable console log capture
    page = await context.newPage();
    
    // Capture console messages
    page.on('console', msg => {
      if (msg.type() === 'error') {
        log(`Browser console error: ${msg.text()}`, 'error');
      }
    });

    // Capture page errors
    page.on('pageerror', error => {
      log(`Page error: ${error.message}`, 'error');
    });

    // Step 1: Navigate to signup page
    log('Step 1: Navigating to signup page...', 'step');
    await page.goto(`${BASE_URL}/auth/signup`);
    await page.waitForLoadState('networkidle');
    
    // Check if signup page loaded
    const signupTitle = await page.textContent('h1');
    if (signupTitle?.includes('Create Your Account')) {
      log('✓ Signup page loaded successfully', 'success');
    } else {
      throw new Error('Signup page did not load correctly');
    }

    // Step 2: Fill signup form
    log('Step 2: Filling signup form...', 'step');
    await page.fill('input[id="fullName"]', TEST_USER.fullName);
    await page.fill('input[id="email"]', TEST_USER.email);
    await page.fill('input[id="password"]', TEST_USER.password);
    await page.fill('input[id="confirmPassword"]', TEST_USER.password);
    await page.check('input[id="terms"]');
    
    log('✓ Signup form filled', 'success');

    // Step 3: Submit signup form
    log('Step 3: Submitting signup form...', 'step');
    await page.click('button[type="submit"]');
    
    // Wait for navigation or error
    try {
      await page.waitForURL('**/onboarding**', { timeout: 10000 });
      log('✓ Signup successful, redirected to onboarding', 'success');
    } catch (e) {
      // Check for error messages
      const errorElement = await page.locator('.bg-red-50').first();
      if (await errorElement.isVisible()) {
        const errorText = await errorElement.textContent();
        throw new Error(`Signup failed: ${errorText}`);
      }
      throw new Error('Signup did not redirect to onboarding');
    }

    // Step 4: Profile Step
    log('Step 4: Completing Profile Step...', 'step');
    
    // Wait for profile form to load
    await page.waitForSelector('input[id="firstName"]', { timeout: 10000 });
    
    // Check if names are pre-filled
    const firstNameValue = await page.inputValue('input[id="firstName"]');
    const lastNameValue = await page.inputValue('input[id="lastName"]');
    
    if (firstNameValue && lastNameValue) {
      log('✓ Names pre-filled from signup', 'success');
    } else {
      log('⚠ Names not pre-filled, filling manually', 'warning');
      await page.fill('input[id="firstName"]', TEST_USER.firstName);
      await page.fill('input[id="lastName"]', TEST_USER.lastName);
    }
    
    // Fill optional fields
    await page.fill('input[id="phone"]', TEST_USER.phone);
    await page.fill('input[id="emergencyContactName"]', TEST_USER.emergencyContactName);
    await page.fill('input[id="emergencyContactPhone"]', TEST_USER.emergencyContactPhone);
    await page.selectOption('select[id="emergencyContactRelationship"]', TEST_USER.emergencyContactRelationship);
    
    // Click continue
    await page.click('button:has-text("Continue")');
    
    // Check for errors
    const profileError = await page.locator('.fixed.bottom-6.right-6.bg-red-500').isVisible();
    if (profileError) {
      const errorText = await page.locator('.fixed.bottom-6.right-6.bg-red-500').textContent();
      throw new Error(`Profile step error: ${errorText}`);
    }
    
    log('✓ Profile step completed', 'success');

    // Step 5: Consent Step
    log('Step 5: Completing Consent Step...', 'step');
    
    // Wait for consent form
    await page.waitForSelector('text=HIPAA Authorization', { timeout: 10000 });
    
    // Check if terms already accepted
    const termsAlreadyAccepted = await page.locator('text=You already accepted our Terms').isVisible();
    if (termsAlreadyAccepted) {
      log('✓ Terms already accepted from signup', 'success');
    }
    
    // Accept HIPAA
    const hipaaCheckbox = await page.locator('input[type="checkbox"]').first();
    await hipaaCheckbox.check();
    
    // Accept marketing (optional)
    const marketingCheckbox = await page.locator('input[type="checkbox"]').last();
    await marketingCheckbox.check();
    
    // Click continue
    await page.click('button:has-text("Continue")');
    
    // Check for errors
    const consentError = await page.locator('.fixed.bottom-6.right-6.bg-red-500').isVisible();
    if (consentError) {
      const errorText = await page.locator('.fixed.bottom-6.right-6.bg-red-500').textContent();
      throw new Error(`Consent step error: ${errorText}`);
    }
    
    log('✓ Consent step completed', 'success');

    // Step 6: Access Step
    log('Step 6: Completing Access Step...', 'step');
    
    // Wait for access options
    await page.waitForSelector('text=Choose Your Path to Wellness', { timeout: 10000 });
    
    // Select waitlist option (since it's the only available one)
    await page.click('text=Join Waitlist');
    
    // Click continue
    await page.click('button:has-text("Continue with Join Waitlist")');
    
    // Check for errors
    const accessError = await page.locator('.fixed.bottom-6.right-6.bg-red-500').isVisible();
    if (accessError) {
      const errorText = await page.locator('.fixed.bottom-6.right-6.bg-red-500').textContent();
      throw new Error(`Access step error: ${errorText}`);
    }
    
    log('✓ Access step completed', 'success');

    // Step 7: Complete Step
    log('Step 7: Completing onboarding...', 'step');
    
    // Wait for complete step
    await page.waitForSelector('text=You\'re All Set!', { timeout: 10000 });
    
    // Click complete button
    await page.click('button:has-text("Go to Dashboard")');
    
    // Wait for dashboard
    try {
      await page.waitForURL('**/dashboard**', { timeout: 10000 });
      log('✓ Onboarding completed successfully!', 'success');
    } catch (e) {
      throw new Error('Failed to redirect to dashboard after completion');
    }

    // Summary
    log('\n' + '='.repeat(50), 'info');
    log('ONBOARDING FLOW TEST COMPLETED SUCCESSFULLY', 'success');
    log('All steps passed without errors', 'success');
    log('='.repeat(50) + '\n', 'info');

  } catch (error) {
    log('\n' + '='.repeat(50), 'error');
    log('ONBOARDING FLOW TEST FAILED', 'error');
    log(`Error: ${error.message}`, 'error');
    log('='.repeat(50) + '\n', 'error');
    
    // Take screenshot on error
    if (page) {
      const screenshotPath = `./onboarding-error-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      log(`Screenshot saved: ${screenshotPath}`, 'info');
    }
    
    throw error;
  } finally {
    // Cleanup
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
if (require.main === module) {
  testOnboardingFlow()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { testOnboardingFlow };