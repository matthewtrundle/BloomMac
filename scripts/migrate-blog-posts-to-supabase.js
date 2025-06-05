#!/usr/bin/env node

// Migrate blog posts from JSON to Supabase
require('dotenv').config({ path: '.env.local' });
const fs = require('fs/promises');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Transform BlogPost to database format
function transformToDbFormat(post) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image_url: post.image,
    image_alt: post.imageAlt,
    category: post.category,
    read_time: post.readTime,
    published_at: post.publishedAt,
    featured: post.featured,
    author_name: post.author?.name,
    author_title: post.author?.title,
    author_image: post.author?.image,
    meta_description: post.metaDescription,
    keywords: post.keywords || []
  };
}

async function migrateBlogPosts() {
  console.log('Migrating blog posts from JSON to Supabase...\n');

  try {
    // 1. Check current Supabase status
    console.log('1. Checking current Supabase blog posts...');
    const { count: existingCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });

    console.log(`   Current posts in Supabase: ${existingCount}`);

    if (existingCount > 0) {
      console.log('\n⚠️  Warning: Blog posts already exist in Supabase.');
      console.log('   To avoid duplicates, this migration will be skipped.');
      console.log('   If you want to re-migrate, please clear the blog_posts table first.');
      return;
    }

    // 2. Load blog posts from JSON
    console.log('\n2. Loading blog posts from JSON file...');
    const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.json');
    const blogPostsData = await fs.readFile(blogPostsPath, 'utf-8');
    const blogPosts = JSON.parse(blogPostsData);

    console.log(`   Found ${blogPosts.length} blog posts in JSON file`);

    // 3. Transform posts to database format
    console.log('\n3. Transforming posts to database format...');
    const dbPosts = blogPosts.map(transformToDbFormat);

    // 4. Insert posts into Supabase
    console.log('\n4. Inserting posts into Supabase...');
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(dbPosts)
      .select();

    if (error) {
      console.error('❌ Error inserting blog posts:', error);
      return;
    }

    console.log(`✅ Successfully migrated ${data.length} blog posts to Supabase!`);

    // 5. Verify migration
    console.log('\n5. Verifying migration...');
    const { count: finalCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });

    console.log(`   Total posts in Supabase: ${finalCount}`);

    if (finalCount === blogPosts.length) {
      console.log('\n✅ Migration completed successfully!');
      console.log('   All blog posts have been migrated to Supabase.');
      console.log('   The blog editor should now work correctly.');
    } else {
      console.log('\n⚠️  Warning: Post count mismatch');
      console.log(`   Expected: ${blogPosts.length}, Got: ${finalCount}`);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('\nStack trace:', error.stack);
  }
}

// Run the migration
migrateBlogPosts();