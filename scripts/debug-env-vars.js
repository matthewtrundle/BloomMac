// Debug script to check environment variables in production
// Run with: node scripts/debug-env-vars.js

console.log('🔍 ENVIRONMENT VARIABLES DEBUG');
console.log('==============================');
console.log('');

console.log('Node Environment:', process.env.NODE_ENV);
console.log('Platform:', typeof window !== 'undefined' ? 'Browser' : 'Node.js');
console.log('');

// Check Supabase variables
console.log('📊 SUPABASE CONFIGURATION:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING');

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('URL starts with:', process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...');
}

if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('Anon Key starts with:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 30) + '...');
}

console.log('');

// Test Supabase client creation
console.log('🧪 TESTING SUPABASE CLIENT CREATION:');
try {
  const { createClient } = require('@supabase/supabase-js');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('❌ Cannot create client - missing environment variables');
  } else {
    const testClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    console.log('✅ Supabase client created successfully');
    console.log('Client has auth:', !!testClient.auth);
    console.log('Client has from:', !!testClient.from);
  }
} catch (error) {
  console.log('❌ Error creating Supabase client:', error.message);
}

console.log('');

// Check other important variables
console.log('🔐 OTHER CRITICAL VARIABLES:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'MISSING');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'MISSING');
console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL ? 'SET' : 'MISSING');

console.log('');
console.log('📝 All environment variables starting with NEXT_PUBLIC:');
Object.keys(process.env)
  .filter(key => key.startsWith('NEXT_PUBLIC'))
  .forEach(key => {
    console.log(`${key}: ${process.env[key] ? 'SET' : 'MISSING'}`);
  });