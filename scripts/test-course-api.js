const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testCourseAPI() {
  console.log('=== SIMULATING COURSE API CALL ===\n');
  
  // Fetch all courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (coursesError) {
    console.error('Error fetching courses:', coursesError);
    return;
  }

  console.log(`Found ${courses.length} courses\n`);

  // Fetch course weeks/modules for each course
  const courseWeeks = {};
  
  if (courses && courses.length > 0) {
    for (const course of courses) {
      const { data: modules, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', course.id)
        .order('week_number', { ascending: true });

      if (!modulesError && modules) {
        // For each module, count the lessons
        const modulesWithCounts = await Promise.all(
          modules.map(async (module) => {
            const { count } = await supabase
              .from('course_lessons')
              .select('*', { count: 'exact', head: true })
              .eq('module_id', module.id);
            
            return {
              id: module.id,
              week_number: module.week_number,
              title: module.title,
              lesson_count: count || 0
            };
          })
        );
        
        courseWeeks[course.id] = modulesWithCounts;
      }
    }
  }

  console.log('API Response Structure:');
  console.log(JSON.stringify({ 
    courses: courses || [],
    courseWeeks
  }, null, 2));
}

testCourseAPI().catch(console.error);