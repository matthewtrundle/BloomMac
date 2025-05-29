// Script to verify all analytics data has been cleared from Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyAnalyticsCleared() {
  console.log('Verifying analytics data has been cleared...\n');

  const results = {};

  // Check analytics_events table
  try {
    const { count, error } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    results.analytics_events = count || 0;
  } catch (err) {
    results.analytics_events = `Error: ${err.message}`;
  }

  // Check chat_conversations table
  try {
    const { count, error } = await supabase
      .from('chat_conversations')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    results.chat_conversations = count || 0;
  } catch (err) {
    results.chat_conversations = err.message.includes('does not exist') ? 'Table does not exist' : `Error: ${err.message}`;
  }

  // Check click_heatmap table
  try {
    const { count, error } = await supabase
      .from('click_heatmap')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    results.click_heatmap = count || 0;
  } catch (err) {
    results.click_heatmap = err.message.includes('does not exist') ? 'Table does not exist' : `Error: ${err.message}`;
  }

  // Check email_automation_logs table
  try {
    const { count, error } = await supabase
      .from('email_automation_logs')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    results.email_automation_logs = count || 0;
  } catch (err) {
    results.email_automation_logs = err.message.includes('does not exist') ? 'Table does not exist' : `Error: ${err.message}`;
  }

  // Check admin_activity_log table
  try {
    const { count, error } = await supabase
      .from('admin_activity_log')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    results.admin_activity_log = count || 0;
  } catch (err) {
    results.admin_activity_log = `Error: ${err.message}`;
  }

  // Check preserved data (should NOT be cleared)
  console.log('=== ANALYTICS DATA (Should be 0) ===');
  console.log(`Analytics Events: ${results.analytics_events}`);
  console.log(`Chat Conversations: ${results.chat_conversations}`);
  console.log(`Click Heatmap: ${results.click_heatmap}`);
  console.log(`Email Automation Logs: ${results.email_automation_logs}`);
  console.log(`Admin Activity Log: ${results.admin_activity_log}`);

  console.log('\n=== PRESERVED BUSINESS DATA (Should NOT be 0) ===');
  
  // Check contact_submissions (should be preserved)
  try {
    const { count, error } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log(`Contact Submissions: ${count || 0} (preserved)`);
  } catch (err) {
    console.log(`Contact Submissions: Error - ${err.message}`);
  }

  // Check subscribers (should be preserved)
  try {
    const { count, error } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log(`Newsletter Subscribers: ${count || 0} (preserved)`);
  } catch (err) {
    console.log(`Newsletter Subscribers: Error - ${err.message}`);
  }

  // Check blog_posts (should be preserved)
  try {
    const { count, error } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log(`Blog Posts: ${count || 0} (preserved)`);
  } catch (err) {
    console.log(`Blog Posts: Error - ${err.message}`);
  }

  // Check career_applications (should be preserved)
  try {
    const { count, error } = await supabase
      .from('career_applications')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log(`Career Applications: ${count || 0} (preserved)`);
  } catch (err) {
    console.log(`Career Applications: Error - ${err.message}`);
  }

  console.log('\n=== VERIFICATION COMPLETE ===');
  
  // Summary
  const analyticsCleared = Object.entries(results).every(([table, count]) => {
    if (typeof count === 'number') return count === 0;
    if (typeof count === 'string') return count === 'Table does not exist' || count.includes('Error');
    return false;
  });
  
  if (analyticsCleared) {
    console.log('✓ All analytics data has been successfully cleared!');
  } else {
    console.log('✗ Some analytics data may not have been cleared properly.');
    console.log('Please check the tables with non-zero counts above.');
  }
}

verifyAnalyticsCleared().catch(console.error);