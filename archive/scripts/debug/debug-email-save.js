// Load environment variables first
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '[SET]' : '[NOT SET]');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugEmailSave() {
  console.log('🔍 Debugging Email Template Save Functionality\n');
  
  // Test data
  const testData = {
    sequence: 'newsletter',
    step: 'welcome',
    subject: 'Test Subject - Debug ' + new Date().toISOString(),
    content: 'Test content for debugging email save functionality',
    modified_by: 'test@example.com'
  };
  
  try {
    // 1. Check if table exists
    console.log('1. Checking if email_templates_custom table exists...');
    const { data: tables, error: tableError } = await supabase
      .from('email_templates_custom')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Table check error:', tableError);
      if (tableError.message.includes('relation') && tableError.message.includes('does not exist')) {
        console.log('\n⚠️  The email_templates_custom table does not exist!');
        console.log('Run this SQL to create it:');
        console.log('psql $DATABASE_URL < supabase/create-email-templates-table.sql');
        return;
      }
    } else {
      console.log('✅ Table exists');
    }
    
    // 2. Try to insert a test record
    console.log('\n2. Testing direct insert...');
    const { data: insertData, error: insertError } = await supabase
      .from('email_templates_custom')
      .insert(testData)
      .select();
    
    if (insertError) {
      console.error('❌ Insert error:', insertError);
      
      // If duplicate key, try update
      if (insertError.code === '23505') {
        console.log('\n3. Record exists, trying update...');
        const { data: updateData, error: updateError } = await supabase
          .from('email_templates_custom')
          .update({
            subject: testData.subject,
            content: testData.content,
            modified_by: testData.modified_by,
            updated_at: new Date().toISOString()
          })
          .eq('sequence', testData.sequence)
          .eq('step', testData.step)
          .select();
        
        if (updateError) {
          console.error('❌ Update error:', updateError);
        } else {
          console.log('✅ Update successful:', updateData);
        }
      }
    } else {
      console.log('✅ Insert successful:', insertData);
    }
    
    // 3. Try upsert (what the API uses)
    console.log('\n4. Testing upsert...');
    const { data: upsertData, error: upsertError } = await supabase
      .from('email_templates_custom')
      .upsert({
        ...testData,
        subject: testData.subject + ' (upsert)',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'sequence,step'
      })
      .select();
    
    if (upsertError) {
      console.error('❌ Upsert error:', upsertError);
      console.error('Error details:', {
        code: upsertError.code,
        message: upsertError.message,
        details: upsertError.details,
        hint: upsertError.hint
      });
    } else {
      console.log('✅ Upsert successful:', upsertData);
    }
    
    // 4. Verify the data
    console.log('\n5. Verifying saved data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('email_templates_custom')
      .select('*')
      .eq('sequence', testData.sequence)
      .eq('step', testData.step);
    
    if (verifyError) {
      console.error('❌ Verify error:', verifyError);
    } else {
      console.log('✅ Data in database:', verifyData);
    }
    
    // 5. Test API endpoint
    console.log('\n6. Testing API endpoint...');
    const apiUrl = 'http://localhost:3001/api/email-templates';
    
    // First get a valid admin token
    console.log('Getting admin token...');
    const loginResponse = await fetch('http://localhost:3001/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@bloomfamilytherapy.com',
        password: 'bloom2024!' // Replace with actual password
      })
    });
    
    if (!loginResponse.ok) {
      console.error('❌ Failed to login:', await loginResponse.text());
      return;
    }
    
    const { token } = await loginResponse.json();
    console.log('✅ Got admin token');
    
    // Test the save endpoint
    const saveResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `adminToken=${token}`
      },
      body: JSON.stringify({
        sequence: 'newsletter',
        step: 'welcome',
        subject: 'API Test Subject - ' + new Date().toISOString(),
        content: 'API Test content'
      })
    });
    
    const responseText = await saveResponse.text();
    console.log('API Response status:', saveResponse.status);
    console.log('API Response:', responseText);
    
    if (!saveResponse.ok) {
      console.error('❌ API save failed');
    } else {
      console.log('✅ API save successful');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the debug script
debugEmailSave();