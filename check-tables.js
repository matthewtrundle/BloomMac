const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  const tables = [
    'subscribers', 
    'email_templates', 
    'courses', 
    'admin_users', 
    'user_profiles',
    'newsletter_subscribers',
    'email_queue',
    'email_logs'
  ];
  
  console.log('Checking tables in database:');
  console.log('==========================');
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (!error) {
      console.log(`✓ ${table}: EXISTS (${count} rows)`);
    } else {
      console.log(`✗ ${table}: ${error.message}`);
    }
  }
}

checkTables();