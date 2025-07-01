const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

function checkSecurityStatus() {
  console.log('🔍 Checking Security Status...\n');

  const issues = [];
  const warnings = [];
  const good = [];

  // 1. Check JWT Secret
  console.log('1️⃣ Checking JWT Secret...');
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    issues.push('❌ JWT_SECRET not set in environment - using weak default');
  } else if (jwtSecret.length < 32) {
    warnings.push('⚠️ JWT_SECRET is short - recommend longer key');
  } else if (jwtSecret.includes('bloom') || jwtSecret.includes('change')) {
    warnings.push('⚠️ JWT_SECRET appears to be default/weak value');
  } else {
    good.push('✅ JWT_SECRET appears strong');
  }

  // 2. Check for hardcoded credentials
  console.log('\n2️⃣ Checking for hardcoded credentials...');
  const vulnerableFile = path.join(__dirname, '..', 'pages', 'api', 'admin', 'simple-login.ts');
  if (fs.existsSync(vulnerableFile)) {
    issues.push('❌ CRITICAL: Hardcoded credentials file still exists');
  } else {
    good.push('✅ Vulnerable credentials file removed');
  }

  // 3. Check Supabase keys
  console.log('\n3️⃣ Checking Supabase configuration...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || !supabaseAnonKey) {
    issues.push('❌ Missing Supabase environment variables');
  } else {
    good.push('✅ Supabase keys configured');
  }

  // 4. Check email configuration
  console.log('\n4️⃣ Checking email configuration...');
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    warnings.push('⚠️ RESEND_API_KEY not set - emails will fail');
  } else {
    good.push('✅ Email service configured');
  }

  // Report Results
  console.log('\n📊 SECURITY REPORT');
  console.log('=' .repeat(50));

  if (issues.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES:');
    issues.forEach(issue => console.log(`  ${issue}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️ WARNINGS:');
    warnings.forEach(warning => console.log(`  ${warning}`));
  }

  if (good.length > 0) {
    console.log('\n✅ SECURE:');
    good.forEach(item => console.log(`  ${item}`));
  }

  // Overall Status
  console.log('\n🎯 OVERALL SECURITY STATUS');
  console.log('=' .repeat(50));
  
  if (issues.length > 0) {
    console.log('🔴 CRITICAL - Immediate action required');
  } else if (warnings.length > 0) {
    console.log('🟡 NEEDS ATTENTION - Security improvements recommended');
  } else {
    console.log('🟢 SECURE - All checks passed');
  }

  console.log(`\nChecks: ${good.length} passed, ${warnings.length} warnings, ${issues.length} critical`);

  // Recommendations
  if (issues.length > 0 || warnings.length > 0) {
    console.log('\n💡 RECOMMENDATIONS:');
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('bloom')) {
      console.log('  1. Generate strong JWT_SECRET: openssl rand -base64 64');
      console.log('  2. Add to .env.local: JWT_SECRET=your_strong_secret_here');
    }
    if (!process.env.RESEND_API_KEY) {
      console.log('  3. Set up Resend API key for email delivery');
    }
  }
}

checkSecurityStatus();