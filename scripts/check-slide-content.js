const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSlideContent() {
  try {
    console.log('🔍 Checking slide content in database...\n');

    // Get the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();

    if (courseError) {
      console.error('Error fetching course:', courseError);
      return;
    }

    console.log(`Found course: ${course.title}\n`);

    // Get all modules with lessons
    const { data: modules, error: modulesError } = await supabase
      .from('course_modules')
      .select(`
        id,
        week_number,
        title,
        course_lessons (
          id,
          lesson_number,
          title,
          slides_html
        )
      `)
      .eq('course_id', course.id)
      .order('week_number');

    if (modulesError) {
      console.error('Error fetching modules:', modulesError);
      return;
    }

    // Check each lesson
    modules.forEach(module => {
      console.log(`Week ${module.week_number}: ${module.title}`);
      
      if (module.course_lessons && module.course_lessons.length > 0) {
        module.course_lessons.forEach(lesson => {
          const hasSlides = lesson.slides_html && lesson.slides_html.length > 0;
          const slideCount = hasSlides ? lesson.slides_html.split('<!-- SLIDE -->').filter(Boolean).length : 0;
          
          console.log(`  Lesson ${lesson.lesson_number}: ${lesson.title}`);
          console.log(`    - Has slides: ${hasSlides ? 'Yes' : 'No'}`);
          if (hasSlides) {
            console.log(`    - Slide count: ${slideCount}`);
            console.log(`    - Content length: ${lesson.slides_html.length} characters`);
          }
        });
      } else {
        console.log('  No lessons found');
      }
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

checkSlideContent();