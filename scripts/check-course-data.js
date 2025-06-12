require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCourseData() {
  console.log('Checking course data in database...\n');

  // Check courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (coursesError) {
    console.error('Error fetching courses:', coursesError);
    return;
  }

  console.log(`Found ${courses?.length || 0} courses:\n`);
  
  courses?.forEach(course => {
    console.log(`ID: ${course.id}`);
    console.log(`Title: ${course.title}`);
    console.log(`Slug: ${course.slug}`);
    console.log(`Price: $${course.price}`);
    console.log(`Active: ${course.is_active}`);
    console.log('---');
  });

  // Check course modules (weeks)
  const { data: modules, error: modulesError } = await supabase
    .from('course_modules')
    .select('*')
    .order('week_number');

  console.log(`\nFound ${modules?.length || 0} course modules (weeks)`);

  // Check lessons
  const { data: lessons, error: lessonsError } = await supabase
    .from('course_lessons')
    .select('*');

  console.log(`Found ${lessons?.length || 0} lessons`);

  // Check if the specific course ID from your screenshot exists
  const courseId = '9549c2c2-52e9-4d3b-bac3-bddc25b4065b';
  const { data: specificCourse, error: specificError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (specificCourse) {
    console.log(`\n✅ Course ${courseId} exists!`);
  } else {
    console.log(`\n❌ Course ${courseId} NOT FOUND!`);
  }
}

checkCourseData();