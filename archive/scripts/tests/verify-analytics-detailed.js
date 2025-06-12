// Detailed verification script to check analytics data
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyAnalyticsDetailed() {
  console.log('Performing detailed analytics verification...\n');

  // Check analytics_events table
  console.log('=== ANALYTICS_EVENTS TABLE ===');
  try {
    const { data, count, error } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: false })
      .limit(5);
    
    if (error) throw error;
    console.log(`Total records: ${count}`);
    if (data && data.length > 0) {
      console.log('Sample records:');
      data.forEach((record, index) => {
        console.log(`  ${index + 1}. Type: ${record.type}, Page: ${record.page}, Created: ${record.created_at}`);
      });
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }

  // Check chat_conversations table
  console.log('\n=== CHAT_CONVERSATIONS TABLE ===');
  try {
    const { data, count, error } = await supabase
      .from('chat_conversations')
      .select('*', { count: 'exact', head: false })
      .limit(5);
    
    if (error) throw error;
    console.log(`Total records: ${count}`);
    if (data && data.length > 0) {
      console.log('Sample records:');
      data.forEach((record, index) => {
        console.log(`  ${index + 1}. Session: ${record.session_id}, Created: ${record.created_at}`);
      });
    }
  } catch (err) {
    if (err.message.includes('does not exist')) {
      console.log('Table does not exist');
    } else {
      console.log(`Error: ${err.message}`);
    }
  }

  // Check click_heatmap table
  console.log('\n=== CLICK_HEATMAP TABLE ===');
  try {
    const { data, count, error } = await supabase
      .from('click_heatmap')
      .select('*', { count: 'exact', head: false })
      .limit(5);
    
    if (error) throw error;
    console.log(`Total records: ${count}`);
    if (data && data.length > 0) {
      console.log('Sample records:');
      data.forEach((record, index) => {
        console.log(`  ${index + 1}. Page: ${record.page_url}, X: ${record.x}, Y: ${record.y}`);
      });
    }
  } catch (err) {
    if (err.message.includes('does not exist')) {
      console.log('Table does not exist');
    } else {
      console.log(`Error: ${err.message}`);
    }
  }

  // Check email_automation_logs table
  console.log('\n=== EMAIL_AUTOMATION_LOGS TABLE ===');
  try {
    const { data, count, error } = await supabase
      .from('email_automation_logs')
      .select('*', { count: 'exact', head: false })
      .limit(5);
    
    if (error) throw error;
    console.log(`Total records: ${count}`);
    if (data && data.length > 0) {
      console.log('Sample records:');
      data.forEach((record, index) => {
        console.log(`  ${index + 1}. Email: ${record.email}, Type: ${record.email_type}, Status: ${record.status}`);
      });
    }
  } catch (err) {
    if (err.message.includes('does not exist')) {
      console.log('Table does not exist');
    } else {
      console.log(`Error: ${err.message}`);
    }
  }

  // Check admin_activity_log table
  console.log('\n=== ADMIN_ACTIVITY_LOG TABLE ===');
  try {
    const { data, count, error } = await supabase
      .from('admin_activity_log')
      .select('*', { count: 'exact', head: false })
      .limit(5);
    
    if (error) throw error;
    console.log(`Total records: ${count}`);
    if (data && data.length > 0) {
      console.log('Sample records:');
      data.forEach((record, index) => {
        console.log(`  ${index + 1}. Action: ${record.action}, Entity: ${record.entity_type}, Created: ${record.created_at}`);
      });
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }

  // Summary of preserved data
  console.log('\n=== PRESERVED DATA (Should NOT be cleared) ===');
  
  try {
    const { count: contactCount } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });
    console.log(`Contact Submissions: ${contactCount} records`);
  } catch (err) {
    console.log(`Contact Submissions: Error - ${err.message}`);
  }

  try {
    const { count: subscriberCount } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true });
    console.log(`Newsletter Subscribers: ${subscriberCount} records`);
  } catch (err) {
    // Try newsletter_signups as fallback
    try {
      const { count: signupCount } = await supabase
        .from('newsletter_signups')
        .select('*', { count: 'exact', head: true });
      console.log(`Newsletter Signups: ${signupCount} records`);
    } catch (err2) {
      console.log(`Newsletter Data: Error - ${err.message}`);
    }
  }

  try {
    const { count: blogCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    console.log(`Blog Posts: ${blogCount} records`);
  } catch (err) {
    console.log(`Blog Posts: Error - ${err.message}`);
  }

  try {
    const { count: careerCount } = await supabase
      .from('career_applications')
      .select('*', { count: 'exact', head: true });
    console.log(`Career Applications: ${careerCount} records`);
  } catch (err) {
    console.log(`Career Applications: Error - ${err.message}`);
  }

  console.log('\n=== END OF VERIFICATION ===');
}

verifyAnalyticsDetailed().catch(console.error);