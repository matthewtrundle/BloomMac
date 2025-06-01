// Check email templates data in Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkEmailTemplatesData() {
  console.log('Checking email templates data...\n');

  try {
    // Check what's in the custom templates table
    const { data: customTemplates, error } = await supabase
      .from('email_templates_custom')
      .select('*')
      .order('sequence', { ascending: true });

    if (error) {
      console.error('❌ Error fetching custom templates:', error);
      return;
    }

    console.log(`Found ${customTemplates?.length || 0} custom templates in database:\n`);
    
    if (customTemplates && customTemplates.length > 0) {
      customTemplates.forEach(template => {
        console.log(`- ${template.sequence} / ${template.step}`);
        console.log(`  Subject: ${template.subject}`);
        console.log(`  Modified by: ${template.modified_by}`);
        console.log(`  Updated: ${new Date(template.updated_at).toLocaleString()}`);
        console.log('');
      });
    } else {
      console.log('No custom templates found (using default templates)');
    }

    // Test a simple insert/update operation
    console.log('\nTesting database write operations...');
    
    const testData = {
      sequence: 'test_check',
      step: 'test_step',
      subject: 'Test Subject',
      content: 'Test Content',
      modified_by: 'check_script@test.com'
    };

    // Try upsert
    const { error: upsertError } = await supabase
      .from('email_templates_custom')
      .upsert(testData, { onConflict: 'sequence,step' });

    if (upsertError) {
      console.error('❌ Upsert failed:', upsertError);
    } else {
      console.log('✅ Database write test successful');
      
      // Clean up
      await supabase
        .from('email_templates_custom')
        .delete()
        .match({ sequence: 'test_check', step: 'test_step' });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkEmailTemplatesData();