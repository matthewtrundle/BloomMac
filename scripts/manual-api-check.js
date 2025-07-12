const fs = require('fs');
const path = require('path');

// Manual list of known issues to check for
const knownIssues = [
  {
    file: '/app/api/admin/careers/route.ts',
    issue: 'References careers_postings table which does not exist',
    suggestion: 'Remove or comment out careers functionality until table is created'
  },
  {
    file: '/app/api/admin/careers/[id]/route.ts', 
    issue: 'References careers_postings table which does not exist',
    suggestion: 'Remove or comment out careers functionality until table is created'
  },
  {
    file: '/app/api/careers/apply/route.ts',
    issue: 'References careers_applications table which does not exist',
    suggestion: 'Remove or create the careers_applications table'
  },
  {
    file: '/app/api/blog-admin-supabase/route.ts',
    issue: 'References blog_images table which does not exist',
    suggestion: 'Create blog_images table or use direct storage'
  },
  {
    file: '/app/api/course/stats/route.ts',
    issue: 'References lesson_progress table which does not exist',
    suggestion: 'Create lesson_progress table for tracking course progress'
  },
  {
    file: '/app/api/courses/all-progress/route.ts',
    issue: 'References lesson_progress and course_enrollments tables',
    suggestion: 'Create these tables or modify to work without them'
  }
];

// Check specific column mismatches
const columnIssues = [
  {
    table: 'email_templates',
    missingColumns: [],
    extraInCode: ['trigger', 'status'] // These are from joined tables
  },
  {
    table: 'subscribers',
    missingColumns: ['subscribed'], // Code uses 'subscribed' but table has 'status'
    extraInCode: []
  },
  {
    table: 'admin_activity_log',
    missingColumns: ['user_id', 'admin_id'], // No user tracking in this table
    extraInCode: []
  }
];

console.log('=== MANUAL API DATABASE CONSISTENCY CHECK ===\n');

// Check files for known issues
console.log('1. CHECKING FOR NON-EXISTENT TABLE REFERENCES:\n');

knownIssues.forEach(({ file, issue, suggestion }) => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('careers_postings') || content.includes('careers_applications') || 
        content.includes('blog_images') || content.includes('lesson_progress')) {
      console.log(`❌ ${file}`);
      console.log(`   Issue: ${issue}`);
      console.log(`   Fix: ${suggestion}\n`);
    }
  }
});

// Check for column mismatches
console.log('\n2. CHECKING FOR COLUMN MISMATCHES:\n');

// Check subscribers table usage
const subscriberFiles = [
  '/app/api/newsletter-signup/route.ts',
  '/app/api/newsletter-admin/route.ts',
  '/app/api/unsubscribe/route.ts'
];

subscriberFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('.subscribed') || content.includes("'subscribed'") || content.includes('"subscribed"')) {
      console.log(`❌ ${file}`);
      console.log(`   Issue: Uses 'subscribed' column but table has 'status' column`);
      console.log(`   Fix: Change .eq('subscribed', true) to .eq('status', 'active')\n`);
    }
  }
});

// Check for auth.users email references
console.log('\n3. CHECKING FOR AUTH.USERS EMAIL REFERENCES:\n');

const authFiles = [
  '/app/api/auth/register/route.ts',
  '/app/api/auth/signup/route.ts',
  '/app/api/admin/auth/login/route.ts'
];

authFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('user_profiles') && content.includes('email')) {
      // Check if trying to insert email into user_profiles
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('user_profiles') && lines[i + 5] && 
            lines.slice(i, i + 10).some(l => l.includes('email:'))) {
          console.log(`⚠️  ${file}`);
          console.log(`   Warning: May be trying to insert email into user_profiles table`);
          console.log(`   Note: Email is stored in auth.users, not user_profiles\n`);
          break;
        }
      }
    }
  }
});

// Check for RPC usage
console.log('\n4. CHECKING FOR RPC FUNCTION USAGE:\n');

const scanForRPC = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      scanForRPC(fullPath);
    } else if (entry.name === 'route.ts') {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('.rpc(')) {
        const relativePath = fullPath.replace(path.join(__dirname, '..'), '');
        const rpcMatches = content.match(/\.rpc\(['"`](\w+)['"`]/g);
        if (rpcMatches) {
          console.log(`📄 ${relativePath}`);
          rpcMatches.forEach(match => {
            const funcName = match.match(/\.rpc\(['"`](\w+)['"`]/)[1];
            console.log(`   Uses RPC function: ${funcName}`);
          });
          console.log('');
        }
      }
    }
  });
};

scanForRPC(path.join(__dirname, '..', 'app', 'api'));

// Summary
console.log('\n=== RECOMMENDATIONS ===\n');
console.log('1. Remove or disable careers functionality until tables are created');
console.log('2. Fix subscribers table column references (subscribed → status)');
console.log('3. Create missing tables: lesson_progress, course_enrollments, blog_images');
console.log('4. Ensure user_profiles inserts don\'t include email field');
console.log('5. Add user tracking to admin_activity_log if needed');
console.log('\n');