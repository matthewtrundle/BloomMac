require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function monitorEmailErrors() {
  console.log('📊 Email System Health Check\n');
  console.log('=' .repeat(50));
  
  try {
    // Check for recent errors
    const { data: recentErrors, error: errorFetch } = await supabase
      .from('email_automation_errors')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('created_at', { ascending: false });
    
    if (errorFetch) {
      console.error('Error fetching error logs:', errorFetch);
      return;
    }
    
    console.log(`\n🔴 Errors in last 24 hours: ${recentErrors?.length || 0}`);
    
    if (recentErrors && recentErrors.length > 0) {
      console.log('\nRecent errors:');
      recentErrors.forEach(err => {
        console.log(`- ${err.error} (${new Date(err.created_at).toLocaleString()})`);
        if (err.error_details?.email) {
          console.log(`  Email: "${err.error_details.email}"`);
        }
      });
    }
    
    // Check successful emails
    const { data: successfulEmails, count: successCount } = await supabase
      .from('email_automation_logs')
      .select('*', { count: 'exact' })
      .eq('status', 'sent')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    console.log(`\n🟢 Successful emails in last 24 hours: ${successCount || 0}`);
    
    // Check pending emails
    const { count: pendingCount } = await supabase
      .from('email_automation_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sending');
    
    console.log(`\n🟡 Emails currently sending: ${pendingCount || 0}`);
    
    // Check active subscribers
    const { count: subscriberCount } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    console.log(`\n👥 Active subscribers: ${subscriberCount || 0}`);
    
    // Check active sequences
    const { data: activeSequences } = await supabase
      .from('email_sequences')
      .select('name, status')
      .eq('status', 'active');
    
    console.log(`\n📋 Active email sequences: ${activeSequences?.length || 0}`);
    if (activeSequences && activeSequences.length > 0) {
      activeSequences.forEach(seq => {
        console.log(`  - ${seq.name}`);
      });
    }
    
    // Summary
    console.log('\n' + '=' .repeat(50));
    const errorRate = (recentErrors?.length || 0) / ((successCount || 0) + (recentErrors?.length || 0)) * 100;
    console.log(`\n📈 Error rate: ${errorRate.toFixed(2)}%`);
    
    if (errorRate > 5) {
      console.log('\n⚠️  WARNING: Error rate is above 5% - investigation recommended');
    } else {
      console.log('\n✅ Email system is healthy');
    }
    
  } catch (error) {
    console.error('Monitoring error:', error);
  }
}

monitorEmailErrors();