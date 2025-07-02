# Onboarding Flow Testing

This directory contains test scripts to help identify issues in the onboarding flow without manual testing.

## Available Test Scripts

### 1. API Test (Quick & Simple)
Tests all API endpoints used in onboarding without a browser:

```bash
npm run test:onboarding
```

This will test:
- Signup endpoint
- Analytics tracking endpoint
- Newsletter signup endpoint
- Achievements endpoint

### 2. Browser Test (Full Flow)
**Note:** Requires Playwright to be installed:

```bash
npm install --save-dev playwright
npm run test:onboarding:browser
```

This will:
- Launch a browser
- Go through the complete signup flow
- Fill all forms automatically
- Take screenshots on errors
- Report any issues found

### 3. Debug Helper (For Manual Testing)
To add detailed console logging during manual testing, add this to your layout:

```jsx
{process.env.NODE_ENV === 'development' && (
  <script src="/scripts/onboarding-debug-helper.js" />
)}
```

## Quick API Test (No Dependencies)

Run the API test to quickly check if all endpoints are working:

```bash
node scripts/test-onboarding-api.js
```

## What Gets Tested

1. **Signup Flow**
   - Form validation
   - Account creation
   - Redirect to onboarding

2. **Profile Step**
   - Name pre-filling from signup
   - Form validation
   - Profile save to database

3. **Consent Step**
   - Terms already accepted check
   - HIPAA consent
   - Marketing preferences

4. **Access Step**
   - Waitlist selection
   - Newsletter signup

5. **Completion**
   - Achievement awarding
   - Dashboard redirect

## Common Issues Found

1. **"No user found in session"**
   - Auth context not properly loaded
   - Session expired
   - User not authenticated

2. **API Endpoint Errors**
   - Missing endpoints (404)
   - Server errors (500)
   - Invalid request data (400)

3. **Form Validation**
   - Required fields not filled
   - Invalid formats (phone, email)
   - Partial data (emergency contact)

## Test User Cleanup

Test users are created with timestamp-based emails like:
`test_1234567890@example.com`

To clean up test users from Supabase:
1. Go to Supabase Dashboard
2. Navigate to Authentication > Users
3. Search for "test_"
4. Delete test users

## Adding More Tests

To add more test scenarios, edit:
- `test-onboarding-flow.js` for browser tests
- `test-onboarding-api.js` for API tests

## Environment Variables

Set these before running tests:
```bash
export BASE_URL=http://localhost:3000  # or your staging URL
```