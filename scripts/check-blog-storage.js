const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkBlogStorage() {
  console.log('Checking Supabase storage buckets...\n');
  
  try {
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return;
    }
    
    console.log('Available storage buckets:');
    buckets.forEach(bucket => {
      console.log(`- ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
    
    // Check if blog-images bucket exists
    const blogImagesBucket = buckets.find(b => b.name === 'blog-images');
    
    if (blogImagesBucket) {
      console.log('\n✓ blog-images bucket exists');
      
      // Try to list files in the bucket
      const { data: files, error: filesError } = await supabase.storage
        .from('blog-images')
        .list();
      
      if (filesError) {
        console.error('Error listing files in blog-images:', filesError);
      } else {
        console.log(`\nFiles in blog-images bucket: ${files.length}`);
        if (files.length > 0) {
          console.log('\nFirst 5 files:');
          files.slice(0, 5).forEach(file => {
            console.log(`- ${file.name} (${file.metadata?.size || 'unknown'} bytes)`);
          });
        }
      }
    } else {
      console.log('\n✗ blog-images bucket does not exist');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBlogStorage();