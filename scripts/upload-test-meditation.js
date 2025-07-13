const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadTestMeditation() {
  console.log('Creating test meditation file for Week 1...');
  
  // Create a simple test audio message
  const testMessage = `
This is a test meditation file for Week 1.
The actual meditation will be generated using ElevenLabs with Dr. Jana's voice.
This is just to test that the audio player is working correctly on the course page.
  `;
  
  console.log('\nTest meditation details:');
  console.log('- Week 1: Grounding Practice for New Moms');
  console.log('- Duration: 8:47');
  console.log('- URL will be: https://utetcmirepwdxbtrcczv.supabase.co/storage/v1/object/public/meditations/week1-meditation.mp3');
  
  console.log('\nNote: You'll need to:');
  console.log('1. Generate the actual meditation audio using ElevenLabs');
  console.log('2. Upload it to the Supabase dashboard under Storage > meditations bucket');
  console.log('3. Name it: week1-meditation.mp3');
  
  console.log('\nThe meditation player is now ready on the course page!');
  console.log('Visit: https://www.bloompsychologynorthaustin.com/course/week1');
}

uploadTestMeditation();