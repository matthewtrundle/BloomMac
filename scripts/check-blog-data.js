#!/usr/bin/env node

// Check blog data in Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkBlogData() {
  console.log('Checking blog posts in Supabase...\n');

  try {
    // Get all blog posts
    const { data, error, count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ Error fetching blog posts:', error);
      return;
    }

    console.log(`Total blog posts: ${count}\n`);

    if (data && data.length > 0) {
      console.log('Recent blog posts:');
      data.forEach((post, index) => {
        console.log(`\n${index + 1}. ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Category: ${post.category}`);
        console.log(`   Published: ${new Date(post.published_at).toLocaleDateString()}`);
        console.log(`   Featured: ${post.featured ? 'Yes' : 'No'}`);
        console.log(`   Image: ${post.image_url ? '✓' : '✗'}`);
        if (post.image_url) {
          console.log(`   Image URL: ${post.image_url}`);
        }
      });
    } else {
      console.log('No blog posts found in the database.');
    }

    // Check for any posts with missing images
    const { data: missingImages } = await supabase
      .from('blog_posts')
      .select('title, slug')
      .or('image_url.is.null,image_url.eq.');

    if (missingImages && missingImages.length > 0) {
      console.log('\n⚠️  Posts with missing images:');
      missingImages.forEach(post => {
        console.log(`   - ${post.title} (${post.slug})`);
      });
    }

  } catch (error) {
    console.error('❌ Error during check:', error);
  }
}

// Run the check
checkBlogData();