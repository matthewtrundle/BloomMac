require('dotenv').config({ path: '.env.local' });

async function testProcessor() {
  console.log('🧪 Testing Email Sequence Processor\n');
  
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://bloompsychologynorthaustin.com'
    : 'http://localhost:3002'; // Adjust port as needed
  
  try {
    console.log('Triggering email sequence processor...');
    console.log(`URL: ${baseUrl}/api/cron/process-email-sequences\n`);
    
    const response = await fetch(`${baseUrl}/api/cron/process-email-sequences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization if needed
        // 'Authorization': `Bearer ${process.env.CRON_SECRET}`
      }
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.result) {
      console.log('\n📊 Processing Summary:');
      console.log(`  - Processed: ${data.result.processed} enrollments`);
      console.log(`  - Sent: ${data.result.sent} emails`);
      console.log(`  - Errors: ${data.result.errors}`);
      
      if (data.result.details && data.result.details.length > 0) {
        console.log('\n📧 Email Details:');
        data.result.details.forEach((detail, index) => {
          console.log(`  ${index + 1}. ${detail.subscriber_email} - ${detail.status}`);
          if (detail.error) {
            console.log(`     Error: ${detail.error}`);
          }
        });
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Check command line args
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node scripts/test-sequence-processor.js [--production]');
  console.log('\nOptions:');
  console.log('  --production  Test against production API');
  console.log('  --help        Show this help message');
  process.exit(0);
}

if (args.includes('--production')) {
  console.log('⚠️  Testing against PRODUCTION\n');
  process.env.NODE_ENV = 'production';
}

testProcessor();