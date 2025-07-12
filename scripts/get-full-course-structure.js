const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getFullCourseStructure() {
  // Get the main postpartum course
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', 'postpartum-wellness-foundations')
    .single();
    
  console.log('=== POSTPARTUM WELLNESS FOUNDATIONS - 6 WEEK COURSE ===\n');
  console.log(`Title: ${course.title}`);
  console.log(`Duration: ${course.duration}`);
  console.log(`Total Modules: ${course.total_modules}`);
  console.log(`Total Lessons: ${course.total_lessons}`);
  console.log('\n');
  
  // Get all modules for this course
  const { data: modules } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', course.id)
    .order('week_number');
    
  for (const module of modules) {
    console.log(`\n=== WEEK ${module.week_number}: ${module.title} ===`);
    console.log(`Description: ${module.description}`);
    console.log('Objectives:');
    module.objectives?.forEach(obj => console.log(`  - ${obj}`));
    
    // Get lessons for this module
    const { data: lessons } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('module_id', module.id)
      .order('lesson_number');
      
    console.log(`\nLessons (${lessons.length}):`);
    lessons.forEach(lesson => {
      console.log(`  ${lesson.lesson_number}. ${lesson.title} (${lesson.video_duration_minutes} min)`);
      console.log(`     ${lesson.description}`);
    });
  }
  
  // Summary of what exists in file system vs database
  console.log('\n\n=== FILE SYSTEM vs DATABASE COMPARISON ===');
  console.log('\nFile System Status:');
  console.log('- Week 1: ✅ Complete (4 lessons with presentations and scripts)');
  console.log('- Week 2: 🏗️ Structure exists (5 lessons with placeholder files)');
  console.log('- Week 3-6: ❌ Not yet created in file system');
  
  console.log('\nDatabase Status:');
  console.log('- All 6 weeks defined with modules');
  console.log('- All 25 lessons created with metadata');
  console.log('- Content needs to be developed for weeks 2-6');
}

getFullCourseStructure().catch(console.error);