const fs = require('fs');
const path = require('path');

// Known table schemas from our check
const tableSchemas = {
  user_profiles: ['id', 'first_name', 'last_name', 'phone', 'bio', 'status', 'preferences', 'metadata', 'created_at', 'updated_at', 'avatar_url', 'baby_due_date', 'postpartum_date', 'number_of_children', 'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship', 'timezone', 'marketing_consent', 'role', 'stripe_customer_id', 'last_login_at'],
  subscribers: ['id', 'email', 'first_name', 'last_name', 'status', 'tags', 'signup_source', 'interests', 'metadata', 'ip_address', 'user_agent', 'referrer', 'confirmed', 'created_at', 'updated_at', 'source', 'unsubscribe_reason'],
  email_templates: ['id', 'name', 'category', 'subject', 'content', 'variables', 'is_public', 'created_by', 'created_at', 'updated_at'],
  email_templates_custom: [], // Exists but empty
  email_sequences: ['id', 'name', 'description', 'trigger', 'trigger_conditions', 'status', 'created_by', 'created_at', 'updated_at'],
  sequence_emails: ['id', 'sequence_id', 'position', 'subject', 'content', 'delay_hours', 'delay_days', 'created_at', 'updated_at'],
  sequence_enrollments: ['id', 'subscriber_id', 'sequence_id', 'enrollment_source', 'status', 'current_position', 'enrolled_at', 'next_send_at', 'completed_at', 'paused_at', 'metadata', 'created_at', 'updated_at'],
  contact_submissions: ['id', 'name', 'email', 'phone', 'service', 'message', 'status', 'source', 'ip_address', 'user_agent', 'created_at', 'updated_at', 'metadata', 'first_name', 'last_name'],
  courses: ['id', 'slug', 'title', 'subtitle', 'description', 'long_description', 'price', 'original_price', 'duration', 'total_modules', 'total_lessons', 'total_duration_minutes', 'image_url', 'instructor_name', 'instructor_credentials', 'features', 'learning_outcomes', 'bonus_materials', 'is_active', 'is_featured', 'sort_order', 'created_at', 'updated_at'],
  course_modules: ['id', 'course_id', 'week_number', 'title', 'description', 'objectives', 'order_index', 'is_published', 'created_at', 'updated_at'],
  course_lessons: ['id', 'module_id', 'lesson_number', 'title', 'description', 'video_url', 'video_duration_minutes', 'video_thumbnail_url', 'slides_html', 'transcript', 'script_notes', 'resources', 'order_index', 'is_preview', 'is_published', 'created_at', 'updated_at', 'video_script_formatted', 'script_version', 'script_duration_estimate', 'script_last_edited_by', 'script_last_edited_at', 'script_status', 'talking_points', 'script_notes_backup'],
  email_automation_logs: ['id', 'sequence_id', 'email_id', 'subscriber_id', 'status', 'sent_at', 'opened_at', 'clicked_at', 'metadata', 'created_at'],
  analytics_events: ['id', 'type', 'page', 'session_id', 'user_id', 'data', 'timestamp', 'created_at', 'metadata'],
  admin_activity_log: ['id', 'action', 'entity_type', 'entity_id', 'details', 'ip_address', 'user_agent', 'created_at'],
  user_preferences: ['id', 'user_id', 'privacy_settings', 'reminder_settings', 'theme_preference', 'language', 'timezone', 'created_at', 'updated_at', 'notification_preferences', 'security_settings', 'communication_preferences', 'quiet_hours'],
  course_enrollments: [], // Empty table
  email_queue: [], // Empty table
  admin_sessions: [], // Empty table
  blog_posts: ['id', 'slug', 'title', 'excerpt', 'content', 'image_url', 'image_alt', 'category', 'read_time', 'featured', 'author_name', 'author_title', 'author_image', 'meta_description', 'keywords', 'published_at', 'created_at', 'updated_at'],
  // Non-existent tables
  careers_postings: null,
  lesson_progress: null,
  blog_images: null,
  careers_applications: null,
  admin_users: null, // Known to not exist
  profiles: null, // Known to be removed
  email_sends: null,
  email_logs: null,
  newsletter_subscribers: null
};

