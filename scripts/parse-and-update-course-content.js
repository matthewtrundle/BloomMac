require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Function to parse lesson content from markdown
function parseLessonContent(weekContent, lessonNumber) {
  // Try to find the lesson by number
  const lessonRegex = new RegExp(`# LESSON ${lessonNumber}:.*?(?=# LESSON|$)`, 's');
  const lessonMatch = weekContent.match(lessonRegex);
  
  if (!lessonMatch) return null;
  
  const lessonContent = lessonMatch[0];
  
  // Extract the script content - everything after "## ENHANCED SCRIPT" or "## SCRIPT"
  const scriptMatch = lessonContent.match(/## (?:ENHANCED )?SCRIPT([\s\S]*?)(?=## HTML SLIDES|$)/);
  const videoScript = scriptMatch ? scriptMatch[1].trim() : '';
  
  // Extract HTML slides - look for code blocks or HTML SLIDES section
  const htmlSlidesMatch = lessonContent.match(/## HTML SLIDES[\s\S]*?```html([\s\S]*?)```/);
  let slidesHtml = '';
  
  if (htmlSlidesMatch) {
    slidesHtml = htmlSlidesMatch[1].trim();
  } else {
    // Try alternative format with just ```html blocks
    const codeBlockMatch = lessonContent.match(/```html([\s\S]*?)```/);
    if (codeBlockMatch) {
      slidesHtml = codeBlockMatch[1].trim();
    }
  }
  
  return {
    videoScript,
    slidesHtml
  };
}

// Function to create basic HTML slides from script content
function createBasicHTMLSlides(script, lessonTitle) {
  if (!script) return '';
  
  // Extract sections from the script
  const sections = script.split(/\[VISUAL:.*?\]/).filter(s => s.trim());
  
  let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${lessonTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .slide { min-height: 100vh; padding: 60px; display: flex; flex-direction: column; justify-content: center; }
        h1 { color: #E85D75; font-size: 48px; margin-bottom: 30px; }
        h2 { color: #7BA098; font-size: 36px; margin-bottom: 20px; }
        p { font-size: 24px; line-height: 1.6; max-width: 800px; }
        .highlight { background: #FFF4E6; padding: 20px; border-radius: 10px; margin: 20px 0; }
    </style>
</head>
<body>
`;

  // Create title slide
  html += `    <div class="slide">
        <h1>${lessonTitle}</h1>
        <p>Let's begin this journey together...</p>
    </div>\n\n`;

  // Create slides from sections
  sections.forEach((section, index) => {
    if (section.trim()) {
      // Extract timestamp and title if available
      const timestampMatch = section.match(/\[(\d+:\d+-\d+:\d+)\]\s*([^\n]+)/);
      let title = `Section ${index + 1}`;
      let content = section;
      
      if (timestampMatch) {
        title = timestampMatch[2].trim();
        content = section.replace(timestampMatch[0], '').trim();
      }
      
      html += `    <!-- SLIDE -->
    <div class="slide">
        <h2>${title}</h2>
        <p>${content.substring(0, 300)}...</p>
    </div>\n\n`;
    }
  });

  html += `</body>
</html>`;

  return html;
}

async function updateCourseContent() {
  console.log('📚 Parsing and Updating Course Content...\n');

  try {
    // Get the course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();

    if (courseError) throw courseError;

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

      const weekFile = path.join(__dirname, '..', 'course-materials', `COMPLETE-COURSE-WEEK${module.week_number}.md`);
      
      try {
        const weekContent = await fs.readFile(weekFile, 'utf8');
        console.log(`  ✅ Read week ${module.week_number} content`);

        // Process each lesson
        for (const lesson of module.course_lessons) {
          console.log(`\n  📖 Lesson ${lesson.lesson_number}: ${lesson.title}`);
          
          const parsedContent = parseLessonContent(weekContent, lesson.lesson_number);
          
          if (parsedContent) {
            let { videoScript, slidesHtml } = parsedContent;
            
            // If no HTML slides found, create basic ones from script
            if (!slidesHtml && videoScript) {
              slidesHtml = createBasicHTMLSlides(videoScript, lesson.title);
              console.log(`    🎨 Generated HTML slides from script`);
            }
            
            // Update the lesson
            const { error: updateError } = await supabase
              .from('course_lessons')
              .update({
                script_notes: videoScript.substring(0, 10000), // Increased limit
                slides_html: slidesHtml,
                updated_at: new Date().toISOString()
              })
              .eq('id', lesson.id);

            if (updateError) {
              console.log(`    ❌ Error: ${updateError.message}`);
            } else {
              console.log(`    ✅ Updated: Script (${videoScript.length} chars), Slides (${slidesHtml.length} chars)`);
            }
          } else {
            console.log(`    ⚠️  Could not parse content for lesson ${lesson.lesson_number}`);
          }
        }
      } catch (fileError) {
        console.log(`  ❌ Error reading file: ${fileError.message}`);
      }
    }

    // Special handling for Week 1 Lesson 1 HTML file
    console.log('\n🎯 Updating Week 1 Lesson 1 with dedicated HTML file...');
    try {
      const htmlFile = path.join(__dirname, '..', 'course-materials', 'week1-slides-lesson1-fixed.html');
      const htmlContent = await fs.readFile(htmlFile, 'utf8');
      
      const week1Module = modules.find(m => m.week_number === 1);
      const lesson1 = week1Module.course_lessons.find(l => l.lesson_number === 1);
      
      if (lesson1) {
        await supabase
          .from('course_lessons')
          .update({
            slides_html: htmlContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', lesson1.id);
        
        console.log(`  ✅ Updated with full HTML presentation (${htmlContent.length} chars)`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }

    // Final verification
    console.log('\n📊 Verifying updates...');
    const { data: allLessons } = await supabase
      .from('course_lessons')
      .select('lesson_number, slides_html, script_notes');

    const withSlides = allLessons.filter(l => l.slides_html && l.slides_html.length > 100).length;
    const withScripts = allLessons.filter(l => l.script_notes && l.script_notes.length > 100).length;
    
    console.log(`\n✅ Final Results:`);
    console.log(`  📄 Lessons with HTML slides: ${withSlides}/24`);
    console.log(`  📝 Lessons with video scripts: ${withScripts}/24`);

  } catch (error) {
    console.error('\n❌ Error:', error);
  }
}

updateCourseContent().catch(console.error);