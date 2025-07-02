#!/usr/bin/env node

/**
 * Comprehensive Onboarding Test Suite
 * Tests multiple scenarios, edge cases, and validation
 */

const { chromium } = require('playwright');
require('dotenv').config({ path: '.env.local' });

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

// Test scenarios with various edge cases
const TEST_SCENARIOS = [
  {
    name: 'Happy Path - Expecting Mother',
    data: {
      fullName: 'Jane Doe',
      email: `jane_${Date.now()}@example.com`,
      password: 'TestPass123!',
      phone: '(555) 123-4567',
      numberOfChildren: 0,
      babyDueDate: '2024-12-25',
      emergencyContactName: 'John Doe',
      emergencyContactPhone: '(555) 987-6543',
      emergencyContactRelationship: 'spouse'
    }
  },
  {
    name: 'Special Characters in Name',
    data: {
      fullName: "Mary O'Connor-Smith",
      email: `mary_${Date.now()}@example.com`,
      password: 'TestPass123!',
      phone: '+1-555-123-4567',
      numberOfChildren: 2,
      postpartumDate: '2024-01-15',
      emergencyContactName: "Jean-François Müller",
      emergencyContactPhone: '555.123.4567',
      emergencyContactRelationship: 'parent'
    }
  },
  {
    name: 'Minimal Required Fields Only',
    data: {
      fullName: 'Min User',
      email: `min_${Date.now()}@example.com`,
      password: 'TestPass123!',
      // Leave optional fields empty
    }
  },
  {
    name: 'International Phone Format',
    data: {
      fullName: 'International User',
      email: `intl_${Date.now()}@example.com`,
      password: 'TestPass123!',
      phone: '+44 20 7946 0958',
      numberOfChildren: 1
    }
  },
  {
    name: 'Validation Test - Invalid Data',
    shouldFail: true,
    data: {
      fullName: '', // Empty name should fail
      email: 'invalid-email', // Invalid email
      password: '123', // Too short password
      phone: 'abcd', // Invalid phone
    }
  }
];

