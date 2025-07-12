const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableSchema(tableName) {
  console.log(`\n=== ${tableName} table schema ===`);
  
  // Get column information
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1);
    
  if (error) {
    console.log('Error:', error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('Columns:', Object.keys(data[0]));
    console.log('\nSample data:');
    console.log(JSON.stringify(data[0], null, 2));
  } else {
    console.log('No data in table');
  }
  
  // Get count
  const { count } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });
    
  console.log(`\nTotal rows: ${count}`);
}

async function main() {
  await checkTableSchema('courses');
  await checkTableSchema('course_modules');
  await checkTableSchema('course_lessons');
}

main().catch(console.error);