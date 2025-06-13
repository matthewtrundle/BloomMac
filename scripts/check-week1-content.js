require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkWeek1Content() {
  console.log('Checking Week 1 content...\n');

  // Get Week 1 module with lessons
  const { data, error } = await supabase
    .from('course_modules')
    .select(`
      *,
      course_lessons (
        id,
        lesson_number,
        title,
        description,
        slides_html,
        video_url,
        video_duration_minutes,
        is_published
      )
    `)
    .eq('course_id', '9549c2c2-52e9-4d3b-bac3-bddc25b4065b')
    .eq('week_number', 1)
    .single();

  if (error) {
    console.error('Error fetching Week 1:', error);
    return;
  }

  console.log('Week 1 Module:');
  console.log('Title:', data.title);
  console.log('Description:', data.description);
  console.log('\nLessons:');
  
  if (!data.course_lessons || data.course_lessons.length === 0) {
    console.log('❌ No lessons found for Week 1!');
    return;
  }

  data.course_lessons.forEach(lesson => {
    console.log(`\nLesson ${lesson.lesson_number}: ${lesson.title}`);
    console.log('- Has slides_html:', !!lesson.slides_html);
    console.log('- slides_html length:', lesson.slides_html?.length || 0);
    console.log('- Has video_url:', !!lesson.video_url);
    console.log('- Video duration:', lesson.video_duration_minutes || 0, 'minutes');
    console.log('- Is published:', lesson.is_published);
    
    // Check first 100 chars of slides_html if present
    if (lesson.slides_html) {
      console.log('- First 100 chars of slides:', lesson.slides_html.substring(0, 100) + '...');
    }
  });
}

checkWeek1Content();