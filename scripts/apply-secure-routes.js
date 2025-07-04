#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Routes that have been completed with secure versions
const completedRoutes = [
  'app/api/profile/update/route.ts', // Already has secure version
  'app/api/contact/submit/route.ts',
  'app/api/admin/contacts/route.ts',
  'app/api/webhooks/calendly/route.ts',
  'app/api/auth/signup/route.ts',
  'app/api/payments/charge-no-show/route.ts',
  'app/api/careers/apply/route.ts'
];

// Read the service role fixes
const fixesPath = path.join(__dirname, 'service-role-fixes.json');
const fixes = JSON.parse(fs.readFileSync(fixesPath, 'utf8'));

// Filter out completed routes
const remainingRoutes = fixes.filter(fix => !completedRoutes.includes(fix.file));

console.log(`Total routes needing fixes: ${fixes.length}`);
console.log(`Routes completed: ${completedRoutes.length}`);
console.log(`Routes remaining: ${remainingRoutes.length}\n`);

// Group by directory for easier processing
const routesByDir = {};
remainingRoutes.forEach(route => {
  const dir = path.dirname(route.file);
  if (!routesByDir[dir]) {
    routesByDir[dir] = [];
  }
  routesByDir[dir].push(route);
});

// Output organized list
console.log('Remaining routes by directory:\n');
Object.entries(routesByDir).forEach(([dir, routes]) => {
  console.log(`${dir}:`);
  routes.forEach(route => {
    const routeName = path.basename(route.file);
    console.log(`  - ${routeName}`);
  });
  console.log('');
});

// Generate batch update script
console.log('\nTo apply secure versions (when ready):');
console.log('=====================================\n');

remainingRoutes.forEach(route => {
  const secureFile = route.file.replace('.ts', '-secure.ts');
  console.log(`# ${route.file}`);
  console.log(`cp ${secureFile} ${route.file}`);
  console.log('');
});

// Save remaining routes to separate file
const remainingRoutesPath = path.join(__dirname, 'remaining-service-role-routes.json');
fs.writeFileSync(remainingRoutesPath, JSON.stringify(remainingRoutes, null, 2));
console.log(`\nRemaining routes saved to: ${remainingRoutesPath}`);