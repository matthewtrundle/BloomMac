#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function triggerEmailAutomation() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const cronSecret = process.env.CRON_SECRET;
  
  console.log('🚀 Triggering Email Automation...\n');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`CRON_SECRET configured: ${cronSecret ? 'Yes' : 'No'}\n`);

  try {
    const headers = {};
    
    // Add authorization if CRON_SECRET is set
    if (cronSecret) {
      headers['Authorization'] = `Bearer ${cronSecret}`;
    }

    const response = await fetch(`${baseUrl}/api/process-email-automation`, {
      method: 'GET',
      headers
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Email automation triggered successfully!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.error('❌ Failed to trigger email automation');
      console.error('Status:', response.status);
      console.error('Response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error triggering email automation:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Make sure the Next.js server is running (npm run dev)');
    }
  }
}

// Run the function
triggerEmailAutomation();