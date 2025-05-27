# Supabase Setup Instructions

## Step 1: Create Database Tables

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/utetcmirepwdxbtrcczv
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Copy ALL the contents from the file: `/supabase/schema.sql`
5. Paste it into the SQL editor
6. Click **"Run"** (or press Cmd+Enter)

You should see a success message saying the tables were created.

## Step 2: Run Data Migration

Once the tables are created, run this command in your terminal:

```bash
cd /Users/mattrundle/Documents/Bloom
node scripts/migrate-to-supabase.js
```

This will:
- Create a backup of your current data
- Migrate blog posts to Supabase
- Migrate analytics events to Supabase
- Check for any newsletter subscribers

## Step 3: Verify Migration

1. Go back to Supabase Dashboard
2. Click on **"Table Editor"** in the left sidebar
3. Check these tables:
   - `blog_posts` - Should have 19 posts
   - `analytics_events` - Should have at least 1 event
   - `subscribers` - Will be empty (no file exists yet)

## Step 4: Test the Connection

After migration, let me know and I'll update all your API endpoints to use Supabase instead of JSON files.

## Important Notes

- Your data is backed up in `/data/backups/` before migration
- The original JSON files remain untouched
- Supabase automatically handles backups going forward

Ready? Start with Step 1 above!