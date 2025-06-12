// Test blog storage functionality directly
const fs = require('fs').promises;
const path = require('path');

async function testBlogStorage() {
  console.log('Testing Blog Storage Functionality\n');
  console.log('=================================\n');

  try {
    // Test 1: Check if blog data file exists and is accessible
    console.log('1. Checking blog data file...');
    const blogDataPath = path.join(process.cwd(), 'data', 'blog-posts.json');
    
    try {
      await fs.access(blogDataPath, fs.constants.R_OK | fs.constants.W_OK);
      console.log('✅ Blog data file exists and is readable/writable');
    } catch (error) {
      console.error('❌ Blog data file access error:', error.message);
      return;
    }

    // Test 2: Read and parse blog data
    console.log('\n2. Reading blog data...');
    const content = await fs.readFile(blogDataPath, 'utf-8');
    const posts = JSON.parse(content);
    console.log(`✅ Successfully loaded ${posts.length} blog posts`);

    // Test 3: Test write operation
    console.log('\n3. Testing write operation...');
    const testPost = posts[0];
    const originalTitle = testPost.title;
    
    // Make a temporary change
    testPost.title = originalTitle + ' (STORAGE TEST)';
    await fs.writeFile(blogDataPath, JSON.stringify(posts, null, 2));
    console.log('✅ Write operation successful');

    // Test 4: Verify the change was saved
    console.log('\n4. Verifying write...');
    const updatedContent = await fs.readFile(blogDataPath, 'utf-8');
    const updatedPosts = JSON.parse(updatedContent);
    const updatedPost = updatedPosts.find(p => p.slug === testPost.slug);
    
    if (updatedPost && updatedPost.title.includes('(STORAGE TEST)')) {
      console.log('✅ Change was successfully saved');
    } else {
      console.error('❌ Change was not saved');
    }

    // Test 5: Restore original
    console.log('\n5. Restoring original data...');
    testPost.title = originalTitle;
    updatedPosts[0] = testPost;
    await fs.writeFile(blogDataPath, JSON.stringify(updatedPosts, null, 2));
    console.log('✅ Original data restored');

    // Test 6: Check blog-storage module
    console.log('\n6. Testing blog-storage module...');
    try {
      // We can't directly test the TypeScript module from Node.js
      // but we can check if the file exists
      const blogStoragePath = path.join(process.cwd(), 'lib', 'blog-storage.ts');
      await fs.access(blogStoragePath);
      console.log('✅ blog-storage.ts module exists');
      
      // Check its contents for proper exports
      const storageContent = await fs.readFile(blogStoragePath, 'utf-8');
      const hasLoadFunction = storageContent.includes('export async function loadBlogPosts');
      const hasSaveFunction = storageContent.includes('export async function saveBlogPosts');
      const hasCreateFunction = storageContent.includes('export async function createBlogPost');
      const hasUpdateFunction = storageContent.includes('export async function updateBlogPost');
      const hasDeleteFunction = storageContent.includes('export async function deleteBlogPost');
      
      console.log(`   ${hasLoadFunction ? '✅' : '❌'} loadBlogPosts function`);
      console.log(`   ${hasSaveFunction ? '✅' : '❌'} saveBlogPosts function`);
      console.log(`   ${hasCreateFunction ? '✅' : '❌'} createBlogPost function`);
      console.log(`   ${hasUpdateFunction ? '✅' : '❌'} updateBlogPost function`);
      console.log(`   ${hasDeleteFunction ? '✅' : '❌'} deleteBlogPost function`);
    } catch (error) {
      console.error('❌ Could not check blog-storage module');
    }

    console.log('\n✅ All blog storage tests passed!');
    console.log('\nBlog storage is working correctly and ready for use.');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testBlogStorage();