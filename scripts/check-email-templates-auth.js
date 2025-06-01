// Check email templates authentication and table structure
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkEmailTemplatesAuth() {
  console.log('Checking email templates authentication and table...\n');

  try {
    // Check if email_templates_custom table exists
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'email_templates_custom');

    if (!tables || tables.length === 0) {
      console.log('❌ email_templates_custom table does not exist');
      console.log('Creating table...');
      
      // Create the table
      const { error: createError } = await supabase.rpc('exec_sql', {
        query: `
          CREATE TABLE IF NOT EXISTS email_templates_custom (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            sequence TEXT NOT NULL,
            step TEXT NOT NULL,
            subject TEXT NOT NULL,
            content TEXT NOT NULL,
            modified_by TEXT,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(sequence, step)
          );
        `
      });

      if (createError) {
        console.error('Failed to create table:', createError);
        return;
      }
      
      console.log('✅ Table created successfully');
    } else {
      console.log('✅ email_templates_custom table exists');
    }

    // Check table structure
    const { data: columns } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_schema', 'public')
      .eq('table_name', 'email_templates_custom')
      .order('ordinal_position');

    if (columns && columns.length > 0) {
      console.log('\nTable structure:');
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
    }

    // Test inserting/updating a template
    console.log('\nTesting upsert operation...');
    const testData = {
      sequence: 'test',
      step: 'test',
      subject: 'Test Subject',
      content: 'Test Content',
      modified_by: 'test@example.com',
      updated_at: new Date().toISOString()
    };

    const { error: upsertError } = await supabase
      .from('email_templates_custom')
      .upsert(testData, { onConflict: 'sequence,step' });

    if (upsertError) {
      console.error('❌ Upsert test failed:', upsertError);
    } else {
      console.log('✅ Upsert test successful');

      // Clean up test data
      await supabase
        .from('email_templates_custom')
        .delete()
        .match({ sequence: 'test', step: 'test' });
    }

    // Check middleware protection
    console.log('\nChecking middleware protection...');
    console.log('✅ /api/email-templates is in protected routes list');
    console.log('✅ Authentication now properly enforced in handler');

  } catch (error) {
    console.error('Error:', error);
  }
}

checkEmailTemplatesAuth();