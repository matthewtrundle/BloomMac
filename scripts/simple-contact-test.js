#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testContactTable() {
  console.log('🔍 Testing contact_submissions table...\n');

  try {
    // Test 1: Try to query the table
    console.log('1. Testing table access...');
    const { data: existingData, error: queryError } = await supabase
      .from('contact_submissions')
      .select('*')
      .limit(1);

    if (queryError) {
      if (queryError.code === '42P01') {
        console.log('❌ Table "contact_submissions" does not exist!');
        console.log('\n🔧 Create the table by running this SQL in Supabase SQL Editor:');
        console.log(`
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'archived')),
  source TEXT DEFAULT 'website',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Add policy for service role access
CREATE POLICY "Service role can manage contact submissions" ON contact_submissions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
        `);
        return;
      } else {
        console.log('❌ Query error:', queryError);
        return;
      }
    }

    console.log('✅ Table exists and is accessible');
    console.log(`📊 Found ${existingData.length} existing records`);

    // Test 2: Try insert operation
    console.log('\n2. Testing insert operation...');
    const testData = {
      name: 'Test Contact',
      email: 'test@example.com',
      message: 'Test message',
      service: 'general',
      source: 'website',
      metadata: {
        page: '/contact',
        test: true
      }
    };

    const { data: insertResult, error: insertError } = await supabase
      .from('contact_submissions')
      .insert(testData)
      .select()
      .single();

    if (insertError) {
      console.log('❌ Insert failed:', insertError);
      console.log('\nPossible issues:');
      console.log('- Missing required columns');
      console.log('- Column type mismatch');
      console.log('- RLS policy blocking insert');
    } else {
      console.log('✅ Insert successful!');
      console.log('📄 Record ID:', insertResult.id);

      // Clean up
      await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', insertResult.id);
      console.log('🧹 Test record cleaned up');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testContactTable().catch(console.error);