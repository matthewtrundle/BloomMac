const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  console.log('Checking database tables...\n');
  
  const tables = [
    'contact_submissions',
    'subscribers',
    'email_automation_triggers',
    'analytics_events',
    'admin_activity_log'
  ];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: exists (${count} rows)`);
      }
    } catch (e) {
      console.log(`❌ ${table}: ${e.message}`);
    }
  }
  
  // Check if functions exist
  console.log('\nChecking functions...');
  const functions = [
    'check_user_role_unified',
    'submit_contact_form'
  ];
  
  for (const func of functions) {
    try {
      const { data, error } = await supabase.rpc(func, {});
      if (error && error.message.includes('function') && error.message.includes('does not exist')) {
        console.log(`❌ ${func}: does not exist`);
      } else if (error && error.message.includes('required')) {
        console.log(`✅ ${func}: exists (missing required params - expected)`);
      } else {
        console.log(`✅ ${func}: exists`);
      }
    } catch (e) {
      console.log(`❌ ${func}: ${e.message}`);
    }
  }
}

checkTables();