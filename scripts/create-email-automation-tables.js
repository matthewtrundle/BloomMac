const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createEmailAutomationTables() {
  console.log('📧 Creating Email Automation Tables...\n');

  try {
    // Create email sequences table
    const { error: sequencesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS email_sequences (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          trigger VARCHAR(100) NOT NULL,
          trigger_conditions JSONB DEFAULT '{}',
          status VARCHAR(20) DEFAULT 'draft',
          created_by UUID,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_email_sequences_status ON email_sequences(status);
        CREATE INDEX IF NOT EXISTS idx_email_sequences_trigger ON email_sequences(trigger);
      `
    });

    if (sequencesError) {
      console.error('Error creating email_sequences table:', sequencesError);
      return;
    }
    console.log('✅ Created email_sequences table');

    // Create sequence emails table
    const { error: emailsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS sequence_emails (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          sequence_id UUID REFERENCES email_sequences(id) ON DELETE CASCADE,
          position INTEGER NOT NULL,
          subject VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          delay_hours INTEGER DEFAULT 0,
          delay_days INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_sequence_emails_sequence ON sequence_emails(sequence_id);
        CREATE INDEX IF NOT EXISTS idx_sequence_emails_position ON sequence_emails(position);
      `
    });

    if (emailsError) {
      console.error('Error creating sequence_emails table:', emailsError);
      return;
    }
    console.log('✅ Created sequence_emails table');

    // Create email automation logs table
    const { error: logsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS email_automation_logs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          sequence_id UUID REFERENCES email_sequences(id) ON DELETE CASCADE,
          email_id UUID REFERENCES sequence_emails(id) ON DELETE CASCADE,
          subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
          status VARCHAR(20) NOT NULL,
          sent_at TIMESTAMPTZ DEFAULT NOW(),
          opened_at TIMESTAMPTZ,
          clicked_at TIMESTAMPTZ,
          metadata JSONB DEFAULT '{}'
        );

        CREATE INDEX IF NOT EXISTS idx_automation_logs_sequence ON email_automation_logs(sequence_id);
        CREATE INDEX IF NOT EXISTS idx_automation_logs_subscriber ON email_automation_logs(subscriber_id);
        CREATE INDEX IF NOT EXISTS idx_automation_logs_status ON email_automation_logs(status);
      `
    });

    if (logsError) {
      console.error('Error creating email_automation_logs table:', logsError);
      return;
    }
    console.log('✅ Created email_automation_logs table');

    // Create email templates table
    const { error: templatesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS email_templates (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          subject VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          variables JSONB DEFAULT '[]',
          is_public BOOLEAN DEFAULT false,
          created_by UUID,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);
        CREATE INDEX IF NOT EXISTS idx_email_templates_public ON email_templates(is_public);
      `
    });

    if (templatesError) {
      console.error('Error creating email_templates table:', templatesError);
      return;
    }
    console.log('✅ Created email_templates table');

    console.log('\n✅ All email automation tables created successfully!');

  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

createEmailAutomationTables().catch(console.error);