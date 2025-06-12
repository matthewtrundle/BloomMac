require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkStripeTables() {
  console.log('🔍 Checking Stripe-related tables...\n');

  const tablesToCheck = [
    'course_purchases',
    'user_course_access',
    'user_courses',
    'courses'
  ];

  for (const table of tablesToCheck) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table} - ${error.message}`);
      } else {
        console.log(`✅ ${table} - Table exists (${count || 0} records)`);
        
        // Get sample columns
        const { data } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (data && data.length > 0) {
          const columns = Object.keys(data[0]);
          console.log(`   Columns: ${columns.slice(0, 5).join(', ')}...`);
        }
      }
    } catch (err) {
      console.log(`❌ ${table} - Error: ${err.message}`);
    }
  }

  console.log('\n📋 What needs to be done:');
  console.log('1. Create missing tables (course_purchases, user_course_access)');
  console.log('2. Add Stripe environment variables to .env.local');
  console.log('3. Set up Stripe webhook endpoint in Stripe dashboard');
  console.log('4. Test the payment flow end-to-end');
}

checkStripeTables().catch(console.error);