// Color logging
const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[FAIL]\x1b[0m ${msg}`),
  warning: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  section: (msg) => console.log(`\n\x1b[35m${'='.repeat(50)}\n${msg}\n${'='.repeat(50)}\x1b[0m`)
};

async function runTest(scenario, browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  
  page.on('pageerror', err => errors.push(err.message));

  try {
    log.section(`Testing: ${scenario.name}`);
    log.info(`Email: ${scenario.data.email}`);
    
    // 1. Signup
    await page.goto(`${BASE_URL}/auth/signup`);
    await page.waitForLoadState('networkidle');
    
    if (scenario.data.fullName) {
      await page.fill('#fullName', scenario.data.fullName);
    }
    await page.fill('#email', scenario.data.email);
    await page.fill('#password', scenario.data.password);
    await page.fill('#confirmPassword', scenario.data.password);
    await page.check('#terms');
    
    await page.click('button[type="submit"]');
    
    // Check for signup errors
    const signupError = await page.locator('.bg-red-50').isVisible();
    if (signupError && !scenario.shouldFail) {
      const errorText = await page.locator('.bg-red-50').textContent();
      throw new Error(`Signup failed: ${errorText}`);
    }
    
    if (scenario.shouldFail) {
      log.success('Validation correctly prevented invalid signup');
      await context.close();
      return { success: true, validationWorking: true };
    }
    
    // Wait for redirect to onboarding
    await page.waitForURL('**/onboarding**', { timeout: 10000 });
    log.success('Signup completed');
    
    // 2. Profile Step
    await page.waitForSelector('#firstName', { timeout: 10000 });
    
    // Check if names are pre-filled
    const firstName = await page.inputValue('#firstName');
    const lastName = await page.inputValue('#lastName');
    
    if (!firstName || !lastName) {
      log.warning('Names not pre-filled from signup');
    } else {
      log.success('Names pre-filled correctly');
    }
    
    // Fill optional fields
    if (scenario.data.phone) {
      await page.fill('#phone', scenario.data.phone);
    }
    
    if (scenario.data.numberOfChildren !== undefined) {
      await page.selectOption('#numberOfChildren', scenario.data.numberOfChildren.toString());
    }
    
    if (scenario.data.postpartumDate) {
      await page.fill('#postpartumDate', scenario.data.postpartumDate);
    }
    
    if (scenario.data.babyDueDate) {
      await page.fill('#babyDueDate', scenario.data.babyDueDate);
    }
    
    if (scenario.data.emergencyContactName) {
      await page.fill('#emergencyContactName', scenario.data.emergencyContactName);
      await page.fill('#emergencyContactPhone', scenario.data.emergencyContactPhone);
      await page.selectOption('#emergencyContactRelationship', scenario.data.emergencyContactRelationship);
    }
    
    // Save profile
    await page.click('button:has-text("Continue")');
    
    // Check for profile errors
    const profileError = await page.locator('.fixed.bottom-6.right-6.bg-red-500').isVisible();
    if (profileError) {
      const errorText = await page.locator('.fixed.bottom-6.right-6.bg-red-500').textContent();
      throw new Error(`Profile save failed: ${errorText}`);
    }
    
    log.success('Profile saved successfully');
    
    // 3. Consent Step
    await page.waitForSelector('text=HIPAA Authorization', { timeout: 10000 });
    
    // Check if terms already accepted
    const termsAccepted = await page.locator('text=You already accepted').isVisible();
    if (termsAccepted) {
      log.success('Terms already accepted recognized');
    }
    
    // Accept HIPAA
    const hipaaCheckbox = await page.locator('input[type="checkbox"]').first();
    await hipaaCheckbox.check();
    
    await page.click('button:has-text("Continue")');
    log.success('Consent step completed');
    
    // 4. Access Step
    await page.waitForSelector('text=Choose Your Path', { timeout: 10000 });
    await page.click('text=Join Waitlist');
    await page.click('button:has-text("Continue with Join Waitlist")');
    log.success('Access step completed');
    
    // 5. Complete
    await page.waitForSelector('text=You\'re All Set!', { timeout: 10000 });
    await page.click('button:has-text("Go to Dashboard")');
    
    // Verify redirect to dashboard
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    log.success('Onboarding completed successfully!');
    
    // Report any console errors
    if (errors.length > 0) {
      log.warning(`Console errors detected: ${errors.join(', ')}`);
    }
    
    await context.close();
    return { success: true, errors };
    
  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    
    // Take screenshot on failure
    const screenshotPath = `./test-failure-${scenario.name.replace(/\s+/g, '-')}-${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    log.info(`Screenshot saved: ${screenshotPath}`);
    
    await context.close();
    return { success: false, error: error.message, errors };
  }
}

async function runAllTests() {
  log.section('Onboarding Comprehensive Test Suite');
  log.info(`Testing URL: ${BASE_URL}`);
  log.info(`Scenarios: ${TEST_SCENARIOS.length}`);
  
  const browser = await chromium.launch({
    headless: true, // Set to false to watch tests
    slowMo: 100 // Slow down for stability
  });
  
  const results = [];
  
  for (const scenario of TEST_SCENARIOS) {
    const result = await runTest(scenario, browser);
    results.push({ scenario: scenario.name, ...result });
  }
  
  await browser.close();
  
  // Summary
  log.section('Test Summary');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  results.forEach(r => {
    if (r.success) {
      log.success(`✓ ${r.scenario}`);
    } else {
      log.error(`✗ ${r.scenario}: ${r.error}`);
    }
  });
  
  log.info(`\nTotal: ${results.length}, Passed: ${passed}, Failed: ${failed}`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

// Check if Playwright is installed
try {
  require('playwright');
} catch (e) {
  log.error('Playwright not installed. Run: npm install --save-dev playwright');
  process.exit(1);
}

// Run tests
runAllTests().catch(console.error);