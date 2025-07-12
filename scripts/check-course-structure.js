const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCourseStructure() {
  // Check courses table
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .order('created_at');
    
  if (coursesError) {
    console.log('Error fetching courses:', coursesError);
  } else {
    console.log('\nCourses found:', courses.length);
    courses.forEach(course => {
      console.log(`\n- ${course.title}`);
      console.log(`  ID: ${course.id}`);
      console.log(`  Description: ${course.description?.substring(0, 100)}...`);
      console.log(`  Duration: ${course.duration_weeks} weeks`);
      console.log(`  Status: ${course.status}`);
    });
  }
  
  // Check course modules
  const { data: modules, error: modulesError } = await supabase
    .from('course_modules')
    .select('*')
    .order('course_id, module_order');
    
  if (modulesError) {
    console.log('\nError fetching modules:', modulesError);
  } else {
    console.log('\n\nModules/Weeks found:', modules.length);
    let currentCourse = null;
    modules.forEach(module => {
      if (module.course_id !== currentCourse) {
        console.log(`\n\nCourse: ${module.course_id}`);
        currentCourse = module.course_id;
      }
      console.log(`  Week ${module.module_order}: ${module.title}`);
      console.log(`    ID: ${module.id}`);
      console.log(`    Description: ${module.description?.substring(0, 80)}...`);
    });
  }
  
  // Check course lessons
  const { data: lessons, error: lessonsError } = await supabase
    .from('course_lessons')
    .select('*')
    .order('module_id, lesson_order');
    
  if (lessonsError) {
    console.log('\nError fetching lessons:', lessonsError);
  } else {
    console.log('\n\nTotal lessons found:', lessons.length);
    
    // Group by module
    const lessonsByModule = {};
    lessons.forEach(lesson => {
      if (!lessonsByModule[lesson.module_id]) {
        lessonsByModule[lesson.module_id] = [];
      }
      lessonsByModule[lesson.module_id].push(lesson);
    });
    
    console.log('\nLessons by module:');
    Object.keys(lessonsByModule).forEach(moduleId => {
      console.log(`\nModule ${moduleId}: ${lessonsByModule[moduleId].length} lessons`);
      lessonsByModule[moduleId].forEach(lesson => {
        console.log(`  ${lesson.lesson_order}. ${lesson.title} (${lesson.duration_minutes} min)`);
      });
    });
  }
}

checkCourseStructure().catch(console.error);