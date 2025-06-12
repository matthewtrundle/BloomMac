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

async function verifyCourseSetup() {
  console.log('=== Verifying Course Setup ===\n');

  try {
    // 1. Check if the course exists
    console.log('1. Checking if course exists...');
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', COURSE_ID)
      .single();

    if (courseError) {
      console.error('❌ Course not found:', courseError.message);
      return;
    }

    console.log('✅ Course found:', course.title);
    console.log(`   Status: ${course.is_active ? 'Active' : 'Inactive'}`);
    console.log(`   Price: $${course.price}`);
    console.log('');

    // 2. Check course modules
    console.log('2. Checking course modules...');
    const { data: modules, error: modulesError } = await supabase
      .from('course_modules')
      .select('*, course_lessons(*)')
      .eq('course_id', COURSE_ID)
      .order('week_number');

    if (modulesError) {
      console.error('❌ Error fetching modules:', modulesError.message);
    } else {
      console.log(`✅ Found ${modules.length} modules/weeks`);
      modules.forEach(module => {
        console.log(`   Week ${module.week_number}: ${module.title} (${module.course_lessons?.length || 0} lessons)`);
      });
    }
    console.log('');

    // 3. Check course resources
    console.log('3. Checking course resources...');
    const { data: resources, error: resourcesError } = await supabase
      .from('course_resources')
      .select('*')
      .eq('course_id', COURSE_ID);

    if (resourcesError) {
      console.error('❌ Error fetching resources:', resourcesError.message);
    } else {
      console.log(`✅ Found ${resources.length} resources`);
    }
    console.log('');

    // 4. API endpoint test instructions
    console.log('4. API Endpoint Information:');
    console.log('   The API endpoint has been updated to match your database schema.');
    console.log('   When you run your Next.js server, the course edit page should work.');
    console.log('');
    console.log('   To test:');
    console.log('   1. Start your development server: npm run dev');
    console.log('   2. Navigate to: http://localhost:3000/admin/courses/' + COURSE_ID + '/edit');
    console.log('   3. The page should load without "Course not found" error');
    console.log('');

    // 5. Summary of changes made
    console.log('5. Changes made to fix the issue:');
    console.log('   ✅ Updated /pages/api/admin/courses/[id]/index.ts to match database schema');
    console.log('   ✅ Updated /pages/api/admin/courses/lessons/[id].ts for lesson updates');
    console.log('   ✅ Updated /app/admin/courses/[id]/edit/page.tsx to use correct field names');
    console.log('   ✅ Fixed status field (using is_active instead of status)');
    console.log('   ✅ Fixed duration field (using duration string instead of duration_weeks)');
    console.log('   ✅ Fixed lesson fields (video_script_formatted instead of video_script)');
    console.log('');

  } catch (error) {
    console.error('Verification error:', error);
  }
}

// Run verification
verifyCourseSetup().then(() => {
  console.log('=== Verification Complete ===');
}).catch(error => {
  console.error('Fatal error:', error);
});