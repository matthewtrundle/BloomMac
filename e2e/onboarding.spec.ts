import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

// Test data generators
const generateTestUser = (scenario: string) => ({
  email: `test_${scenario}_${Date.now()}@example.com`,
  password: 'TestPass123!',
  fullName: faker.person.fullName(),
});

const testScenarios = [
  {
    name: 'Expecting mother - 0 children',
    data: {
      childrenCount: 0,
      isExpecting: true,
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      firstName: "Sarah-Jane",
      lastName: "O'Connor",
      phone: '+1 (555) 123-4567',
      emergencyName: 'John Doe-Smith',
      emergencyPhone: '555-987-6543',
    }
  },
  {
    name: 'Parent with special characters in name',
    data: {
      childrenCount: 2,
      isExpecting: false,
      firstName: "François",
      lastName: "D'Amico-López",
      phone: '555.234.5678',
      emergencyName: "Anne-Marie O'Brien",
      emergencyPhone: '(555) 345-6789',
    }
  },
  {
    name: 'Maximum children count',
    data: {
      childrenCount: 7,
      isExpecting: true,
      dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      firstName: "TestMax",
      lastName: "UserMax",
      phone: '5551234567',
    }
  },
  {
    name: 'Minimal required fields only',
    data: {
      childrenCount: 1,
      isExpecting: false,
      firstName: "Min",
      lastName: "User",
      phone: '5559999999',
    }
  },
  {
    name: 'International phone format',
    data: {
      childrenCount: 3,
      isExpecting: false,
      firstName: "International",
      lastName: "User",
      phone: '+44 20 7946 0958',
      emergencyName: 'Emergency Contact',
      emergencyPhone: '+33 1 42 86 82 00',
    }
  }
];

const validationTests = [
  {
    name: 'Empty first name',
    data: { firstName: '', lastName: 'Test' },
    expectedError: 'First name is required'
  },
  {
    name: 'Invalid phone format',
    data: { phone: '123' },
    expectedError: 'Please enter a valid phone number'
  },
  {
    name: 'Too many children',
    data: { childrenCount: 10 },
    expectedError: 'Please enter a valid number of children'
  },
  {
    name: 'SQL injection attempt',
    data: { firstName: "'; DROP TABLE profiles; --" },
    shouldPass: true // Should be sanitized, not error
  },
  {
    name: 'XSS attempt',
    data: { lastName: '<script>alert("xss")</script>' },
    shouldPass: true // Should be sanitized, not error
  }
];

