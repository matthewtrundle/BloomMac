const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCourseSchema() {
  console.log('=== Checking Course Database Schema ===\n');

  try {
    // 1. Check courses table columns
    console.log('1. Checking courses table columns...');
    const { data: coursesColumns, error: coursesError } = await supabase
      .rpc('get_table_columns', { table_name: 'courses' });

    if (coursesError) {
      console.error('Error getting courses columns:', coursesError);
      
      // Try alternative method
      console.log('Trying alternative method...');
      const { data: sampleCourse, error: sampleError } = await supabase
        .from('courses')
        .select('*')
        .limit(1)
        .single();
      
      if (!sampleError && sampleCourse) {
        console.log('Courses table columns (from sample):');
        console.log(Object.keys(sampleCourse));
      }
    } else {
      console.log('Courses table columns:', coursesColumns);
    }
    console.log('');

    // 2. Check course_modules table
    console.log('2. Checking course_modules table...');
    const { data: modulesData, error: modulesError } = await supabase
      .from('course_modules')
      .select('*')
      .limit(1);

    if (modulesError) {
      console.error('course_modules table error:', modulesError.message);
    } else {
      console.log('course_modules exists:', modulesData?.length >= 0);
      if (modulesData && modulesData.length > 0) {
        console.log('course_modules columns:', Object.keys(modulesData[0]));
      }
    }
    console.log('');

    // 3. Check course_lessons table
    console.log('3. Checking course_lessons table...');
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('course_lessons')
      .select('*')
      .limit(1);

    if (lessonsError) {
      console.error('course_lessons table error:', lessonsError.message);
    } else {
      console.log('course_lessons exists:', lessonsData?.length >= 0);
      if (lessonsData && lessonsData.length > 0) {
        console.log('course_lessons columns:', Object.keys(lessonsData[0]));
      }
    }
    console.log('');

    // 4. Check course_resources table
    console.log('4. Checking course_resources table...');
    const { data: resourcesData, error: resourcesError } = await supabase
      .from('course_resources')
      .select('*')
      .limit(1);

    if (resourcesError) {
      console.error('course_resources table error:', resourcesError.message);
    } else {
      console.log('course_resources exists:', resourcesData?.length >= 0);
      if (resourcesData && resourcesData.length > 0) {
        console.log('course_resources columns:', Object.keys(resourcesData[0]));
      }
    }
    console.log('');

    // 5. Check admin_users table
    console.log('5. Checking admin_users table...');
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (adminError) {
      console.error('admin_users table error:', adminError.message);
    } else {
      console.log('admin_users exists:', adminData?.length >= 0);
      if (adminData && adminData.length > 0) {
        console.log('admin_users columns:', Object.keys(adminData[0]));
      }
    }
    console.log('');

    // 6. Check what tables exist in the database
    console.log('6. Listing all tables in the database...');
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_all_tables');

    if (tablesError) {
      // Try alternative query
      const { data: altTables, error: altError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (!altError && altTables) {
        console.log('Found tables:', altTables.map(t => t.table_name).join(', '));
      } else {
        console.log('Could not list tables');
      }
    } else {
      console.log('Tables:', tables);
    }

  } catch (error) {
    console.error('Script error:', error);
  }
}

// Run the check
checkCourseSchema().then(() => {
  console.log('\n=== Schema check completed ===');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});