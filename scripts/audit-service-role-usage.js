#!/usr/bin/env node

/**
 * Script to audit all service role usage in the codebase
 * Identifies files that need to be updated for security
 */

const fs = require('fs').promises;
const path = require('path');

const projectRoot = path.join(__dirname, '..');

// Patterns to search for
const patterns = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'supabaseAdmin',
  'createClient.*SERVICE_ROLE',
  'service_role',
  'serviceRoleKey'
];

// Directories to skip
const skipDirs = [
  'node_modules',
  '.next',
  '.git',
  'out',
  'coverage',
  '.vercel'
];

// Files that are allowed to use service role (server-only)
const allowedFiles = [
  'scripts/',
  'supabase/migrations/',
  'lib/supabase-admin.ts' // If we create a server-only admin client
];

async function auditServiceRoleUsage() {
  console.log('🔍 Auditing Service Role Usage\n');
  
  const issues = [];
  let totalFiles = 0;
  let checkedFiles = 0;
  
  async function scanDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(projectRoot, fullPath);
      
      if (entry.isDirectory()) {
        if (!skipDirs.includes(entry.name)) {
          await scanDirectory(fullPath);
        }
      } else if (entry.isFile() && isCodeFile(entry.name)) {
        totalFiles++;
        
        // Check if file is in allowed location
        const isAllowed = allowedFiles.some(allowed => relativePath.includes(allowed));
        
        const content = await fs.readFile(fullPath, 'utf-8');
        const foundPatterns = [];
        
        for (const pattern of patterns) {
          const regex = new RegExp(pattern, 'gi');
          const matches = content.match(regex);
          
          if (matches) {
            foundPatterns.push({
              pattern,
              count: matches.length,
              matches: matches.slice(0, 3) // First 3 matches
            });
          }
        }
        
        if (foundPatterns.length > 0) {
          checkedFiles++;
          
          // Find line numbers
          const lines = content.split('\n');
          const lineNumbers = [];
          
          lines.forEach((line, index) => {
            for (const pattern of patterns) {
              if (line.match(new RegExp(pattern, 'i'))) {
                lineNumbers.push({
                  line: index + 1,
                  content: line.trim().substring(0, 80)
                });
              }
            }
          });
          
          issues.push({
            file: relativePath,
            severity: isAllowed ? 'info' : getFileSeverity(relativePath),
            patterns: foundPatterns,
            lineNumbers: lineNumbers.slice(0, 5), // First 5 occurrences
            isAllowed
          });
        }
      }
    }
  }
  
  await scanDirectory(projectRoot);
  
  // Sort issues by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  
  // Display results
  console.log(`📊 Scanned ${totalFiles} files, found ${issues.length} files with service role usage\n`);
  
  // Group by severity
  const critical = issues.filter(i => i.severity === 'critical');
  const high = issues.filter(i => i.severity === 'high');
  const medium = issues.filter(i => i.severity === 'medium');
  const low = issues.filter(i => i.severity === 'low');
  const info = issues.filter(i => i.severity === 'info');
  
  if (critical.length > 0) {
    console.log('🚨 CRITICAL - Client-accessible files using service role:\n');
    critical.forEach(issue => displayIssue(issue));
  }
  
  if (high.length > 0) {
    console.log('\n⚠️  HIGH - API routes using service role:\n');
    high.forEach(issue => displayIssue(issue));
  }
  
  if (medium.length > 0) {
    console.log('\n⚡ MEDIUM - Other files using service role:\n');
    medium.forEach(issue => displayIssue(issue));
  }
  
  if (low.length > 0) {
    console.log('\n📌 LOW - Configuration files:\n');
    low.forEach(issue => displayIssue(issue));
  }
  
  if (info.length > 0) {
    console.log('\nℹ️  INFO - Allowed service role usage:\n');
    info.forEach(issue => displayIssue(issue));
  }
  
  // Generate fix list
  console.log('\n📝 Generating fix list...\n');
  
  const fixList = issues
    .filter(i => !i.isAllowed && i.severity !== 'low')
    .map(i => ({
      file: i.file,
      severity: i.severity,
      action: getFixAction(i.file)
    }));
  
  await fs.writeFile(
    path.join(__dirname, 'service-role-fixes.json'),
    JSON.stringify(fixList, null, 2)
  );
  
  console.log(`✅ Fix list saved to scripts/service-role-fixes.json`);
  console.log(`\n📋 Summary:`);
  console.log(`- ${critical.length} critical issues (client-side usage)`);
  console.log(`- ${high.length} high priority issues (API routes)`);
  console.log(`- ${medium.length + low.length} other issues`);
  console.log(`- ${info.length} allowed usages\n`);
  
  if (critical.length > 0 || high.length > 0) {
    console.log('⚠️  IMMEDIATE ACTION REQUIRED!');
    console.log('Fix all critical and high priority issues before deployment.\n');
    process.exit(1);
  }
}

function isCodeFile(filename) {
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];
  return extensions.some(ext => filename.endsWith(ext));
}

function getFileSeverity(filepath) {
  // Client-side files are critical
  if (filepath.includes('app/') && !filepath.includes('app/api/')) {
    return 'critical';
  }
  if (filepath.includes('components/') || filepath.includes('pages/') && !filepath.includes('pages/api/')) {
    return 'critical';
  }
  
  // API routes are high priority
  if (filepath.includes('app/api/') || filepath.includes('pages/api/')) {
    return 'high';
  }
  
  // Library files are medium
  if (filepath.includes('lib/')) {
    return 'medium';
  }
  
  // Config files are low
  if (filepath.includes('.config.') || filepath.includes('.env')) {
    return 'low';
  }
  
  return 'medium';
}

function displayIssue(issue) {
  console.log(`📄 ${issue.file}`);
  
  issue.patterns.forEach(p => {
    console.log(`   Pattern: "${p.pattern}" (${p.count} occurrences)`);
  });
  
  if (issue.lineNumbers.length > 0) {
    console.log('   Lines:');
    issue.lineNumbers.forEach(ln => {
      console.log(`     ${ln.line}: ${ln.content}`);
    });
  }
  
  console.log('');
}

function getFixAction(filepath) {
  if (filepath.includes('app/api/') || filepath.includes('pages/api/')) {
    return 'Replace with user-authenticated Supabase client';
  }
  
  if (filepath.includes('components/') || filepath.includes('app/') && !filepath.includes('api/')) {
    return 'Remove service role usage - use API routes instead';
  }
  
  if (filepath.includes('lib/')) {
    return 'Create separate server-only module or remove';
  }
  
  return 'Review and update based on context';
}

// Run the audit
auditServiceRoleUsage().catch(console.error);