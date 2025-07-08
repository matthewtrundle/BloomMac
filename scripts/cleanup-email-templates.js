const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupEmailTemplates() {
  console.log('🧹 Starting email template cleanup...\n');
  
  try {
    // Phase 1.1: Delete orphaned templates from email_templates
    console.log('📍 Phase 1.1: Deleting orphaned templates from email_templates...');
    const { data: deletedTemplates, error: error1 } = await supabase
      .from('email_templates')
      .delete()
      .in('name', [
        'Newsletter Welcome',
        'Newsletter Welcome Back',
        'New Mom Support Program',
        '5 Ways to Manage Daily Anxiety'
      ])
      .select();
    
    if (error1) throw error1;
    console.log(`✅ Deleted ${deletedTemplates?.length || 0} orphaned templates from email_templates`);
    
    // Phase 1.2: Delete unused custom templates from email_templates_custom
    console.log('\n📍 Phase 1.2: Deleting unused custom templates from email_templates_custom...');
    const { data: deletedCustom, error: error2 } = await supabase
      .from('email_templates_custom')
      .delete()
      .in('sequence', [
        'bookingConfirmation',
        'leadNurture',
        'contactFollowup',  // old version
        'newsletter'        // old version
      ])
      .select();
    
    if (error2) throw error2;
    console.log(`✅ Deleted ${deletedCustom?.length || 0} unused custom templates`);
    
    // Phase 1.3: Archive unused sequences
    console.log('\n📍 Phase 1.3: Archiving unused sequences...');
    const { data: archivedSeqs1, error: error3a } = await supabase
      .from('email_sequences')
      .update({ status: 'archived' })
      .in('trigger', ['resource_download', 'new_mom_program'])
      .select();
    
    if (error3a) throw error3a;
    
    // Archive old newsletter sequence
    const { data: archivedSeqs2, error: error3b } = await supabase
      .from('email_sequences')
      .update({ status: 'archived' })
      .eq('id', '655f6a5e-483c-4a39-85a3-0674ca0d0758')
      .select();
    
    if (error3b) throw error3b;
    
    const totalArchived = (archivedSeqs1?.length || 0) + (archivedSeqs2?.length || 0);
    console.log(`✅ Archived ${totalArchived} unused sequences`);
    
    // Phase 1.4: Delete emails from archived sequences
    console.log('\n📍 Phase 1.4: Deleting emails from archived sequences...');
    
    // First get all archived sequence IDs
    const { data: archivedSequences, error: getError } = await supabase
      .from('email_sequences')
      .select('id')
      .eq('status', 'archived');
    
    if (getError) throw getError;
    
    if (archivedSequences && archivedSequences.length > 0) {
      const archivedIds = archivedSequences.map(s => s.id);
      
      const { data: deletedEmails, error: error4 } = await supabase
        .from('sequence_emails')
        .delete()
        .in('sequence_id', archivedIds)
        .select();
      
      if (error4) throw error4;
      console.log(`✅ Deleted ${deletedEmails?.length || 0} emails from archived sequences`);
    } else {
      console.log('✅ No archived sequences found to clean up');
    }
    
    // Summary
    console.log('\n📊 Cleanup Summary:');
    console.log('------------------');
    
    // Get final counts
    const { count: finalTemplates } = await supabase
      .from('email_templates')
      .select('*', { count: 'exact', head: true });
    
    const { count: finalCustom } = await supabase
      .from('email_templates_custom')
      .select('*', { count: 'exact', head: true });
    
    const { count: finalEmails } = await supabase
      .from('sequence_emails')
      .select('*', { count: 'exact', head: true });
    
    const { count: activeSequences } = await supabase
      .from('email_sequences')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    console.log(`📧 Email Templates: ${finalTemplates} remaining`);
    console.log(`📝 Custom Templates: ${finalCustom} remaining`);
    console.log(`📨 Sequence Emails: ${finalEmails} remaining`);
    console.log(`🔄 Active Sequences: ${activeSequences} remaining`);
    
    console.log('\n✅ Email template cleanup complete!');
    console.log('💡 Next steps: Test email flows to ensure they still work correctly');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    console.log('\n⚠️  To restore from backup, run: node backups/restore-email-backup.js');
    process.exit(1);
  }
}

cleanupEmailTemplates();