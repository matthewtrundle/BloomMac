const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function backupEmailData() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = path.join(__dirname, '..', 'backups', `email-backup-${timestamp}`);
  
  // Create backup directory
  fs.mkdirSync(backupDir, { recursive: true });
  
  console.log(`Creating backup in: ${backupDir}`);
  
  try {
    // Backup email_templates
    const { data: emailTemplates, error: error1 } = await supabase
      .from('email_templates')
      .select('*');
    
    if (error1) throw error1;
    fs.writeFileSync(
      path.join(backupDir, 'email_templates.json'),
      JSON.stringify(emailTemplates, null, 2)
    );
    console.log(`✅ Backed up ${emailTemplates.length} email_templates`);
    
    // Backup email_templates_custom
    const { data: customTemplates, error: error2 } = await supabase
      .from('email_templates_custom')
      .select('*');
    
    if (error2) throw error2;
    fs.writeFileSync(
      path.join(backupDir, 'email_templates_custom.json'),
      JSON.stringify(customTemplates, null, 2)
    );
    console.log(`✅ Backed up ${customTemplates.length} email_templates_custom`);
    
    // Backup email_sequences
    const { data: sequences, error: error3 } = await supabase
      .from('email_sequences')
      .select('*');
    
    if (error3) throw error3;
    fs.writeFileSync(
      path.join(backupDir, 'email_sequences.json'),
      JSON.stringify(sequences, null, 2)
    );
    console.log(`✅ Backed up ${sequences.length} email_sequences`);
    
    // Backup sequence_emails
    const { data: sequenceEmails, error: error4 } = await supabase
      .from('sequence_emails')
      .select('*');
    
    if (error4) throw error4;
    fs.writeFileSync(
      path.join(backupDir, 'sequence_emails.json'),
      JSON.stringify(sequenceEmails, null, 2)
    );
    console.log(`✅ Backed up ${sequenceEmails.length} sequence_emails`);
    
    // Backup sequence_enrollments (active enrollments)
    const { data: enrollments, error: error5 } = await supabase
      .from('sequence_enrollments')
      .select('*')
      .eq('status', 'active');
    
    if (error5) throw error5;
    fs.writeFileSync(
      path.join(backupDir, 'sequence_enrollments_active.json'),
      JSON.stringify(enrollments, null, 2)
    );
    console.log(`✅ Backed up ${enrollments.length} active sequence_enrollments`);
    
    // Create restore script
    const restoreScript = `
// Restore script for email data backup ${timestamp}
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
        fs.readFileSync(path.join(__dirname, '${path.basename(backupDir)}', table + '.json'), 'utf8')
      );
      
      // Delete existing data
      await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Insert backup data
      if (data.length > 0) {
        const { error } = await supabase.from(table).insert(data);
        if (error) throw error;
      }
      
      console.log(\`✅ Restored \${data.length} records to \${table}\`);
    }
    
    console.log('\\n✅ Restore complete!');
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    process.exit(1);
  }
}

restore();
`;
    
    fs.writeFileSync(
      path.join(backupDir, '..', 'restore-email-backup.js'),
      restoreScript
    );
    console.log(`✅ Created restore script: backups/restore-email-backup.js`);
    
    console.log(`\n✅ Backup complete! Saved to: ${backupDir}`);
    console.log('📝 To restore this backup, run: node backups/restore-email-backup.js');
    
  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
}

backupEmailData();