const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixSlideFormatting() {
  console.log('🔧 Fixing Week 1 Lesson 1 slide formatting...');

  try {
    // Get the lesson
    const { data: lesson, error: fetchError } = await supabase
      .from('course_lessons')
      .select('id, slides_html')
      .eq('title', 'Welcome to Your Fourth Trimester')
      .single();

    if (fetchError) {
      console.error('Error fetching lesson:', fetchError);
      return;
    }

    console.log('📚 Found lesson:', lesson.id);

    // Clean up the slides HTML - remove leading separator and ensure proper formatting
    const slidesContent = lesson.slides_html.trim();
    
    // Remove the leading <!-- SLIDE --> if it exists
    const cleanedSlides = slidesContent.startsWith('<!-- SLIDE -->')
      ? slidesContent.substring('<!-- SLIDE -->'.length).trim()
      : slidesContent;

    // Update the lesson with cleaned slides
    const { error: updateError } = await supabase
      .from('course_lessons')
      .update({ slides_html: cleanedSlides })
      .eq('id', lesson.id);

    if (updateError) {
      console.error('Error updating lesson:', updateError);
      return;
    }

    console.log('✅ Successfully fixed slide formatting!');
    console.log('📊 The slides should now display correctly without empty first slide');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

fixSlideFormatting();