#!/usr/bin/env node
/**
 * Force sign out any active sessions
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function forceSignOut() {
  console.log('🔄 Forcing sign out...\n');

  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Sign out failed:', error.message);
    } else {
      console.log('✅ Successfully signed out');
      console.log('   All sessions cleared');
      console.log('   You should now see the Login button');
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

forceSignOut();