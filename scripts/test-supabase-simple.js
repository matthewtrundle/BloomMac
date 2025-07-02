#!/usr/bin/env node

/**
 * Simple Supabase Connection Test
 */

require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Supabase Connection Test\n');

// Check environment variables
console.log('1️⃣  Environment Check:');
console.log(`   SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}`);
console.log(`   ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}`);
console.log(`   SERVICE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌'}`);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('\n❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
  process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');

// Use service role to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  console.log('\n2️⃣  Testing Connection...');
  
  try {
    const { error } = await supabase.from('user_profiles').select('count').single();
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('   ❌ Table user_profiles does not exist');
        console.log('\n   Run the SQL in: supabase/create-user-profiles-table.sql');
      } else if (error.message.includes('row-level security')) {
        console.log('   ⚠️  Table exists but RLS is blocking access');
        console.log('\n   Run the SQL in: supabase/safe-rls-fix.sql');
      } else {
        console.log(`   ❌ Error: ${error.message}`);
      }
    } else {
      console.log('   ✅ Connection successful!');
    }
    
  } catch (err) {
    console.log(`   ❌ ${err.message}`);
  }
}

test();