# Automated Backend Testing Suite

This comprehensive testing suite verifies all functionality outlined in `COMPREHENSIVE_BACKEND_TESTING_PLAN.md`.

## Quick Start

1. **Setup the test environment:**
   ```bash
   cd scripts/automated-tests
   node setup.js
   ```

2. **Run all tests:**
   ```bash
   npm run test
   ```

3. **Run individual test modules:**
   ```bash
   npm run test:database    # Database connection & migration
   npm run test:contact     # Contact form API
   npm run test:newsletter  # Newsletter signup API
   npm run test:career      # Career application API
   npm run test:email       # Email automation system
   npm run test:rate-limit  # Rate limiting protection
   npm run test:admin       # Admin authentication & access
   npm run test:security    # Security measures
   npm run test:performance # Performance & load testing
   ```

## Test Modules

### 1. Database Connection (`test-database-connection.js`)
- ✅ Supabase connection established
- ✅ CRUD operations work
- ✅ No legacy database references
- ✅ All required tables exist

### 2. Contact Form API (`test-contact-form-api.js`)
- ✅ Valid form submissions
- ✅ Data validation
- ✅ Database storage
- ✅ Email automation triggers
- ✅ Rate limiting (3 per hour)
- ✅ Concurrent request handling

### 3. Newsletter API (`test-newsletter-api.js`)
- ✅ Valid newsletter signups
- ✅ Duplicate prevention
- ✅ Reactivation of unsubscribed users
- ✅ Email validation
- ✅ Rate limiting (5 per hour)
- ✅ Field sanitization

### 4. Career Application API (`test-career-api.js`)
- ✅ Valid application submissions
- ✅ File upload handling
- ✅ File size/type validation
- ✅ Rate limiting (2 per hour)
- ✅ Required field validation

### 5. Email System (`test-email-system-api.js`)
- ✅ Environment configuration
- ✅ Email automation tables
- ✅ Trigger creation and processing
- ✅ Email logging
- ✅ Deduplication checks
- ✅ Template personalization

### 6. Rate Limiting (`test-rate-limiting.js`)
- ✅ Endpoint-specific limits enforced
- ✅ Proper HTTP 429 responses
- ✅ Rate limit headers included
- ✅ Different IPs have separate limits
- ✅ Rate limit reset after time window

### 7. Admin System (`test-admin-api.js`)
- ✅ JWT configuration
- ✅ Protected route access
- ✅ Token validation
- ✅ Activity logging
- ✅ CORS protection

### 8. Data Migration (`test-data-migration.js`)
- ✅ All tables exist with proper structure
- ✅ Row Level Security enabled
- ✅ No orphaned data
- ✅ No legacy database connections

### 9. Security (`test-security.js`)
- ✅ No hardcoded secrets
- ✅ Environment protection
- ✅ SQL injection protection
- ✅ XSS protection
- ✅ CSRF protection
- ✅ File upload security
- ✅ Authentication bypass prevention

### 10. Performance (`test-performance.js`)
- ✅ API response times < thresholds
- ✅ Concurrent request handling
- ✅ Database query performance
- ✅ Memory efficiency
- ✅ Large data handling
- ✅ Error recovery performance

## Configuration

### Environment Variables Required:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
JWT_SECRET=your_jwt_secret
```

### Production Testing:
To run tests against production:
```bash
ALLOW_PRODUCTION_TESTS=true npm run test
```

**⚠️ WARNING**: Production tests may create test data. Use with caution.

## Test Output

### Success Output:
```
🧪 Running Automated Backend Tests

▶️  Running: Database Connection
✅ All database connection tests passed

▶️  Running: Contact Form
✅ All contact form tests passed

... (all modules)

📊 Test Summary
─────────────────────────────────
✅ Passed: 45
❌ Failed: 0
⏱️  Duration: 32.5s

🎉 All tests passed! Backend is fully functional.
```

### Failure Output:
```
❌ Contact Form API - FAILED
   Error: Rate limiting not enforced

📊 Test Summary
─────────────────────────────────
✅ Passed: 43
❌ Failed: 2
⏱️  Duration: 28.1s

❌ 2 tests failed. Please fix issues before deployment.
```

## Test Data

### Automatic Cleanup:
- All tests clean up their own test data
- Test emails use `@automated-test.com` and `@test.com` domains
- Temporary files are removed after upload tests

### Manual Cleanup:
If tests are interrupted, you may need to manually clean:
```sql
-- Remove test data
DELETE FROM subscribers WHERE email LIKE '%@automated-test.com';
DELETE FROM contact_submissions WHERE email LIKE '%@test.com';
DELETE FROM career_applications WHERE email LIKE '%@test.com';
```

## Continuous Integration

### GitHub Actions Example:
```yaml
name: Backend Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd scripts/automated-tests
          npm install
      - name: Run tests
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
        run: npm run test
```

## Performance Benchmarks

### Expected Response Times:
- Contact Form API: < 1000ms
- Newsletter API: < 1000ms
- Career Application API: < 2000ms (file upload)
- Admin Login: < 500ms
- Database Queries: < 500ms

### Rate Limits:
- Contact Form: 3 requests/hour per IP
- Newsletter: 5 requests/hour per IP
- Career Applications: 2 requests/hour per IP
- Email Send: 10 requests/minute per IP

## Troubleshooting

### Common Issues:

1. **"Cannot find module" error:**
   ```bash
   cd scripts/automated-tests
   npm install
   ```

2. **Database connection failed:**
   - Check `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
   - Verify Supabase project is running

3. **Rate limit tests failing:**
   - Wait 1 hour between test runs
   - Or use different IP addresses

4. **File upload tests failing:**
   - Check Supabase Storage is configured
   - Verify bucket permissions

### Debug Mode:
```bash
NODE_ENV=test DEBUG=true npm run test
```

## Contributing

When adding new features:
1. Add corresponding test cases
2. Update this README
3. Ensure all tests pass
4. Document any new environment variables

## Support

For issues with the testing suite:
1. Check the logs for specific error messages
2. Verify all environment variables are set
3. Ensure Supabase tables and policies are correct
4. Run individual test modules to isolate issues