require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateCourseContent() {
  console.log('📚 Updating Course Content from Files...\n');

  try {
    // First, get the course ID for Postpartum Wellness Foundations
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();

    if (courseError) throw courseError;
    console.log('✅ Found course:', course.id);

    // Get all modules with lessons
    const { data: modules, error: modulesError } = await supabase
      .from('course_modules')
      .select(`
        id,
        week_number,
        course_lessons (
          id,
          lesson_number,
          title
        )
      `)
      .eq('course_id', course.id)
      .order('week_number');

    if (modulesError) throw modulesError;

    // Process each week
    for (const module of modules) {
      console.log(`\n📅 Processing Week ${module.week_number}...`);

      // Read the complete course week file
      const weekFile = path.join(__dirname, '..', 'course-materials', `COMPLETE-COURSE-WEEK${module.week_number}.md`);
      
      try {
        const weekContent = await fs.readFile(weekFile, 'utf8');
        console.log(`  ✅ Read week ${module.week_number} content (${weekContent.length} chars)`);

        // Extract lessons from the week content
        const lessonSections = weekContent.split(/## Lesson \d+:/);
        
        // Process each lesson
        for (const lesson of module.course_lessons) {
          console.log(`\n  📖 Updating Lesson ${lesson.lesson_number}: ${lesson.title}`);
          
          // Find the corresponding lesson section
          const lessonIndex = lesson.lesson_number;
          if (lessonSections[lessonIndex]) {
            const lessonContent = lessonSections[lessonIndex];
            
            // Extract video script
            const scriptMatch = lessonContent.match(/### Video Script[\s\S]*?(?=###|$)/);
            const videoScript = scriptMatch ? scriptMatch[0].replace('### Video Script', '').trim() : '';
            
            // Extract HTML slides content
            const slidesMatch = lessonContent.match(/```html[\s\S]*?```/);
            let slidesHtml = '';
            if (slidesMatch) {
              slidesHtml = slidesMatch[0].replace(/```html\n?/, '').replace(/\n?```/, '');
            }
            
            // Update the lesson in the database
            const { error: updateError } = await supabase
              .from('course_lessons')
              .update({
                script_notes: videoScript.substring(0, 5000), // Limit to 5000 chars
                slides_html: slidesHtml,
                updated_at: new Date().toISOString()
              })
              .eq('id', lesson.id);

            if (updateError) {
              console.log(`    ❌ Error updating lesson: ${updateError.message}`);
            } else {
              console.log(`    ✅ Updated with script (${videoScript.length} chars) and slides (${slidesHtml.length} chars)`);
            }
          }
        }
      } catch (fileError) {
        console.log(`  ❌ Could not read week ${module.week_number} file:`, fileError.message);
      }
    }

    // Special handling for Week 1 Lesson 1 which has a separate HTML file
    console.log('\n🎯 Special update for Week 1 Lesson 1 HTML slides...');
    try {
      const htmlFile = path.join(__dirname, '..', 'course-materials', 'week1-slides-lesson1-fixed.html');
      const htmlContent = await fs.readFile(htmlFile, 'utf8');
      
      // Get Week 1 Lesson 1
      const { data: lesson, error: lessonError } = await supabase
        .from('course_lessons')
        .select('id')
        .eq('lesson_number', 1)
        .eq('module_id', modules.find(m => m.week_number === 1).id)
        .single();

      if (!lessonError && lesson) {
        const { error: updateError } = await supabase
          .from('course_lessons')
          .update({
            slides_html: htmlContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', lesson.id);

        if (!updateError) {
          console.log(`  ✅ Updated Week 1 Lesson 1 with full HTML slides (${htmlContent.length} chars)`);
        }
      }
    } catch (htmlError) {
      console.log('  ❌ Error updating Week 1 Lesson 1 HTML:', htmlError.message);
    }

    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const { data: updatedLessons, error: verifyError } = await supabase
      .from('course_lessons')
      .select('lesson_number, slides_html, script_notes')
      .not('slides_html', 'is', null);

    if (!verifyError) {
      const withSlides = updatedLessons.filter(l => l.slides_html && l.slides_html.length > 50).length;
      const withScripts = updatedLessons.filter(l => l.script_notes && l.script_notes.length > 50).length;
      
      console.log(`\n📊 Final Results:`);
      console.log(`  ✅ Lessons with HTML slides: ${withSlides}/24`);
      console.log(`  ✅ Lessons with video scripts: ${withScripts}/24`);
    }

  } catch (error) {
    console.error('Error updating course content:', error);
  }
}

updateCourseContent().catch(console.error);