const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyTables() {
  console.log('🔍 Verifying email automation tables...\n');
  
  const tables = [
    { name: 'sequence_enrollments', required: true },
    { name: 'sequence_email_sends', required: true },
    { name: 'email_automation_logs', required: false },
    { name: 'email_automation_metrics', required: false, isView: true }
  ];
  
  let allGood = true;
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table.name)
      .select('*', { count: 'exact', head: true });
    
    if (!error) {
      console.log(`✅ ${table.name}: EXISTS (${count || 0} rows)${table.isView ? ' [VIEW]' : ''}`);
    } else {
      if (table.required) {
        console.log(`❌ ${table.name}: NOT FOUND - ${error.message}`);
        allGood = false;
      } else {
        console.log(`⚠️  ${table.name}: NOT FOUND (optional)`);
      }
    }
  }
  
  if (!allGood) {
    console.log('\n❗ Required tables are missing!');
    console.log('\nTo create them:');
    console.log('1. Go to your Supabase SQL Editor:');
    console.log('   https://app.supabase.com/project/utetcmirepwdxbtrcczv/sql/new');
    console.log('\n2. Copy and run this SQL:\n');
    
    const createSQL = `-- Create Email Automation Tables

CREATE TABLE IF NOT EXISTS sequence_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  sequence_id UUID NOT NULL REFERENCES email_sequences(id),
  enrollment_source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'unsubscribed', 'failed')),
  current_position INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  next_send_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_enrollment 
ON sequence_enrollments(subscriber_id, sequence_id) 
WHERE status = 'active';

CREATE TABLE IF NOT EXISTS sequence_email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES sequence_enrollments(id) ON DELETE CASCADE,
  sequence_email_id UUID NOT NULL REFERENCES sequence_emails(id),
  email_template_id UUID REFERENCES email_templates(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced', 'opened', 'clicked', 'unsubscribed')),
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  resend_id TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON sequence_enrollments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON sequence_email_sends TO authenticated;`;
    
    console.log(createSQL);
  } else {
    console.log('\n✨ All required tables exist!');
    
    // Check if we have any active sequences
    console.log('\n📊 Checking email sequences...');
    const { data: sequences, error: seqError } = await supabase
      .from('email_sequences')
      .select('id, name, trigger, status')
      .eq('status', 'active');
    
    if (!seqError && sequences) {
      console.log(`\nFound ${sequences.length} active sequences:`);
      sequences.forEach(seq => {
        console.log(`  - ${seq.name} (trigger: ${seq.trigger})`);
      });
    }
  }
}

verifyTables();