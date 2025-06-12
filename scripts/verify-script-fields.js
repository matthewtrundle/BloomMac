require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyScriptFields() {
  console.log('🔍 Verifying Script Management Fields...\n');

  try {
    // Check if new fields exist by trying to query them
    const { data: lesson, error } = await supabase
      .from('course_lessons')
      .select(`
        id,
        title,
        script_notes,
        script_status,
        script_duration_estimate,
        script_last_edited_by,
        script_last_edited_at,
        talking_points,
        video_script_formatted
      `)
      .limit(1)
      .single();

    if (error) {
      console.log('❌ Error querying new fields:', error.message);
      console.log('\nPlease make sure you ran the SQL script in Supabase.');
      return;
    }

    console.log('✅ All script management fields are available!\n');
    console.log('📋 Sample lesson with new fields:');
    console.log(`  Title: ${lesson.title}`);
    console.log(`  Script Status: ${lesson.script_status || 'not set'}`);
    console.log(`  Duration Estimate: ${lesson.script_duration_estimate ? Math.round(lesson.script_duration_estimate / 60) + ' minutes' : 'not set'}`);
    console.log(`  Has Script: ${lesson.script_notes ? 'Yes (' + lesson.script_notes.length + ' chars)' : 'No'}`);
    console.log(`  Talking Points: ${lesson.talking_points ? lesson.talking_points.length + ' points' : 'none'}`);

    // Check if script revisions table exists
    const { error: revError } = await supabase
      .from('course_script_revisions')
      .select('*')
      .limit(1);

    if (!revError) {
      console.log('\n✅ Script revisions table exists');
    } else {
      console.log('\n❌ Script revisions table error:', revError.message);
    }

    // Update script status for lessons that have scripts
    console.log('\n🔄 Setting initial script status for existing scripts...');
    const { data: updated, error: updateError } = await supabase
      .from('course_lessons')
      .update({ 
        script_status: 'draft',
        script_duration_estimate: 600 // Default 10 minutes
      })
      .not('script_notes', 'is', null)
      .gt('length(script_notes)', 100)
      .is('script_status', null);

    if (!updateError) {
      console.log('✅ Updated script status for existing content');
    }

    console.log('\n📊 Next Steps:');
    console.log('1. Visit http://localhost:3011/admin/courses');
    console.log('2. Click "Edit" on "Postpartum Wellness Foundations"');
    console.log('3. Click on the "Video Scripts" tab');
    console.log('4. You should see all 24 lessons with their scripts');
    console.log('5. Click any lesson to edit its script, status, and talking points');

  } catch (error) {
    console.error('Error:', error);
  }
}

verifyScriptFields().catch(console.error);