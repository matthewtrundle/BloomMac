const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkWeek1Lesson1() {
  try {
    // Get the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();

    if (courseError || !course) {
      console.error('Error fetching course:', courseError);
      return;
    }

    // Get the module
    const { data: module, error: moduleError } = await supabase
      .from('course_modules')
      .select('id')
      .eq('course_id', course.id)
      .eq('week_number', 1)
      .single();

    if (moduleError || !module) {
      console.error('Error fetching module:', moduleError);
      return;
    }

    // Get the lesson
    const { data: lesson, error: lessonError } = await supabase
      .from('course_lessons')
      .select('slides_html, title')
      .eq('module_id', module.id)
      .eq('lesson_number', 1)
      .single();

    if (lessonError || !lesson) {
      console.error('Error fetching lesson:', lessonError);
      return;
    }

    console.log('Week 1 Lesson 1:', lesson.title);
    console.log('Slides HTML Length:', lesson.slides_html?.length || 0);
    
    if (lesson.slides_html) {
      console.log('\nFirst 1500 characters:');
      console.log(lesson.slides_html.substring(0, 1500));
      console.log('\n...\n');
      console.log('Last 1500 characters:');
      console.log(lesson.slides_html.substring(lesson.slides_html.length - 1500));
      
      // Count separators
      const separators = (lesson.slides_html.match(/<!-- SLIDE -->/g) || []).length;
      console.log('\nNumber of <!-- SLIDE --> separators:', separators);
      
      // Show where each separator is
      const parts = lesson.slides_html.split('<!-- SLIDE -->');
      console.log('\nSlide parts:', parts.length);
      parts.forEach((part, index) => {
        console.log(`\nSlide ${index + 1} preview (first 200 chars):`);
        console.log(part.substring(0, 200).replace(/\s+/g, ' ').trim());
      });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkWeek1Lesson1();