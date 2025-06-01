require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testEmailTemplateSave() {
  console.log('Testing email template save functionality...\n');
  
  try {
    // Test 1: Check if table exists and is accessible
    console.log('1. Checking if email_templates_custom table exists...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('email_templates_custom')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Error accessing table:', tableError);
      return;
    }
    console.log('✅ Table exists and is accessible');
    
    // Test 2: Try to insert a test template
    console.log('\n2. Testing insert/upsert functionality...');
    const testTemplate = {
      sequence: 'test-sequence',
      step: 'test-step',
      subject: 'Test Subject',
      content: 'Test Content',
      modified_by: 'test-script'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('email_templates_custom')
      .upsert(testTemplate, {
        onConflict: 'sequence,step'
      })
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting template:', insertError);
      return;
    }
    console.log('✅ Successfully inserted/updated test template');
    
    // Test 3: Verify the data was saved
    console.log('\n3. Verifying saved data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('email_templates_custom')
      .select('*')
      .eq('sequence', 'test-sequence')
      .eq('step', 'test-step')
      .single();
    
    if (verifyError) {
      console.error('❌ Error verifying data:', verifyError);
    } else {
      console.log('✅ Data verified:', verifyData);
    }
    
    // Test 4: Clean up test data
    console.log('\n4. Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('email_templates_custom')
      .delete()
      .eq('sequence', 'test-sequence')
      .eq('step', 'test-step');
    
    if (deleteError) {
      console.error('❌ Error cleaning up:', deleteError);
    } else {
      console.log('✅ Test data cleaned up');
    }
    
    console.log('\n✅ All tests passed! The email template save functionality should work.');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the test
testEmailTemplateSave();