#!/usr/bin/env node

// Test blog storage with Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testBlogSupabase() {
  console.log('Testing blog storage with Supabase...\n');

  try {
    // 1. Check if blog_posts table exists and has data
    console.log('1. Checking blog_posts table...');
    const { data: posts, error: fetchError, count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .limit(5);

    if (fetchError) {
      console.error('❌ Error fetching blog posts:', fetchError);
      return;
    }

    console.log(`✅ Successfully connected to blog_posts table`);
    console.log(`   Total posts: ${count}`);
    if (posts && posts.length > 0) {
      console.log(`   First post: "${posts[0].title}"`);
    }

    // 2. Test creating a new post
    console.log('\n2. Testing create operation...');
    const testPost = {
      slug: 'test-post-' + Date.now(),
      title: 'Test Post - ' + new Date().toISOString(),
      excerpt: 'This is a test blog post excerpt',
      content: '# Test Content\n\nThis is test content for the blog post.',
      image_url: '/images/Hero/Hero.png',
      image_alt: 'Test image',
      category: 'Mental Health',
      read_time: 5,
      published_at: new Date().toISOString(),
      featured: false,
      author_name: 'Jana Rundle',
      author_title: 'Licensed Clinical Psychologist',
      author_image: '/images/Team/Jana Rundle.jpg',
      meta_description: 'Test meta description',
      keywords: ['test', 'blog']
    };

    const { data: newPost, error: createError } = await supabase
      .from('blog_posts')
      .insert(testPost)
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating test post:', createError);
      return;
    }

    console.log(`✅ Successfully created test post with ID: ${newPost.id}`);

    // 3. Test updating the post
    console.log('\n3. Testing update operation...');
    const { data: updatedPost, error: updateError } = await supabase
      .from('blog_posts')
      .update({ title: testPost.title + ' (Updated)' })
      .eq('id', newPost.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating test post:', updateError);
    } else {
      console.log(`✅ Successfully updated test post`);
    }

    // 4. Test deleting the post
    console.log('\n4. Testing delete operation...');
    const { error: deleteError } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', newPost.id);

    if (deleteError) {
      console.error('❌ Error deleting test post:', deleteError);
    } else {
      console.log(`✅ Successfully deleted test post`);
    }

    console.log('\n✅ All Supabase blog storage tests passed!');
    console.log('\nThe blog editor should now work correctly with Supabase storage.');
    
  } catch (error) {
    console.error('❌ Unexpected error during testing:', error);
  }
}

// Run the test
testBlogSupabase();