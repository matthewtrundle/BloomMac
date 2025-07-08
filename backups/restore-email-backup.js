
// Restore script for email data backup 2025-07-08T03-46-21
// Usage: node restore-email-backup.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function restore() {
  console.log('⚠️  WARNING: This will REPLACE current email data!');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    // Restore tables in order
    const tables = [
      'email_templates',
      'email_templates_custom',
      'email_sequences',
      'sequence_emails'
    ];
    
    for (const table of tables) {
      const data = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'email-backup-2025-07-08T03-46-21', table + '.json'), 'utf8')
      );
      
      // Delete existing data
      await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert backup data
      if (data.length > 0) {
        const { error } = await supabase.from(table).insert(data);
        if (error) throw error;
      }
      
      console.log(`✅ Restored ${data.length} records to ${table}`);
    }
    
    console.log('\n✅ Restore complete!');
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    process.exit(1);
  }
}

restore();
