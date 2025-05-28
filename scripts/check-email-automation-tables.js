const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkEmailAutomationTables() {
  console.log('🔍 Checking Email Automation Tables in Supabase...\n');

  const tables = [
    'email_sequences',
    'sequence_emails',
    'email_automation_logs',
    'email_templates'
  ];

  for (const table of tables) {
    try {
      // Try to query each table
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: NOT FOUND - ${error.message}`);
      } else {
        console.log(`✅ ${table}: EXISTS`);
        
        // Get count
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        console.log(`   Records: ${count || 0}`);
        
        // Show sample data for templates
        if (table === 'email_templates' && data && data.length > 0) {
          console.log(`   Sample: ${data[0].name}`);
        }
      }
    } catch (err) {
      console.log(`❌ ${table}: ERROR - ${err.message}`);
    }
  }

  console.log('\n📝 Summary:');
  console.log('If tables show "NOT FOUND", you need to run the SQL schema.');
  console.log('Schema file location: /supabase/email-automation-schema.sql');
}

checkEmailAutomationTables().catch(console.error);