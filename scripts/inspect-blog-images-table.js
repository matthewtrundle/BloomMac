const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectBlogImagesTable() {
  console.log('Inspecting blog_images table structure...\n');
  
  try {
    // First, check if table exists and get a sample row
    const { data, error } = await supabase
      .from('blog_images')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error accessing blog_images table:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('Sample row from blog_images:');
      console.log(JSON.stringify(data[0], null, 2));
      console.log('\nColumn names:');
      Object.keys(data[0]).forEach(col => {
        console.log(`- ${col}: ${typeof data[0][col]}`);
      });
    } else {
      console.log('blog_images table exists but is empty');
      
      // Try to insert a test row to see the structure
      const testRow = {
        url: 'test',
        alt: 'test'
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('blog_images')
        .insert([testRow])
        .select();
      
      if (insertError) {
        console.log('\nFailed to insert test row. Error details:');
        console.log(insertError);
        console.log('\nThis error can help us understand the expected schema.');
      } else {
        console.log('\nSuccessfully inserted test row:');
        console.log(insertData);
        
        // Clean up
        await supabase.from('blog_images').delete().eq('url', 'test');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

inspectBlogImagesTable();