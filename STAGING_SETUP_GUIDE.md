# 🚀 Staging Environment Setup Guide

## Overview
This guide will help you create a staging environment that exactly mirrors your production database.

## Option 1: Create a Staging Project on Supabase (Recommended)

### Step 1: Create a New Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name it something like "bloom-staging"
4. Choose the same region as production (us-east-2)
5. Generate a strong database password and save it

### Step 2: Clone Production Schema
Once your staging project is ready, we'll use pg_dump to copy the entire schema:

```bash
# Set your credentials
PROD_DB="postgresql://postgres.utetcmirepwdxbtrcczv:F13aUlrMdMFDpSkg@aws-0-us-east-2.pooler.supabase.com:5432/postgres"
STAGING_DB="postgresql://postgres.[YOUR-STAGING-PROJECT-ID]:[YOUR-STAGING-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

# Dump production schema (structure only, no data)
pg_dump "$PROD_DB" \
  --schema-only \
  --no-owner \
  --no-acl \
  --schema=public \
  --schema=auth \
  --schema=storage \
  > production-schema.sql

# Apply to staging
psql "$STAGING_DB" < production-schema.sql
```

### Step 3: Copy Essential Data
Copy only non-sensitive, essential data:

```bash
# Copy lookup data (courses, email templates, etc.)
pg_dump "$PROD_DB" \
  --data-only \
  --table=courses \
  --table=course_modules \
  --table=course_lessons \
  --table=email_templates \
  --table=appointment_types \
  > staging-data.sql

psql "$STAGING_DB" < staging-data.sql
```

### Step 4: Update Your Environment
Create a `.env.staging` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-STAGING-PROJECT-ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-STAGING-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-STAGING-SERVICE-KEY]
```

## Option 2: Use Supabase Branching (If Available)

Supabase is rolling out database branching which makes this easier:

```bash
# If you have access to branching
supabase link --project-ref [YOUR-PROJECT-REF]
supabase db branch create staging
supabase db branch switch staging
```

## Option 3: Local Staging with Docker

If you prefer a local staging environment:

### Step 1: Stop Current Local Instance
```bash
supabase stop
```

### Step 2: Create Staging Config
Create `supabase/config.staging.toml`:

```toml
[project]
id = "bloom-staging"

[db]
port = 54323
shadow_port = 54324

[studio]
port = 54325

[api]
port = 54326

[auth]
site_url = "http://localhost:3000"
```

### Step 3: Start Staging Instance
```bash
supabase start --config supabase/config.staging.toml
```

## 🔄 Continuous Sync Strategy

### 1. Schema Migrations
All schema changes should go through migrations:

```bash
# Create migration
supabase migration new [description]

# Apply to staging first
supabase db push --db-url "$STAGING_DB"

# Test thoroughly, then apply to production
supabase db push --db-url "$PROD_DB"
```

### 2. Data Sync Script
Create a script to periodically sync non-sensitive data:

```bash
#!/bin/bash
# sync-staging-data.sh

# Tables to sync (non-sensitive only)
TABLES=(
  "courses"
  "course_modules" 
  "course_lessons"
  "email_templates"
  "appointment_types"
  "blog_posts"
)

for table in "${TABLES[@]}"; do
  echo "Syncing $table..."
  pg_dump "$PROD_DB" --data-only --table=$table | psql "$STAGING_DB"
done
```

## 🛡️ Security Considerations

1. **Never sync sensitive data** (user_profiles, payments, etc.)
2. **Use test accounts** for staging
3. **Different API keys** for staging vs production
4. **Separate admin accounts** for staging

## 📋 Testing Checklist

After setting up staging, test:

- [ ] User registration/login
- [ ] Profile management
- [ ] Course enrollment
- [ ] Payment flows (use Stripe test mode)
- [ ] Email sending (use test email service)
- [ ] Admin dashboard
- [ ] All RLS policies

## 🚀 Deployment Flow

1. **Local Development** → Make changes
2. **Staging** → Test changes with production schema
3. **Production** → Deploy after staging validation

## Environment Variables

Update your package.json:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:staging": "cp .env.staging .env.local && next dev",
    "dev:prod": "cp .env.production .env.local && next dev"
  }
}
```

Now you can easily switch environments:
```bash
npm run dev:staging  # Use staging database
npm run dev:prod     # Use production database (careful!)
npm run dev          # Use local database
```