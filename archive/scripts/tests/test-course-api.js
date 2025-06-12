const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const COURSE_ID = '9549c2c2-52e9-4d3b-bac3-bddc25b4065b';
const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function testCourseAPI() {
  console.log('=== Testing Course API ===');
  console.log(`Course ID: ${COURSE_ID}`);
  console.log(`API URL: ${API_URL}`);
  console.log('');

  try {
    // 1. Check if course exists in database directly
    console.log('1. Checking database directly...');
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', COURSE_ID)
      .single();

    if (courseError) {
      console.error('Database error:', courseError);
    } else if (courseData) {
      console.log('✓ Course found in database:');
      console.log(JSON.stringify(courseData, null, 2));
    } else {
      console.log('✗ Course NOT found in database');
    }
    console.log('');

    // 2. Check course_lessons table
    console.log('2. Checking course_lessons table...');
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('course_id', COURSE_ID);

    if (lessonsError) {
      console.error('Lessons query error:', lessonsError);
    } else {
      console.log(`Found ${lessonsData?.length || 0} lessons for this course`);
      if (lessonsData?.length > 0) {
        console.log('First lesson:', JSON.stringify(lessonsData[0], null, 2));
      }
    }
    console.log('');

    // 3. Get admin user for authentication
    console.log('3. Getting admin authentication...');
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'jana@bloomthroughit.com')
      .single();

    if (adminError || !adminUser) {
      console.error('Admin user not found:', adminError);
    } else {
      console.log('✓ Admin user found');
    }
    console.log('');

    // 4. Test API without authentication
    console.log('4. Testing API without authentication...');
    try {
      const response = await fetch(`${API_URL}/api/admin/courses/${COURSE_ID}`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('API error (no auth):', error.message);
    }
    console.log('');

    // 5. Test API with authentication (if admin user found)
    if (adminUser) {
      console.log('5. Testing API with authentication...');
      
      // Create a simple auth token (you may need to adjust this based on your auth implementation)
      const authToken = Buffer.from(`${adminUser.id}:${Date.now()}`).toString('base64');
      
      try {
        const response = await fetch(`${API_URL}/api/admin/courses/${COURSE_ID}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Cookie': `admin_session=${adminUser.id}`,
            'Content-Type': 'application/json'
          }
        });
        console.log(`Status: ${response.status} ${response.statusText}`);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
      } catch (error) {
        console.error('API error (with auth):', error.message);
      }
    }
    console.log('');

    // 6. Check all courses in database
    console.log('6. Listing all courses in database...');
    const { data: allCourses, error: allCoursesError } = await supabase
      .from('courses')
      .select('id, title, slug, status')
      .order('created_at', { ascending: false });

    if (allCoursesError) {
      console.error('Error fetching all courses:', allCoursesError);
    } else {
      console.log(`Total courses: ${allCourses?.length || 0}`);
      if (allCourses && allCourses.length > 0) {
        console.log('All courses:');
        allCourses.forEach(course => {
          console.log(`  - ${course.id}: ${course.title} (${course.slug}) [${course.status}]`);
        });
      }
    }
    console.log('');

    // 7. Direct test of the edit page API endpoint
    console.log('7. Testing the edit page API endpoint pattern...');
    try {
      // Test if there's a specific edit endpoint
      const editResponse = await fetch(`${API_URL}/api/admin/courses/${COURSE_ID}/edit`);
      console.log(`Edit endpoint status: ${editResponse.status} ${editResponse.statusText}`);
      if (editResponse.status !== 404) {
        const editData = await editResponse.json();
        console.log('Edit endpoint response:', JSON.stringify(editData, null, 2));
      }
    } catch (error) {
      console.error('Edit endpoint error:', error.message);
    }

  } catch (error) {
    console.error('Test script error:', error);
  }
}

// Run the test
testCourseAPI().then(() => {
  console.log('\n=== Test completed ===');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});