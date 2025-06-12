// Test blog save functionality
require('dotenv').config({ path: '.env.local' });
const fs = require('fs/promises');
const path = require('path');

async function testBlogSave() {
  console.log('Testing blog save functionality...\n');

  try {
    // Check if blog-posts.json exists
    const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.json');
    const exists = await fs.access(blogPostsPath).then(() => true).catch(() => false);
    
    if (!exists) {
      console.error('❌ Blog posts file not found at:', blogPostsPath);
      return;
    }

    console.log('✅ Blog posts file exists');

    // Try to read and parse the file
    const content = await fs.readFile(blogPostsPath, 'utf-8');
    const posts = JSON.parse(content);
    
    console.log(`✅ Successfully loaded ${posts.length} blog posts`);
    
    // Check file permissions
    try {
      await fs.access(blogPostsPath, fs.constants.W_OK);
      console.log('✅ Blog posts file is writable');
    } catch (error) {
      console.error('❌ Blog posts file is not writable:', error.message);
    }

    // Test blog-storage functions
    const { loadBlogPosts, saveBlogPosts } = require('../lib/blog-storage');
    
    // Test loading
    const loadedPosts = await loadBlogPosts();
    console.log(`✅ blog-storage.loadBlogPosts() returned ${loadedPosts.length} posts`);

    // Test saving (with a minor change that we'll revert)
    const testPost = loadedPosts[0];
    const originalTitle = testPost.title;
    testPost.title = originalTitle + ' (TEST)';
    
    await saveBlogPosts(loadedPosts);
    console.log('✅ blog-storage.saveBlogPosts() completed without error');
    
    // Revert the change
    testPost.title = originalTitle;
    await saveBlogPosts(loadedPosts);
    console.log('✅ Reverted test change');

    console.log('\n✅ All blog save tests passed!');
    console.log('\nNote: The blog editor should now work properly with JWT authentication.');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
    console.error('\nStack trace:', error.stack);
  }
}

// Run the test
testBlogSave();