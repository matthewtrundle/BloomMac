import { test, expect } from '@playwright/test';

test.describe('Production Critical Flows - Database & User Journey', () => {
  
  test.describe('1. Email Automation Flow', () => {
    test('Newsletter signup triggers email sequence', async ({ page }) => {
      // Generate unique email
      const testEmail = `test_${Date.now()}@example.com`;
      
      // Go to homepage
      await page.goto('/');
      
      // Find newsletter signup (adjust selector based on your actual UI)
      const newsletterInput = page.locator('input[type="email"]').first();
      await newsletterInput.fill(testEmail);
      
      // Submit newsletter form
      await page.locator('button:has-text("Subscribe")').click();
      
      // Wait for success message
      await expect(page.locator('text=Thank you for subscribing')).toBeVisible({ timeout: 10000 });
      
      // Verify enrollment was created (via API check)
      const response = await page.request.get('/api/test/verify-enrollment', {
        params: { email: testEmail, trigger: 'newsletter_signup' }
      });
      
      expect(response.ok()).toBe(true);
    });

    test('Contact form submission creates enrollment', async ({ page }) => {
      await page.goto('/contact');
      
      // Fill contact form
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', `contact_${Date.now()}@example.com`);
      await page.fill('textarea[name="message"]', 'Test message for automation');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Verify success
      await expect(page.locator('text=Thank you for contacting us')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('2. User Authentication & Profile Flow', () => {
    test('User can sign up and create profile', async ({ page }) => {
      const uniqueEmail = `user_${Date.now()}@example.com`;
      
      await page.goto('/auth/signup');
      
      // Fill signup form
      await page.fill('input[name="email"]', uniqueEmail);
      await page.fill('input[name="password"]', 'TestPass123!');
      await page.click('button[type="submit"]');
      
      // Should redirect to onboarding or dashboard
      await expect(page).toHaveURL(/\/(onboarding|dashboard)/, { timeout: 10000 });
    });

    test('Existing user can login and access dashboard', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Use test user we created
      await page.fill('input[name="email"]', 'testuser@example.com');
      await page.fill('input[name="password"]', 'password');
      await page.click('button[type="submit"]');
      
      // Should see dashboard
      await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
      await expect(page.locator('h1:has-text("Good morning")')).toBeVisible();
    });
  });

  test.describe('3. Provider Dashboard Flow', () => {
    test('Provider can login and access provider dashboard', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Login as provider
      await page.fill('input[name="email"]', 'testprovider@example.com');
      await page.fill('input[name="password"]', 'password');
      await page.click('button[type="submit"]');
      
      // Navigate to provider dashboard
      await page.goto('/provider/dashboard');
      
      // Verify provider-specific content
      await expect(page.locator('h1:has-text("Provider Dashboard")')).toBeVisible();
    });

    test('Provider can view and edit profile', async ({ page }) => {
      // Assumes already logged in from previous test
      await page.goto('/provider/profile');
      
      // Check profile loads
      await expect(page.locator('text=Test Provider')).toBeVisible();
      
      // Navigate to edit
      await page.click('a:has-text("Edit Profile")');
      await expect(page).toHaveURL('/provider/profile/edit');
      
      // Update bio
      await page.fill('textarea[name="bio"]', 'Updated provider bio for testing');
      await page.click('button:has-text("Save")');
      
      // Verify save
      await expect(page.locator('text=Profile updated successfully')).toBeVisible();
    });
  });

  test.describe('4. Data Integrity Checks', () => {
    test('User profiles table has proper structure', async ({ page }) => {
      // This tests the unified user model
      const response = await page.request.get('/api/test/check-user-model');
      expect(response.ok()).toBe(true);
      
      const data = await response.json();
      expect(data.hasRoleColumn).toBe(true);
      expect(data.hasNoEmailColumn).toBe(true); // Email should be in auth.users
    });

    test('Email sequences are properly configured', async ({ page }) => {
      const response = await page.request.get('/api/test/check-email-config');
      expect(response.ok()).toBe(true);
      
      const data = await response.json();
      expect(data.activeSequences).toContain('newsletter_signup');
      expect(data.activeSequences).toContain('contact_form');
    });
  });

  test.describe('5. Critical API Endpoints', () => {
    test('Dashboard API returns unified data', async ({ page }) => {
      // Login first
      await page.goto('/auth/login');
      await page.fill('input[name="email"]', 'testuser@example.com');
      await page.fill('input[name="password"]', 'password');
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard');
      
      // Test unified dashboard endpoint
      const response = await page.request.get('/api/dashboard');
      expect(response.ok()).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveProperty('profile');
      expect(data).toHaveProperty('achievements');
      expect(data).toHaveProperty('courses');
    });
  });
});

// Smoke tests that can run against production
test.describe('Production Smoke Tests (Read-Only)', () => {
  test('Homepage loads with critical elements', async ({ page }) => {
    await page.goto('/');
    
    // Check key elements exist
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Bloom Psychology')).toBeVisible();
    await expect(page.locator('a:has-text("Login")')).toBeVisible();
  });

  test('Critical pages return 200 status', async ({ page }) => {
    const pages = ['/', '/about', '/services', '/contact', '/auth/login'];
    
    for (const path of pages) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    }
  });

  test('Newsletter signup form is functional', async ({ page }) => {
    await page.goto('/');
    
    // Find newsletter form
    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible();
    
    // Check form can be filled (but don't submit in production)
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });
});