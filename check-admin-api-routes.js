const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.bold.blue('\n🔍 Checking Admin API Routes\n'));

// Expected admin API routes based on admin panel pages
const expectedRoutes = [
  // From admin dashboard
  { path: '/api/admin/analytics', methods: ['GET'] },
  { path: '/api/admin/analytics/events', methods: ['GET', 'POST'] },
  { path: '/api/admin/analytics/export', methods: ['GET'] },
  
  // From contact management
  { path: '/api/admin/contacts', methods: ['GET', 'PUT', 'DELETE'] },
  { path: '/api/admin/contacts/export', methods: ['GET'] },
  
  // From email management
  { path: '/api/admin/emails/templates', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/admin/emails/queue', methods: ['GET', 'POST'] },
  { path: '/api/admin/emails/send', methods: ['POST'] },
  
  // From newsletter
  { path: '/api/admin/newsletter/subscribers', methods: ['GET', 'POST', 'DELETE'] },
  { path: '/api/admin/newsletter/send', methods: ['POST'] },
  { path: '/api/admin/newsletter/export', methods: ['GET'] },
  
  // From blog (already fixed)
  { path: '/api/blog-admin-supabase', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  
  // From courses
  { path: '/api/admin/courses', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
  { path: '/api/admin/courses/enrollments', methods: ['GET', 'POST', 'DELETE'] },
  
  // From careers
  { path: '/api/admin/careers', methods: ['GET', 'PUT', 'DELETE'] },
  
  // From user management
  { path: '/api/admin/users', methods: ['GET', 'PUT', 'DELETE'] },
  { path: '/api/admin/users/export', methods: ['GET'] },
  
  // Activity logs
  { path: '/api/admin/activity', methods: ['GET'] },
  
  // Settings
  { path: '/api/admin/settings', methods: ['GET', 'PUT'] },
];

// Check which routes exist
const apiDir = path.join(process.cwd(), 'app', 'api');
const missingRoutes = [];
const existingRoutes = [];

function checkRoute(routePath) {
  // Convert API path to file path
  const pathParts = routePath.replace('/api/', '').split('/');
  const filePath = path.join(apiDir, ...pathParts, 'route.ts');
  const altFilePath = path.join(apiDir, ...pathParts, 'route.js');
  
  if (fs.existsSync(filePath) || fs.existsSync(altFilePath)) {
    return true;
  }
  return false;
}

// Check each expected route
expectedRoutes.forEach(route => {
  if (checkRoute(route.path)) {
    existingRoutes.push(route);
    console.log(chalk.green(`✅ ${route.path}`));
  } else {
    missingRoutes.push(route);
    console.log(chalk.red(`❌ ${route.path} - MISSING`));
  }
});

// Summary
console.log(chalk.bold.blue('\n📊 Summary\n'));
console.log(chalk.green(`Existing routes: ${existingRoutes.length}`));
console.log(chalk.red(`Missing routes: ${missingRoutes.length}`));

if (missingRoutes.length > 0) {
  console.log(chalk.yellow('\n⚠️  Missing API Routes:\n'));
  
  // Group by feature
  const groupedMissing = {};
  missingRoutes.forEach(route => {
    const feature = route.path.split('/')[3]; // e.g., 'analytics', 'contacts'
    if (!groupedMissing[feature]) {
      groupedMissing[feature] = [];
    }
    groupedMissing[feature].push(route);
  });
  
  Object.entries(groupedMissing).forEach(([feature, routes]) => {
    console.log(chalk.bold(`\n${feature.toUpperCase()}:`));
    routes.forEach(route => {
      console.log(`  - ${route.path} (${route.methods.join(', ')})`);
    });
  });
  
  console.log(chalk.yellow('\n💡 These missing routes will cause features to fail in the admin panel.'));
}

// Check for admin pages that might be calling non-existent APIs
console.log(chalk.bold.blue('\n🔍 Checking Admin Pages for API Calls\n'));

const adminPagesDir = path.join(process.cwd(), 'app', 'admin');

function findApiCalls(dir) {
  const apiCalls = new Set();
  
  function scanDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.')) {
        scanDir(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Find fetch calls
        const fetchMatches = content.match(/fetch\(['"`](\/api\/[^'"`]+)['"`]/g);
        if (fetchMatches) {
          fetchMatches.forEach(match => {
            const api = match.match(/['"`](\/api\/[^'"`]+)['"`]/)[1];
            apiCalls.add(api);
          });
        }
      }
    });
  }
  
  scanDir(dir);
  return Array.from(apiCalls);
}

const usedApis = findApiCalls(adminPagesDir);
console.log(chalk.gray(`Found ${usedApis.length} unique API calls in admin pages\n`));

// Check which used APIs are missing
const missingUsedApis = usedApis.filter(api => !checkRoute(api));
if (missingUsedApis.length > 0) {
  console.log(chalk.red('❌ APIs used in admin pages but missing:\n'));
  missingUsedApis.forEach(api => {
    console.log(chalk.red(`  - ${api}`));
  });
}

console.log('\n' + chalk.bold.green('✅ Run ./test-all-admin-features.sh to check database tables'));