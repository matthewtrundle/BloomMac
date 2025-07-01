#!/usr/bin/env node

/**
 * Check if contact_submissions table exists in production
 * and verify its structure
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkContactTable() {
  console.log('🔍 Checking contact_submissions table in production...\n');

  try {
    // 1. Check if table exists
    console.log('1. Checking if table exists...');
    const { data: tables, error: tableError } = await supabase
      .rpc('get_table_exists', { table_name: 'contact_submissions' })
      .catch(async () => {
        // Fallback: try direct query
        return await supabase
          .from('contact_submissions')
          .select('*')
          .limit(1);
      });

    if (tableError) {
      console.error('❌ Error checking table existence:', tableError);
      return;
    }

    if (!tables || tables.length === 0) {
      console.log('❌ Table "contact_submissions" does not exist!');
      console.log('\n📋 You need to create the table. Run this SQL in Supabase:');
      console.log(`
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'archived')),
  admin_notes TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID REFERENCES auth.users(id),
  source TEXT DEFAULT 'website',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Service role can manage contact submissions" ON contact_submissions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
      `);
      return;
    }

    console.log('✅ Table exists');

    // 2. Check table structure
    console.log('\n2. Checking table structure...');
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_schema', 'public')
      .eq('table_name', 'contact_submissions')
      .order('ordinal_position');

    if (columnError) {
      console.error('❌ Error checking columns:', columnError);
      return;
    }

    console.log('📋 Current table structure:');
    columns.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULLABLE'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });

    // 3. Test insert operation
    console.log('\n3. Testing insert operation...');
    const testData = {
      name: 'Test Contact',
      email: 'test@example.com',
      phone: '555-1234',
      service: 'general',
      message: 'Test message',
      status: 'new',
      source: 'website',
      metadata: {
        page: '/contact',
        user_agent: 'Test Agent',
        ip_address: '127.0.0.1',
        submitted_at: new Date().toISOString()
      }
    };

    const { data: insertResult, error: insertError } = await supabase
      .from('contact_submissions')
      .insert(testData)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
      console.log('\n🔧 Possible fixes:');
      console.log('1. Check if all required columns exist');
      console.log('2. Verify column data types match');
      console.log('3. Check if RLS policies allow inserts');
      console.log('4. Ensure foreign key constraints are satisfied');
    } else {
      console.log('✅ Insert test successful');
      console.log('📄 Inserted record:', insertResult);

      // Clean up test record
      await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', insertResult.id);
      console.log('🧹 Test record cleaned up');
    }

    // 4. Check RLS policies
    console.log('\n4. Checking RLS policies...');
    const { data: policies, error: policyError } = await supabase
      .from('pg_policies')
      .select('policyname, tablename, roles, cmd, qual')
      .eq('tablename', 'contact_submissions');

    if (policyError) {
      console.log('⚠️  Could not check RLS policies (might need special permissions)');
    } else if (policies && policies.length > 0) {
      console.log('📋 RLS Policies:');
      policies.forEach(policy => {
        console.log(`   ${policy.policyname}: ${policy.cmd} for ${policy.roles}`);
      });
    } else {
      console.log('⚠️  No RLS policies found - this might cause access issues');
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkContactTable().catch(console.error);