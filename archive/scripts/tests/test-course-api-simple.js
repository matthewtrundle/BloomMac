const fetch = require('node-fetch');
require('dotenv').config();

const COURSE_ID = '9549c2c2-52e9-4d3b-bac3-bddc25b4065b';
const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function testCourseAPI() {
  console.log('=== Testing Course API (Simple) ===');
  console.log(`Course ID: ${COURSE_ID}`);
  console.log(`API URL: ${API_URL}/api/admin/courses/${COURSE_ID}`);
  console.log('');

  try {
    console.log('Making GET request to course API...');
    const response = await fetch(`${API_URL}/api/admin/courses/${COURSE_ID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`Response Status: ${response.status} ${response.statusText}`);
    console.log(`Response Headers:`, response.headers.raw());
    
    const responseText = await response.text();
    console.log('Raw Response:', responseText);
    
    try {
      const data = JSON.parse(responseText);
      console.log('\nParsed Response:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.course) {
        console.log('\n✓ Course found!');
        console.log(`Title: ${data.course.title}`);
        console.log(`Active: ${data.course.is_active}`);
        console.log(`Weeks: ${data.weeks?.length || 0}`);
        console.log(`Assets: ${data.assets?.length || 0}`);
      }
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError.message);
    }

  } catch (error) {
    console.error('Request failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testCourseAPI().then(() => {
  console.log('\n=== Test completed ===');
}).catch(error => {
  console.error('Fatal error:', error);
});