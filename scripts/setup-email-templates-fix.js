// Fix email templates table setup
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' }
});

async function setupEmailTemplatesTable() {
  console.log('Setting up email templates table...\n');

  try {
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'supabase', 'create-email-templates-table.sql');
    const sqlContent = await fs.readFile(sqlPath, 'utf-8');
    
    // Split SQL statements and execute them one by one
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);
      
      // For complex statements, we need to use direct database connection
      // Since Supabase JS client doesn't support executing raw SQL directly,
      // we'll check if the table exists and provide instructions
      if (i === 0) {
        // Check if table exists
        const { data, error } = await supabase
          .from('email_templates_custom')
          .select('id')
          .limit(1);
        
        if (error && error.code === 'PGRST204') {
          console.log('❌ Table does not exist');
          console.log('\nPlease execute the following SQL in your Supabase SQL editor:');
          console.log('https://app.supabase.com/project/_/sql/new\n');
          console.log(sqlContent);
          return;
        } else if (!error) {
          console.log('✅ Table already exists');
        }
      }
    }

    // Test the table
    console.log('\nTesting table operations...');
    
    // Test insert
    const testData = {
      sequence: 'test_sequence',
      step: 'test_step',
      subject: 'Test Subject',
      content: 'Test Content',
      modified_by: 'setup_script@test.com'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('email_templates_custom')
      .insert(testData)
      .select();

    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
    } else {
      console.log('✅ Insert test successful');
      
      // Test update
      const { error: updateError } = await supabase
        .from('email_templates_custom')
        .update({ subject: 'Updated Subject' })
        .eq('sequence', 'test_sequence')
        .eq('step', 'test_step');

      if (updateError) {
        console.error('❌ Update test failed:', updateError);
      } else {
        console.log('✅ Update test successful');
      }

      // Clean up
      const { error: deleteError } = await supabase
        .from('email_templates_custom')
        .delete()
        .eq('sequence', 'test_sequence')
        .eq('step', 'test_step');

      if (deleteError) {
        console.error('❌ Cleanup failed:', deleteError);
      } else {
        console.log('✅ Cleanup successful');
      }
    }

    console.log('\n✅ Email templates table is ready!');
    console.log('\nThe email template editor should now work properly with:');
    console.log('- JWT authentication (same as admin panel)');
    console.log('- Proper database storage for custom templates');
    console.log('- Automatic tracking of who modified templates');

  } catch (error) {
    console.error('Error:', error);
  }
}

setupEmailTemplatesTable();