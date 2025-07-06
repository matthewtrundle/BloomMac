# 🚀 Staging Environment Quick Start

## Prerequisites
- PostgreSQL client tools (`brew install postgresql` on macOS)
- Node.js and npm installed
- Access to create a new Supabase project

## Step 1: Create Staging Project on Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Name: `bloom-staging`
4. Region: `us-east-2` (same as production)
5. Generate a strong password and save it

## Step 2: Run Setup Script

```bash
# Make the script executable
chmod +x scripts/setup-staging-environment.sh

# Run the setup
./scripts/setup-staging-environment.sh
```

The script will:
- Dump your production schema
- Apply it to staging
- Copy essential data (courses, templates, etc.)
- Create environment files
- Set up npm scripts

## Step 3: Create Test Data

```bash
# Install dependencies if needed
npm install

# Create test users and data
node scripts/create-staging-test-data.js
```

## Step 4: Test Your Staging Environment

```bash
# Run the test suite
node scripts/test-staging-environment.js
```

## Step 5: Start Development

```bash
# Start with staging database
npm run dev:staging
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev:staging` | Start dev server with staging DB |
| `npm run build:staging` | Build with staging configuration |
| `npm run test:staging` | Run tests against staging |
| `./scripts/sync-staging-with-production.sh` | Check for schema differences |

## Important Notes

⚠️ **Security Reminders:**
- Never copy real user data to staging
- Use test payment credentials (Stripe test mode)
- Keep staging credentials separate from production
- Don't commit `.env.staging` to version control

## Deployment Flow

```
Local Dev → Staging → Production
```

1. Develop features locally
2. Test thoroughly in staging
3. Deploy to production only after staging validation

## Troubleshooting

### Schema Apply Failed
- Check if tables already exist
- Review error messages in the output
- Use `psql` to manually inspect

### Test Data Creation Failed
- Ensure service role key is correct
- Check if email service is configured
- Verify auth settings in Supabase dashboard

### Connection Issues
- Verify project ID and region
- Check database password
- Ensure IP is not blocked (Supabase security)

## Next Steps

1. ✅ Run all tests in staging
2. ✅ Verify all features work
3. ✅ Set up CI/CD pipeline for staging
4. ✅ Document any staging-specific configurations