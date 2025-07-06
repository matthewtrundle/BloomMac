#!/usr/bin/env node

/**
 * Cleanup Orphaned User Data
 * ==========================
 * 
 * Safely removes orphaned profiles and preferences
 * while preserving the active user's data.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function cleanupOrphanedData() {
  log('🧹 CLEANING UP ORPHANED USER DATA', 'bold');
  log('=================================', 'blue');
  log('');

  try {
    // Define orphaned data to remove based on diagnosis
    const orphanedProfileIds = [
      '2a6835a5-6041-463f-b6bb-f6c5d38bea59',
      'a450bb41-693f-431f-be7e-04c76a0660bc', 
      'f32161d9-77a4-40ba-a19f-6d5e38d3f4f9',
      '683acfad-72e6-45ae-9684-2e5d13168d3a'
    ];

    const orphanedPreferenceIds = [
      '6ebf06a7-e69f-450b-8f0d-1751e43c804f',
      '284c1874-aef8-41eb-9541-e3776484fd39'
    ];

    // Also check if we should remove the older profile with less data
    const keepProfileId = 'ad3392b7-1e01-4f18-850a-ec4c3538016a'; // Updated TestUser - most recent
    const oldProfileId = '5967ba74-ac7b-43d9-9c08-a2d0bbbfa878'; // Test User - older

    log('📋 CLEANUP PLAN:', 'blue');
    log(`   ✅ Keep: ${keepProfileId} (Updated TestUser - most recent)`, 'green');
    log(`   ❌ Remove: ${oldProfileId} (Test User - older duplicate)`, 'yellow');
    log(`   ❌ Remove: ${orphanedProfileIds.length} orphaned profiles`, 'yellow');
    log(`   ❌ Remove: ${orphanedPreferenceIds.length} orphaned preferences`, 'yellow');
    log('');

    // Confirmation
    log('⚠️  This will permanently delete orphaned data. Continue? (5 seconds to cancel)', 'yellow');
    await new Promise(resolve => setTimeout(resolve, 5000));

    let totalDeleted = 0;

    // 1. Delete orphaned user_preferences
    log('1️⃣ Deleting orphaned preferences...', 'blue');
    for (const userId of orphanedPreferenceIds) {
      const { error } = await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', userId);

      if (error) {
        log(`   ❌ Failed to delete preference ${userId}: ${error.message}`, 'red');
      } else {
        log(`   ✅ Deleted preference for ${userId.substring(0, 8)}...`, 'green');
        totalDeleted++;
      }
    }

    // 2. Delete orphaned user_profiles (empty ones)
    log('\n2️⃣ Deleting orphaned profiles...', 'blue');
    for (const profileId of orphanedProfileIds) {
      // Also delete associated preferences first
      await supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', profileId);

      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', profileId);

      if (error) {
        log(`   ❌ Failed to delete profile ${profileId}: ${error.message}`, 'red');
      } else {
        log(`   ✅ Deleted profile ${profileId.substring(0, 8)}...`, 'green');
        totalDeleted++;
      }
    }

    // 3. Delete the older duplicate profile
    log('\n3️⃣ Deleting older duplicate profile...', 'blue');
    
    // Delete preferences for older profile
    await supabase
      .from('user_preferences')
      .delete()
      .eq('user_id', oldProfileId);

    const { error: oldProfileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', oldProfileId);

    if (oldProfileError) {
      log(`   ❌ Failed to delete old profile: ${oldProfileError.message}`, 'red');
    } else {
      log(`   ✅ Deleted old profile ${oldProfileId.substring(0, 8)}... (Test User)`, 'green');
      totalDeleted++;
    }

    // 4. Verify remaining data
    log('\n4️⃣ Verifying remaining data...', 'blue');
    
    const { data: remainingProfiles } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name, phone')
      .order('created_at', { ascending: false });

    const { data: remainingPreferences } = await supabase
      .from('user_preferences')
      .select('user_id, privacy_settings')
      .order('created_at', { ascending: false });

    log(`   📊 Remaining profiles: ${remainingProfiles?.length || 0}`, 'blue');
    remainingProfiles?.forEach(profile => {
      const name = `${profile.first_name || 'NULL'} ${profile.last_name || 'NULL'}`.trim();
      log(`      - ${profile.id.substring(0, 8)}... ${name || 'NO NAME'}`);
    });

    log(`   📊 Remaining preferences: ${remainingPreferences?.length || 0}`, 'blue');
    remainingPreferences?.forEach(pref => {
      const hasSettings = pref.privacy_settings && Object.keys(pref.privacy_settings).length > 0;
      log(`      - ${pref.user_id.substring(0, 8)}... ${hasSettings ? 'HAS SETTINGS' : 'EMPTY'}`);
    });

    log(`\n✅ CLEANUP COMPLETE! Deleted ${totalDeleted} orphaned records.`, 'green');
    log('=================================', 'blue');

    // 5. Show active profile info
    log('\n🎯 YOUR ACTIVE PROFILE:', 'green');
    const { data: activeProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', keepProfileId)
      .single();

    if (activeProfile) {
      log(`   ID: ${activeProfile.id}`, 'green');
      log(`   Name: ${activeProfile.first_name} ${activeProfile.last_name}`, 'green');
      log(`   Phone: ${activeProfile.phone}`, 'green');
      log(`   Emergency: ${activeProfile.emergency_contact_name}`, 'green');
      log(`   Created: ${activeProfile.created_at}`, 'green');
    }

  } catch (error) {
    log(`❌ Cleanup failed: ${error.message}`, 'red');
    console.error(error);
  }
}

// Check if we have required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  log('❌ Missing required environment variables', 'red');
  process.exit(1);
}

cleanupOrphanedData();