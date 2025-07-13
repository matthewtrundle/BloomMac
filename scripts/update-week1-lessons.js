const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Master lesson data from course document
const correctLessons = [
  {
    number: 1,
    title: 'Welcome to Your Postpartum Journey',
    duration: 12,
    description: 'Introduces the "fourth trimester" concept and validates the complexity of postpartum adjustment.'
  },
  {
    number: 2,
    title: 'What\'s Normal vs. What\'s Not',
    duration: 14,
    description: 'Differentiates common postpartum experiences from signs that indicate need for additional support.'
  },
  {
    number: 3,
    title: 'The Science of Postpartum Changes',
    duration: 11,
    description: 'Explains neurobiological changes, hormones, and physical recovery to reduce self-blame.'
  },
  {
    number: 4,
    title: 'Honoring Your Experience',
    duration: 13,
    description: 'Validates the full range of emotions including ambivalence, grief, and joy using "both/and" thinking.'
  }
];

async function updateWeek1Lessons() {
  try {
    console.log('🔍 Fetching course and module info...');
    
    // Get course ID
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();
      
    if (courseError) {
      console.error('❌ Error fetching course:', courseError);
      return;
    }
    
    // Get week 1 module
    const { data: module, error: moduleError } = await supabase
      .from('course_modules')
      .select('id')
      .eq('course_id', course.id)
      .eq('week_number', 1)
      .single();
      
    if (moduleError) {
      console.error('❌ Error fetching module:', moduleError);
      return;
    }
    
    console.log('✅ Found Week 1 module');
    
    // Get current lessons
    const { data: currentLessons, error: lessonsError } = await supabase
      .from('course_lessons')
      .select('id, lesson_number, title, description, video_duration_minutes')
      .eq('module_id', module.id)
      .order('lesson_number');
      
    if (lessonsError) {
      console.error('❌ Error fetching lessons:', lessonsError);
      return;
    }
    
    console.log('\n📊 Current vs. Correct Lessons:');
    
    // Update each lesson
    for (let i = 0; i < correctLessons.length; i++) {
      const correctLesson = correctLessons[i];
      const currentLesson = currentLessons[i];
      
      if (currentLesson) {
        const needsUpdate = 
          currentLesson.title !== correctLesson.title ||
          currentLesson.description !== correctLesson.description ||
          currentLesson.video_duration_minutes !== correctLesson.duration;
        
        console.log(`\nLesson ${correctLesson.number}:`);
        console.log(`  Current: "${currentLesson.title}"`);
        console.log(`  Correct: "${correctLesson.title}" ${needsUpdate ? '❌' : '✅'}`);
        
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('course_lessons')
            .update({
              title: correctLesson.title,
              description: correctLesson.description,
              video_duration_minutes: correctLesson.duration
            })
            .eq('id', currentLesson.id);
            
          if (updateError) {
            console.error(`❌ Error updating lesson ${correctLesson.number}:`, updateError);
          } else {
            console.log(`✅ Updated lesson ${correctLesson.number}`);
          }
        }
      } else {
        console.log(`❌ Missing lesson ${correctLesson.number} in database`);
      }
    }
    
    console.log('\n🔍 Verifying updates...');
    
    // Verify updates
    const { data: updatedLessons } = await supabase
      .from('course_lessons')
      .select('lesson_number, title, description, video_duration_minutes')
      .eq('module_id', module.id)
      .order('lesson_number');
      
    console.log('\n📋 Final Week 1 Lessons:');
    updatedLessons.forEach(lesson => {
      console.log(`Lesson ${lesson.lesson_number}: ${lesson.title} (${lesson.video_duration_minutes} min)`);
      console.log(`  ${lesson.description}\n`);
    });
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

updateWeek1Lessons();