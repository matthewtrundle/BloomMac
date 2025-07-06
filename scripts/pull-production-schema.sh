#!/bin/bash

echo "🔄 Pulling complete production schema..."

# Database connection
DB_URL="postgresql://postgres.utetcmirepwdxbtrcczv:F13aUlrMdMFDpSkg@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

# Create a complete schema dump (structure only, no data)
echo "📥 Dumping production schema..."
pg_dump "$DB_URL" \
  --schema-only \
  --no-owner \
  --no-privileges \
  --no-comments \
  --schema=public \
  --schema=auth \
  --schema=storage \
  > production-schema-complete.sql

echo "✅ Schema dump complete!"

# Create a migration file that can be applied to local
echo "🔧 Creating migration file..."
cat > supabase/migrations/$(date +%Y%m%d)_sync_with_production.sql << 'EOF'
-- =====================================================
-- Sync Local Database with Production Schema
-- Generated: $(date)
-- =====================================================

-- IMPORTANT: Review this file before applying!
-- Some tables might already exist locally

EOF

# Append the schema dump
cat production-schema-complete.sql >> supabase/migrations/$(date +%Y%m%d)_sync_with_production.sql

echo "📄 Migration file created: supabase/migrations/$(date +%Y%m%d)_sync_with_production.sql"
echo ""
echo "⚠️  IMPORTANT: Before applying this migration:"
echo "1. Review the file for any conflicts"
echo "2. Backup your local database"
echo "3. Apply with: npx supabase db push supabase/migrations/$(date +%Y%m%d)_sync_with_production.sql --local"