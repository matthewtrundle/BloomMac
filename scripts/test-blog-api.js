const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testBlogAccess() {
  console.log('Testing blog posts access...\n');
  
  // Test with service role key (what the API uses)
  console.log('1. Testing with service role key (supabaseAdmin):');
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    const { data, error, count } = await supabaseAdmin
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error with service role:', error);
    } else {
      console.log(`✅ Service role can access blog_posts table`);
      console.log(`   Found ${count} blog posts\n`);
    }
  } catch (err) {
    console.error('Exception with service role:', err);
  }
  
  // Test actual data fetch
  console.log('2. Testing actual data fetch:');
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('id, slug, title, published_at')
      .order('published_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('Error fetching data:', error);
    } else {
      console.log(`✅ Successfully fetched ${data.length} blog posts:`);
      data.forEach(post => {
        console.log(`   - ${post.title} (${post.slug})`);
      });
    }
  } catch (err) {
    console.error('Exception fetching data:', err);
  }
  
  // Check RLS status
  console.log('\n3. Checking RLS status:');
  try {
    const { data, error } = await supabaseAdmin
      .rpc('pg_catalog.pg_class')
      .select('relname, relrowsecurity')
      .eq('relname', 'blog_posts')
      .single();
    
    if (error) {
      // Try alternative method
      const { data: rlsData, error: rlsError } = await supabaseAdmin
        .from('pg_tables')
        .select('tablename, rowsecurity')
        .eq('schemaname', 'public')
        .eq('tablename', 'blog_posts')
        .single();
      
      if (rlsError) {
        console.log('Could not check RLS status directly');
      } else {
        console.log(`RLS is ${rlsData?.rowsecurity ? 'ENABLED' : 'DISABLED'} on blog_posts table`);
      }
    }
  } catch (err) {
    console.log('Could not check RLS status:', err.message);
  }
  
  // Test with anon key (what public users would use)
  console.log('\n4. Testing with anon key (public access):');
  const supabaseAnon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  try {
    const { data, error, count } = await supabaseAnon
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error with anon key:', error);
    } else {
      console.log(`✅ Anon key can access blog_posts table`);
      console.log(`   Found ${count} blog posts`);
    }
  } catch (err) {
    console.error('Exception with anon key:', err);
  }
}

testBlogAccess().then(() => {
  console.log('\nTest complete.');
  process.exit(0);
}).catch(err => {
  console.error('\nTest failed:', err);
  process.exit(1);
});