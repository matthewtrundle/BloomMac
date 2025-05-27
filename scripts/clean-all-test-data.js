const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanAllTestData() {
  console.log('🧹 Cleaning ALL test data from Supabase...\n');

  try {
    // Clean analytics events with test patterns
    console.log('Removing test analytics events...');
    const { error: analyticsError1, count: count1 } = await supabase
      .from('analytics_events')
      .delete()
      .like('session_id', 'test-session-%')
      .select('*', { count: 'exact', head: true });
    
    const { error: analyticsError2, count: count2 } = await supabase
      .from('analytics_events')
      .delete()
      .like('user_id', 'test-user-%')
      .select('*', { count: 'exact', head: true });
    
    const totalAnalytics = (count1 || 0) + (count2 || 0);
    console.log(`✅ Removed ${totalAnalytics} test analytics events`);

    // Clean ALL test data based on email patterns
    console.log('\nRemoving all test email data...');
    
    // Subscribers
    const { count: subCount } = await supabase
      .from('subscribers')
      .delete()
      .ilike('email', '%@example.com')
      .select('*', { count: 'exact', head: true });
    console.log(`✅ Removed ${subCount || 0} test subscribers`);
    
    // Contacts
    const { count: contactCount } = await supabase
      .from('contact_submissions')
      .delete()
      .ilike('email', '%@example.com')
      .select('*', { count: 'exact', head: true });
    console.log(`✅ Removed ${contactCount || 0} test contacts`);
    
    // Career applications
    const { count: careerCount } = await supabase
      .from('career_applications')
      .delete()
      .ilike('email', '%@example.com')
      .select('*', { count: 'exact', head: true });
    console.log(`✅ Removed ${careerCount || 0} test career applications`);
    
    // Chat conversations with test emails
    const { count: chatCount } = await supabase
      .from('chat_conversations')
      .delete()
      .ilike('user_email', '%@example.com')
      .select('*', { count: 'exact', head: true });
    console.log(`✅ Removed ${chatCount || 0} test chat conversations`);

    console.log('\n✨ ALL test data has been cleaned!');
    console.log('Your analytics dashboard will now show only real user data.');

  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

cleanAllTestData();