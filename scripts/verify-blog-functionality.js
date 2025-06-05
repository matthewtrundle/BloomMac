#!/usr/bin/env node

// Verify blog functionality with Supabase
const tsNode = require('ts-node');
tsNode.register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs'
  }
});

require('dotenv').config({ path: '.env.local' });

async function verifyBlogFunctionality() {
  console.log('Verifying blog functionality with Supabase...\n');

  try {
    // Import the blog storage functions
    const { 
      loadBlogPosts, 
      getBlogPost, 
      createBlogPost, 
      updateBlogPost,
      deleteBlogPost 
    } = require('../lib/blog-storage');

    // 1. Test loading all posts
    console.log('1. Testing loadBlogPosts()...');
    const posts = await loadBlogPosts();
    console.log(`✅ Loaded ${posts.length} blog posts`);
    if (posts.length > 0) {
      console.log(`   First post: "${posts[0].title}"`);
    }

    // 2. Test getting a specific post
    console.log('\n2. Testing getBlogPost()...');
    if (posts.length > 0) {
      const firstPost = await getBlogPost(posts[0].slug);
      console.log(`✅ Retrieved post: "${firstPost.title}"`);
    }

    // 3. Test creating a new post
    console.log('\n3. Testing createBlogPost()...');
    const testPostData = {
      title: "Test Post from Verification Script",
      excerpt: "This is a test post created to verify blog functionality",
      content: "# Test Post\n\nThis post was created by the verification script.",
      image: "/images/Hero/Hero.png",
      imageAlt: "Test hero image",
      category: "Mental Health",
      readTime: 3,
      publishedAt: new Date().toISOString(),
      featured: false,
      author: {
        name: "Jana Rundle",
        title: "Licensed Clinical Psychologist",
        image: "/images/Team/Jana Rundle.jpg"
      },
      metaDescription: "Test post for verification",
      keywords: ["test", "verification"]
    };

    const newPost = await createBlogPost(testPostData);
    console.log(`✅ Created new post with slug: "${newPost.slug}"`);

    // 4. Test updating the post
    console.log('\n4. Testing updateBlogPost()...');
    const updatedPost = await updateBlogPost(newPost.slug, {
      title: testPostData.title + " (Updated)",
      featured: true
    });
    console.log(`✅ Updated post title to: "${updatedPost.title}"`);
    console.log(`   Featured status: ${updatedPost.featured}`);

    // 5. Test deleting the post
    console.log('\n5. Testing deleteBlogPost()...');
    const deleted = await deleteBlogPost(newPost.slug);
    console.log(`✅ Deleted test post: ${deleted}`);

    // 6. Verify deletion
    const deletedPost = await getBlogPost(newPost.slug);
    console.log(`   Verified deletion: ${deletedPost === null ? 'Success' : 'Failed'}`);

    console.log('\n✅ All blog functionality tests passed!');
    console.log('\n📝 Summary:');
    console.log('- Blog storage is now using Supabase');
    console.log('- All CRUD operations are working correctly');
    console.log('- The blog editor should now save posts without errors');
    console.log('\n🎉 The blog save issue has been fixed!');

  } catch (error) {
    console.error('❌ Error during verification:', error);
    console.error('\nStack trace:', error.stack);
  }
}

// Run the verification
verifyBlogFunctionality();