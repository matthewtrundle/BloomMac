const fs = require('fs');
const path = require('path');

// Known table schemas from our check
const tableSchemas = {
  user_profiles: ['id', 'first_name', 'last_name', 'phone', 'bio', 'status', 'preferences', 'metadata', 'created_at', 'updated_at', 'avatar_url', 'baby_due_date', 'postpartum_date', 'number_of_children', 'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship', 'timezone', 'marketing_consent', 'role', 'stripe_customer_id', 'last_login_at'],
  subscribers: ['id', 'email', 'first_name', 'last_name', 'status', 'tags', 'signup_source', 'interests', 'metadata', 'ip_address', 'user_agent', 'referrer', 'confirmed', 'created_at', 'updated_at', 'source', 'unsubscribe_reason'],
  email_templates: ['id', 'name', 'category', 'subject', 'content', 'variables', 'is_public', 'created_by', 'created_at', 'updated_at'],
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
  careers_applications: null
};

const issues = [];

function extractDatabaseOperations(content, filePath) {
  const operations = [];
  
  // Regex patterns for Supabase operations
  const patterns = {
    from: /supabase\.from\(['"`](\w+)['"`]\)/g,
    select: /\.select\(['"`]([^'"`]+)['"`]\)/g,
    insert: /\.insert\(\{([^}]+)\}\)/g,
    update: /\.update\(\{([^}]+)\}\)/g,
    rpc: /supabase\.rpc\(['"`](\w+)['"`]/g,
    auth: /supabase\.auth\.(\w+)/g
  };
  
  // Extract table references
  let match;
  while ((match = patterns.from.exec(content)) !== null) {
    const table = match[1];
    const lineNum = content.substring(0, match.index).split('\n').length;
    
    // Get the operation context (next 5 lines)
    const lines = content.split('\n');
    const contextStart = lineNum - 1;
    const contextEnd = Math.min(contextStart + 5, lines.length);
    const context = lines.slice(contextStart, contextEnd).join('\n');
    
    operations.push({
      file: filePath,
      line: lineNum,
      table: table,
      operation: 'from',
      context: context
    });
  }
  
  // Extract RPC calls
  patterns.rpc.lastIndex = 0;
  while ((match = patterns.rpc.exec(content)) !== null) {
    const funcName = match[1];
    const lineNum = content.substring(0, match.index).split('\n').length;
    
    operations.push({
      file: filePath,
      line: lineNum,
      function: funcName,
      operation: 'rpc'
    });
  }
  
  return operations;
}

function checkColumnReferences(content, table, filePath) {
  const schema = tableSchemas[table];
  if (!schema || schema.length === 0) return [];
  
  const columnIssues = [];
  
  // Look for column references in select, insert, update operations
  const selectPattern = /\.select\(['"`]([^'"`]+)['"`]\)/g;
  const insertPattern = /\.insert\(\{([^}]+)\}\)/g;
  const updatePattern = /\.update\(\{([^}]+)\}\)/g;
  const wherePattern = /\.(?:eq|neq|gt|gte|lt|lte|like|ilike|in|contains|containedBy|filter)\(['"`](\w+)['"`]/g;
  
  // Check select columns
  let match;
  while ((match = selectPattern.exec(content)) !== null) {
    const columns = match[1].split(',').map(c => c.trim());
    columns.forEach(col => {
      if (col !== '*' && !col.includes('(') && !schema.includes(col.split(':')[0])) {
        columnIssues.push({
          file: filePath,
          table: table,
          column: col,
          issue: 'Column not found in schema',
          operation: 'select'
        });
      }
    });
  }
  
  // Check insert/update fields
  [insertPattern, updatePattern].forEach(pattern => {
    pattern.lastIndex = 0;
    while ((match = pattern.exec(content)) !== null) {
      const fields = match[1];
      // Extract field names from object
      const fieldPattern = /(\w+):/g;
      let fieldMatch;
      while ((fieldMatch = fieldPattern.exec(fields)) !== null) {
        const field = fieldMatch[1];
        if (!schema.includes(field)) {
          columnIssues.push({
            file: filePath,
            table: table,
            column: field,
            issue: 'Column not found in schema',
            operation: pattern === insertPattern ? 'insert' : 'update'
          });
        }
      }
    }
  });
  
  // Check where clause columns
  while ((match = wherePattern.exec(content)) !== null) {
    const column = match[1];
    if (!schema.includes(column)) {
      columnIssues.push({
        file: filePath,
        table: table,
        column: column,
        issue: 'Column not found in schema',
        operation: 'where/filter'
      });
    }
  }
  
  return columnIssues;
}

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const operations = extractDatabaseOperations(content, filePath);
    
    operations.forEach(op => {
      if (op.table) {
        // Check if table exists
        if (tableSchemas[op.table] === null) {
          issues.push({
            file: op.file,
            line: op.line,
            issue: `Table '${op.table}' does not exist`,
            severity: 'ERROR',
            context: op.context
          });
        } else if (tableSchemas[op.table] === undefined) {
          issues.push({
            file: op.file,
            line: op.line,
            issue: `Unknown table '${op.table}' - may need to check if it exists`,
            severity: 'WARNING',
            context: op.context
          });
        } else {
          // Check column references for this table
          const columnIssues = checkColumnReferences(content, op.table, filePath);
          columnIssues.forEach(issue => {
            issues.push({
              file: issue.file,
              issue: `Column '${issue.column}' not found in table '${issue.table}' (${issue.operation})`,
              severity: 'ERROR'
            });
          });
        }
      }
    });
    
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
console.log('=== API DATABASE CONSISTENCY CHECK ===\n');
console.log('Analyzing all API endpoints...\n');

const apiDir = path.join(__dirname, '..', 'app', 'api');
scanDirectory(apiDir);

// Report issues
if (issues.length === 0) {
  console.log('✅ No database consistency issues found!');
} else {
  console.log(`Found ${issues.length} potential issues:\n`);
  
  // Group by file
  const issuesByFile = {};
  issues.forEach(issue => {
    const relativePath = issue.file.replace(path.dirname(apiDir), '');
    if (!issuesByFile[relativePath]) {
      issuesByFile[relativePath] = [];
    }
    issuesByFile[relativePath].push(issue);
  });
  
  Object.entries(issuesByFile).forEach(([file, fileIssues]) => {
    console.log(`\n📄 ${file}:`);
    fileIssues.forEach(issue => {
      const icon = issue.severity === 'ERROR' ? '❌' : '⚠️';
      console.log(`  ${icon} ${issue.issue}`);
      if (issue.line) {
        console.log(`     Line: ${issue.line}`);
      }
      if (issue.context) {
        console.log(`     Context:\n${issue.context.split('\n').map(l => '       ' + l).join('\n')}`);
      }
    });
  });
}

console.log('\n=== SUMMARY ===');
console.log(`Total files analyzed: ${Object.keys(issues.reduce((acc, i) => ({ ...acc, [i.file]: true }), {})).length}`);
console.log(`Total issues found: ${issues.length}`);
console.log(`Errors: ${issues.filter(i => i.severity === 'ERROR').length}`);
console.log(`Warnings: ${issues.filter(i => i.severity === 'WARNING').length}`);