const allIssues = {};
let totalFiles = 0;

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = filePath.replace(path.join(__dirname, '..'), '');
    const issues = [];
    totalFiles++;

    // 1. Check table references
    const tablePattern = /supabase\.from\(['"`](\w+)['"`]\)/g;
    let match;
    while ((match = tablePattern.exec(content)) !== null) {
      const table = match[1];
      const lineNum = content.substring(0, match.index).split('\n').length;
      
      if (tableSchemas[table] === null) {
        issues.push({
          type: 'NON_EXISTENT_TABLE',
          table: table,
          line: lineNum,
          severity: 'ERROR',
          message: `Table '${table}' does not exist in database`
        });
      } else if (tableSchemas[table] === undefined) {
        issues.push({
          type: 'UNKNOWN_TABLE',
          table: table,
          line: lineNum,
          severity: 'WARNING',
          message: `Table '${table}' not in known schema list - verify it exists`
        });
      }
    }

    // 2. Check RPC calls
    const rpcPattern = /supabase\.rpc\(['"`](\w+)['"`]/g;
    while ((match = rpcPattern.exec(content)) !== null) {
      const funcName = match[1];
      const lineNum = content.substring(0, match.index).split('\n').length;
      
      if (funcName === 'query') {
        issues.push({
          type: 'DANGEROUS_RPC',
          function: funcName,
          line: lineNum,
          severity: 'WARNING',
          message: `Using raw query RPC function - ensure proper access control`
        });
      }
    }

    // 3. Check column references in operations
    const operations = [
      { pattern: /\.select\(['"`]([^'"`]+)['"`]\)/g, type: 'select' },
      { pattern: /\.eq\(['"`](\w+)['"`]/g, type: 'filter' },
      { pattern: /\.neq\(['"`](\w+)['"`]/g, type: 'filter' },
      { pattern: /\.gt\(['"`](\w+)['"`]/g, type: 'filter' },
      { pattern: /\.gte\(['"`](\w+)['"`]/g, type: 'filter' },
      { pattern: /\.lt\(['"`](\w+)['"`]/g, type: 'filter' },
      { pattern: /\.lte\(['"`](\w+)['"`]/g, type: 'filter' },
      { pattern: /\.like\(['"`](\w+)['"`]/g, type: 'filter' },
      { pattern: /\.ilike\(['"`](\w+)['"`]/g, type: 'filter' },
      { pattern: /\.contains\(['"`](\w+)['"`]/g, type: 'filter' },
      { pattern: /\.order\(['"`](\w+)['"`]/g, type: 'order' }
    ];

    // Find current table context for each operation
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      // Find table reference
      const tableMatch = line.match(/from\(['"`](\w+)['"`]\)/);
      if (tableMatch) {
        const currentTable = tableMatch[1];
        const schema = tableSchemas[currentTable];
        
        if (schema && schema.length > 0) {
          // Check subsequent lines for column operations
          for (let i = idx; i < Math.min(idx + 10, lines.length); i++) {
            const checkLine = lines[i];
            
            // Check select columns
            const selectMatch = checkLine.match(/\.select\(['"`]([^'"`]+)['"`]\)/);
            if (selectMatch) {
              const columns = selectMatch[1];
              if (!columns.includes('*') && !columns.includes('!')) {
                const colList = columns.split(',').map(c => c.trim());
                colList.forEach(col => {
                  if (!col.includes('(') && !col.includes(':')) {
                    const colName = col.split('.').pop();
                    if (!schema.includes(colName)) {
                      issues.push({
                        type: 'UNKNOWN_COLUMN',
                        table: currentTable,
                        column: colName,
                        line: idx + i + 1,
                        severity: 'ERROR',
                        message: `Column '${colName}' not found in table '${currentTable}'`
                      });
                    }
                  }
                });
              }
            }
            
            // Check filter columns
            operations.forEach(op => {
              if (op.type === 'filter' || op.type === 'order') {
                const opMatch = checkLine.match(op.pattern);
                if (opMatch) {
                  const colName = opMatch[1];
                  if (!schema.includes(colName)) {
                    issues.push({
                      type: 'UNKNOWN_COLUMN',
                      table: currentTable,
                      column: colName,
                      line: idx + i + 1,
                      severity: 'ERROR',
                      message: `Column '${colName}' not found in table '${currentTable}' (${op.type})`
                    });
                  }
                }
              }
            });
          }
        }
      }
    });

    // 4. Check insert/update operations
    const insertPattern = /\.insert\(\{([^}]+)\}\)/g;
    const updatePattern = /\.update\(\{([^}]+)\}\)/g;
    
    [insertPattern, updatePattern].forEach((pattern, idx) => {
      const opType = idx === 0 ? 'insert' : 'update';
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(content)) !== null) {
        const fields = match[1];
        const lineNum = content.substring(0, match.index).split('\n').length;
        
        // Find the table context
        const beforeMatch = content.substring(0, match.index);
        const tableMatch = beforeMatch.match(/\.from\(['"`](\w+)['"`]\)[^}]*$/);
        
        if (tableMatch) {
          const table = tableMatch[1];
          const schema = tableSchemas[table];
          
          if (schema && schema.length > 0) {
            // Extract field names
            const fieldPattern = /(\w+):/g;
            let fieldMatch;
            while ((fieldMatch = fieldPattern.exec(fields)) !== null) {
              const field = fieldMatch[1];
              if (!schema.includes(field)) {
                issues.push({
                  type: 'UNKNOWN_COLUMN',
                  table: table,
                  column: field,
                  line: lineNum,
                  severity: 'ERROR',
                  message: `Column '${field}' not found in table '${table}' (${opType})`
                });
              }
            }
          }
        }
      }
    });

    // 5. Check for auth.users references
    if (content.includes('auth.users')) {
      const authMatches = content.match(/auth\.users/g);
      if (authMatches) {
        issues.push({
          type: 'AUTH_TABLE_ACCESS',
          line: content.split('\n').findIndex(line => line.includes('auth.users')) + 1,
          severity: 'INFO',
          message: 'Accessing auth.users table - ensure proper permissions'
        });
      }
    }

    if (issues.length > 0) {
      allIssues[relativePath] = issues;
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
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.fix.md')) {
      analyzeFile(fullPath);
    }
  });
}

// Start analysis
console.log('=== COMPREHENSIVE API DATABASE CONSISTENCY ANALYSIS ===\n');

const apiDir = path.join(__dirname, '..', 'app', 'api');
scanDirectory(apiDir);

// Generate report
const totalIssues = Object.values(allIssues).reduce((sum, issues) => sum + issues.length, 0);
const errorCount = Object.values(allIssues).flat().filter(i => i.severity === 'ERROR').length;
const warningCount = Object.values(allIssues).flat().filter(i => i.severity === 'WARNING').length;
const infoCount = Object.values(allIssues).flat().filter(i => i.severity === 'INFO').length;

console.log(`Analyzed ${totalFiles} API files\n`);

if (totalIssues === 0) {
  console.log('✅ No database consistency issues found!');
} else {
  console.log(`Found ${totalIssues} issues:\n`);
  console.log(`  ❌ Errors: ${errorCount}`);
  console.log(`  ⚠️  Warnings: ${warningCount}`);
  console.log(`  ℹ️  Info: ${infoCount}\n`);
  
  // Group issues by type
  const issuesByType = {};
  Object.values(allIssues).flat().forEach(issue => {
    if (!issuesByType[issue.type]) {
      issuesByType[issue.type] = [];
    }
    issuesByType[issue.type].push(issue);
  });
  
  console.log('=== ISSUES BY TYPE ===\n');
  Object.entries(issuesByType).forEach(([type, issues]) => {
    console.log(`${type}: ${issues.length} occurrences`);
  });
  
  console.log('\n=== DETAILED ISSUES BY FILE ===\n');
  
  Object.entries(allIssues).forEach(([file, issues]) => {
    console.log(`📄 ${file}:`);
    issues.forEach(issue => {
      const icon = issue.severity === 'ERROR' ? '❌' : issue.severity === 'WARNING' ? '⚠️' : 'ℹ️';
      console.log(`  ${icon} Line ${issue.line}: ${issue.message}`);
    });
    console.log('');
  });
}

// List tables that are referenced but don't exist
const nonExistentTables = new Set();
Object.values(allIssues).flat().forEach(issue => {
  if (issue.type === 'NON_EXISTENT_TABLE') {
    nonExistentTables.add(issue.table);
  }
});

if (nonExistentTables.size > 0) {
  console.log('\n=== NON-EXISTENT TABLES REFERENCED ===\n');
  nonExistentTables.forEach(table => {
    console.log(`  ❌ ${table}`);
  });
}