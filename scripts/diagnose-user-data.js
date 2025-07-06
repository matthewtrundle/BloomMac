#!/usr/bin/env node

/**
 * User Data Consistency Diagnostic
 * ================================
 * 
 * Diagnoses data inconsistency issues for matthewtrundle@gmail.com
 * and provides cleanup recommendations.
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

async function diagnoseUserData() {
  log('🔍 USER DATA CONSISTENCY DIAGNOSIS', 'bold');
  log('=====================================', 'blue');
  log('');

  try {
    // 1. Check user_profiles for potential matches
    log('1️⃣ CHECKING USER PROFILES...', 'blue');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      log(`❌ Error fetching profiles: ${profilesError.message}`, 'red');
      return;
    }

    log(`Found ${profiles.length} total profiles:`, 'blue');
    profiles.forEach((profile, index) => {
      const name = `${profile.first_name || 'NULL'} ${profile.last_name || 'NULL'}`.trim();
      const hasData = profile.first_name || profile.last_name || profile.phone;
      const status = hasData ? '✅ HAS DATA' : '⚠️  EMPTY/NULL';
      
      log(`  ${index + 1}. ${profile.id.substring(0, 8)}... - ${name || 'NO NAME'} - ${status}`);
      log(`     Created: ${profile.created_at} | Updated: ${profile.updated_at}`);
      
      if (profile.phone) log(`     Phone: ${profile.phone}`);
      if (profile.emergency_contact_name) log(`     Emergency: ${profile.emergency_contact_name}`);
    });

    // 2. Check user_preferences for associations
    log('\n2️⃣ CHECKING USER PREFERENCES...', 'blue');
    const { data: preferences, error: prefsError } = await supabase
      .from('user_preferences')
      .select('user_id, privacy_settings, created_at')
      .order('created_at', { ascending: false });

    if (prefsError) {
      log(`❌ Error fetching preferences: ${prefsError.message}`, 'red');
    } else {
      log(`Found ${preferences.length} preference records:`, 'blue');
      preferences.forEach((pref, index) => {
        const hasPrivacy = pref.privacy_settings && Object.keys(pref.privacy_settings).length > 0;
        const status = hasPrivacy ? '✅ HAS SETTINGS' : '⚠️  EMPTY';
        
        log(`  ${index + 1}. ${pref.user_id.substring(0, 8)}... - ${status}`);
        log(`     Created: ${pref.created_at}`);
        
        // Check if this user_id matches any profile
        const matchingProfile = profiles.find(p => p.id === pref.user_id);
        if (matchingProfile) {
          const name = `${matchingProfile.first_name || 'NULL'} ${matchingProfile.last_name || 'NULL'}`.trim();
          log(`     Profile: ${name || 'NO NAME'} ✅ LINKED`);
        } else {
          log(`     Profile: ❌ ORPHANED - No matching profile!`, 'red');
        }
      });
    }

    // 3. Identify orphaned data
    log('\n3️⃣ IDENTIFYING ORPHANED DATA...', 'blue');
    
    const orphanedProfiles = profiles.filter(p => 
      !p.first_name && !p.last_name && !p.phone
    );
    
    const orphanedPreferences = preferences?.filter(pref => 
      !profiles.find(p => p.id === pref.user_id)
    ) || [];

    log(`Found ${orphanedProfiles.length} orphaned profiles (no data):`, 'yellow');
    orphanedProfiles.forEach(profile => {
      log(`  - ${profile.id} (created: ${profile.created_at})`);
    });

    log(`Found ${orphanedPreferences.length} orphaned preferences (no profile):`, 'yellow');
    orphanedPreferences.forEach(pref => {
      log(`  - ${pref.user_id} (created: ${pref.created_at})`);
    });

    // 4. Recommend active profile
    log('\n4️⃣ PROFILE RECOMMENDATION...', 'blue');
    
    const profilesWithData = profiles.filter(p => 
      p.first_name || p.last_name || p.phone || p.emergency_contact_name
    );

    if (profilesWithData.length === 0) {
      log('❌ No profiles found with actual data', 'red');
      log('   Recommendation: Use most recent profile and add data manually', 'yellow');
      if (profiles.length > 0) {
        const newest = profiles[0];
        log(`   Suggested profile: ${newest.id}`, 'yellow');
      }
    } else if (profilesWithData.length === 1) {
      const activeProfile = profilesWithData[0];
      log('✅ Found 1 profile with data - likely your active profile:', 'green');
      log(`   ID: ${activeProfile.id}`);
      log(`   Name: ${activeProfile.first_name} ${activeProfile.last_name}`);
      log(`   Phone: ${activeProfile.phone}`);
      log(`   Emergency: ${activeProfile.emergency_contact_name}`);
    } else {
      log(`⚠️  Found ${profilesWithData.length} profiles with data:`, 'yellow');
      profilesWithData.forEach((profile, index) => {
        log(`   ${index + 1}. ${profile.id.substring(0, 8)}... - ${profile.first_name} ${profile.last_name}`);
        log(`      Created: ${profile.created_at} | Phone: ${profile.phone}`);
      });
      log('   Recommendation: Use the most recently updated profile', 'yellow');
    }

    // 5. Generate cleanup script
    log('\n5️⃣ CLEANUP RECOMMENDATIONS...', 'blue');
    
    if (orphanedProfiles.length > 0) {
      log('🧹 Orphaned profiles to delete:', 'yellow');
      orphanedProfiles.forEach(profile => {
        log(`DELETE FROM user_profiles WHERE id = '${profile.id}';`);
      });
    }
    
    if (orphanedPreferences.length > 0) {
      log('🧹 Orphaned preferences to delete:', 'yellow');
      orphanedPreferences.forEach(pref => {
        log(`DELETE FROM user_preferences WHERE user_id = '${pref.user_id}';`);
      });
    }

    log('\n✅ DIAGNOSIS COMPLETE', 'green');
    log('=====================================', 'blue');

  } catch (error) {
    log(`❌ Diagnosis failed: ${error.message}`, 'red');
    console.error(error);
  }
}

// Check if we have required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  log('❌ Missing required environment variables', 'red');
  process.exit(1);
}

diagnoseUserData();