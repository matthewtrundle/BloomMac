#!/usr/bin/env node

const fetch = require('node-fetch');

async function testAPIs() {
  const baseUrl = 'http://localhost:3000';
  const tests = [
    {
      name: 'Newsletter Admin API',
      url: '/api/newsletter-admin',
      method: 'GET'
    },
    {
      name: 'Email Templates API',
      url: '/api/email-templates',
      method: 'GET'
    },
    {
      name: 'Email Analytics API',
      url: '/api/email-analytics',
      method: 'GET'
    },
    {
      name: 'Test Email API',
      url: '/api/test-email',
      method: 'GET'
    },
    {
      name: 'Email Automations API',
      url: '/api/email-automations',
      method: 'GET'
    }
  ];

  console.log('🧪 Testing Email APIs...\n');

  for (const test of tests) {
    try {
      console.log(`📍 Testing: ${test.name}`);
      console.log(`   URL: ${test.url}`);
      
      const response = await fetch(`${baseUrl}${test.url}`, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
          // Add a basic cookie for auth if needed
          'Cookie': 'adminToken=test'
        }
      });

      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ Success! Response structure:');
        
        // Show key fields based on API
        if (test.url.includes('newsletter-admin')) {
          console.log(`      - Subscribers: ${data.subscribers?.length || 0}`);
          console.log(`      - Active: ${data.stats?.active_subscribers || 0}`);
          console.log(`      - Total: ${data.stats?.total_subscribers || 0}`);
        } else if (test.url.includes('email-templates')) {
          console.log(`      - Templates: ${data.templates?.length || 0}`);
          if (data.templates?.length > 0) {
            console.log(`      - First template: ${data.templates[0].name}`);
          }
        } else if (test.url.includes('email-analytics')) {
          console.log(`      - Open Rate: ${data.overview?.openRate || 0}%`);
          console.log(`      - Click Rate: ${data.overview?.clickRate || 0}%`);
        } else if (test.url.includes('test-email')) {
          console.log(`      - Configured: ${data.configured}`);
          console.log(`      - Provider: ${data.provider}`);
        } else if (test.url.includes('automations')) {
          console.log(`      - Automations: ${data.automations?.length || 0}`);
        }
      } else {
        const error = await response.text();
        console.log(`   ❌ Failed: ${error.substring(0, 100)}...`);
      }
      
      console.log('');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log('');
    }
  }

  // Test if we can actually fetch from the database
  console.log('\n📊 Direct Database Test:');
  const { createClient } = require('@supabase/supabase-js');
  require('dotenv').config({ path: '.env.local' });
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('status')
      .limit(5);
    
    if (error) throw error;
    console.log(`   ✅ Database connection working! Found ${subscribers.length} subscribers`);
  } catch (error) {
    console.log(`   ❌ Database error: ${error.message}`);
  }
}

testAPIs().catch(console.error);