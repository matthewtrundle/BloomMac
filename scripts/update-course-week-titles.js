const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Master course structure from CLAUDE.md
const correctWeekTitles = {
  1: "Understanding Your Fourth Trimester",
  2: "Cultivating Self-Compassion & Building Resilience",
  3: "Building Your Support Ecosystem",
  4: "Understanding & Managing Postpartum Anxiety",
  5: "Identity Integration & Matrescence",
  6: "Sustainable Wellness & Moving Forward"
};

async function updateWeekTitles() {
  try {
    console.log('🔍 Fetching course ID for Postpartum Wellness Foundations...');
    
    // Get the course ID
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('slug', 'postpartum-wellness-foundations')
      .single();

    if (courseError || !course) {
      console.error('❌ Error fetching course:', courseError);
      return;
    }

    console.log(`✅ Found course: ${course.title} (ID: ${course.id})`);
    console.log('\n📊 Current week titles in database:');

    // Get all modules for this course
    const { data: modules, error: modulesError } = await supabase
      .from('course_modules')
      .select('id, week_number, title')
      .eq('course_id', course.id)
      .order('week_number');

    if (modulesError) {
      console.error('❌ Error fetching modules:', modulesError);
      return;
    }

    // Display current state
    modules.forEach(module => {
      const correctTitle = correctWeekTitles[module.week_number];
      const isCorrect = module.title === correctTitle;
      console.log(`Week ${module.week_number}: "${module.title}" ${isCorrect ? '✅' : '❌'}`);
      if (!isCorrect) {
        console.log(`  → Should be: "${correctTitle}"`);
      }
    });

    console.log('\n🔄 Updating week titles to match master document...');

    // Update each module
    for (const module of modules) {
      const correctTitle = correctWeekTitles[module.week_number];
      
      if (module.title !== correctTitle) {
        const { error: updateError } = await supabase
          .from('course_modules')
          .update({ title: correctTitle })
          .eq('id', module.id);

        if (updateError) {
          console.error(`❌ Error updating Week ${module.week_number}:`, updateError);
        } else {
          console.log(`✅ Updated Week ${module.week_number}: "${correctTitle}"`);
        }
      }
    }

    console.log('\n✅ Week title update complete!');

    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const { data: updatedModules, error: verifyError } = await supabase
      .from('course_modules')
      .select('week_number, title')
      .eq('course_id', course.id)
      .order('week_number');

    if (verifyError) {
      console.error('❌ Error verifying updates:', verifyError);
      return;
    }

    console.log('\n📊 Final week titles in database:');
    updatedModules.forEach(module => {
      const correctTitle = correctWeekTitles[module.week_number];
      const isCorrect = module.title === correctTitle;
      console.log(`Week ${module.week_number}: "${module.title}" ${isCorrect ? '✅' : '❌'}`);
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the update
updateWeekTitles();