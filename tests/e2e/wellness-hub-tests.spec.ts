import { test, expect } from '@playwright/test';

test.describe('Wellness Hub (User Dashboard)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page and log in as a standard user
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should display the user dashboard with all sections', async ({ page }) => {
    // Check for the main sections of the dashboard
    await expect(page.locator('h1:has-text("Good morning")')).toBeVisible();
    await expect(page.locator('h2:has-text("Your Wellness Journey")')).toBeVisible();
    await expect(page.locator('h2:has-text("Your Courses")')).toBeVisible();
    await expect(page.locator('h2:has-text("Appointments")')).toBeVisible();
    await expect(page.locator('h2:has-text("Workbooks")')).toBeVisible();
  });

  test('should fetch all dashboard data from the new unified API endpoint', async ({ page }) => {
    // Check that the new /api/dashboard endpoint is being called
    const response = await page.waitForResponse('/api/dashboard');
    expect(response.ok()).toBe(true);
  });

  test('should display the correct user profile information', async ({ page }) => {
    // Check for the user's name and other profile information
    await expect(page.locator('h3:has-text("Test User")')).toBeVisible();
    await expect(page.locator('p:has-text("Member")')).toBeVisible();
  });

  test('should display the user\'s achievements', async ({ page }) => {
    // Check for the achievements section and at least one achievement
    await expect(page.locator('h4:has-text("Recent Achievements")')).toBeVisible();
    await expect(page.locator('h4:has-text("Welcome Explorer")')).toBeVisible();
  });

  test('should display the user\'s course progress', async ({ page }) => {
    // Check for the course progress section and at least one course
    await expect(page.locator('h3:has-text("Your Courses")')).toBeVisible();
    await expect(page.locator('h4:has-text("Postpartum Wellness")')).toBeVisible();
  });

  test('should display the user\'s upcoming appointments', async ({ page }) => {
    // Check for the appointments section and at least one appointment
    await expect(page.locator('h3:has-text("Appointments")')).toBeVisible();
    await expect(page.locator('h4:has-text("Upcoming Appointments")')).toBeVisible();
  });

  test('should display the user\'s workbook status', async ({ page }) => {
    // Check for the workbook status section and at least one workbook
    await expect(page.locator('h3:has-text("Workbooks")')).toBeVisible();
    await expect(page.locator('h4:has-text("Postpartum Wellness Foundations Workbooks")')).toBeVisible();
  });
});