import { test, expect } from '@playwright/test';

test.describe('Provider Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page and log in as a provider
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'testprovider@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/provider/dashboard');
  });

  test('should display the provider dashboard with all sections', async ({ page }) => {
    // Check for the main sections of the dashboard
    await expect(page.locator('h1:has-text("Provider Dashboard")')).toBeVisible();
    await expect(page.locator('h2:has-text("Appointments")')).toBeVisible();
    await expect(page.locator('h3:has-text("Quick Actions")')).toBeVisible();
    await expect(page.locator('h3:has-text("30-Day Statistics")')).toBeVisible();
  });

  test('should fetch all dashboard data from the new unified API endpoint', async ({ page }) => {
    // Check that the new /api/provider/dashboard endpoint is being called
    const response = await page.waitForResponse(/\/api\/provider\/dashboard/);
    expect(response.ok()).toBe(true);
  });

  test('should display the provider\'s appointments', async ({ page }) => {
    // Check for the appointments section and at least one appointment
    await expect(page.locator('h2:has-text("Appointments")')).toBeVisible();
    await expect(page.locator('h3:has-text("Test User")')).toBeVisible();
  });

  test('should allow the provider to view their profile', async ({ page }) => {
    // Navigate to the profile page and check for the profile information
    await page.click('a[href="/provider/profile"]');
    await page.waitForURL('/provider/profile');
    await expect(page.locator('h1:has-text("Your Profile")')).toBeVisible();
    await expect(page.locator('p:has-text("Test Provider")')).toBeVisible();
  });

  test('should allow the provider to edit their profile', async ({ page }) => {
    // Navigate to the edit profile page, make a change, and save it
    await page.click('a[href="/provider/profile/edit"]');
    await page.waitForURL('/provider/profile/edit');
    await expect(page.locator('h1:has-text("Edit Your Profile")')).toBeVisible();
    await page.fill('input[name="title"]', 'Lead Therapist');
    await page.click('button:has-text("Save Profile")');
    await page.waitForURL('/provider/profile');
    await expect(page.locator('p:has-text("Lead Therapist")')).toBeVisible();
  });

  test('should allow the provider to view their clients\' workbook submissions', async ({ page }) => {
    // Navigate to the workbooks page and check for the submissions
    await page.click('a[href="/provider/workbooks"]');
    await page.waitForURL('/provider/workbooks');
    await expect(page.locator('h1:has-text("Workbook Submissions")')).toBeVisible();
    await expect(page.locator('h3:has-text("Test User")')).toBeVisible();
  });
});
