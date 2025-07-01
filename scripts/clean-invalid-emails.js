const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Additional checks
  const invalidPatterns = [
    /\s/,           // No spaces
    /\.{2,}/,       // No consecutive dots
    /@.*@/,         // Only one @
    /^[.]/,         // Can't start with dot
    /[.]$/,         // Can't end with dot
    /@[.]/,         // Can't have @.
    /[.]@/          // Can't have .@
  ];
  
  if (!emailRegex.test(email)) return false;
  
  for (const pattern of invalidPatterns) {
    if (pattern.test(email)) return false;
  }
  
  return true;
}

async function cleanInvalidEmails() {
  console.log('🧹 Cleaning Invalid Email Addresses...\n');
  
  try {
    // 1. Get all subscribers
    console.log('📋 Fetching all subscribers...');
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('id, email, status, created_at');
    
    if (error) {
      console.error('❌ Error fetching subscribers:', error);
      return;
    }
    
    console.log(`✅ Found ${subscribers.length} total subscribers`);
    
    // 2. Identify invalid emails
    const invalidEmails = [];
    const validEmails = [];
    
    subscribers.forEach(subscriber => {
      if (isValidEmail(subscriber.email)) {
        validEmails.push(subscriber);
      } else {
        invalidEmails.push(subscriber);
      }
    });
    
    console.log(`\n📊 Email Validation Results:`);
    console.log(`   ✅ Valid emails: ${validEmails.length}`);
    console.log(`   ❌ Invalid emails: ${invalidEmails.length}`);
    
    if (invalidEmails.length === 0) {
      console.log('\n🎉 All email addresses are valid! No cleanup needed.');
      return;
    }
    
    // 3. Show invalid emails for review
    console.log(`\n❌ Invalid Email Addresses Found:`);
    invalidEmails.forEach((subscriber, index) => {
      console.log(`   ${index + 1}. ${subscriber.email} (ID: ${subscriber.id})`);
    });
    
    // 4. Option to delete or mark inactive
    console.log(`\n🔧 Cleanup Options:`);
    console.log(`   A. Mark invalid emails as 'inactive' (preserves data)`);
    console.log(`   B. Delete invalid email records completely`);
    console.log(`   C. Export invalid emails for manual review`);
    
    // For now, let's mark them as inactive (safer option)
    console.log(`\n🛡️ Taking safe approach: Marking invalid emails as 'inactive'...`);
    
    const invalidIds = invalidEmails.map(s => s.id);
    
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({ 
        status: 'invalid_email',
        updated_at: new Date().toISOString()
      })
      .in('id', invalidIds);
    
    if (updateError) {
      console.error('❌ Error updating invalid emails:', updateError);
      return;
    }
    
    console.log(`✅ Successfully marked ${invalidEmails.length} emails as 'invalid_email'`);
    
    // 5. Also check email_automation_logs for invalid sends
    console.log(`\n📋 Checking email automation logs for invalid sends...`);
    
    const { data: automationLogs, error: logError } = await supabase
      .from('email_automation_logs')
      .select('id, recipient_email, status')
      .eq('status', 'failed');
    
    if (logError) {
      console.log('⚠️  Could not check automation logs:', logError.message);
    } else {
      const failedEmailSends = automationLogs?.filter(log => 
        !isValidEmail(log.recipient_email)
      ) || [];
      
      console.log(`   📊 Failed sends to invalid emails: ${failedEmailSends.length}`);
      
      if (failedEmailSends.length > 0) {
        console.log(`   ℹ️  These failed sends are now expected (emails marked invalid)`);
      }
    }
    
    // 6. Create cleanup report
    const report = {
      total_subscribers: subscribers.length,
      valid_emails: validEmails.length,
      invalid_emails: invalidEmails.length,
      cleanup_action: 'marked_inactive',
      cleaned_at: new Date().toISOString(),
      invalid_email_list: invalidEmails.map(s => ({
        id: s.id,
        email: s.email,
        created_at: s.created_at
      }))
    };
    
    // Save report
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(__dirname, '..', 'data', 'backups', `email-cleanup-${new Date().toISOString().split('T')[0]}.json`);
    
    try {
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n📄 Cleanup report saved: ${reportPath}`);
    } catch (err) {
      console.log(`⚠️  Could not save report file: ${err.message}`);
    }
    
    console.log(`\n✅ Email cleanup complete!`);
    console.log(`\nSummary:`);
    console.log(`   • Total subscribers: ${subscribers.length}`);
    console.log(`   • Valid emails: ${validEmails.length} (${Math.round(validEmails.length/subscribers.length*100)}%)`);
    console.log(`   • Invalid emails: ${invalidEmails.length} (marked as 'invalid_email')`);
    console.log(`   • Email automation will skip invalid addresses`);
    
  } catch (error) {
    console.error('❌ Error during email cleanup:', error);
  }
}

cleanInvalidEmails().catch(console.error);