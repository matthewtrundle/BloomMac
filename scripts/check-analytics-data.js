const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAnalyticsData() {
  console.log('📊 Checking Analytics Data in Supabase\n');

  // Get analytics events from last 7 days
  const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  
  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('*')
    .gte('created_at', cutoffDate)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('❌ Error fetching analytics:', error.message);
    return;
  }

  console.log(`Found ${events.length} events in the last 7 days\n`);

  // Count by type
  const typeCounts = {};
  events.forEach(event => {
    typeCounts[event.type] = (typeCounts[event.type] || 0) + 1;
  });

  console.log('Event Types:');
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

  // Count unique sessions
  const uniqueSessions = new Set(events.map(e => e.session_id || e.id)).size;
  console.log(`\nUnique Sessions/Visitors: ${uniqueSessions}`);

  // Show conversion calculations
  const pageViews = events.filter(e => e.type === 'page_view').length;
  const conversions = events.filter(e => 
    ['contact_form', 'booking_click', 'newsletter_signup', 'new_mom_signup'].includes(e.type)
  ).length;
  const conversionRate = uniqueSessions > 0 ? (conversions / uniqueSessions) * 100 : 0;

  console.log(`\nConversion Calculation:`);
  console.log(`  Page Views: ${pageViews}`);
  console.log(`  Conversions: ${conversions}`);
  console.log(`  Conversion Rate: ${conversionRate.toFixed(1)}%`);
  console.log(`  (Conversions / Unique Visitors * 100)`);

  // Show some recent events
  console.log('\nRecent Events:');
  events.slice(0, 5).forEach(event => {
    console.log(`  ${new Date(event.created_at).toLocaleString()} - ${event.type} - ${event.page || 'N/A'}`);
  });
}

checkAnalyticsData().catch(console.error);