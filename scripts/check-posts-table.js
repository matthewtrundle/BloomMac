const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkPostsTable() {
  console.log('Checking posts table (which has 2 rows)...\n');
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Get data from posts table
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('*');
    
    if (error) {
      console.error('Error querying posts table:', error);
      return;
    }
    
    console.log(`Found ${data.length} posts in 'posts' table\n`);
    
    if (data.length > 0) {
      console.log('Posts data:');
      data.forEach((post, index) => {
        console.log(`\nPost ${index + 1}:`);
        console.log(JSON.stringify(post, null, 2));
      });
      
      // Check the structure
      console.log('\n\nTable structure (based on first row):');
      const columns = Object.keys(data[0]);
      console.log('Columns:', columns.join(', '));
      
      // Check if this matches blog_posts structure
      const blogPostColumns = ['slug', 'title', 'excerpt', 'content', 'image_url', 'category', 'published_at'];
      const missingColumns = blogPostColumns.filter(col => !columns.includes(col));
      
      if (missingColumns.length === 0) {
        console.log('\n✅ This table has all the necessary blog post columns');
        console.log('   It appears the blog data is in the "posts" table, not "blog_posts"');
      } else {
        console.log('\n⚠️  Missing columns for blog posts:', missingColumns.join(', '));
      }
    }
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkPostsTable().then(() => {
  console.log('\nCheck complete.');
  process.exit(0);
}).catch(err => {
  console.error('\nCheck failed:', err);
  process.exit(1);
});