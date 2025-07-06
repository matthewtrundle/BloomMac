#!/usr/bin/env node

/**
 * Database Migration Script: Clean up duplicate profiles table
 * 
 * This script will:
 * 1. Backup the profiles table
 * 2. Check for any data in profiles not in user_profiles
 * 3. Migrate any unique data
 * 4. Drop the profiles table
 * 
 * SAFETY: Run with --dry-run first to see what will happen
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DRY_RUN = process.argv.includes('--dry-run');

async function log(message, data = null) {
  console.log(`[${new Date().toISOString()}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

async function checkProfilesTables() {
  log('Checking current state of profile tables...');
  
  // Check user_profiles
  const { count: userProfilesCount, error: upError } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true });
    
  if (upError) {
    log('ERROR: Could not access user_profiles table', upError);
    return false;
  }
  
  log(`user_profiles table has ${userProfilesCount} records`);
  
  // Check profiles
  const { count: profilesCount, error: pError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
    
  if (pError) {
    if (pError.message.includes('does not exist')) {
      log('profiles table does not exist - nothing to migrate');
      return false;
    }
    log('ERROR: Could not access profiles table', pError);
    return false;
  }
  
  log(`profiles table has ${profilesCount} records`);
  
  return { userProfilesCount, profilesCount };
}

async function findUniqueProfilesData() {
  log('Finding data in profiles table not in user_profiles...');
  
  // Get all profiles
  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('*');
    
  if (pError) {
    log('ERROR: Could not fetch profiles', pError);
    return [];
  }
  
  // Get all user_profiles
  const { data: userProfiles, error: upError } = await supabase
    .from('user_profiles')
    .select('id');
    
  if (upError) {
    log('ERROR: Could not fetch user_profiles', upError);
    return [];
  }
  
  const userProfileIds = new Set(userProfiles.map(up => up.id));
  const uniqueProfiles = profiles.filter(p => !userProfileIds.has(p.id));
  
  log(`Found ${uniqueProfiles.length} profiles not in user_profiles`);
  
  return uniqueProfiles;
}

async function backupProfilesTable() {
  const backupTableName = `profiles_backup_${new Date().toISOString().split('T')[0].replace(/-/g, '_')}`;
  
  log(`Creating backup table: ${backupTableName}`);
  
  if (DRY_RUN) {
    log('DRY RUN: Would create backup table');
    return true;
  }
  
  // Note: This requires raw SQL execution which Supabase client doesn't support directly
  // You'll need to run this SQL manually in Supabase dashboard:
  log('Please run this SQL in Supabase dashboard:');
  console.log(`CREATE TABLE ${backupTableName} AS SELECT * FROM profiles;`);
  
  return true;
}

async function migrateUniqueData(uniqueProfiles) {
  if (uniqueProfiles.length === 0) {
    log('No unique data to migrate');
    return true;
  }
  
  log(`Migrating ${uniqueProfiles.length} unique profiles to user_profiles`);
  
  for (const profile of uniqueProfiles) {
    // Map profiles fields to user_profiles fields
    const userProfileData = {
      id: profile.id,
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      phone: profile.phone,
      postpartum_date: profile.postpartum_date,
      number_of_children: profile.number_of_children || 0,
      emergency_contact_name: profile.emergency_contact_name,
      emergency_contact_phone: profile.emergency_contact_phone,
      status: 'active',
      created_at: profile.created_at,
      updated_at: profile.updated_at
    };
    
    log(`Migrating profile for user ${profile.id}`);
    
    if (DRY_RUN) {
      log('DRY RUN: Would insert:', userProfileData);
      continue;
    }
    
    const { error } = await supabase
      .from('user_profiles')
      .insert(userProfileData);
      
    if (error) {
      log(`ERROR: Failed to migrate profile ${profile.id}`, error);
      return false;
    }
  }
  
  return true;
}

async function dropProfilesTable() {
  log('Dropping profiles table...');
  
  if (DRY_RUN) {
    log('DRY RUN: Would drop profiles table');
    return true;
  }
  
  // Note: Supabase client doesn't support DROP TABLE
  log('Please run this SQL in Supabase dashboard:');
  console.log('DROP TABLE profiles;');
  
  return true;
}

async function main() {
  console.log('=== Profiles Table Migration Script ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log('');
  
  // Step 1: Check current state
  const tableState = await checkProfilesTables();
  if (!tableState) {
    log('Migration not needed or cannot proceed');
    return;
  }
  
  // Step 2: Find unique data
  const uniqueProfiles = await findUniqueProfilesData();
  
  // Step 3: Create backup
  await backupProfilesTable();
  
  // Step 4: Migrate unique data
  const migrationSuccess = await migrateUniqueData(uniqueProfiles);
  if (!migrationSuccess && !DRY_RUN) {
    log('ERROR: Migration failed, stopping');
    return;
  }
  
  // Step 5: Drop profiles table
  await dropProfilesTable();
  
  log('');
  log('=== Migration Summary ===');
  log(`- Profiles in old table: ${tableState.profilesCount}`);
  log(`- Unique profiles migrated: ${uniqueProfiles.length}`);
  log(`- Status: ${DRY_RUN ? 'DRY RUN COMPLETE' : 'MIGRATION COMPLETE'}`);
  
  if (!DRY_RUN) {
    log('');
    log('IMPORTANT: Please run the SQL commands shown above in Supabase dashboard');
  }
}

// Run the migration
main().catch(error => {
  log('FATAL ERROR:', error);
  process.exit(1);
});