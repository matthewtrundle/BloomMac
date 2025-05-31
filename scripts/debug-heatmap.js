const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugHeatmap() {
  console.log('🔍 Debugging Heatmap System...\n');

  // 1. Check if click_heatmap table exists
  console.log('1. Checking click_heatmap table:');
  const { data: tableCheck, error: tableError } = await supabase
    .from('click_heatmap')
    .select('count')
    .limit(1);

  if (tableError) {
    console.log('❌ Table does not exist or error:', tableError.message);
  } else {
    console.log('✅ Table exists');
  }

  // 2. Count total clicks in the table
  console.log('\n2. Counting clicks in click_heatmap:');
  const { count: clickCount, error: countError } = await supabase
    .from('click_heatmap')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.log('❌ Error counting clicks:', countError.message);
  } else {
    console.log(`✅ Total clicks: ${clickCount}`);
  }

  // 3. Check recent clicks (last 7 days)
  console.log('\n3. Recent clicks (last 7 days):');
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentClicks, error: recentError } = await supabase
    .from('click_heatmap')
    .select('page, created_at')
    .gte('created_at', sevenDaysAgo)
    .order('created_at', { ascending: false })
    .limit(5);

  if (recentError) {
    console.log('❌ Error fetching recent clicks:', recentError.message);
  } else {
    console.log(`✅ Recent clicks (${recentClicks.length} found):`);
    recentClicks.forEach(click => {
      console.log(`   - ${click.page} at ${click.created_at}`);
    });
  }

  // 4. Check if get_heatmap_data function exists
  console.log('\n4. Testing get_heatmap_data function:');
  const { data: funcData, error: funcError } = await supabase
    .rpc('get_heatmap_data', { 
      p_page: '/', 
      p_days: 30 
    });

  if (funcError) {
    console.log('❌ Function error:', funcError.message);
    console.log('   This function may not have been created in the database');
  } else {
    console.log(`✅ Function works! Found ${funcData?.length || 0} data points`);
  }

  // 5. Check analytics_events for click events
  console.log('\n5. Checking analytics_events for click data:');
  const { data: clickEvents, error: clickEventsError } = await supabase
    .from('analytics_events')
    .select('page, created_at, data')
    .eq('type', 'click')
    .order('created_at', { ascending: false })
    .limit(5);

  if (clickEventsError) {
    console.log('❌ Error fetching click events:', clickEventsError.message);
  } else {
    console.log(`✅ Click events in analytics_events: ${clickEvents.length}`);
    clickEvents.forEach(event => {
      console.log(`   - ${event.page} at ${event.created_at}`);
    });
  }

  // 6. Insert a test click
  console.log('\n6. Inserting test click:');
  const { error: insertError } = await supabase
    .from('click_heatmap')
    .insert({
      page: '/',
      x_percent: 50.0,
      y_percent: 50.0,
      element_type: 'button',
      element_text: 'Test Click',
      session_id: 'debug-session-' + Date.now()
    });

  if (insertError) {
    console.log('❌ Error inserting test click:', insertError.message);
  } else {
    console.log('✅ Test click inserted successfully');
  }

  // 7. Check if the aggregated view exists
  console.log('\n7. Checking heatmap_aggregated view:');
  const { data: viewData, error: viewError } = await supabase
    .from('heatmap_aggregated')
    .select('*')
    .limit(5);

  if (viewError) {
    console.log('❌ View does not exist or error:', viewError.message);
  } else {
    console.log(`✅ View exists with ${viewData?.length || 0} aggregated points`);
  }

  console.log('\n📊 Summary:');
  console.log('- If the table/function/view don\'t exist, run the SQL migration');
  console.log('- If no clicks are found, the tracking might not be working');
  console.log('- Check browser console for JavaScript errors');
}

debugHeatmap().catch(console.error);