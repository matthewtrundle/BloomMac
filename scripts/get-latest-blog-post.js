const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getLatestBlogPost() {
  try {
    // Get the most recent blog post
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching blog post:', error);
      return;
    }
    
    if (!data) {
      console.log('No blog posts found');
      return;
    }
    
    console.log('Latest Blog Post:');
    console.log('==================');
    console.log('Title:', data.title);
    console.log('Published:', new Date(data.published_at).toLocaleDateString());
    console.log('Category:', data.category);
    console.log('Author:', data.author_name);
    console.log('Read time:', data.read_time, 'minutes');
    console.log('Featured:', data.featured ? 'Yes' : 'No');
    console.log('\nExcerpt:');
    console.log(data.excerpt);
    console.log('\nSlug:', data.slug);
    console.log('\nContent length:', data.content.length, 'characters');
    
    // Show first 500 characters of content
    console.log('\nContent preview:');
    console.log(data.content.substring(0, 500) + '...');
    
  } catch (error) {
    console.error('Failed to get latest blog post:', error);
  }
}

getLatestBlogPost();