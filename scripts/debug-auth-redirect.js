const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugAuthRedirect() {
  console.log('🔍 Debugging Authentication Redirect Issue\n');

  console.log('📋 PROBLEM SUMMARY:');
  console.log('   Users are redirected to login page when clicking Settings from Dashboard');
  console.log('   Even though they are already logged in\n');

  console.log('🔎 ROOT CAUSE ANALYSIS:');
  console.log('   1. Dashboard uses AuthContext (consistent auth state)');
  console.log('   2. Settings page WAS using Supabase client directly');
  console.log('   3. This caused race conditions between:');
  console.log('      - Middleware session refresh');
  console.log('      - Settings page auth check');
  console.log('      - AuthContext state update\n');

  console.log('✅ SOLUTION IMPLEMENTED:');
  console.log('   Modified /app/settings/page.tsx to use AuthContext');
  console.log('   Now both pages use the same auth state source\n');

  console.log('🧪 TESTING THE FIX:');
  console.log('   1. Clear browser cookies/storage');
  console.log('   2. Log in fresh');
  console.log('   3. Navigate to Dashboard');
  console.log('   4. Click Settings link');
  console.log('   5. Should now work without redirect\n');

  console.log('📝 ADDITIONAL CHECKS:');
  
  // Check if there are any user preferences that might affect auth
  try {
    const { data: prefs, error } = await supabase
      .from('user_preferences')
      .select('user_id')
      .limit(5);
    
    console.log(`   - User preferences table: ${prefs ? `✅ ${prefs.length} records` : '❌ Not accessible'}`);
  } catch (e) {
    console.log('   - User preferences table: ❌ Error accessing');
  }

  console.log('\n🛠️ IF ISSUE PERSISTS:');
  console.log('   1. Check browser DevTools > Network tab for 401 errors');
  console.log('   2. Check browser DevTools > Application > Cookies for:');
  console.log('      - sb-<project-id>-auth-token');
  console.log('      - sb-<project-id>-auth-token-code-verifier');
  console.log('   3. Check browser console for any auth errors');
  console.log('   4. Ensure Supabase Dashboard > Authentication > URL Configuration includes:');
  console.log('      - Site URL: http://localhost:3000 (or your dev URL)');
  console.log('      - Redirect URLs: http://localhost:3000/auth/callback');
  
  console.log('\n🔧 CODE CHANGES MADE:');
  console.log('   File: /app/settings/page.tsx');
  console.log('   - Added: import { useAuth } from \'@/contexts/AuthContext\'');
  console.log('   - Changed: const { user, loading: authLoading } = useAuth()');
  console.log('   - Updated: useEffect to check authLoading && user');
  console.log('   - Updated: Loading check to include authLoading');
}

debugAuthRedirect();