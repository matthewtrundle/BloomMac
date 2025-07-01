#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Create Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applySchemaFix() {
  console.log('🔧 Applying Email Automation Schema Fixes...\n');
  
  try {
    // Read the SQL file
    const sqlFile = path.join(__dirname, '..', 'supabase', 'fix-email-automation-schema.sql');
    
    if (!fs.existsSync(sqlFile)) {
      console.error('❌ SQL file not found:', sqlFile);
      return;
    }
    
    const sql = fs.readFileSync(sqlFile, 'utf8');
    console.log('📝 Loaded SQL migration script');
    
    // Apply the SQL fixes using Supabase RPC
    console.log('⚙️ Applying database schema fixes...');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql_to_execute: sql });
    
    if (error) {
      console.error('❌ Error applying schema fixes:', error);
      
      // Try applying the SQL in smaller chunks instead
      console.log('🔄 Trying to apply fixes individually...');
      
      // Split SQL into individual statements and execute them
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i].trim();
        if (!stmt) continue;
        
        console.log(`   ${i + 1}/${statements.length}: Executing statement...`);
        
        try {
          const { error: stmtError } = await supabase.rpc('exec_sql', { 
            sql_to_execute: stmt + ';' 
          });
          
          if (stmtError) {
            console.log(`   ⚠️  Statement ${i + 1} failed:`, stmtError.message);
          } else {
            console.log(`   ✅ Statement ${i + 1} succeeded`);
          }
        } catch (err) {
          console.log(`   ⚠️  Statement ${i + 1} error:`, err.message);
        }
      }
      
    } else {
      console.log('✅ Schema fixes applied successfully!');
      if (data) {
        console.log('📊 Results:', data);
      }
    }
    
    // Verify the fixes were applied
    console.log('\n🔍 Verifying schema fixes...');
    
    // Check if source column exists
    const { data: sourceCheck, error: sourceError } = await supabase
      .from('subscribers')
      .select('source')
      .limit(1);
    
    if (sourceError) {
      console.log('❌ subscribers.source column: not found');
    } else {
      console.log('✅ subscribers.source column: exists');
    }
    
    // Check if created_at column exists in email_automation_logs
    const { data: createdAtCheck, error: createdAtError } = await supabase
      .from('email_automation_logs')
      .select('created_at')
      .limit(1);
    
    if (createdAtError) {
      console.log('❌ email_automation_logs.created_at column: not found');
    } else {
      console.log('✅ email_automation_logs.created_at column: exists');
    }
    
    // Check if email_automation_triggers table exists
    const { data: triggersCheck, error: triggersError } = await supabase
      .from('email_automation_triggers')
      .select('id')
      .limit(1);
    
    if (triggersError) {
      console.log('❌ email_automation_triggers table: not found');
    } else {
      console.log('✅ email_automation_triggers table: exists');
    }
    
    console.log('\n🎉 Schema fix application complete!');
    console.log('\nNext step: Run email system test again:');
    console.log('node scripts/test-email-system.js');
    
  } catch (error) {
    console.error('❌ Error during schema fix:', error);
  }
}

applySchemaFix().catch(console.error);