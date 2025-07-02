#!/usr/bin/env node
/**
 * Check current authentication state in Supabase
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAuthState() {
  console.log('🔍 Checking Current Auth State\n');

  try {
    // Check for active session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Error checking session:', error.message);
      return;
    }

    if (session) {
      console.log('✅ Active session found:');
      console.log('   User ID:', session.user.id);
      console.log('   Email:', session.user.email);
      console.log('   Session expires:', new Date(session.expires_at * 1000).toLocaleString());
      console.log('   Email confirmed:', session.user.email_confirmed_at ? 'Yes' : 'No');
      
      // Check profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profile) {
        console.log('\n📋 User Profile:');
        console.log('   Name:', profile.first_name, profile.last_name);
        console.log('   Phone:', profile.phone);
      } else {
        console.log('\n⚠️  No profile found for this user');
      }
      
      console.log('\n🔄 To sign out this user, run:');
      console.log('   node scripts/force-signout.js');
      
    } else {
      console.log('❌ No active session found');
      console.log('   You should see the Login button in the header');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkAuthState();