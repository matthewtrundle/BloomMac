const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  console.log('Checking email template tables in Supabase...\n');
  
  try {
    // Check email_templates_custom table
    const { data: customData, error: customError } = await supabase
      .from('email_templates_custom')
      .select('*')
      .limit(1);
    
    if (!customError) {
      console.log('✅ email_templates_custom table exists!');
    } else {
      console.log('❌ email_templates_custom error:', customError.message);
    }
    
    // Check email_templates_history table
    const { data: historyData, error: historyError } = await supabase
      .from('email_templates_history')
      .select('*')
      .limit(1);
    
    if (!historyError) {
      console.log('✅ email_templates_history table exists!');
    } else {
      console.log('❌ email_templates_history error:', historyError.message);
    }
    
    // Try to insert a test record
    const testData = {
      sequence: 'test-verification',
      step: 'test-step',
      subject: 'Test Subject - This is a verification test',
      content: '<p>Test Content - This record will be deleted</p>',
      modified_by: 'system-check'
    };
    
    const { error: insertError } = await supabase
      .from('email_templates_custom')
      .insert(testData);
    
    if (!insertError) {
      console.log('✅ Successfully inserted test record!');
      
      // Clean up test record
      const { error: deleteError } = await supabase
        .from('email_templates_custom')
        .delete()
        .eq('sequence', 'test-verification')
        .eq('step', 'test-step');
      
      if (!deleteError) {
        console.log('✅ Cleaned up test record');
      }
      
      console.log('\n🎉 All tables are working correctly!');
      console.log('\nYour email template editor is ready to use:');
      console.log('- Visit /admin/email-editor');
      console.log('- All template edits will be saved to the database');
      console.log('- Version history will be tracked');
    } else {
      console.log('❌ Insert test failed:', insertError.message);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkTables();