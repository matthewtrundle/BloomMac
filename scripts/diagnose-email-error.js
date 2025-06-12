require('dotenv').config();

console.log('\n🔍 Diagnosing Email Configuration\n');
console.log('='.repeat(50));

// Check environment variables
console.log('\n1. Environment Variables:');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');

// Test Resend initialization
console.log('\n2. Testing Resend Client:');
try {
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  console.log('✅ Resend client created successfully');
} catch (error) {
  console.log('❌ Resend initialization error:', error.message);
}

// Check for common issues
console.log('\n3. Common Issues Check:');

// Check if trying to use Resend without API key
if (!process.env.RESEND_API_KEY) {
  console.log('❌ RESEND_API_KEY is not set in environment variables');
  console.log('   This will cause errors when trying to send emails');
  console.log('   Add it to your .env.local file: RESEND_API_KEY=re_...');
}

// Test database connection
console.log('\n4. Testing Database Connection:');
(async () => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Check for subscribers with invalid emails
    const { data: invalidEmails, error } = await supabase
      .from('subscribers')
      .select('id, email')
      .or('email.is.null,email.eq.');
      
    if (error) {
      console.log('❌ Database query error:', error.message);
    } else {
      console.log('✅ Database connection successful');
      if (invalidEmails && invalidEmails.length > 0) {
        console.log(`⚠️  Found ${invalidEmails.length} subscribers with invalid emails`);
      }
    }
    
    // Check for any pending emails
    const { count: pendingCount } = await supabase
      .from('email_automation_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sending');
      
    if (pendingCount > 0) {
      console.log(`⚠️  ${pendingCount} emails stuck in 'sending' status`);
    }
    
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
  }
})();

console.log('\n' + '='.repeat(50));
console.log('\n💡 Recommendations:');

if (!process.env.RESEND_API_KEY) {
  console.log('\n1. Add RESEND_API_KEY to your .env.local file');
  console.log('2. Get your API key from: https://resend.com/api-keys');
  console.log('3. Format: RESEND_API_KEY=re_123456789...');
}

console.log('\n✅ Diagnostic complete\n');

process.exit(0);