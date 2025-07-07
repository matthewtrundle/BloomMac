import { test, expect } from '@playwright/test';

test('Simple onboarding flow test', async ({ page }) => {
  // Go to the site
  await page.goto('/');
  
  // Take a screenshot to see what we're working with
  await page.screenshot({ path: 'e2e/screenshots/homepage.png' });
  
  // Check if the site loads
  await expect(page).toHaveTitle(/Bloom/);
  
  console.log('✅ Site loads correctly');
  
  // Try to find signup/login elements
  const signupButton = page.locator('text=Get Started', 'text=Sign Up', 'text=Join');
  const loginButton = page.locator('text=Login', 'text=Sign In');
  
  if (await signupButton.first().isVisible()) {
    console.log('✅ Found signup button');
    await signupButton.first().click();
    await page.screenshot({ path: 'e2e/screenshots/signup-page.png' });
  } else if (await loginButton.first().isVisible()) {
    console.log('✅ Found login button');
    await loginButton.first().click();
    await page.screenshot({ path: 'e2e/screenshots/login-page.png' });
  } else {
    console.log('ℹ️  No obvious auth buttons found');
    await page.screenshot({ path: 'e2e/screenshots/no-auth-buttons.png' });
  }
  
  // Look for onboarding page
  await page.goto('/onboarding');
  await page.screenshot({ path: 'e2e/screenshots/onboarding-page.png' });
  
  // Check if onboarding form exists
  const firstNameInput = page.locator('input[name="firstName"]');
  if (await firstNameInput.isVisible()) {
    console.log('✅ Found onboarding form');
    
    // Fill out the form
    await firstNameInput.fill('Test');
    await page.locator('input[name="lastName"]').fill('User');
    await page.locator('input[name="childrenCount"]').fill('2');
    await page.locator('input[name="phone"]').fill('5551234567');
    
    await page.screenshot({ path: 'e2e/screenshots/form-filled.png' });
    
    // Try to submit
    const submitButton = page.locator('button[type="submit"]', 'button:has-text("Save")', 'button:has-text("Submit")');
    if (await submitButton.first().isVisible()) {
      await submitButton.first().click();
      console.log('✅ Form submitted');
      
      // Wait a bit and see what happens
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'e2e/screenshots/after-submit.png' });
    }
  } else {
    console.log('ℹ️  Onboarding form not found or not visible');
  }
});