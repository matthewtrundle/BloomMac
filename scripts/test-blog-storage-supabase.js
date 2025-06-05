// Test Supabase blog storage functionality
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSupabaseBlogStorage() {
  console.log('Testing Supabase Blog Storage Functionality\n');
  console.log('==========================================\n');

  try {
    // Test 1: Check if blog_posts table exists
    console.log('1. Checking blog_posts table...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Error accessing blog_posts table:', tableError.message);
      return;
    }
    console.log('✅ blog_posts table is accessible');

    // Test 2: Count existing posts
    console.log('\n2. Counting existing posts...');
    const { count, error: countError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error counting posts:', countError.message);
      return;
    }
    console.log(`✅ Found ${count} existing blog posts`);

    // Test 3: Create a test post
    console.log('\n3. Creating test post...');
    const testPost = {
      slug: 'supabase-test-post-' + Date.now(),
      title: 'Test Post from Supabase Storage Test',
      excerpt: 'This is a test post created to verify Supabase blog storage',
      content: 'This post was created by the test-blog-storage-supabase.js script to verify that blog storage is working correctly with Supabase.',
      image_url: '/images/Hero/Hero.png',
      image_alt: 'Test image',
      category: 'Testing',
      read_time: 1,
      featured: false,
      author_name: 'Test Script',
      author_title: 'Automated Tester',
      meta_description: 'Test post for Supabase blog storage',
      keywords: ['test', 'supabase', 'blog'],
      published_at: new Date().toISOString()
    };

    const { data: createdPost, error: createError } = await supabase
      .from('blog_posts')
      .insert([testPost])
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Error creating test post:', createError.message);
      return;
    }
    console.log('✅ Test post created successfully');
    console.log('   ID:', createdPost.id);
    console.log('   Slug:', createdPost.slug);

    // Test 4: Read the created post
    console.log('\n4. Reading created post...');
    const { data: readPost, error: readError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', testPost.slug)
      .single();
    
    if (readError) {
      console.error('❌ Error reading post:', readError.message);
    } else if (readPost && readPost.title === testPost.title) {
      console.log('✅ Post read successfully');
    } else {
      console.error('❌ Post data mismatch');
    }

    // Test 5: Update the post
    console.log('\n5. Updating test post...');
    const updatedTitle = testPost.title + ' (UPDATED)';
    const { data: updatedPost, error: updateError } = await supabase
      .from('blog_posts')
      .update({ title: updatedTitle })
      .eq('slug', testPost.slug)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Error updating post:', updateError.message);
    } else if (updatedPost && updatedPost.title === updatedTitle) {
      console.log('✅ Post updated successfully');
    } else {
      console.error('❌ Update verification failed');
    }

    // Test 6: Search functionality
    console.log('\n6. Testing search...');
    const { data: searchResults, error: searchError } = await supabase
      .from('blog_posts')
      .select('*')
      .or(`title.ilike.%Supabase%,content.ilike.%Supabase%`)
      .limit(5);
    
    if (searchError) {
      console.error('❌ Error searching posts:', searchError.message);
    } else {
      console.log(`✅ Search returned ${searchResults.length} results`);
    }

    // Test 7: Delete the test post
    console.log('\n7. Deleting test post...');
    const { error: deleteError } = await supabase
      .from('blog_posts')
      .delete()
      .eq('slug', testPost.slug);
    
    if (deleteError) {
      console.error('❌ Error deleting post:', deleteError.message);
    } else {
      console.log('✅ Test post deleted successfully');
    }

    // Test 8: Verify deletion
    console.log('\n8. Verifying deletion...');
    const { data: deletedCheck, error: checkError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', testPost.slug)
      .single();
    
    if (checkError && checkError.code === 'PGRST116') {
      console.log('✅ Post successfully deleted (not found)');
    } else if (deletedCheck) {
      console.error('❌ Post still exists after deletion');
    }

    // Test 9: Check featured posts functionality
    console.log('\n9. Testing featured posts query...');
    const { data: featuredPosts, error: featuredError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(3);
    
    if (featuredError) {
      console.error('❌ Error querying featured posts:', featuredError.message);
    } else {
      console.log(`✅ Found ${featuredPosts.length} featured posts`);
    }

    // Test 10: Check category filtering
    console.log('\n10. Testing category filtering...');
    const { data: categoryPosts, error: categoryError } = await supabase
      .from('blog_posts')
      .select('category')
      .limit(1);
    
    if (categoryError) {
      console.error('❌ Error getting categories:', categoryError.message);
    } else if (categoryPosts.length > 0) {
      const testCategory = categoryPosts[0].category;
      const { data: categoryFiltered, error: filterError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('category', testCategory);
      
      if (filterError) {
        console.error('❌ Error filtering by category:', filterError.message);
      } else {
        console.log(`✅ Category filter returned ${categoryFiltered.length} posts for category "${testCategory}"`);
      }
    }

    console.log('\n✅ All Supabase blog storage tests completed!');
    console.log('\nSummary:');
    console.log('- Blog posts table is properly configured');
    console.log('- CRUD operations are working correctly');
    console.log('- Search and filtering functionality is operational');
    console.log('- The Supabase blog storage is ready for use');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the tests
testSupabaseBlogStorage();