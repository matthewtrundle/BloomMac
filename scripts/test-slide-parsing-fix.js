const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function parseSlides(html) {
  let slides = [];
  
  if (html) {
    // Check if it's a full HTML document or just slide fragments
    if (html.includes('<!DOCTYPE')) {
      // Extract body content first
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const bodyContent = bodyMatch ? bodyMatch[1] : html;
      
      // Split by slide separator and clean up
      slides = bodyContent
        .split('<!-- SLIDE -->')
        .map(slide => slide.trim())
        .filter(slide => slide.length > 0);
    } else {
      // Direct slide format (no HTML wrapper)
      slides = html
        .split('<!-- SLIDE -->')
        .map(slide => slide.trim())
        .filter(slide => slide.length > 0);
    }
  }
  
  return slides;
}

async function testAllFormats() {
  console.log('🧪 Testing slide parsing for different formats...\n');
  
  // Test Week 1 Lesson 1 (direct format with leading separator)
  const { data: course } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', 'postpartum-wellness-foundations')
    .single();

  const { data: module } = await supabase
    .from('course_modules')
    .select('id')
    .eq('course_id', course.id)
    .eq('week_number', 1)
    .single();

  const { data: lesson1 } = await supabase
    .from('course_lessons')
    .select('title, slides_html')
    .eq('module_id', module.id)
    .eq('lesson_number', 1)
    .single();

  console.log('📄 Testing:', lesson1.title);
  const slides1 = parseSlides(lesson1.slides_html);
  console.log('  - Number of slides:', slides1.length);
  console.log('  - First slide title:', slides1[0]?.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] || 'No title found');
  console.log('  - All slide titles:');
  slides1.forEach((slide, i) => {
    const title = slide.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] || 'No title';
    console.log(`    ${i + 1}. ${title}`);
  });

  // Test a DOCTYPE format lesson
  const { data: lesson2 } = await supabase
    .from('course_lessons')
    .select('title, slides_html')
    .eq('module_id', module.id)
    .eq('lesson_number', 2)
    .single();

  console.log('\n📄 Testing:', lesson2.title);
  const slides2 = parseSlides(lesson2.slides_html);
  console.log('  - Number of slides:', slides2.length);
  console.log('  - First slide preview:', slides2[0]?.substring(0, 100) + '...');
  
  // Test another DOCTYPE lesson
  const { data: randomLesson } = await supabase
    .from('course_lessons')
    .select('title, slides_html')
    .ilike('slides_html', '<!DOCTYPE%')
    .neq('id', lesson2.id)
    .limit(1)
    .single();

  console.log('\n📄 Testing:', randomLesson.title);
  const slides3 = parseSlides(randomLesson.slides_html);
  console.log('  - Number of slides:', slides3.length);
  console.log('  - Contains styles in first slide:', slides3[0]?.includes('<style>'));
}

testAllFormats().catch(console.error);