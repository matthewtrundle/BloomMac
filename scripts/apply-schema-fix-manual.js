#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Create Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applySchemaFixManual() {
  console.log('🔧 Applying Email Automation Schema Fixes Manually...\n');
  
  try {
    // 1. Check and add 'source' column to subscribers table
    console.log('1️⃣ Checking subscribers.source column...');
    
    // Test if source column exists by trying to select it
    const { data: sourceTest, error: sourceTestError } = await supabase
      .from('subscribers')
      .select('source')
      .limit(1);
    
    if (sourceTestError && sourceTestError.message.includes('does not exist')) {
      console.log('   ⚠️  source column missing, will need manual SQL fix');
      console.log('   📝 Please run this SQL in Supabase SQL Editor:');
      console.log('   ALTER TABLE subscribers ADD COLUMN source VARCHAR(100) DEFAULT \'website\';');
      console.log('   UPDATE subscribers SET source = COALESCE(signup_source, \'website\') WHERE source IS NULL;');
    } else if (sourceTestError) {
      console.log('   ❌ Error checking source column:', sourceTestError.message);
    } else {
      console.log('   ✅ source column exists');
    }
    
    // 2. Check and add 'created_at' column to email_automation_logs table
    console.log('\n2️⃣ Checking email_automation_logs.created_at column...');
    
    const { data: createdAtTest, error: createdAtTestError } = await supabase
      .from('email_automation_logs')
      .select('created_at')
      .limit(1);
    
    if (createdAtTestError && createdAtTestError.message.includes('does not exist')) {
      console.log('   ⚠️  created_at column missing, will need manual SQL fix');
      console.log('   📝 Please run this SQL in Supabase SQL Editor:');
      console.log('   ALTER TABLE email_automation_logs ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();');
      console.log('   UPDATE email_automation_logs SET created_at = COALESCE(sent_at, NOW()) WHERE created_at IS NULL;');
    } else if (createdAtTestError) {
      console.log('   ❌ Error checking created_at column:', createdAtTestError.message);
    } else {
      console.log('   ✅ created_at column exists');
    }
    
    // 3. Check and create email_automation_triggers table
    console.log('\n3️⃣ Checking email_automation_triggers table...');
    
    const { data: triggersTest, error: triggersTestError } = await supabase
      .from('email_automation_triggers')
      .select('id')
      .limit(1);
    
    if (triggersTestError && triggersTestError.message.includes('does not exist')) {
      console.log('   ⚠️  email_automation_triggers table missing, will need manual SQL fix');
      console.log('   📝 Please run this SQL in Supabase SQL Editor:');
      console.log('   CREATE TABLE email_automation_triggers (');
      console.log('     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
      console.log('     subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,');
      console.log('     trigger_type TEXT NOT NULL,');
      console.log('     trigger_data JSONB DEFAULT \'{}\',');
      console.log('     triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),');
      console.log('     processed_at TIMESTAMPTZ,');
      console.log('     created_at TIMESTAMPTZ DEFAULT NOW()');
      console.log('   );');
      console.log('   ALTER TABLE email_automation_triggers ENABLE ROW LEVEL SECURITY;');
    } else if (triggersTestError) {
      console.log('   ❌ Error checking triggers table:', triggersTestError.message);
    } else {
      console.log('   ✅ email_automation_triggers table exists');
    }
    
    // 4. Show current database status
    console.log('\n📊 Current Database Status:');
    
    // Count subscribers
    const { count: subscriberCount } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true });
    console.log(`   👥 Subscribers: ${subscriberCount || 0}`);
    
    // Count email sequences
    const { count: sequenceCount } = await supabase
      .from('email_sequences')
      .select('*', { count: 'exact', head: true });
    console.log(`   📧 Email Sequences: ${sequenceCount || 0}`);
    
    // Count contact submissions
    const { count: contactCount } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true });
    console.log(`   📝 Contact Submissions: ${contactCount || 0}`);
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Apply any missing SQL fixes shown above in Supabase SQL Editor');
    console.log('2. Run the email system test: node scripts/test-email-system.js');
    console.log('3. Test contact form submission to trigger email automation');
    
  } catch (error) {
    console.error('❌ Error during schema check:', error);
  }
}

applySchemaFixManual().catch(console.error);