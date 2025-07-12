const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('Environment variables:');
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Has SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('Has ANON_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('Timestamp:', new Date().toISOString());

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Test actual connection with a timestamp
async function testLiveConnection() {
  console.log('\n=== TESTING LIVE CONNECTION ===');
  console.log('Current time:', new Date().toISOString());
  
  // First, let's check blog_posts table structure
  console.log('\n1. Checking blog_posts table...');
  const { data: blogPosts, error: blogError } = await supabase
    .from('blog_posts')
    .select('*')
    .limit(1);
    
  if (blogError) {
    console.log('Error accessing blog_posts:', blogError);
  } else {
    console.log('Successfully connected to blog_posts table');
    if (blogPosts[0]) {
      console.log('Columns in blog_posts:', Object.keys(blogPosts[0]));
      console.log('Sample data:', {
        id: blogPosts[0].id,
        title: blogPosts[0].title,
        created_at: blogPosts[0].created_at
      });
    }
  }

  // Check if blog_images table exists
  console.log('\n2. Checking blog_images table...');
  const { data: blogImages, error: imagesError } = await supabase
    .from('blog_images')
    .select('*')
    .limit(1);
    
  if (imagesError) {
    console.log('Error accessing blog_images:', imagesError.message);
  } else {
    console.log('blog_images table exists');
    if (blogImages && blogImages[0]) {
      console.log('Columns:', Object.keys(blogImages[0]));
    } else {
      console.log('No data in blog_images table');
    }
  }

  // Check the actual count with a timestamp to prove it's live
  console.log('\n3. Getting live counts...');
  const { count: postCount } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true });
    
  const { count: imageCount } = await supabase
    .from('blog_images')
    .select('*', { count: 'exact', head: true });
    
  console.log('LIVE blog_posts count:', postCount);
  console.log('LIVE blog_images count:', imageCount || 'table does not exist');
  
  // Check user_profiles to verify connection
  console.log('\n4. Verifying with user_profiles...');
  const { count: userCount } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true });
  console.log('LIVE user_profiles count:', userCount);
  
  console.log('\n=== CONNECTION TEST COMPLETE ===');
  console.log('Timestamp:', new Date().toISOString());
}

testLiveConnection().catch(console.error);