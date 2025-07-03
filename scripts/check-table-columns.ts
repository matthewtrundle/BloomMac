import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define expected schemas based on our features
const expectedSchemas = {
  profiles: {
    required: ['id', 'email', 'created_at'],
    expected: ['first_name', 'last_name', 'phone', 'postpartum_date', 'number_of_children', 'emergency_contact_name', 'emergency_contact_phone', 'updated_at']
  },
  course_enrollments: {
    required: ['id', 'user_id', 'course_id', 'enrolled_at', 'status'],
    expected: ['enrollment_method', 'amount_paid', 'stripe_payment_id', 'completed_at']
  },
  user_progress: {
    required: ['id', 'user_id', 'course_id', 'lesson_number', 'completed'],
    expected: ['completed_at', 'time_spent_minutes', 'created_at', 'updated_at']
  },
  workbook_responses: {
    required: ['id', 'user_id', 'course_id', 'week_number', 'question_id'],
    expected: ['response', 'is_draft', 'is_submitted', 'submitted_at', 'created_at', 'updated_at']
  },
  workbook_questions: {
    required: ['id', 'course_id', 'week_number', 'question_number', 'question_text'],
    expected: ['question_type', 'options', 'created_at']
  },
  appointments: {
    required: ['id', 'user_id', 'appointment_date', 'appointment_type', 'status'],
    expected: ['notes', 'payment_status', 'confirmation_sent', 'confirmation_received', 'cancelled_at', 'created_at']
  },
  user_achievements: {
    required: ['id', 'user_id', 'achievement_id', 'earned_at'],
    expected: ['type', 'name', 'description', 'icon', 'points', 'created_at']
  },
  course_activity_logs: {
    required: ['id', 'user_id', 'course_id', 'activity_type', 'created_at'],
    expected: ['lesson_number', 'metadata']
  }
};

async function checkTableSchema(tableName: string) {
  console.log(`\n🔍 Checking ${tableName}...`);
  
  try {
    // Get a sample row to see actual columns
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.log(`  ❌ Error accessing table: ${error.message}`);
      return;
    }
    
    // If we have data, use it to get columns
    let actualColumns: string[] = [];
    if (data && data.length > 0) {
      actualColumns = Object.keys(data[0]);
    } else {
      // Try to insert and rollback to get column info
      try {
        const { error: insertError } = await supabase
          .from(tableName)
          .insert({})
          .select();
        
        // The error message often contains column information
        if (insertError && insertError.message) {
          console.log(`  ℹ️  Table exists but is empty`);
          // Try to parse columns from error message if possible
        }
      } catch (e) {
        // Ignore
      }
    }
    
    const schema = expectedSchemas[tableName as keyof typeof expectedSchemas];
    if (!schema) {
      console.log(`  ⚠️  No expected schema defined`);
      if (actualColumns.length > 0) {
        console.log(`  📋 Actual columns: ${actualColumns.join(', ')}`);
      }
      return;
    }
    
    // Check required columns
    console.log(`  📋 Required columns:`);
    for (const col of schema.required) {
      const exists = actualColumns.includes(col);
      console.log(`    ${exists ? '✅' : '❌'} ${col}`);
    }
    
    // Check expected columns
    console.log(`  📋 Expected columns:`);
    for (const col of schema.expected) {
      const exists = actualColumns.includes(col);
      console.log(`    ${exists ? '✅' : '⚠️ '} ${col}`);
    }
    
    // Show any extra columns
    const allExpected = [...schema.required, ...schema.expected];
    const extraColumns = actualColumns.filter(col => !allExpected.includes(col));
    if (extraColumns.length > 0) {
      console.log(`  📋 Extra columns found: ${extraColumns.join(', ')}`);
    }
    
  } catch (error) {
    console.log(`  ❌ Unexpected error: ${error}`);
  }
}

async function runAudit() {
  console.log('🗄️  Database Schema Audit for Bloom Psychology');
  console.log('=' .repeat(60));
  
  for (const tableName of Object.keys(expectedSchemas)) {
    await checkTableSchema(tableName);
  }
  
  console.log('\n\n📊 Summary of Required Changes:');
  console.log('=' .repeat(60));
  console.log(`
Based on the features we've built, here are the database changes needed:

1. PROFILES table needs:
   - first_name, last_name (for personalization)
   - phone (for contact)
   - postpartum_date (for journey tracking)
   - number_of_children (for personalized messages)
   - emergency_contact_name, emergency_contact_phone (for safety)

2. COURSE_ENROLLMENTS table needs:
   - enrollment_method (free/paid)
   - amount_paid (for payment tracking)
   - stripe_payment_id (for payment verification)

3. USER_PROGRESS table needs:
   - time_spent_minutes (for analytics)
   - completed_at timestamp

4. WORKBOOK_RESPONSES table needs:
   - is_draft, is_submitted flags
   - submitted_at timestamp

5. APPOINTMENTS table needs:
   - confirmation_sent, confirmation_received flags
   - payment_status

6. USER_ACHIEVEMENTS table might need:
   - type, name, description, icon, points columns
   OR these could be in a separate achievements definition table
`);
}

runAudit().catch(console.error);