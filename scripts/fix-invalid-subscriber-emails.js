require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixInvalidEmails() {
  console.log('🔍 Checking and fixing invalid subscriber emails...\n');

  try {
    // Find subscribers with null, empty, or invalid emails
    const { data: allSubscribers, error } = await supabase
      .from('subscribers')
      .select('id, email, status, signup_source, created_at');

    if (error) {
      console.error('Error querying subscribers:', error);
      return;
    }

    const invalidSubscribers = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    allSubscribers.forEach(subscriber => {
      if (!subscriber.email || 
          subscriber.email === '' || 
          typeof subscriber.email !== 'string' ||
          !emailRegex.test(subscriber.email)) {
        invalidSubscribers.push(subscriber);
      }
    });

    if (invalidSubscribers.length === 0) {
      console.log('✅ No subscribers with invalid emails found!');
      return;
    }

    console.log(`⚠️  Found ${invalidSubscribers.length} subscribers with invalid emails:\n`);
    
    invalidSubscribers.forEach(subscriber => {
      console.log(`ID: ${subscriber.id}`);
      console.log(`Email: "${subscriber.email || 'NULL'}"`);
      console.log(`Status: ${subscriber.status}`);
      console.log(`Source: ${subscriber.signup_source}`);
      console.log(`Created: ${subscriber.created_at}`);
      console.log('---');
    });

    // Ask for confirmation before deactivating
    console.log('\nThese subscribers will be marked as inactive to prevent email errors.');
    console.log('To proceed, run this script with the --fix flag');
    
    if (process.argv.includes('--fix')) {
      console.log('\n🔧 Deactivating subscribers with invalid emails...');
      
      for (const subscriber of invalidSubscribers) {
        const { error: updateError } = await supabase
          .from('subscribers')
          .update({ 
            status: 'inactive',
            metadata: {
              ...subscriber.metadata,
              deactivated_reason: 'invalid_email',
              deactivated_at: new Date().toISOString()
            }
          })
          .eq('id', subscriber.id);

        if (updateError) {
          console.error(`Error updating subscriber ${subscriber.id}:`, updateError);
        } else {
          console.log(`✅ Deactivated subscriber ${subscriber.id}`);
        }
      }
      
      console.log('\n✅ Finished deactivating invalid subscribers');
      
      // Log this action
      const { error: logError } = await supabase
        .from('admin_activity_log')
        .insert({
          action: 'bulk_deactivate_invalid_emails',
          entity_type: 'subscriber',
          details: {
            count: invalidSubscribers.length,
            reason: 'invalid_email_addresses',
            subscriber_ids: invalidSubscribers.map(s => s.id)
          }
        });
        
      if (logError) {
        console.error('Error logging activity:', logError);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the fix
fixInvalidEmails();