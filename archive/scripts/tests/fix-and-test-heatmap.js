const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAndTestHeatmap() {
  console.log('🔧 Fixing heatmap system...\n');

  // 1. Read and execute the fix SQL
  console.log('1. Applying function fix...');
  const fixSql = fs.readFileSync(
    path.join(__dirname, '../supabase/fix-heatmap-function.sql'), 
    'utf8'
  );

  try {
    // Execute SQL directly using the Supabase client
    const { error } = await supabase.rpc('query', { query: fixSql });
    if (error) {
      console.log('Note: Direct SQL execution not available via RPC');
      console.log('Please run this SQL in Supabase SQL Editor:');
      console.log('\n--- SQL TO RUN ---');
      console.log(fixSql);
      console.log('--- END SQL ---\n');
    }
  } catch (e) {
    console.log('SQL fix needs to be applied manually in Supabase dashboard');
  }

  // 2. Add realistic test data
  console.log('\n2. Adding realistic test click data...');
  
  const pages = ['/', '/contact', '/about', '/services/therapy-for-moms'];
  const elements = [
    { type: 'a', text: 'Book Now', id: 'book-cta' },
    { type: 'button', text: 'Get Started', id: 'hero-btn' },
    { type: 'a', text: 'Learn More', id: null },
    { type: 'div', text: 'Contact Us', id: 'contact-section' },
    { type: 'a', text: 'Schedule Consultation', id: 'schedule-btn' }
  ];

  const testClicks = [];
  
  // Generate 50 realistic clicks
  for (let i = 0; i < 50; i++) {
    const page = pages[Math.floor(Math.random() * pages.length)];
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    // Cluster clicks around common areas
    const clusters = [
      { x: 50, y: 20 },  // Header area
      { x: 50, y: 40 },  // Hero section
      { x: 85, y: 25 },  // Top right (CTA)
      { x: 50, y: 80 },  // Footer area
      { x: 30, y: 60 },  // Sidebar
    ];
    
    const cluster = clusters[Math.floor(Math.random() * clusters.length)];
    
    testClicks.push({
      page,
      x_percent: cluster.x + (Math.random() - 0.5) * 10,
      y_percent: cluster.y + (Math.random() - 0.5) * 10,
      element_type: element.type,
      element_text: element.text,
      element_id: element.id,
      viewport_width: 1920,
      viewport_height: 1080,
      session_id: `test-session-${Math.floor(i / 3)}`, // ~3 clicks per session
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  const { error: insertError } = await supabase
    .from('click_heatmap')
    .insert(testClicks);

  if (insertError) {
    console.log('❌ Error inserting test data:', insertError.message);
  } else {
    console.log('✅ Added 50 test clicks across multiple pages');
  }

  // 3. Verify the data
  console.log('\n3. Verifying click data...');
  const { data: summary, error: summaryError } = await supabase
    .from('click_heatmap')
    .select('page')
    .order('created_at', { ascending: false });

  if (!summaryError && summary) {
    const pageCounts = summary.reduce((acc, row) => {
      acc[row.page] = (acc[row.page] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 Click distribution:');
    Object.entries(pageCounts).forEach(([page, count]) => {
      console.log(`   ${page}: ${count} clicks`);
    });
  }

  // 4. Test the heatmap API
  console.log('\n4. Testing heatmap API endpoint...');
  const fetch = require('node-fetch');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/heatmap-data?page=/&range=7d`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API working!');
      console.log(`   Total clicks: ${data.stats?.totalClicks || 0}`);
      console.log(`   Unique sessions: ${data.stats?.uniqueSessions || 0}`);
      console.log(`   Heatmap points: ${data.heatmapData?.length || 0}`);
    } else {
      console.log('❌ API error:', data.error);
    }
  } catch (e) {
    console.log('⚠️  Could not test API - make sure the app is running');
  }

  console.log('\n✨ Setup complete! The heatmap should now show data.');
  console.log('📌 Remember to apply the SQL fix in Supabase dashboard if needed.');
}

fixAndTestHeatmap().catch(console.error);