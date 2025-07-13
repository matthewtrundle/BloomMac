const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkWeek1Lessons() {
  try {
    // Get course ID
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();
      
    if (courseError) {
      console.error('Error fetching course:', courseError);
      return;
    }
    
    // Get week 1 module
    const { data: module, error: moduleError } = await supabase
      .from('course_modules')
      .select('id, title')
      .eq('course_id', course.id)
      .eq('week_number', 1)
      .single();
      
    if (moduleError) {
      console.error('Error fetching module:', moduleError);
      return;
    }
    
    console.log('Week 1:', module.title);
    
    // Get lessons for week 1
    const { data: lessons, error: lessonsError } = await supabase
      .from('course_lessons')
      .select('lesson_number, title, description, video_duration_minutes')
      .eq('module_id', module.id)
      .order('lesson_number');
      
    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError);
      return;
    }
    
    console.log('\nCurrent lessons in database:');
    lessons.forEach(lesson => {
      console.log(`Lesson ${lesson.lesson_number}: ${lesson.title}`);
      console.log(`  Description: ${lesson.description || 'No description'}`);
      console.log(`  Duration: ${lesson.video_duration_minutes || 'No duration'} min\n`);
    });
    
    // Show what should be there
    console.log('\nShould be:');
    const correctLessons = [
      {
        number: 1,
        title: 'Welcome to Your Postpartum Journey',
        duration: '12 min',
        description: 'Introduces the "fourth trimester" concept and validates the complexity of postpartum adjustment.'
      },
      {
        number: 2,
        title: 'What\'s Normal vs. What\'s Not',
        duration: '14 min',
        description: 'Differentiates common postpartum experiences from signs that indicate need for additional support.'
      },
      {
        number: 3,
        title: 'The Science of Postpartum Changes',
        duration: '11 min',
        description: 'Explains neurobiological changes, hormones, and physical recovery to reduce self-blame.'
      },
      {
        number: 4,
        title: 'Honoring Your Experience',
        duration: '13 min',
        description: 'Validates the full range of emotions including ambivalence, grief, and joy using "both/and" thinking.'
      }
    ];
    
    correctLessons.forEach(lesson => {
      console.log(`Lesson ${lesson.number}: ${lesson.title} (${lesson.duration})`);
      console.log(`  ${lesson.description}\n`);
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkWeek1Lessons();