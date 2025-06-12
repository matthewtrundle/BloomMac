#!/usr/bin/env node

// Test blog save through API
require('dotenv').config({ path: '.env.local' });

const testBlogData = {
  title: "Test Blog Post",
  excerpt: "This is a test blog post excerpt",
  content: "# Test Content\n\nThis is test content for the blog post.",
  image: "/images/Hero/Hero.png",
  imageAlt: "Test image",
  category: "Mental Health",
  readTime: 5,
  publishedAt: new Date().toISOString(),
  featured: false,
  author: {
    name: "Jana Rundle",
    title: "Licensed Clinical Psychologist",
    image: "/images/Team/Jana Rundle.jpg"
  },
  metaDescription: "Test meta description",
  keywords: ["test", "blog"]
};

async function testBlogApiSave() {
  console.log('Testing blog save through API...\n');

  try {
    // First, let's test if we can access the blog-admin API without auth
    console.log('1. Testing API access without authentication...');
    const noAuthResponse = await fetch('http://localhost:3000/api/blog-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testBlogData)
    });

    console.log(`Response status: ${noAuthResponse.status}`);
    const noAuthData = await noAuthResponse.text();
    console.log(`Response: ${noAuthData}\n`);

    // Now let's check what happens with the blog storage directly
    console.log('2. Testing direct blog storage...');
    const { createBlogPost, loadBlogPosts } = await import('../lib/blog-storage.js');
    
    const initialPosts = await loadBlogPosts();
    console.log(`Current number of posts: ${initialPosts.length}`);
    
    // Try to create a post directly
    console.log('\n3. Creating test post directly...');
    const newPost = await createBlogPost(testBlogData);
    console.log(`Created post with slug: ${newPost.slug}`);
    
    // Verify it was saved
    const updatedPosts = await loadBlogPosts();
    console.log(`Number of posts after creation: ${updatedPosts.length}`);
    
    // Clean up - remove the test post
    console.log('\n4. Cleaning up test post...');
    const { deleteBlogPost } = await import('../lib/blog-storage.js');
    await deleteBlogPost(newPost.slug);
    console.log('Test post deleted');
    
    console.log('\n✅ Direct blog storage is working correctly!');
    console.log('\n⚠️  The issue is likely with authentication or API routing.');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
    console.error('\nStack trace:', error.stack);
  }
}

// Run the test
testBlogApiSave();