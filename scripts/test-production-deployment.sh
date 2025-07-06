#!/bin/bash
echo "🚀 TESTING PRODUCTION DEPLOYMENT"
echo "================================"
echo ""
echo "Testing privacy settings endpoint:"
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  https://www.bloompsychologynorthaustin.com/api/user/settings/privacy

echo ""
echo "Testing password change endpoint:"  
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  -X POST https://www.bloompsychologynorthaustin.com/api/user/settings/security/change-password

echo ""
echo "Testing settings page:"
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  https://www.bloompsychologynorthaustin.com/settings

echo ""
echo "✅ Expected results after deployment:"
echo "  - Privacy endpoint: 401 (requires auth)"
echo "  - Password endpoint: 401 (requires auth)" 
echo "  - Settings page: 200 (should load)"
echo ""
echo "If you see 404/405, wait another minute and try again."