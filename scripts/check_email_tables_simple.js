const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  // Try to select from each table to check if it exists
  const tables = [
    'email_templates',
    'email_templates_custom',
    'email_analytics', 
    'email_campaign_metrics',
    'email_queue',
    'email_logs',
    'email_sends',
    'email_automation_logs',
    'email_automation_errors',
    'email_sequences',
    'subscribers'
  ];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✓ ${table}: exists (${count || 0} rows)`);
      }
    } catch (e) {
      console.log(`❌ ${table}: ${e.message}`);
    }
  }
}

checkTables().catch(console.error);