#!/usr/bin/env node

/**
 * Check Supabase auth settings to see if email confirmation is required
 */

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking Supabase Auth Configuration...\n');

console.log('Environment Variables:');
console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');

console.log('\n⚠️  Important Supabase Settings to Check:');
console.log('\n1. Go to your Supabase Dashboard');
console.log('2. Navigate to Authentication → Settings');
console.log('3. Check these critical settings:');
console.log('   - Email Confirmations: Should be DISABLED for immediate access');
console.log('   - Enable Email Confirmations: ❌ (unchecked)');
console.log('   - Double confirm email changes: ❌ (unchecked)');
console.log('\n4. If email confirmation is enabled:');
console.log('   - Users won\'t get a session until they confirm their email');
console.log('   - This causes the 401 errors you\'re seeing');
console.log('\n5. For production, you may want email confirmation ON');
console.log('   - But then handle the flow differently in the UI');

console.log('\n📝 Quick Fix Options:');
console.log('\nOption 1: Disable Email Confirmation (Development)');
console.log('- Go to Supabase Dashboard → Authentication → Settings');
console.log('- Uncheck "Enable Email Confirmations"');
console.log('- Save changes');

console.log('\nOption 2: Handle Email Confirmation Properly (Production)');
console.log('- Keep email confirmation enabled');
console.log('- After signup, redirect to a "check your email" page');
console.log('- Don\'t redirect to dashboard until email is confirmed');

console.log('\n🔗 Direct link to your project settings:');
console.log(`https://supabase.com/dashboard/project/${process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/(\w+)\.supabase\.co/)?.[1]}/auth/policies`);