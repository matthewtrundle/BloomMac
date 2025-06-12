const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupEmailLogs() {
  console.log('🔧 Setting up email logs table...\n');

  try {
    // Check if table exists
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'email_logs');

    if (tables && tables.length > 0) {
      console.log('✅ Email logs table already exists');
      
      // Check some sample logs
      const { data: logs, count } = await supabase
        .from('email_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(5);

      console.log(`\n📊 Email Logs Stats:`);
      console.log(`Total logs: ${count || 0}`);
      
      if (logs && logs.length > 0) {
        console.log('\nRecent emails:');
        logs.forEach(log => {
          console.log(`- ${log.type} to ${log.recipient} (${log.status}) - ${new Date(log.created_at).toLocaleString()}`);
        });
      }
    } else {
      console.log('❌ Email logs table does not exist');
      console.log('\nTo create it, run the following SQL in Supabase SQL Editor:');
      console.log('\n1. Go to: https://app.supabase.com/project/[YOUR_PROJECT_ID]/sql');
      console.log('2. Copy and run the SQL from: supabase/create-email-logs-table.sql');
    }

    // Test email configuration
    console.log('\n🔍 Checking email configuration...');
    
    const hasResendKey = !!process.env.RESEND_API_KEY;
    const hasSiteUrl = !!process.env.NEXT_PUBLIC_SITE_URL;
    
    console.log(`\n✓ RESEND_API_KEY: ${hasResendKey ? 'Configured' : 'Missing'}`);
    console.log(`✓ NEXT_PUBLIC_SITE_URL: ${hasSiteUrl ? process.env.NEXT_PUBLIC_SITE_URL : 'Missing'}`);
    
    if (!hasResendKey) {
      console.log('\n⚠️  To send custom emails (like welcome emails), add RESEND_API_KEY to your .env.local');
      console.log('   Get your API key from: https://resend.com/api-keys');
    }
    
    if (!hasSiteUrl) {
      console.log('\n⚠️  NEXT_PUBLIC_SITE_URL is required for email links to work properly');
      console.log('   Add to .env.local: NEXT_PUBLIC_SITE_URL=https://www.bloompsychologynorthaustin.com');
    }

    console.log('\n✅ Email setup check complete!');
    console.log('\nNext steps:');
    console.log('1. Configure SMTP in Supabase Dashboard → Settings → Auth → SMTP Settings');
    console.log('2. Test emails at: /admin/auth-email-test');
    console.log('3. Monitor email logs in the admin dashboard');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupEmailLogs();