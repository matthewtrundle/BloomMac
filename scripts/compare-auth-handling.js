const fs = require('fs');
const path = require('path');

console.log('🔍 Comparing Authentication Handling Between Pages\n');

// Read both files
const dashboardPath = path.join(__dirname, '../app/dashboard/page.tsx');
const settingsPath = path.join(__dirname, '../app/settings/page.tsx');

const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8');
const settingsContent = fs.readFileSync(settingsPath, 'utf-8');

console.log('1. Dashboard Page Authentication:');
console.log('   - Uses: useAuth() from AuthContext');
console.log('   - Checks: !authLoading && !user');
console.log('   - Redirect: router.push(\'/auth/login\')');
console.log('   - Loading state: Shows spinner while authLoading is true');

console.log('\n2. Settings Page Authentication:');
console.log('   - Uses: createClientComponentClient() directly');
console.log('   - Checks: await supabase.auth.getSession()');
console.log('   - Redirect: router.push(\'/auth/login\')');
console.log('   - Loading state: Shows spinner while !user');

console.log('\n3. KEY DIFFERENCES:');
console.log('   ❌ Dashboard uses AuthContext (centralized auth state)');
console.log('   ❌ Settings uses Supabase client directly (independent auth check)');
console.log('   ❌ This could cause race conditions or inconsistent auth state');

console.log('\n4. POTENTIAL ISSUES:');
console.log('   1. Settings page might redirect before middleware refreshes session');
console.log('   2. AuthContext might not be updated when navigating from dashboard');
console.log('   3. Different auth checking methods could have different timing');

console.log('\n5. SOLUTION:');
console.log('   The settings page should use the same AuthContext as the dashboard');
console.log('   This ensures consistent auth state across the application');