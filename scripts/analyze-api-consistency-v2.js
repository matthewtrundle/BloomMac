const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run actual queries to get table schemas
console.log('=== FETCHING ACTUAL DATABASE SCHEMAS ===\n');

const tables = [
  'user_profiles', 'subscribers', 'email_templates', 'email_templates_custom',
  'email_sequences', 'sequence_emails', 'sequence_enrollments', 'contact_submissions',
  'courses', 'course_modules', 'course_lessons', 'email_automation_logs',
  'analytics_events', 'admin_activity_log', 'user_preferences',
  'course_enrollments', 'email_queue', 'admin_sessions', 'blog_posts'
];

const actualSchemas = {};

// Get actual column names from database
tables.forEach(table => {
  try {
    const query = `SELECT column_name FROM information_schema.columns WHERE table_name = '${table}' AND table_schema = 'public'`;
    const result = execSync(`npm run db:query "${query}" 2>/dev/null`, { encoding: 'utf8' });
    
    if (result.includes('column_name')) {
      const columns = [];
      const lines = result.split('\n');
      let inTable = false;
      
      lines.forEach(line => {
        if (line.includes('│') && inTable && !line.includes('column_name')) {
          const match = line.match(/│\s+(\w+)\s+│/);
          if (match) columns.push(match[1]);
        }
        if (line.includes('column_name')) inTable = true;
        if (line.includes('└─') || line.includes('Results (0')) inTable = false;
      });
      
      if (columns.length > 0) {
        actualSchemas[table] = columns;
        console.log(`✓ ${table}: ${columns.length} columns`);
      } else {
        actualSchemas[table] = null;
        console.log(`✗ ${table}: does not exist`);
      }
    }
  } catch (error) {
    actualSchemas[table] = null;
    console.log(`✗ ${table}: does not exist`);
  }
});

console.log('\n=== ANALYZING API ENDPOINTS ===\n');

const issues = [];
let totalFiles = 0;
let totalOperations = 0;

