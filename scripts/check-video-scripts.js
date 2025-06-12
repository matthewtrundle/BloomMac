require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkVideoScripts() {
  console.log('📹 Checking Video Scripts in Database...\n');

  try {
    // Get a few lessons with scripts
    const { data: lessons, error } = await supabase
      .from('course_lessons')
      .select('id, lesson_number, title, script_notes')
      .not('script_notes', 'is', null)
      .order('lesson_number')
      .limit(3);

    if (error) throw error;

    console.log(`Found ${lessons.length} lessons with scripts\n`);

    // Display sample script content
    lessons.forEach(lesson => {
      console.log(`📖 Lesson ${lesson.lesson_number}: ${lesson.title}`);
      console.log('Script preview (first 500 chars):');
      console.log('---');
      console.log(lesson.script_notes.substring(0, 500) + '...');
      console.log('---\n');
    });

    // Check total script coverage
    const { count: totalLessons } = await supabase
      .from('course_lessons')
      .select('*', { count: 'exact', head: true });

    const { count: lessonsWithScripts } = await supabase
      .from('course_lessons')
      .select('*', { count: 'exact', head: true })
      .not('script_notes', 'is', null)
      .gt('char_length(script_notes)', 100);

    console.log(`📊 Script Coverage: ${lessonsWithScripts}/${totalLessons} lessons have scripts`);

    // Check if we need additional fields
    console.log('\n🔍 Current Database Fields for Scripts:');
    console.log('- script_notes (text) - Currently storing full video scripts');
    
    console.log('\n💡 Suggested Additional Fields:');
    console.log('- video_script_formatted (text) - For rich text/formatted version');
    console.log('- script_version (integer) - Track script revisions');
    console.log('- script_duration_estimate (integer) - Estimated speaking time in seconds');
    console.log('- script_last_edited_by (text) - Track who edited');
    console.log('- script_status (text) - draft/reviewed/final');
    console.log('- talking_points (jsonb) - Bullet points for quick reference');

  } catch (error) {
    console.error('Error:', error);
  }
}

checkVideoScripts().catch(console.error);