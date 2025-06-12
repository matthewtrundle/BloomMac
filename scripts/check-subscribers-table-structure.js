require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableStructure() {
  console.log('Checking subscribers table structure...\n');

  try {
    // Get a sample subscriber to see the columns
    const { data: sample, error } = await supabase
      .from('subscribers')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error querying subscribers:', error);
      return;
    }

    if (sample && sample.length > 0) {
      console.log('Subscribers table columns:');
      console.log(Object.keys(sample[0]));
      console.log('\nSample data:');
      console.log(JSON.stringify(sample[0], null, 2));
    } else {
      console.log('No subscribers found in the table');
    }

    // Get total count
    const { count } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true });

    console.log(`\nTotal subscribers: ${count}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

checkTableStructure();