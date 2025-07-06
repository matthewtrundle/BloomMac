#!/usr/bin/env node

/**
 * Build-Test Loop for Database Operations
 * This ensures what we build matches what's in the database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class DatabaseBuildTester {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  // Test if a query works before using it in code
  async testQuery(description, queryBuilder) {
    console.log(`\nTesting: ${description}`);
    try {
      const { data, error } = await queryBuilder();
      
      if (error) {
        this.errors.push({
          description,
          error: error.message,
          hint: error.hint || 'Check column names and table relationships'
        });
        console.log(`❌ FAILED: ${error.message}`);
        return null;
      }
      
      console.log(`✅ SUCCESS: Retrieved ${data?.length || 0} records`);
      return data;
    } catch (e) {
      this.errors.push({ description, error: e.message });
      console.log(`❌ ERROR: ${e.message}`);
      return null;
    }
  }

  // Generate TypeScript interfaces from actual data
  async generateTypes(tableName) {
    console.log(`\nGenerating types for ${tableName}...`);
    
    const { data } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (!data || data.length === 0) {
      console.log('No data to analyze');
      return;
    }
    
    const sample = data[0];
    let typeDefinition = `export interface ${toPascalCase(tableName)} {\n`;
    
    for (const [key, value] of Object.entries(sample)) {
      const type = getTypeScriptType(value);
      typeDefinition += `  ${key}: ${type};\n`;
    }
    
    typeDefinition += '}\n';
    
    console.log('Generated TypeScript interface:');
    console.log(typeDefinition);
    
    return typeDefinition;
  }

  // Test all queries in a file
  async testFileQueries(filePath) {
    console.log(`\nTesting queries in ${filePath}...`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const supabaseQueries = content.match(/supabase\s*\.\s*from\([^)]+\)[^;]+/g) || [];
    
    console.log(`Found ${supabaseQueries.length} Supabase queries`);
    
    for (const query of supabaseQueries) {
      console.log(`\nQuery: ${query.substring(0, 50)}...`);
      
      // Extract table name
      const tableMatch = query.match(/from\(['"]([^'"]+)['"]\)/);
      if (tableMatch) {
        const table = tableMatch[1];
        
        // Extract selected columns
        const selectMatch = query.match(/select\(['"]([^'"]+)['"]\)/);
        if (selectMatch) {
          const columns = selectMatch[1];
          
          // Test if this query would work
          await this.testQuery(
            `Query from ${path.basename(filePath)}`,
            () => supabase.from(table).select(columns).limit(1)
          );
        }
      }
    }
  }

  // Validate API endpoint matches database
  async validateEndpoint(endpoint, expectedShape) {
    console.log(`\nValidating endpoint: ${endpoint}`);
    
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`);
      const data = await response.json();
      
      if (!response.ok) {
        this.errors.push({
          endpoint,
          error: `HTTP ${response.status}`,
          data
        });
        console.log(`❌ Endpoint returned error: ${response.status}`);
        return false;
      }
      
      // Check if response matches expected shape
      for (const key of Object.keys(expectedShape)) {
        if (!(key in data)) {
          this.warnings.push({
            endpoint,
            warning: `Missing expected key: ${key}`
          });
          console.log(`⚠️  Missing expected key: ${key}`);
        }
      }
      
      console.log(`✅ Endpoint working`);
      return true;
    } catch (e) {
      this.errors.push({ endpoint, error: e.message });
      console.log(`❌ Failed to call endpoint: ${e.message}`);
      return false;
    }
  }

  // Generate summary report
  generateReport() {
    console.log('\n=== BUILD-TEST REPORT ===\n');
    
    if (this.errors.length === 0) {
      console.log('✅ All tests passed!');
    } else {
      console.log(`❌ ${this.errors.length} errors found:\n`);
      this.errors.forEach((err, i) => {
        console.log(`${i + 1}. ${err.description || err.endpoint}`);
        console.log(`   Error: ${err.error}`);
        if (err.hint) console.log(`   Hint: ${err.hint}`);
        console.log('');
      });
    }
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️  ${this.warnings.length} warnings:\n`);
      this.warnings.forEach((warn, i) => {
        console.log(`${i + 1}. ${warn.endpoint}: ${warn.warning}`);
      });
    }
  }
}

// Helper functions
function toPascalCase(str) {
  return str.replace(/(^|_)([a-z])/g, (_, __, letter) => letter.toUpperCase());
}

function getTypeScriptType(value) {
  if (value === null) return 'null';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (Array.isArray(value)) return 'any[]';
  if (typeof value === 'object') return 'Record<string, any>';
  return 'any';
}

// Export for use in other scripts
module.exports = DatabaseBuildTester;

// If run directly, show examples
if (require.main === module) {
  async function runTests() {
    const tester = new DatabaseBuildTester();
    
    // Test common queries
    await tester.testQuery(
      'Get active subscribers',
      () => supabase.from('subscribers').select('*').eq('status', 'active')
    );
    
    await tester.testQuery(
      'Get subscriber with email (using wrong column)',
      () => supabase.from('subscribers').select('*').eq('subscribed', true)
    );
    
    // Generate types
    await tester.generateTypes('subscribers');
    
    // Test a specific file (if provided)
    const fileToTest = process.argv[2];
    if (fileToTest && fs.existsSync(fileToTest)) {
      await tester.testFileQueries(fileToTest);
    }
    
    // Generate report
    tester.generateReport();
  }
  
  runTests();
}