const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkData() {
  // Get recent analytics events
  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
    
  console.log('Recent analytics events:');
  console.log(JSON.stringify(events, null, 2));
  
  // Get count
  const { count } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true });
    
  console.log(`\nTotal events: ${count}`);
}

checkData();