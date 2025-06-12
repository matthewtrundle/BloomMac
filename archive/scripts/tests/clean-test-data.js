const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanTestData() {
  console.log('🧹 Cleaning test data from Supabase...\n');

  try {
    // Clean analytics events (remove test data)
    console.log('Removing test analytics events...');
    const { error: analyticsError, count: analyticsCount } = await supabase
      .from('analytics_events')
      .delete()
      .gte('created_at', '2025-05-27') // Remove data from today when test data was added
      .select('*', { count: 'exact', head: true });
    
    if (analyticsError) {
      console.error('Error cleaning analytics:', analyticsError);
    } else {
      console.log(`✅ Removed ${analyticsCount || 0} test analytics events`);
    }

    // Clean test newsletter subscribers
    console.log('\nRemoving test newsletter subscribers...');
    const testEmails = [
      'sarah.johnson@example.com',
      'emma.davis@example.com',
      'jessica.miller@example.com',
      'maria.garcia@example.com',
      'ashley.wilson@example.com'
    ];
    
    const { error: subscribersError, count: subscribersCount } = await supabase
      .from('subscribers')
      .delete()
      .in('email', testEmails)
      .select('*', { count: 'exact', head: true });
    
    if (subscribersError) {
      console.error('Error cleaning subscribers:', subscribersError);
    } else {
      console.log(`✅ Removed ${subscribersCount || 0} test subscribers`);
    }

    // Clean test contact submissions
    console.log('\nRemoving test contact submissions...');
    const { error: contactError, count: contactCount } = await supabase
      .from('contact_submissions')
      .delete()
      .ilike('email', '%@example.com')
      .select('*', { count: 'exact', head: true });
    
    if (contactError) {
      console.error('Error cleaning contacts:', contactError);
    } else {
      console.log(`✅ Removed ${contactCount || 0} test contact submissions`);
    }

    // Clean test career applications
    console.log('\nRemoving test career applications...');
    const { error: careerError, count: careerCount } = await supabase
      .from('career_applications')
      .delete()
      .ilike('email', '%@example.com')
      .select('*', { count: 'exact', head: true });
    
    if (careerError) {
      console.error('Error cleaning careers:', careerError);
    } else {
      console.log(`✅ Removed ${careerCount || 0} test career applications`);
    }

    // Clean test chat conversations
    console.log('\nRemoving test chat conversations...');
    const { error: chatError, count: chatCount } = await supabase
      .from('chat_conversations')
      .delete()
      .gte('created_at', '2025-05-27')
      .select('*', { count: 'exact', head: true });
    
    if (chatError) {
      console.error('Error cleaning chats:', chatError);
    } else {
      console.log(`✅ Removed ${chatCount || 0} test chat conversations`);
    }

    console.log('\n✨ Test data cleanup complete!');
    console.log('Your analytics will now start fresh from real user interactions.');

  } catch (error) {
    console.error('Cleanup error:', error);
    process.exit(1);
  }
}

// Run the cleanup
cleanTestData();