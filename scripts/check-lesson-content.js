require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkLessonContent() {
  console.log('📚 Checking Lesson Content Status...\n');

  try {
    // Get all lessons with their content and module info
    const { data: modules, error } = await supabase
      .from('course_modules')
      .select(`
        week_number,
        course_lessons (
          id,
          lesson_number,
          title,
          slides_html,
          video_url,
          video_script
        )
      `)
      .order('week_number');

    if (error) throw error;

    let totalLessons = 0;
    modules.forEach(m => totalLessons += m.course_lessons.length);
    console.log(`Total lessons: ${totalLessons}\n`);

    // Display status by week
    modules.forEach(module => {
      console.log(`\n📅 Week ${module.week_number}:`);
      
      module.course_lessons.sort((a, b) => a.lesson_number - b.lesson_number).forEach(lesson => {
        const hasSlides = lesson.slides_html && lesson.slides_html.length > 50;
        const hasVideo = !!lesson.video_url;
        const hasScript = lesson.video_script && lesson.video_script.length > 50;
        
        console.log(`  Lesson ${lesson.lesson_number}: ${lesson.title}`);
        console.log(`    📄 HTML Slides: ${hasSlides ? '✅' : '❌'} (${lesson.slides_html?.length || 0} chars)`);
        console.log(`    📹 Video URL: ${hasVideo ? '✅' : '❌'}`);
        console.log(`    📝 Video Script: ${hasScript ? '✅' : '❌'} (${lesson.video_script?.length || 0} chars)`);
      });
    });

    // Summary statistics
    let withSlides = 0, withVideos = 0, withScripts = 0;
    modules.forEach(module => {
      module.course_lessons.forEach(lesson => {
        if (lesson.slides_html && lesson.slides_html.length > 50) withSlides++;
        if (lesson.video_url) withVideos++;
        if (lesson.video_script && lesson.video_script.length > 50) withScripts++;
      });
    });

    console.log('\n📊 Content Summary:');
    console.log(`  📄 Lessons with HTML slides: ${withSlides}/${totalLessons}`);
    console.log(`  📹 Lessons with video URLs: ${withVideos}/${totalLessons}`);
    console.log(`  📝 Lessons with video scripts: ${withScripts}/${totalLessons}`);

    // Check for sample content
    let sampleLesson = null;
    modules.forEach(module => {
      module.course_lessons.forEach(lesson => {
        if (!sampleLesson && lesson.slides_html && lesson.slides_html.length > 50) {
          sampleLesson = lesson;
        }
      });
    });
    
    if (sampleLesson) {
      console.log('\n📋 Sample HTML Slides Content (first 200 chars):');
      console.log(sampleLesson.slides_html.substring(0, 200) + '...');
    }

  } catch (error) {
    console.error('Error checking lesson content:', error);
  }
}

checkLessonContent().catch(console.error);