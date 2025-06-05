#!/usr/bin/env node

// Test blog storage directly
const path = require('path');

async function testBlogStorageDirect() {
  console.log('Testing blog storage directly...\n');

  try {
    // Import using full path
    const blogStoragePath = path.join(process.cwd(), 'lib', 'blog-storage.ts');
    console.log(`Looking for blog storage at: ${blogStoragePath}`);
    
    // Since it's TypeScript, we need to compile it or use ts-node
    // Let's check what happens when we import it directly
    console.log('\n1. Checking blog data file...');
    const fs = require('fs/promises');
    const blogDataPath = path.join(process.cwd(), 'data', 'blog-posts.json');
    
    const exists = await fs.access(blogDataPath).then(() => true).catch(() => false);
    console.log(`Blog data file exists: ${exists}`);
    
    if (exists) {
      const data = await fs.readFile(blogDataPath, 'utf-8');
      const posts = JSON.parse(data);
      console.log(`Number of posts: ${posts.length}`);
      console.log(`First post title: ${posts[0]?.title || 'No posts'}`);
      
      // Test write permission
      console.log('\n2. Testing write permission...');
      try {
        // Add a test field to the first post
        posts[0]._test = Date.now();
        await fs.writeFile(blogDataPath, JSON.stringify(posts, null, 2));
        console.log('✅ Successfully wrote to blog posts file');
        
        // Remove test field
        delete posts[0]._test;
        await fs.writeFile(blogDataPath, JSON.stringify(posts, null, 2));
        console.log('✅ Successfully cleaned up test data');
      } catch (writeError) {
        console.error('❌ Failed to write to blog posts file:', writeError.message);
      }
    }
    
    console.log('\n3. Checking if blog storage is actually using Supabase...');
    
    // Check if there's a Supabase connection for blog posts
    const supabasePath = path.join(process.cwd(), 'lib', 'supabase.ts');
    const supabaseExists = await fs.access(supabasePath).then(() => true).catch(() => false);
    console.log(`Supabase client exists: ${supabaseExists}`);
    
    // Check migration status
    console.log('\n4. Checking migration documentation...');
    const migrationSummary = await fs.readFile(
      path.join(process.cwd(), 'SUPABASE_MIGRATION_SUMMARY.md'), 
      'utf-8'
    );
    
    const blogMigrationMentioned = migrationSummary.includes('blog_posts');
    console.log(`Blog posts mentioned in migration: ${blogMigrationMentioned}`);
    
    if (blogMigrationMentioned) {
      console.log('\n⚠️  Blog posts should be using Supabase, but blog-storage.ts is still using file storage!');
      console.log('This is likely the root cause of the save issue.');
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
    console.error('\nStack trace:', error.stack);
  }
}

// Run the test
testBlogStorageDirect();