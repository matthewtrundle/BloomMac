#!/bin/bash

echo "🔧 Running profile fields migration..."
echo ""
echo "This script will:"
echo "1. Add any missing fields to user_profiles table"
echo "2. Make all fields nullable except first_name and last_name"
echo "3. Add baby_due_date and timezone fields if missing"
echo ""

# Read the migration file
MIGRATION_SQL=$(cat /Users/mattrundle/Documents/Bloom/supabase/migrations/20250107_fix_profile_fields.sql)

# Execute via supabase CLI
echo "$MIGRATION_SQL" | supabase db push --db-url "$DATABASE_URL"

echo ""
echo "✅ Migration complete! Profile save should now work properly."
echo ""
echo "To test:"
echo "1. Go to https://www.bloompsychologynorthaustin.com/dashboard"
echo "2. Click on Edit Profile"
echo "3. Try saving your profile"
echo ""
echo "Or use the test page: https://www.bloompsychologynorthaustin.com/test-profile-save.html"