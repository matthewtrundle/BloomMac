const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateBlogPosts() {
  console.log('📝 Migrating blog posts...');
  
  try {
    // Read existing blog posts
    const blogData = await fs.readFile(path.join(process.cwd(), 'data', 'blog-posts.json'), 'utf-8');
    const blogPosts = JSON.parse(blogData);
    
    console.log(`Found ${blogPosts.length} blog posts to migrate`);
    
    // Transform blog posts for Supabase
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
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(transformedPosts)
      .select();
    
    if (error) {
      console.error('Error migrating blog posts:', error);
      return false;
    }
    
    console.log(`✅ Successfully migrated ${data.length} blog posts`);
    return true;
  } catch (error) {
    console.error('Error reading blog posts file:', error);
    return false;
  }
}

async function migrateAnalytics() {
  console.log('📊 Migrating analytics events...');
  
  try {
    // Read existing analytics
    const analyticsData = await fs.readFile(path.join(process.cwd(), 'data', 'analytics.json'), 'utf-8');
    const events = JSON.parse(analyticsData);
    
    console.log(`Found ${events.length} analytics events to migrate`);
    
    // Transform analytics events for Supabase
    const transformedEvents = events.map(event => ({
      type: event.type,
      page: event.page,
      session_id: event.sessionId,
      user_id: event.userId,
      data: event.data || {},
      created_at: event.timestamp
    }));
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('analytics_events')
      .insert(transformedEvents)
      .select();
    
    if (error) {
      console.error('Error migrating analytics:', error);
      return false;
    }
    
    console.log(`✅ Successfully migrated ${data.length} analytics events`);
    return true;
  } catch (error) {
    console.error('Error reading analytics file:', error);
    return false;
  }
}

async function checkSubscribers() {
  console.log('👥 Checking for subscribers...');
  
  try {
    // Check if subscribers file exists
    const subscribersPath = path.join(process.cwd(), 'data', 'subscribers.json');
    await fs.access(subscribersPath);
    
    const subscribersData = await fs.readFile(subscribersPath, 'utf-8');
    const subscribers = JSON.parse(subscribersData);
    
    console.log(`Found ${subscribers.length} subscribers to migrate`);
    
    if (subscribers.length > 0) {
      // Transform subscribers for Supabase
      const transformedSubscribers = subscribers.map(sub => ({
        email: sub.email,
        first_name: sub.name || sub.firstName,
        status: sub.status,
        tags: sub.tags,
        signup_source: sub.signupSource,
        interests: sub.interests,
        metadata: sub.metadata || {},
        confirmed: sub.confirmed !== false,
        created_at: sub.timestamp
      }));
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('subscribers')
        .insert(transformedSubscribers)
        .select();
      
      if (error) {
        console.error('Error migrating subscribers:', error);
        return false;
      }
      
      console.log(`✅ Successfully migrated ${data.length} subscribers`);
    }
    return true;
  } catch (error) {
    console.log('⚠️  No subscribers file found - this is expected if no one has signed up yet');
    return true;
  }
}

async function createBackup() {
  console.log('💾 Creating backup of current data...');
  
  const backupDir = path.join(process.cwd(), 'data', 'backups', `pre-supabase-${new Date().toISOString().split('T')[0]}`);
  await fs.mkdir(backupDir, { recursive: true });
  
  // Copy all data files
  const files = ['blog-posts.json', 'analytics.json', 'subscribers.json'];
  
  for (const file of files) {
    try {
      const source = path.join(process.cwd(), 'data', file);
      const dest = path.join(backupDir, file);
      await fs.copyFile(source, dest);
      console.log(`  ✓ Backed up ${file}`);
    } catch (error) {
      console.log(`  - ${file} not found (skipping)`);
    }
  }
  
  console.log(`✅ Backup created at: ${backupDir}`);
}

async function main() {
  console.log('🚀 Starting Supabase migration...\n');
  
  // Create backup first
  await createBackup();
  console.log('');
  
  // Run migrations
  const blogSuccess = await migrateBlogPosts();
  console.log('');
  
  const analyticsSuccess = await migrateAnalytics();
  console.log('');
  
  await checkSubscribers();
  console.log('');
  
  // Summary
  console.log('📋 Migration Summary:');
  console.log('====================');
  if (blogSuccess && analyticsSuccess) {
    console.log('✅ All data successfully migrated to Supabase!');
    console.log('\nNext steps:');
    console.log('1. Update your API endpoints to use Supabase');
    console.log('2. Test all functionality');
    console.log('3. Monitor the Supabase dashboard for any issues');
  } else {
    console.log('⚠️  Some migrations failed. Please check the errors above.');
  }
}

// Run the migration
main().catch(console.error);