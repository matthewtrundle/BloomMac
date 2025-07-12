const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkBlogImagesTable() {
  console.log('Checking blog_images table...\n');
  
  try {
    // First, try to count rows
    const { count, error: countError } = await supabase
      .from('blog_images')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ blog_images table does not exist');
      console.log('Error:', countError.message);
      console.log('\nThis explains why the admin blog image functionality is broken.');
      console.log('The code expects a blog_images table to exist for storing image metadata.');
      return;
    }
    
    console.log(`✓ blog_images table exists with ${count} rows`);
    
    // Try to get schema info
    const { data, error } = await supabase
      .from('blog_images')
      .select('*')
      .limit(1);
    
    if (!error && data && data.length > 0) {
      console.log('\nTable columns:');
      Object.keys(data[0]).forEach(col => {
        console.log(`- ${col}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBlogImagesTable();