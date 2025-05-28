const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSubscribers() {
  console.log('📧 Checking Newsletter Subscribers\n');

  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching subscribers:', error.message);
    return;
  }

  console.log(`Total subscribers: ${subscribers.length}`);
  
  if (subscribers.length > 0) {
    console.log('\nRecent subscribers:');
    subscribers.slice(0, 5).forEach(sub => {
      console.log(`  ${sub.email} - ${sub.status} - ${new Date(sub.created_at).toLocaleDateString()}`);
    });
  } else {
    console.log('No subscribers found in the database.');
  }

  // Check table structure
  if (subscribers.length > 0) {
    console.log('\nTable columns:', Object.keys(subscribers[0]));
  }
}

checkSubscribers().catch(console.error);