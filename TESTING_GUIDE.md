# Bloom Project: Comprehensive Testing Guide

This document provides a complete guide for setting up and running the end-to-end (E2E) tests for the Bloom project using Playwright. Following these instructions will ensure a consistent and reliable testing environment.

## 1. Prerequisites

Before running the tests, ensure the following requirements are met:

1.  **Node.js:** Ensure you have a recent LTS version of Node.js installed (e.g., v20.x or later).
2.  **Project Dependencies:** Install all necessary npm packages by running the following command from the project root:
    ```bash
    npm install
    ```
3.  **Environment Variables:** The application requires a set of environment variables to run correctly.
    *   Copy the example environment file: `cp .env.example .env.local`
    *   Edit `.env.local` and fill in the required values, especially the Supabase URL and keys for your local development environment.
    *   **Important**: The development server is configured to run on port `3001`.
4.  **Database Setup:** The tests expect the database to be running and migrated to the latest version. Ensure you have applied the `V6_FINAL_MIGRATION.sql` script to your local database.
5.  **Playwright Installation:** Install the required browser binaries for Playwright:
    ```bash
    npx playwright install
    ```

## 2. Key Configuration Files

These files define how the tests are structured and executed.

### `package.json` (Test Scripts)

The following scripts are available for running tests:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p ${PORT:-3000}",
    "lint": "next lint",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:unit": "jest",
    "...": "..."
  }
}
```

### `playwright.config.ts`

This is the main configuration file for Playwright. It is configured to automatically manage the development server.

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // webServer config to automatically start dev server
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

## 3. Test Suites

The E2E tests are located in the `tests/` directory. The primary test suites are:

-   `tests/e2e/wellness-hub-tests.spec.ts`
-   `tests/e2e/provider-dashboard-tests.spec.ts`
-   `tests/e2e/onboarding.spec.ts`
-   `tests/e2e/simple-onboarding.spec.ts`

## 4. Running the Tests

To execute the entire E2E test suite, run the following command from the project root:

```bash
npx playwright test
```

This command will automatically perform the following steps:
1.  Start the Next.js development server.
2.  Wait for the server to be fully accessible at `http://localhost:3001`.
3.  Execute all tests found in the `tests/` directory across the configured browsers.
4.  Shut down the development server once the test run is complete.
5.  A detailed HTML report can be found in the `playwright-report` directory.

## 5. Troubleshooting

-   **`net::ERR_CONNECTION_REFUSED`**: This error indicates the test runner could not connect to the dev server. The `webServer` configuration in `playwright.config.ts` should handle this automatically. If this error persists, check for the following:
    -   Another process is already running on port `3001`.
    -   The development server fails to start due to an error. Try running `npm run dev` manually in a separate terminal to diagnose any startup issues.
-   **Test Failures**: Review the `playwright-report/index.html` file for detailed error messages, screenshots, and video recordings of the failed tests.
