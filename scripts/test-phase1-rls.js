const { createClient } = require('@supabase/supabase-js');
const chalk = require('chalk');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Create different client instances
const anonClient = createClient(supabaseUrl, supabaseAnonKey);
const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

console.log(chalk.blue('\n🔐 Testing Phase 1 RLS Implementation\n'));

async function testRLS() {
  let testsPassed = 0;
  let testsFailed = 0;

  // Create test users
  console.log(chalk.yellow('Setting up test users...'));
  
  const user1Email = `test-user1-${Date.now()}@example.com`;
  const user2Email = `test-user2-${Date.now()}@example.com`;
  
  const { data: user1, error: user1Error } = await serviceClient.auth.admin.createUser({
    email: user1Email,
    password: 'test-password-123',
    email_confirm: true
  });
  
  const { data: user2, error: user2Error } = await serviceClient.auth.admin.createUser({
    email: user2Email,
    password: 'test-password-123',
    email_confirm: true
  });

  if (user1Error || user2Error) {
    console.error(chalk.red('Failed to create test users:'), user1Error || user2Error);
    return;
  }

  console.log(chalk.green('✓ Created test users'));

  // Sign in as user1
  const { data: session1, error: signInError } = await anonClient.auth.signInWithPassword({
    email: user1Email,
    password: 'test-password-123'
  });

  if (signInError) {
    console.error(chalk.red('Failed to sign in:'), signInError);
    return;
  }

  // Test 1: User preferences - users should only see their own
  console.log(chalk.yellow('\nTest 1: User Preferences RLS'));
  
  // User1 should be able to view their own preferences
  const { data: ownPrefs, error: ownPrefsError } = await anonClient
    .from('user_preferences')
    .select('*')
    .eq('user_id', user1.user.id);

  if (!ownPrefsError) {
    console.log(chalk.green('✓ User can view own preferences'));
    testsPassed++;
  } else {
    console.log(chalk.red('✗ User cannot view own preferences:', ownPrefsError.message));
    testsFailed++;
  }

  // User1 should NOT be able to view user2's preferences
  const { data: otherPrefs, error: otherPrefsError } = await anonClient
    .from('user_preferences')
    .select('*')
    .eq('user_id', user2.user.id);

  if (otherPrefs && otherPrefs.length === 0) {
    console.log(chalk.green('✓ User cannot view other users\' preferences'));
    testsPassed++;
  } else {
    console.log(chalk.red('✗ User can view other users\' preferences - SECURITY BREACH'));
    testsFailed++;
  }

  // Test 2: User notifications - users should only see their own
  console.log(chalk.yellow('\nTest 2: User Notifications RLS'));
  
  // Create a notification for user1 using service role
  const { data: notification, error: notifError } = await serviceClient
    .from('user_notifications')
    .insert({
      user_id: user1.user.id,
      type: 'system',
      title: 'Test Notification',
      message: 'This is a test notification'
    })
    .select()
    .single();

  if (!notifError) {
    console.log(chalk.green('✓ Service role can create notifications'));
    testsPassed++;
  } else {
    console.log(chalk.red('✗ Service role cannot create notifications:', notifError.message));
    testsFailed++;
  }

  // User1 should see their notification
  const { data: userNotifs, error: userNotifsError } = await anonClient
    .from('user_notifications')
    .select('*')
    .eq('user_id', user1.user.id);

  if (userNotifs && userNotifs.length > 0) {
    console.log(chalk.green('✓ User can view own notifications'));
    testsPassed++;
  } else {
    console.log(chalk.red('✗ User cannot view own notifications'));
    testsFailed++;
  }

  // Test 3: Wellness entries - users should only see their own
  console.log(chalk.yellow('\nTest 3: Wellness Entries RLS'));
  
  // User1 creates a wellness entry
  const { data: wellnessEntry, error: wellnessError } = await anonClient
    .from('wellness_entries')
    .insert({
      user_id: user1.user.id,
      entry_date: new Date().toISOString().split('T')[0],
      mood_score: 8,
      energy_level: 7,
      sleep_hours: 7.5
    })
    .select()
    .single();

  if (!wellnessError) {
    console.log(chalk.green('✓ User can create own wellness entries'));
    testsPassed++;
  } else {
    console.log(chalk.red('✗ User cannot create wellness entries:', wellnessError.message));
    testsFailed++;
  }

  // Test 4: Subscribers table - anyone can subscribe
  console.log(chalk.yellow('\nTest 4: Subscribers RLS'));
  
  // Test anonymous subscription
  await anonClient.auth.signOut();
  
  const { data: subscription, error: subError } = await anonClient
    .from('subscribers')
    .insert({
      email: 'anonymous@example.com',
      type: 'newsletter'
    })
    .select()
    .single();

  if (!subError) {
    console.log(chalk.green('✓ Anonymous users can subscribe'));
    testsPassed++;
  } else {
    console.log(chalk.red('✗ Anonymous users cannot subscribe:', subError.message));
    testsFailed++;
  }

  // Test 5: Email automation triggers - only service role
  console.log(chalk.yellow('\nTest 5: Email Automation Triggers RLS'));
  
  // Anonymous should NOT be able to view triggers
  const { data: triggers, error: triggersError } = await anonClient
    .from('email_automation_triggers')
    .select('*');

  if (triggersError || !triggers || triggers.length === 0) {
    console.log(chalk.green('✓ Anonymous users cannot view email triggers'));
    testsPassed++;
  } else {
    console.log(chalk.red('✗ Anonymous users can view email triggers - SECURITY BREACH'));
    testsFailed++;
  }

  // Cleanup
  console.log(chalk.yellow('\nCleaning up test data...'));
  await serviceClient.auth.admin.deleteUser(user1.user.id);
  await serviceClient.auth.admin.deleteUser(user2.user.id);

  // Summary
  console.log(chalk.blue('\n========================================'));
  console.log(chalk.blue('Test Summary:'));
  console.log(chalk.green(`✓ Passed: ${testsPassed}`));
  console.log(chalk.red(`✗ Failed: ${testsFailed}`));
  console.log(chalk.blue('========================================\n'));

  if (testsFailed === 0) {
    console.log(chalk.green('🎉 All Phase 1 RLS tests passed!'));
  } else {
    console.log(chalk.red('⚠️  Some tests failed. Please review the RLS policies.'));
  }
}

testRLS().catch(console.error);