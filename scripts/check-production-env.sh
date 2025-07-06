#!/bin/bash
echo "🔍 CHECKING PRODUCTION ENVIRONMENT VARIABLES"
echo "============================================"
echo ""

echo "1️⃣ Testing local environment variables..."
node scripts/debug-env-vars.js

echo ""
echo "2️⃣ Testing production environment variables via API..."
echo ""

curl -s https://www.bloompsychologynorthaustin.com/api/debug/env | jq '.' || {
  echo "❌ Failed to call debug API or jq not available"
  echo "Raw response:"
  curl -s https://www.bloompsychologynorthaustin.com/api/debug/env
}

echo ""
echo "3️⃣ Testing if supabase import works in browser..."
echo ""

# Test if the main supabase import fails
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  https://www.bloompsychologynorthaustin.com/onboarding

echo ""
echo "📋 NEXT STEPS:"
echo "1. Check if all variables show 'SET' in production"
echo "2. Verify supabaseClientTest shows 'created: true'"
echo "3. If variables are missing, check Vercel dashboard"
echo "4. If client creation fails, check the error message"