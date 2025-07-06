#!/bin/bash

echo "🧪 COMPREHENSIVE USER FLOW TEST RUNNER"
echo "======================================"
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if required packages are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting comprehensive user flow test..."
echo ""
echo "This test will:"
echo "1. ✨ Create a new test user account"
echo "2. 👤 Create and edit user profile"
echo "3. 🔒 Set and modify privacy settings"
echo "4. 🔑 Change user password"
echo "5. ✅ Verify all data in database"
echo "6. 🧹 Clean up test data"
echo ""
echo "Press Ctrl+C to cancel, or wait 5 seconds to continue..."

# Give user a chance to cancel
sleep 5

echo ""
echo "Starting test execution..."
echo ""

# Run the test script
node scripts/comprehensive-user-flow-test.js

# Capture exit code
TEST_EXIT_CODE=$?

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED! Your user flow is working perfectly."
    echo ""
    echo "✅ Key Features Verified:"
    echo "   - User signup and authentication"
    echo "   - Profile creation and editing"
    echo "   - Privacy settings management"
    echo "   - Password change functionality"
    echo "   - Database persistence"
    echo ""
    echo "Your application is ready for users! 🚀"
else
    echo "❌ SOME TESTS FAILED. Please check the output above for details."
    echo ""
    echo "Common issues to check:"
    echo "   - Environment variables in .env.local"
    echo "   - Supabase database connectivity"
    echo "   - API endpoint availability"
    echo "   - Network connectivity to production server"
    echo ""
    echo "Run the test again after fixing any issues."
fi

exit $TEST_EXIT_CODE