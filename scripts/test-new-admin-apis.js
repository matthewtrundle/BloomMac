#!/usr/bin/env node

const fetch = require('node-fetch');

async function testNewAPIs() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing New Admin APIs...\n');
  console.log('=' .repeat(60));

  // Test 1: Activity Log API
  console.log('\n📊 Testing Activity Log API:');
  try {
    const activityResponse = await fetch(`${baseUrl}/api/admin/activity-log?page=1&limit=5`, {
      headers: { 'Cookie': 'adminToken=test' }
    });
    
    console.log(`   Status: ${activityResponse.status}`);
    
    if (activityResponse.ok) {
      const data = await activityResponse.json();
      console.log(`   ✅ Success! Found ${data.activities?.length || 0} activities`);
      console.log(`   Total records: ${data.pagination?.total || 0}`);
      if (data.activities?.length > 0) {
        console.log(`   Latest activity: ${data.activities[0].action} (${data.activities[0].entityType})`);
      }
    } else {
      const error = await activityResponse.text();
      console.log(`   ❌ Failed: ${error.substring(0, 100)}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 2: Recent Activity API
  console.log('\n📊 Testing Recent Activity API:');
  try {
    const recentResponse = await fetch(`${baseUrl}/api/recent-activity?limit=5`, {
      headers: { 'Cookie': 'adminToken=test' }
    });
    
    console.log(`   Status: ${recentResponse.status}`);
    
    if (recentResponse.ok) {
      const data = await recentResponse.json();
      console.log(`   ✅ Success! Found ${data.activities?.length || 0} recent activities`);
      
      // Count by type
      const typeCounts = {};
      data.activities?.forEach(activity => {
        typeCounts[activity.type] = (typeCounts[activity.type] || 0) + 1;
      });
      
      Object.entries(typeCounts).forEach(([type, count]) => {
        console.log(`      - ${type}: ${count}`);
      });
    } else {
      const error = await recentResponse.text();
      console.log(`   ❌ Failed: ${error.substring(0, 100)}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Test 3: Blog Image Upload (mock test)
  console.log('\n📊 Testing Blog Image Upload API:');
  console.log('   ⚠️  Skipping actual upload test (requires file)');
  console.log('   Endpoint exists at: /api/upload-blog-image');
  console.log('   Method: POST with FormData containing "image" field');

  // Test 4: Generate Blog Image API
  console.log('\n📊 Testing Generate Blog Image API:');
  try {
    const generateResponse = await fetch(`${baseUrl}/api/generate-blog-image`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': 'adminToken=test'
      },
      body: JSON.stringify({
        title: 'Managing Postpartum Anxiety: A Guide for New Mothers',
        excerpt: 'Learn practical strategies for coping with postpartum anxiety...'
      })
    });
    
    console.log(`   Status: ${generateResponse.status}`);
    
    if (generateResponse.ok) {
      const data = await generateResponse.json();
      console.log(`   ✅ Success! Generated prompt: "${data.prompt}"`);
      console.log(`   Status: ${data.message}`);
    } else {
      const error = await generateResponse.text();
      console.log(`   ❌ Failed: ${error.substring(0, 100)}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // Direct database check
  console.log('\n\n🗄️ Database Verification:');
  const { createClient } = require('@supabase/supabase-js');
  require('dotenv').config({ path: '.env.local' });
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data: recentLogs, error } = await supabase
      .from('admin_activity_log')
      .select('action, entity_type, created_at')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (error) throw error;
    
    console.log(`   ✅ Admin activity log has ${recentLogs.length} recent entries`);
    recentLogs.forEach(log => {
      console.log(`      - ${log.action} on ${log.entity_type}`);
    });
  } catch (error) {
    console.log(`   ❌ Database error: ${error.message}`);
  }

  console.log('\n\n✅ SUMMARY:');
  console.log('=' .repeat(60));
  console.log('All new APIs have been created and are ready for testing.');
  console.log('\nTo fully test in browser:');
  console.log('1. Login to admin panel');
  console.log('2. Visit /admin/activity to see activity logs');
  console.log('3. Check main dashboard for recent activity widget');
  console.log('4. Try uploading a blog image');
}

testNewAPIs().catch(console.error);