// Script to switch blog storage from file-based to Supabase
const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function switchToSupabaseBlogStorage() {
  console.log('Switching Blog Storage to Supabase\n');
  console.log('==================================\n');

  try {
    // Step 1: Check current blog data
    console.log('1. Reading current blog data from file...');
    const blogDataPath = path.join(process.cwd(), 'data', 'blog-posts.json');
    const blogData = await fs.readFile(blogDataPath, 'utf-8');
    const blogPosts = JSON.parse(blogData);
    console.log(`✅ Found ${blogPosts.length} blog posts in file storage`);

    // Step 2: Check Supabase blog_posts table
    console.log('\n2. Checking Supabase blog_posts table...');
    const { count: existingCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Supabase currently has ${existingCount} blog posts`);

    // Step 3: Transform blog posts for Supabase
    console.log('\n3. Transforming blog posts for Supabase...');
    const transformedPosts = blogPosts.map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image_url: post.image,
      image_alt: post.imageAlt,
      category: post.category,
      read_time: post.readTime,
      featured: post.featured,
      author_name: post.author.name,
      author_title: post.author.title,
      author_image: post.author.image,
      meta_description: post.metaDescription,
      keywords: post.keywords,
      published_at: post.publishedAt
    }));
    console.log('✅ Blog posts transformed successfully');

    // Step 4: Backup existing Supabase data if any
    if (existingCount > 0) {
      console.log('\n4. Backing up existing Supabase blog posts...');
      const { data: existingPosts } = await supabase
        .from('blog_posts')
        .select('*');
      
      const backupPath = path.join(
        process.cwd(), 
        'data', 
        'backups', 
        `supabase-blog-backup-${new Date().toISOString().split('T')[0]}.json`
      );
      
      await fs.mkdir(path.dirname(backupPath), { recursive: true });
      await fs.writeFile(backupPath, JSON.stringify(existingPosts, null, 2));
      console.log(`✅ Backed up ${existingPosts.length} posts to ${backupPath}`);
    }

    // Step 5: Clear existing posts (optional - comment out if you want to keep them)
    if (existingCount > 0) {
      console.log('\n5. Clearing existing Supabase blog posts...');
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (deleteError) {
        console.error('❌ Error clearing existing posts:', deleteError.message);
        return;
      }
      console.log('✅ Existing posts cleared');
    }

    // Step 6: Insert blog posts into Supabase
    console.log('\n6. Inserting blog posts into Supabase...');
    
    // Insert in batches to avoid hitting limits
    const batchSize = 50;
    let inserted = 0;
    
    for (let i = 0; i < transformedPosts.length; i += batchSize) {
      const batch = transformedPosts.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(batch)
        .select();
      
      if (error) {
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error.message);
        continue;
      }
      
      inserted += data.length;
      console.log(`   ✅ Inserted batch ${i / batchSize + 1} (${data.length} posts)`);
    }
    
    console.log(`✅ Successfully inserted ${inserted} blog posts into Supabase`);

    // Step 7: Verify the migration
    console.log('\n7. Verifying migration...');
    const { count: finalCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    console.log(`✅ Supabase now has ${finalCount} blog posts`);
    
    if (finalCount === blogPosts.length) {
      console.log('✅ All posts migrated successfully!');
    } else {
      console.log(`⚠️  Count mismatch: Expected ${blogPosts.length}, got ${finalCount}`);
    }

    // Step 8: Update the blog-admin API to use Supabase
    console.log('\n8. Next steps to complete the switch:');
    console.log('   1. Update /pages/api/blog-admin.ts to import from blog-storage-supabase.ts');
    console.log('   2. Update any other files that import from blog-storage.ts');
    console.log('   3. Test all blog functionality (create, read, update, delete)');
    console.log('   4. Once verified, you can archive the old blog-posts.json file');
    
    console.log('\n✅ Blog storage migration to Supabase completed!');

  } catch (error) {
    console.error('❌ Migration error:', error);
  }
}

// Add a function to verify both storage systems have the same data
async function verifyStorageParity() {
  console.log('\nVerifying Storage Parity\n');
  console.log('========================\n');

  try {
    // Read from file
    const blogDataPath = path.join(process.cwd(), 'data', 'blog-posts.json');
    const blogData = await fs.readFile(blogDataPath, 'utf-8');
    const filePosts = JSON.parse(blogData);

    // Read from Supabase
    const { data: supabasePosts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('❌ Error reading from Supabase:', error.message);
      return;
    }

    console.log(`File storage: ${filePosts.length} posts`);
    console.log(`Supabase storage: ${supabasePosts.length} posts`);

    // Check each post
    const mismatches = [];
    for (const filePost of filePosts) {
      const supabasePost = supabasePosts.find(p => p.slug === filePost.slug);
      if (!supabasePost) {
        mismatches.push(`Missing in Supabase: ${filePost.slug}`);
      } else {
        // Check key fields
        if (filePost.title !== supabasePost.title ||
            filePost.content !== supabasePost.content ||
            filePost.excerpt !== supabasePost.excerpt) {
          mismatches.push(`Content mismatch: ${filePost.slug}`);
        }
      }
    }

    if (mismatches.length === 0) {
      console.log('\n✅ All posts match between file and Supabase storage!');
    } else {
      console.log('\n⚠️  Found mismatches:');
      mismatches.forEach(m => console.log(`   - ${m}`));
    }

  } catch (error) {
    console.error('❌ Verification error:', error);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--verify')) {
    await verifyStorageParity();
  } else {
    await switchToSupabaseBlogStorage();
    console.log('\nRun with --verify flag to check storage parity');
  }
}

main();