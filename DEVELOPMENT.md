# Bloom Psychology - Development Guide

## Prerequisites
- Docker Desktop
- Node.js 18+
- Supabase CLI (`brew install supabase/tap/supabase`)

## Local Development Setup

### 1. Start Docker Desktop
Make sure Docker is running before proceeding.

### 2. Start Local Supabase
```bash
# Start all Supabase services
supabase start

# This will give you:
# - API URL: http://localhost:54321
# - Studio URL: http://localhost:54323
# - Database: postgresql://postgres:postgres@localhost:54322/postgres
# - Anon Key: (shown in output)
# - Service Role Key: (shown in output)
```

### 3. Configure Environment
Create `.env.development.local`:
```env
# Copy the keys from supabase start output
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-local-service-key>

# Keep other services pointing to production for now
RESEND_API_KEY=<your-resend-key>
OPENROUTER_API_KEY=<your-openrouter-key>
```

### 4. Run Migrations
```bash
# Reset database and apply all migrations
supabase db reset

# This runs:
# 1. All migrations in supabase/migrations/
# 2. Seed file (if exists) from supabase/seed.sql
```

### 5. Generate TypeScript Types
```bash
# Generate types from your local database
supabase gen types typescript --local > lib/database.types.ts
```

### 6. Start Development Server
```bash
# Use local environment
npm run dev
```

## Database Management

### Creating New Migrations
```bash
# Create a new migration
supabase migration new <description>

# Example:
supabase migration new add_blog_posts_table

# Edit the file in supabase/migrations/
# Test locally with:
supabase db reset
```

### Pulling Production Schema
```bash
# Pull schema from production (requires auth)
supabase db pull

# This creates migrations for any remote changes
```

### Pushing to Production
```bash
# First, always test locally
supabase db reset

# Then push to production
supabase db push
```

## Testing

### Database Testing
```bash
# Run database-specific tests
node scripts/test_db_operations.js
```

### API Testing
```bash
# Test API routes against local Supabase
npm run test:api
```

### E2E Testing
```bash
# Run full E2E tests
npm run test:e2e
```

## Common Tasks

### Reset Everything
```bash
# Stop and clean up
supabase stop --no-backup

# Start fresh
supabase start
supabase db reset
```

### Check Database Status
```bash
# View running services
supabase status

# Access Studio UI
open http://localhost:54323
```

### Switch Between Local and Production
```bash
# For local development
npm run dev

# For production testing (uses .env.local)
NODE_ENV=production npm run dev
```

## Troubleshooting

### Docker Issues
- Make sure Docker Desktop is running
- Try `docker system prune` if you have space issues
- Restart Docker Desktop if containers won't start

### Migration Errors
- Check SQL syntax in migration files
- Ensure migrations run in correct order
- Use `supabase db reset --debug` for detailed errors

### Type Generation
- Always regenerate types after schema changes
- Commit the generated types file
- Types are in `lib/database.types.ts`

## Best Practices

1. **Always test migrations locally first**
2. **Keep seed data up to date**
3. **Use consistent test user IDs**
4. **Document any special setup steps**
5. **Don't commit local environment keys**