function extractTableOperations(content, filePath) {
  const operations = [];
  
  // Extract all Supabase operations with their context
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Find .from() calls
    const fromMatch = line.match(/\.from\(['"`](\w+)['"`]\)/);
    if (fromMatch) {
      const table = fromMatch[1];
      let operation = { table, line: i + 1, type: 'query' };
      
      // Look for chained operations in the next few lines
      for (let j = i; j < Math.min(i + 20, lines.length); j++) {
        const checkLine = lines[j];
        
        // Select columns
        const selectMatch = checkLine.match(/\.select\(['"`]([^'"`]+)['"`](?:,|)\)/);
        if (selectMatch) {
          const selectStr = selectMatch[1];
          if (!selectStr.includes('*') && !selectStr.includes('!')) {
            operation.selectColumns = selectStr.split(',').map(c => c.trim());
          }
        }
        
        // Insert fields
        const insertMatch = checkLine.match(/\.insert\(\s*\{/);
        if (insertMatch) {
          operation.type = 'insert';
          // Extract fields from the object
          const insertBlock = lines.slice(j, Math.min(j + 30, lines.length)).join('\n');
          const fieldMatches = insertBlock.match(/(\w+):\s*[^,}]+/g);
          if (fieldMatches) {
            operation.insertFields = fieldMatches.map(m => m.split(':')[0].trim());
          }
        }
        
        // Update fields
        const updateMatch = checkLine.match(/\.update\(\s*\{/);
        if (updateMatch) {
          operation.type = 'update';
          // Extract fields from the object
          const updateBlock = lines.slice(j, Math.min(j + 30, lines.length)).join('\n');
          const fieldMatches = updateBlock.match(/(\w+):\s*[^,}]+/g);
          if (fieldMatches) {
            operation.updateFields = fieldMatches.map(m => m.split(':')[0].trim());
          }
        }
        
        // Filter columns
        ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'in', 'contains'].forEach(op => {
          const filterMatch = checkLine.match(new RegExp(`\\.${op}\\(['"\`](\\w+)['"\`]`));
          if (filterMatch) {
            if (!operation.filterColumns) operation.filterColumns = [];
            operation.filterColumns.push(filterMatch[1]);
          }
        });
        
        // Order columns
        const orderMatch = checkLine.match(/\.order\(['"`](\w+)['"`]/);
        if (orderMatch) {
          if (!operation.orderColumns) operation.orderColumns = [];
          operation.orderColumns.push(orderMatch[1]);
        }
        
        // Stop if we hit another query
        if (j > i && checkLine.includes('.from(')) break;
      }
      
      operations.push(operation);
    }
    
    // Find RPC calls
    const rpcMatch = line.match(/\.rpc\(['"`](\w+)['"`]/);
    if (rpcMatch) {
      operations.push({
        type: 'rpc',
        function: rpcMatch[1],
        line: i + 1
      });
    }
  }
  
  return operations;
}

function checkOperations(operations, filePath) {
  const fileIssues = [];
  
  operations.forEach(op => {
    if (op.table) {
      const schema = actualSchemas[op.table];
      
      // Check if table exists
      if (schema === null) {
        fileIssues.push({
          type: 'TABLE_NOT_EXISTS',
          severity: 'ERROR',
          line: op.line,
          message: `Table '${op.table}' does not exist in database`
        });
        return;
      }
      
      // Check select columns
      if (op.selectColumns && schema) {
        op.selectColumns.forEach(col => {
          // Handle nested selects and aliases
          const cleanCol = col.split(':')[0].split('(')[0].trim();
          if (!schema.includes(cleanCol) && !cleanCol.includes('.')) {
            fileIssues.push({
              type: 'COLUMN_NOT_EXISTS',
              severity: 'ERROR',
              line: op.line,
              message: `Column '${cleanCol}' not found in table '${op.table}'`
            });
          }
        });
      }
      
      // Check insert fields
      if (op.insertFields && schema) {
        op.insertFields.forEach(field => {
          if (!schema.includes(field)) {
            fileIssues.push({
              type: 'COLUMN_NOT_EXISTS',
              severity: 'ERROR',
              line: op.line,
              message: `Column '${field}' not found in table '${op.table}' (insert)`
            });
          }
        });
      }
      
      // Check update fields
      if (op.updateFields && schema) {
        op.updateFields.forEach(field => {
          if (!schema.includes(field)) {
            fileIssues.push({
              type: 'COLUMN_NOT_EXISTS',
              severity: 'ERROR',
              line: op.line,
              message: `Column '${field}' not found in table '${op.table}' (update)`
            });
          }
        });
      }
      
      // Check filter columns
      if (op.filterColumns && schema) {
        op.filterColumns.forEach(col => {
          if (!schema.includes(col)) {
            fileIssues.push({
              type: 'COLUMN_NOT_EXISTS',
              severity: 'ERROR',
              line: op.line,
              message: `Column '${col}' not found in table '${op.table}' (filter)`
            });
          }
        });
      }
      
      // Check order columns
      if (op.orderColumns && schema) {
        op.orderColumns.forEach(col => {
          if (!schema.includes(col)) {
            fileIssues.push({
              type: 'COLUMN_NOT_EXISTS',
              severity: 'ERROR',
              line: op.line,
              message: `Column '${col}' not found in table '${op.table}' (order)`
            });
          }
        });
      }
    }
    
    // Check RPC functions
    if (op.type === 'rpc' && op.function === 'query') {
      fileIssues.push({
        type: 'DANGEROUS_RPC',
        severity: 'WARNING',
        line: op.line,
        message: `Using raw query RPC function - ensure proper access control`
      });
    }
  });
  
  return fileIssues;
}

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const operations = extractTableOperations(content, filePath);
    const fileIssues = checkOperations(operations, filePath);
    
    totalFiles++;
    totalOperations += operations.length;
    
    if (fileIssues.length > 0) {
      const relativePath = filePath.replace(path.join(__dirname, '..'), '');
      issues.push({ file: relativePath, issues: fileIssues });
    }
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
  }
}

function scanDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.name === 'route.ts' && !fullPath.includes('route.ts.fix')) {
      analyzeFile(fullPath);
    }
  });
}

// Start analysis
const apiDir = path.join(__dirname, '..', 'app', 'api');
scanDirectory(apiDir);

// Generate report
console.log(`\nAnalyzed ${totalFiles} API files with ${totalOperations} database operations\n`);

if (issues.length === 0) {
  console.log('✅ No database consistency issues found!');
} else {
  const totalIssues = issues.reduce((sum, f) => sum + f.issues.length, 0);
  const errors = issues.reduce((sum, f) => sum + f.issues.filter(i => i.severity === 'ERROR').length, 0);
  const warnings = issues.reduce((sum, f) => sum + f.issues.filter(i => i.severity === 'WARNING').length, 0);
  
  console.log(`Found ${totalIssues} issues in ${issues.length} files:\n`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log(`  ⚠️  Warnings: ${warnings}\n`);
  
  console.log('=== ISSUES BY FILE ===\n');
  
  issues.forEach(({ file, issues }) => {
    console.log(`📄 ${file}:`);
    issues.forEach(issue => {
      const icon = issue.severity === 'ERROR' ? '❌' : '⚠️';
      console.log(`  ${icon} Line ${issue.line}: ${issue.message}`);
    });
    console.log('');
  });
  
  // Summary by issue type
  const issueTypes = {};
  issues.forEach(({ issues }) => {
    issues.forEach(issue => {
      if (!issueTypes[issue.type]) issueTypes[issue.type] = 0;
      issueTypes[issue.type]++;
    });
  });
  
  console.log('=== SUMMARY BY ISSUE TYPE ===\n');
  Object.entries(issueTypes).forEach(([type, count]) => {
    console.log(`${type}: ${count} occurrences`);
  });
}