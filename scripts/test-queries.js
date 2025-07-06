#!/usr/bin/env node

/**
 * Test Database Queries Before Using in Code
 * This helps prevent building features based on wrong assumptions
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Common queries to test
const testQueries = {
  // Test if a column exists
  checkColumn: async (table, column) => {
    console.log(`\nChecking if ${table}.${column} exists...`);
    try {
      const { data, error } = await supabase
        .from(table)
        .select(column)
        .limit(1);
      
      if (error) {
        console.log(`❌ Column '${column}' does NOT exist in table '${table}'`);
        console.log(`   Error: ${error.message}`);
        return false;
      }
      
      console.log(`✅ Column '${column}' exists in table '${table}'`);
      return true;
    } catch (e) {
      console.log(`❌ Error checking column: ${e.message}`);
      return false;
    }
  },

  // Test a relationship
  checkRelationship: async (fromTable, toTable, foreignKey) => {
    console.log(`\nChecking relationship ${fromTable}.${foreignKey} -> ${toTable}.id...`);
    try {
      const { data, error } = await supabase
        .from(fromTable)
        .select(`
          *,
          ${toTable}!${foreignKey} (*)
        `)
        .limit(1);
      
      if (error) {
        console.log(`❌ Relationship does NOT work`);
        console.log(`   Error: ${error.message}`);
        return false;
      }
      
      console.log(`✅ Relationship works!`);
      console.log(`   Sample data:`, JSON.stringify(data, null, 2));
      return true;
    } catch (e) {
      console.log(`❌ Error checking relationship: ${e.message}`);
      return false;
    }
  },

  // Get sample data with specific columns
  getSampleData: async (table, columns = '*', limit = 3) => {
    console.log(`\nGetting sample data from ${table}...`);
    try {
      const { data, error } = await supabase
        .from(table)
        .select(columns)
        .limit(limit);
      
      if (error) {
        console.log(`❌ Error getting data: ${error.message}`);
        return null;
      }
      
      console.log(`✅ Sample data from ${table}:`);
      console.table(data);
      return data;
    } catch (e) {
      console.log(`❌ Error: ${e.message}`);
      return null;
    }
  },

  // Test a complex query before using it
  testComplexQuery: async (queryFunction) => {
    console.log(`\nTesting complex query...`);
    try {
      const result = await queryFunction(supabase);
      console.log(`✅ Query successful!`);
      console.log(`   Result:`, JSON.stringify(result, null, 2));
      return result;
    } catch (e) {
      console.log(`❌ Query failed: ${e.message}`);
      return null;
    }
  }
};

// Export for use in other scripts
module.exports = testQueries;

// If run directly, show examples
if (require.main === module) {
  async function runExamples() {
    console.log('=== DATABASE QUERY TESTING TOOL ===\n');

    // Example 1: Check if columns exist
    await testQueries.checkColumn('subscribers', 'email');
    await testQueries.checkColumn('subscribers', 'subscribed'); // This should fail
    await testQueries.checkColumn('subscribers', 'status'); // This should work

    // Example 2: Check relationships
    await testQueries.checkRelationship('admin_users', 'auth.users', 'id');

    // Example 3: Get sample data
    await testQueries.getSampleData('subscribers', 'id, email, status', 5);

    // Example 4: Test a complex query
    await testQueries.testComplexQuery(async (supabase) => {
      const { data, error } = await supabase
        .from('subscribers')
        .select('status, count')
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
    });
  }

  runExamples();
}