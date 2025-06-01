require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupEmailTemplatesTable() {
  console.log('Setting up email_templates_custom table...');
  
  try {
    // Create the email_templates_custom table
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create table for storing custom email template edits
        CREATE TABLE IF NOT EXISTS email_templates_custom (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          sequence TEXT NOT NULL,
          step TEXT NOT NULL,
          subject TEXT NOT NULL,
          content TEXT NOT NULL,
          modified_by TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(sequence, step)
        );

        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS idx_email_templates_custom_sequence_step ON email_templates_custom(sequence, step);

        -- Create a trigger to update the updated_at timestamp
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER update_email_templates_custom_updated_at
          BEFORE UPDATE ON email_templates_custom
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (createTableError) {
      // Try alternative approach - execute SQL directly
      console.log('RPC approach failed, trying direct SQL execution...');
      
      // First, let's check if the table exists
      const { data: tables, error: checkError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'email_templates_custom');

      if (checkError) {
        console.error('Error checking for table:', checkError);
      } else if (tables && tables.length > 0) {
        console.log('Table email_templates_custom already exists!');
        return;
      }

      // If we can't use RPC or check tables, provide manual instructions
      console.log('\n⚠️  Unable to create table automatically.');
      console.log('\nPlease run the following SQL in your Supabase SQL editor:');
      console.log('\n--- COPY FROM HERE ---\n');
      console.log(`
-- Create table for storing custom email template edits
CREATE TABLE IF NOT EXISTS email_templates_custom (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence TEXT NOT NULL,
  step TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  modified_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(sequence, step)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_templates_custom_sequence_step ON email_templates_custom(sequence, step);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_templates_custom_updated_at
  BEFORE UPDATE ON email_templates_custom
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
      `);
      console.log('\n--- COPY TO HERE ---\n');
      console.log('After creating the table, the email template editor should work correctly.');
      return;
    }

    console.log('✅ Email templates table created successfully!');

    // Test the table by inserting and then deleting a test record
    const { error: testError } = await supabase
      .from('email_templates_custom')
      .insert({
        sequence: 'test',
        step: 'test',
        subject: 'Test Subject',
        content: 'Test Content',
        modified_by: 'setup-script'
      });

    if (testError) {
      console.error('Error testing table:', testError);
    } else {
      // Clean up test record
      await supabase
        .from('email_templates_custom')
        .delete()
        .match({ sequence: 'test', step: 'test' });
      
      console.log('✅ Table test successful - email template saving should now work!');
    }

  } catch (error) {
    console.error('Error setting up email templates table:', error);
    console.log('\nPlease check your Supabase credentials and try again.');
  }
}

// Run the setup
setupEmailTemplatesTable();