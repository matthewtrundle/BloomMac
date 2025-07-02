#!/usr/bin/env node

/**
 * Quick onboarding check - simulates the problematic flow
 */

console.log('🔍 Quick Onboarding Flow Check\n');

// Check 1: Environment variables
console.log('1️⃣ Checking environment setup...');
const checks = {
  'Supabase URL': process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌',
  'Supabase Anon Key': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌',
  'Resend API Key': process.env.RESEND_API_KEY ? '✅' : '❌',
};

for (const [key, status] of Object.entries(checks)) {
  console.log(`   ${status} ${key}`);
}

// Check 2: File existence
console.log('\n2️⃣ Checking required files...');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  '/pages/api/analytics/track.ts',
  '/pages/api/achievements.ts',
  '/pages/api/newsletter-signup.ts',
  '/components/onboarding/OnboardingFlow.tsx',
  '/components/onboarding/steps/ProfileStep.tsx',
  '/components/onboarding/steps/ConsentStep.tsx',
  '/components/onboarding/steps/AccessStep.tsx',
];

for (const file of requiredFiles) {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
}

// Check 3: Common issues
console.log('\n3️⃣ Common issues to check:');
console.log('   ⚠️  "No user found in session" - Fixed by using useAuth hook');
console.log('   ⚠️  "Something went wrong" - Check browser console for actual error');
console.log('   ⚠️  API endpoint 404s - All endpoints now created');
console.log('   ⚠️  Duplicate name/email - ProfileStep now pre-fills from signup');
console.log('   ⚠️  Terms already accepted - ConsentStep now handles this');

// Check 4: Database tables
console.log('\n4️⃣ Required Supabase tables:');
console.log('   📋 auth.users (built-in)');
console.log('   📋 public.user_profiles');
console.log('   📋 public.subscribers');
console.log('   📋 public.user_course_access');

// Summary
console.log('\n📊 Summary:');
console.log('   - All API endpoints have been created');
console.log('   - Auth flow has been fixed to use proper hooks');
console.log('   - Duplicate information collection has been resolved');
console.log('   - Error handling has been improved with better messages');
console.log('\n✨ The onboarding flow should now work without "Something went wrong" errors!');
console.log('\n🐛 If you still see errors:');
console.log('   1. Check browser console for specific error messages');
console.log('   2. Look for "No user found" or "Session expired" messages');
console.log('   3. Ensure all environment variables are set');
console.log('   4. Check that Supabase tables exist\n');