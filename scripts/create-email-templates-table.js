const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createEmailTemplatesTables() {
  try {
    console.log('Creating email templates tables...');

    // Create main custom templates table
    const { error: tableError } = await supabase.rpc('exec_sql', {
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

        DROP TRIGGER IF EXISTS update_email_templates_custom_updated_at ON email_templates_custom;
        CREATE TRIGGER update_email_templates_custom_updated_at
          BEFORE UPDATE ON email_templates_custom
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

        -- Create backup table for template history
        CREATE TABLE IF NOT EXISTS email_templates_history (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          template_id UUID,
          sequence TEXT NOT NULL,
          step TEXT NOT NULL,
          subject TEXT NOT NULL,
          content TEXT NOT NULL,
          modified_by TEXT,
          version INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        -- Create indexes for history lookups
        CREATE INDEX IF NOT EXISTS idx_email_templates_history_template_id ON email_templates_history(template_id);
        CREATE INDEX IF NOT EXISTS idx_email_templates_history_sequence_step ON email_templates_history(sequence, step);
      `
    });

    if (tableError) {
      console.error('Error creating tables:', tableError);
      // Try alternative approach without exec_sql
      console.log('Trying alternative approach...');
      
      // Check if table exists by trying to query it
      const { data, error: checkError } = await supabase
        .from('email_templates_custom')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') {
        console.error('Table does not exist and cannot be created automatically.');
        console.log('Please create the table manually using the SQL in supabase/create-email-templates-table.sql');
      } else {
        console.log('Table already exists or was created successfully!');
      }
    } else {
      console.log('Email templates tables created successfully!');
    }

    // Verify the tables exist
    const { data: customTemplates, error: verifyError } = await supabase
      .from('email_templates_custom')
      .select('count')
      .limit(1);

    if (!verifyError) {
      console.log('✅ email_templates_custom table verified');
    }

    const { data: historyTemplates, error: historyError } = await supabase
      .from('email_templates_history')
      .select('count')
      .limit(1);

    if (!historyError) {
      console.log('✅ email_templates_history table verified');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the migration
createEmailTemplatesTables().then(() => {
  console.log('Migration completed');
  process.exit(0);
}).catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});