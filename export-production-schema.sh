#\!/bin/bash

# First, you need your project reference
echo "Enter your Supabase project reference (from your dashboard URL):"
read PROJECT_REF

echo "Enter your database password (from project settings):"
read -s DB_PASSWORD

# Export schema using pg_dump
echo "Exporting schema..."
PGPASSWORD=$DB_PASSWORD pg_dump \
  -h db.$PROJECT_REF.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  --schema-only \
  --no-owner \
  --no-privileges \
  > production-schema.sql

echo "Schema exported to production-schema.sql"
