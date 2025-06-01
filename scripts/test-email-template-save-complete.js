const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testEmailTemplateSave() {
  console.log('Testing Email Template Save Functionality...\n');
  
  try {
    // 1. Check if email_templates_custom table exists
    console.log('1. Checking if email_templates_custom table exists...');
    const { data: tables, error: tablesError } = await supabase
      .from('email_templates_custom')
      .select('*')
      .limit(1);
    
    if (tablesError) {
      console.error('❌ Table check failed:', tablesError.message);
      console.log('\n2. Creating email_templates_custom table...');
      
      // Create the table
      const { error: createError } = await supabase.rpc('query', {
        query: `
          CREATE TABLE IF NOT EXISTS email_templates_custom (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            sequence TEXT NOT NULL,
            step TEXT NOT NULL,
            subject TEXT NOT NULL,
            content TEXT NOT NULL,
            modified_by TEXT,
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(sequence, step)
          );
        `
      }).single();
      
      if (createError) {
        console.error('❌ Failed to create table:', createError.message);
        
        // Try alternative approach
        console.log('\n3. Trying to create table with direct SQL...');
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS public.email_templates_custom (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            sequence TEXT NOT NULL,
            step TEXT NOT NULL,
            subject TEXT NOT NULL,
            content TEXT NOT NULL,
            modified_by TEXT,
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            CONSTRAINT unique_sequence_step UNIQUE(sequence, step)
          );
        `;
        
        // Save SQL file for manual execution
        const fs = require('fs');
        fs.writeFileSync('./supabase/create-email-templates-custom-table.sql', createTableSQL);
        console.log('✅ SQL file created: ./supabase/create-email-templates-custom-table.sql');
        console.log('   Please run this SQL in Supabase dashboard');
      } else {
        console.log('✅ Table created successfully');
      }
    } else {
      console.log('✅ Table exists');
    }
    
    // 2. Test direct database save
    console.log('\n4. Testing direct database save...');
    const testTemplate = {
      sequence: 'newsletter',
      step: 'welcome',
      subject: 'Test Subject - ' + new Date().toISOString(),
      content: 'Test Content - This is a test save',
      modified_by: 'test-script',
      updated_at: new Date().toISOString()
    };
    
    const { data: upsertData, error: upsertError } = await supabase
      .from('email_templates_custom')
      .upsert(testTemplate, {
        onConflict: 'sequence,step'
      })
      .select();
    
    if (upsertError) {
      console.error('❌ Direct save failed:', upsertError.message);
      
      // Try update if insert fails
      console.log('\n5. Trying update instead of upsert...');
      const { data: updateData, error: updateError } = await supabase
        .from('email_templates_custom')
        .update({
          subject: testTemplate.subject,
          content: testTemplate.content,
          modified_by: testTemplate.modified_by,
          updated_at: testTemplate.updated_at
        })
        .eq('sequence', testTemplate.sequence)
        .eq('step', testTemplate.step)
        .select();
      
      if (updateError) {
        console.error('❌ Update also failed:', updateError.message);
        
        // Try insert
        console.log('\n6. Trying direct insert...');
        const { data: insertData, error: insertError } = await supabase
          .from('email_templates_custom')
          .insert(testTemplate)
          .select();
        
        if (insertError) {
          console.error('❌ Insert failed:', insertError.message);
        } else {
          console.log('✅ Insert successful:', insertData);
        }
      } else {
        console.log('✅ Update successful:', updateData);
      }
    } else {
      console.log('✅ Direct save successful:', upsertData);
    }
    
    // 3. Verify the save
    console.log('\n7. Verifying saved data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('email_templates_custom')
      .select('*')
      .eq('sequence', 'newsletter')
      .eq('step', 'welcome')
      .single();
    
    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message);
    } else {
      console.log('✅ Data verified:', {
        sequence: verifyData.sequence,
        step: verifyData.step,
        subject: verifyData.subject,
        modified_by: verifyData.modified_by,
        updated_at: verifyData.updated_at
      });
    }
    
    // 4. Check for RLS policies
    console.log('\n8. Checking for RLS policies...');
    const { data: policies, error: policiesError } = await supabase.rpc('query', {
      query: `
        SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
        FROM pg_policies
        WHERE tablename = 'email_templates_custom';
      `
    }).single();
    
    if (policiesError) {
      console.log('⚠️  Could not check RLS policies');
    } else if (!policies || policies.length === 0) {
      console.log('⚠️  No RLS policies found - table might be publicly accessible');
    } else {
      console.log('✅ RLS policies found:', policies);
    }
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
  }
}

// Run the test
testEmailTemplateSave();