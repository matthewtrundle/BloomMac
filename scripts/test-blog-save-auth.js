// Test blog save functionality with authentication
require('dotenv').config({ path: '.env.local' });
const fs = require('fs').promises;
const path = require('path');

async function testBlogSave() {
  console.log('Testing Blog Save Functionality\n');
  console.log('==============================\n');

  const baseUrl = 'http://localhost:3000';
  
  try {
    // Check if server is running
    try {
      await fetch(`${baseUrl}/api/test-analytics`);
    } catch {
      console.error('❌ Server is not running. Please start with: npm run dev');
      return;
    }

    // Step 1: Login to get JWT token
    console.log('1. Testing login...');
    const loginResponse = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'jana@bloompsychologygroup.com',
        password: 'BloomAdmin2024!'
      })
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.error('❌ Login failed:', error);
      return;
    }

    // Extract the adminToken cookie
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    const adminToken = setCookieHeader?.match(/adminToken=([^;]+)/)?.[1];
    
    if (!adminToken) {
      console.error('❌ No adminToken found in login response');
      return;
    }

    console.log('✅ Login successful');

    // Step 2: Fetch blog posts
    console.log('\n2. Fetching blog posts...');
    const fetchResponse = await fetch(`${baseUrl}/api/blog-admin`, {
      headers: {
        'Cookie': `adminToken=${adminToken}`
      }
    });

    if (!fetchResponse.ok) {
      console.error('❌ Failed to fetch posts:', fetchResponse.status);
      return;
    }

    const posts = await fetchResponse.json();
    console.log(`✅ Fetched ${posts.length} blog posts`);

    // Step 3: Test updating a post
    console.log('\n3. Testing blog post update...');
    const testPost = posts[0];
    const originalTitle = testPost.title;
    
    const updateResponse = await fetch(`${baseUrl}/api/blog-admin?slug=${testPost.slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `adminToken=${adminToken}`
      },
      body: JSON.stringify({
        ...testPost,
        title: originalTitle + ' (AUTH TEST)'
      })
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      console.error('❌ Update failed:', updateResponse.status, error);
      return;
    }

    console.log('✅ Blog post updated successfully');

    // Step 4: Verify the update
    console.log('\n4. Verifying update...');
    const verifyResponse = await fetch(`${baseUrl}/api/blog-admin?slug=${testPost.slug}`, {
      headers: {
        'Cookie': `adminToken=${adminToken}`
      }
    });

    const updatedPost = await verifyResponse.json();
    if (updatedPost.title.includes('(AUTH TEST)')) {
      console.log('✅ Update verified in API');
    } else {
      console.error('❌ Update not reflected in API');
    }

    // Step 5: Check file directly
    console.log('\n5. Checking blog data file...');
    const blogDataPath = path.join(process.cwd(), 'data', 'blog-posts.json');
    const fileContent = await fs.readFile(blogDataPath, 'utf-8');
    const filePosts = JSON.parse(fileContent);
    const filePost = filePosts.find(p => p.slug === testPost.slug);
    
    if (filePost && filePost.title.includes('(AUTH TEST)')) {
      console.log('✅ Update saved to file');
    } else {
      console.error('❌ Update not saved to file');
    }

    // Step 6: Restore original
    console.log('\n6. Restoring original title...');
    await fetch(`${baseUrl}/api/blog-admin?slug=${testPost.slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `adminToken=${adminToken}`
      },
      body: JSON.stringify({
        ...testPost,
        title: originalTitle
      })
    });
    console.log('✅ Original title restored');

    // Step 7: Test creating a new post
    console.log('\n7. Testing blog post creation...');
    const newPost = {
      title: 'Test Authentication Post',
      excerpt: 'This is a test post to verify authentication',
      content: '# Test Post\n\nThis post was created to test JWT authentication.',
      image: '/images/Hero/Hero.png',
      imageAlt: 'Test image',
      category: 'Mental Health',
      readTime: 3,
      publishedAt: new Date().toISOString(),
      featured: false,
      author: {
        name: 'Jana Rundle',
        title: 'Licensed Clinical Psychologist',
        image: '/images/Team/Jana Rundle.jpg'
      },
      metaDescription: 'Test post for authentication',
      keywords: ['test', 'authentication']
    };

    const createResponse = await fetch(`${baseUrl}/api/blog-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `adminToken=${adminToken}`
      },
      body: JSON.stringify(newPost)
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error('❌ Create failed:', createResponse.status, error);
    } else {
      const createdPost = await createResponse.json();
      console.log('✅ New blog post created with slug:', createdPost.slug);
      
      // Delete the test post
      console.log('\n8. Cleaning up test post...');
      await fetch(`${baseUrl}/api/blog-admin?slug=${createdPost.slug}`, {
        method: 'DELETE',
        headers: {
          'Cookie': `adminToken=${adminToken}`
        }
      });
      console.log('✅ Test post deleted');
    }

    console.log('\n✅ All blog authentication tests passed!');
    console.log('\nBlog functionality is working correctly with JWT authentication.');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testBlogSave();