#!/usr/bin/env node

// Test blog image loading
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testBlogImages() {
  console.log('Testing blog image loading...\n');

  try {
    // Get all blog posts
    const { data, error } = await supabase
      .from('blog_posts')
      .select('title, slug, image_url')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching blog posts:', error);
      return;
    }

    let totalImages = 0;
    let missingImages = 0;
    let problematicPosts = [];

    console.log(`Checking ${data.length} blog posts...\n`);

    for (const post of data) {
      if (post.image_url) {
        totalImages++;
        
        // Check if it's a local image
        if (post.image_url.startsWith('/images/')) {
          const imagePath = path.join(process.cwd(), 'public', post.image_url);
          
          if (!fs.existsSync(imagePath)) {
            missingImages++;
            problematicPosts.push({
              title: post.title,
              slug: post.slug,
              image_url: post.image_url,
              reason: 'File not found on disk'
            });
            console.log(`❌ Missing: ${post.image_url}`);
            console.log(`   Post: ${post.title}`);
            console.log(`   Expected at: ${imagePath}\n`);
          }
        } else if (post.image_url.includes('supabase.co')) {
          // For Supabase URLs, we'd need to make an HTTP request to check
          console.log(`🔗 Supabase URL: ${post.image_url.substring(0, 80)}...`);
          console.log(`   Post: ${post.title}\n`);
        }
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Total posts: ${data.length}`);
    console.log(`Posts with images: ${totalImages}`);
    console.log(`Missing images: ${missingImages}`);
    
    if (problematicPosts.length > 0) {
      console.log('\n⚠️  Problematic posts:');
      problematicPosts.forEach(post => {
        console.log(`\n- ${post.title}`);
        console.log(`  Slug: ${post.slug}`);
        console.log(`  Image: ${post.image_url}`);
        console.log(`  Issue: ${post.reason}`);
      });
    } else {
      console.log('\n✅ All images found!');
    }

    // Check for images in the Blog folder that aren't being used
    const blogImagesDir = path.join(process.cwd(), 'public', 'images', 'Blog');
    if (fs.existsSync(blogImagesDir)) {
      const blogImages = fs.readdirSync(blogImagesDir);
      const usedImages = data
        .filter(post => post.image_url && post.image_url.includes('/Blog/'))
        .map(post => path.basename(post.image_url));
      
      const unusedImages = blogImages.filter(img => !usedImages.includes(img));
      
      if (unusedImages.length > 0) {
        console.log(`\n📁 Unused images in /images/Blog/ folder: ${unusedImages.length}`);
        unusedImages.slice(0, 5).forEach(img => {
          console.log(`   - ${img}`);
        });
        if (unusedImages.length > 5) {
          console.log(`   ... and ${unusedImages.length - 5} more`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

// Run the test
testBlogImages();