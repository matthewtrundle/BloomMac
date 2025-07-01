const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkEmailTemplates() {
  console.log('📧 Checking email templates table...\n');

  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('Columns found in email_templates:');
      Object.keys(data[0]).forEach(column => {
        console.log(`  - ${column}: ${typeof data[0][column]}`);
      });
      
      console.log('\nSample record:');
      console.log(JSON.stringify(data[0], null, 2));
    }

    // Get all templates
    const { data: allTemplates } = await supabase
      .from('email_templates')
      .select('*');

    console.log(`\nTotal templates: ${allTemplates?.length || 0}`);
    
    if (allTemplates) {
      allTemplates.forEach(t => {
        console.log(`\n📄 Template: ${t.id}`);
        console.log(`   Subject: ${t.subject || 'N/A'}`);
        console.log(`   Type: ${t.type || 'N/A'}`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkEmailTemplates();