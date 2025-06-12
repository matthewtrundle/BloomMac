require('dotenv').config();
const { processScheduledEmails } = require('../lib/email-automation');

async function testEmailAutomation() {
  console.log('Testing email automation with validation...\n');
  
  try {
    // Test the email automation process
    console.log('🔄 Running email automation process...');
    await processScheduledEmails();
    console.log('✅ Email automation completed successfully!\n');
    
    // Check for any errors that were logged
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    const { data: errors, error: fetchError } = await supabase
      .from('email_automation_errors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (fetchError) {
      console.error('Error fetching error logs:', fetchError);
      return;
    }
    
    if (errors && errors.length > 0) {
      console.log(`⚠️  Found ${errors.length} email errors:\n`);
      errors.forEach(err => {
        console.log(`Error ID: ${err.id}`);
        console.log(`Error: ${err.error}`);
        console.log(`Details: ${JSON.stringify(err.error_details, null, 2)}`);
        console.log(`Created: ${err.created_at}`);
        console.log('---');
      });
    } else {
      console.log('✅ No email errors found!');
    }
    
    // Check recent successful emails
    const { data: recentLogs } = await supabase
      .from('email_automation_logs')
      .select('*')
      .eq('status', 'sent')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentLogs && recentLogs.length > 0) {
      console.log(`\n📧 Recent successful emails: ${recentLogs.length}`);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testEmailAutomation();