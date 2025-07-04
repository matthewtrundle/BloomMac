#!/usr/bin/env node

/**
 * Migration script to securely update admin authentication
 * Run this AFTER updating environment variables
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function migrateAdminAuth() {
  console.log('🔒 Admin Authentication Migration Script\n');
  
  try {
    // Check environment variables
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      console.error('❌ JWT_SECRET must be set and at least 32 characters long');
      process.exit(1);
    }
    
    // Fetch existing admin users
    const { data: admins, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('❌ Error fetching admin users:', error);
      process.exit(1);
    }
    
    console.log(`Found ${admins?.length || 0} admin users\n`);
    
    if (!admins || admins.length === 0) {
      console.log('📝 No admin users found. Creating initial admin...\n');
      
      const email = await question('Enter admin email: ');
      const name = await question('Enter admin name: ');
      
      // Generate secure password
      const password = generateSecurePassword();
      console.log(`\n🔑 Generated secure password: ${password}`);
      console.log('⚠️  SAVE THIS PASSWORD NOW! It will not be shown again.\n');
      
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create admin user
      const { error: createError } = await supabase
        .from('admin_users')
        .insert({
          email,
          name,
          password: hashedPassword,
          role: 'super_admin',
          is_active: true,
          created_at: new Date().toISOString()
        });
      
      if (createError) {
        console.error('❌ Error creating admin:', createError);
        process.exit(1);
      }
      
      console.log('✅ Admin user created successfully!');
      
      // Log the creation
      await supabase
        .from('admin_activity_log')
        .insert({
          action: 'admin_created',
          entity_type: 'admin_user',
          details: {
            email,
            method: 'migration_script'
          }
        });
      
    } else {
      console.log('📝 Existing admin users:');
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.email} (${admin.role})`);
      });
      
      const resetPassword = await question('\nReset password for an admin? (y/n): ');
      
      if (resetPassword.toLowerCase() === 'y') {
        const adminIndex = await question('Enter admin number to reset: ');
        const selectedAdmin = admins[parseInt(adminIndex) - 1];
        
        if (!selectedAdmin) {
          console.error('❌ Invalid selection');
          process.exit(1);
        }
        
        // Generate new secure password
        const password = generateSecurePassword();
        console.log(`\n🔑 New password for ${selectedAdmin.email}: ${password}`);
        console.log('⚠️  SAVE THIS PASSWORD NOW! It will not be shown again.\n');
        
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Update password
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ 
            password: hashedPassword,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedAdmin.id);
        
        if (updateError) {
          console.error('❌ Error updating password:', updateError);
          process.exit(1);
        }
        
        console.log('✅ Password updated successfully!');
        
        // Log the update
        await supabase
          .from('admin_activity_log')
          .insert({
            action: 'password_reset',
            entity_type: 'admin_user',
            entity_id: selectedAdmin.id,
            details: {
              email: selectedAdmin.email,
              method: 'migration_script'
            }
          });
      }
    }
    
    // Check for weak passwords
    console.log('\n🔍 Checking for weak passwords...');
    
    const weakPasswords = await supabase
      .from('admin_users')
      .select('id, email, password')
      .not('password', 'is', null);
    
    if (weakPasswords.data) {
      for (const admin of weakPasswords.data) {
        // Check if password might be the default
        const isDefault = await bcrypt.compare('bloom-admin-2024', admin.password);
        if (isDefault) {
          console.log(`⚠️  ${admin.email} is using the default password!`);
          console.log('   Run this script again to reset their password.');
        }
      }
    }
    
    console.log('\n✅ Migration complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Update .env file with JWT_SECRET if not already done');
    console.log('2. Deploy the new auth-secure.ts file');
    console.log('3. Update all API routes to remove service role usage');
    console.log('4. Test admin login with new credentials');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

function generateSecurePassword() {
  const length = 16;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + special;
  
  let password = '';
  
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Run the migration
migrateAdminAuth();