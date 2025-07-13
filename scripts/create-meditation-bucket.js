const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createMeditationBucket() {
  console.log('Creating meditation storage bucket...');
  
  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }
    
    const meditationBucket = buckets.find(b => b.name === 'meditations');
    
    if (meditationBucket) {
      console.log('✅ Meditation bucket already exists!');
      console.log('Bucket details:', meditationBucket);
      return;
    }
    
    // Create new bucket
    const { data, error } = await supabase.storage.createBucket('meditations', {
      public: true, // Allow public access for streaming
      fileSizeLimit: 52428800, // 50MB limit per file
      allowedMimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
    });
    
    if (error) {
      console.error('Error creating bucket:', error);
      return;
    }
    
    console.log('✅ Meditation bucket created successfully!');
    console.log('Bucket details:', data);
    
    // Set CORS policy for audio streaming
    console.log('\nSetting CORS policy for audio streaming...');
    // Note: CORS is automatically configured for public buckets in Supabase
    
    console.log('\n📁 You can now upload meditation files to the "meditations" bucket');
    console.log('📍 Access them at: https://[project-id].supabase.co/storage/v1/object/public/meditations/[filename]');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createMeditationBucket();