test.describe('Onboarding Flow - Comprehensive Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Test successful scenarios
  for (const scenario of testScenarios) {
    test(`Successful onboarding: ${scenario.name}`, async ({ page }) => {
      const user = generateTestUser(scenario.name.replace(/\s+/g, '_'));
      
      // Sign up
      await page.click('text=Get Started');
      await page.fill('input[name="email"]', user.email);
      await page.fill('input[name="password"]', user.password);
      await page.fill('input[name="fullName"]', user.fullName);
      await page.click('button[type="submit"]');
      
      // Wait for redirect to onboarding
      await page.waitForURL('**/onboarding');
      
      // Fill onboarding form
      await page.fill('input[name="firstName"]', scenario.data.firstName);
      await page.fill('input[name="lastName"]', scenario.data.lastName);
      await page.fill('input[name="childrenCount"]', scenario.data.childrenCount.toString());
      
      if (scenario.data.isExpecting) {
        await page.check('input[name="isExpecting"]');
        if (scenario.data.dueDate) {
          await page.fill('input[name="dueDate"]', scenario.data.dueDate);
        }
      }
      
      await page.fill('input[name="phone"]', scenario.data.phone);
      
      if (scenario.data.emergencyName) {
        await page.fill('input[name="emergencyName"]', scenario.data.emergencyName);
        await page.fill('input[name="emergencyPhone"]', scenario.data.emergencyPhone);
      }
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Verify redirect to dashboard
      await page.waitForURL('**/dashboard');
      
      // Verify profile saved correctly
      const profileName = await page.textContent('[data-testid="profile-name"]');
      expect(profileName).toContain(scenario.data.firstName);
      
      // Take screenshot for documentation
      await page.screenshot({ 
        path: `e2e/screenshots/success_${scenario.name.replace(/\s+/g, '_')}.png` 
      });
    });
  }

  // Test validation scenarios
  test.describe('Validation Tests', () => {
    for (const validationTest of validationTests) {
      test(`Validation: ${validationTest.name}`, async ({ page }) => {
        // Navigate directly to onboarding (assume user exists)
        await page.goto('/onboarding');
        
        // Fill form with test data
        const defaultData = {
          firstName: 'Test',
          lastName: 'User',
          childrenCount: '1',
          phone: '5551234567',
          ...validationTest.data
        };
        
        for (const [field, value] of Object.entries(defaultData)) {
          if (value !== undefined && value !== '') {
            await page.fill(`input[name="${field}"]`, value.toString());
          }
        }
        
        // Try to submit
        await page.click('button[type="submit"]');
        
        if (validationTest.expectedError) {
          // Check for error message
          const errorMessage = await page.textContent('.error-message');
          expect(errorMessage).toContain(validationTest.expectedError);
        } else if (validationTest.shouldPass) {
          // Should not show error
          const errorMessages = await page.$$('.error-message');
          expect(errorMessages.length).toBe(0);
        }
        
        // Screenshot validation state
        await page.screenshot({ 
          path: `e2e/screenshots/validation_${validationTest.name.replace(/\s+/g, '_')}.png` 
        });
      });
    }
  });

  // Test concurrent users
  test('Concurrent user simulation', async ({ browser }) => {
    const userCount = 5;
    const contexts = [];
    
    // Create multiple browser contexts
    for (let i = 0; i < userCount; i++) {
      const context = await browser.newContext();
      contexts.push(context);
    }
    
    // Run onboarding for all users concurrently
    const promises = contexts.map(async (context, index) => {
      const page = await context.newPage();
      const user = generateTestUser(`concurrent_${index}`);
      
      await page.goto('/');
      await page.click('text=Get Started');
      await page.fill('input[name="email"]', user.email);
      await page.fill('input[name="password"]', user.password);
      await page.fill('input[name="fullName"]', user.fullName);
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/onboarding');
      
      await page.fill('input[name="firstName"]', `User${index}`);
      await page.fill('input[name="lastName"]', `Concurrent`);
      await page.fill('input[name="childrenCount"]', (index + 1).toString());
      await page.fill('input[name="phone"]', `555123456${index}`);
      
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard');
      
      return { success: true, user: `User${index}` };
    });
    
    const results = await Promise.all(promises);
    
    // Verify all users succeeded
    expect(results.every(r => r.success)).toBe(true);
    
    // Cleanup contexts
    for (const context of contexts) {
      await context.close();
    }
  });

  // Test session handling
  test('Session expiry handling', async ({ page, context }) => {
    const user = generateTestUser('session_test');
    
    // Complete onboarding
    await page.goto('/');
    await page.click('text=Get Started');
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="fullName"]', user.fullName);
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/onboarding');
    
    // Clear cookies to simulate session expiry
    await context.clearCookies();
    
    // Try to submit onboarding form
    await page.fill('input[name="firstName"]', 'Session');
    await page.fill('input[name="lastName"]', 'Test');
    await page.fill('input[name="childrenCount"]', '1');
    await page.fill('input[name="phone"]', '5551234567');
    await page.click('button[type="submit"]');
    
    // Should redirect to login
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });

  // Test error recovery
  test('Network error recovery', async ({ page, context }) => {
    // Simulate network failure
    await context.route('**/api/profile/save', route => {
      route.abort('failed');
    });
    
    await page.goto('/onboarding');
    
    // Fill and submit form
    await page.fill('input[name="firstName"]', 'Network');
    await page.fill('input[name="lastName"]', 'Test');
    await page.fill('input[name="childrenCount"]', '1');
    await page.fill('input[name="phone"]', '5551234567');
    await page.click('button[type="submit"]');
    
    // Should show error message
    const errorMessage = await page.textContent('.error-message');
    expect(errorMessage).toContain('error');
    
    // Re-enable network
    await context.unroute('**/api/profile/save');
    
    // Retry should work
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });
});

// Performance tests
test.describe('Performance Tests', () => {
  test('Form submission performance', async ({ page }) => {
    await page.goto('/onboarding');
    
    const startTime = Date.now();
    
    await page.fill('input[name="firstName"]', 'Perf');
    await page.fill('input[name="lastName"]', 'Test');
    await page.fill('input[name="childrenCount"]', '2');
    await page.fill('input[name="phone"]', '5551234567');
    
    await Promise.all([
      page.waitForResponse('**/api/profile/save'),
      page.click('button[type="submit"]')
    ]);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should complete within 3 seconds
    expect(duration).toBeLessThan(3000);
    
    console.log(`Form submission took ${duration}ms`);
  });
});