const fs = require('fs');
const path = require('path');

// API routes that need fixing
const apiRoutes = [
  'app/api/achievements/get/route.ts',
  'app/api/workbook/enrolled/route.ts',
  'app/api/course/stats/route.ts',
  'app/api/courses/all-progress/route.ts'
];

const oldImports = `import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';`;

const newImports = `import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';`;

const oldClient = `const supabase = createRouteHandlerClient({ cookies });`;
const newClient = `const { supabase } = createSupabaseRouteHandlerClient(request);`;

console.log('🔧 Fixing Dashboard API Routes\n');

apiRoutes.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  // Fix imports
  if (content.includes("import { createRouteHandlerClient }")) {
    content = content.replace(oldImports, newImports);
    modified = true;
  }
  
  // Fix client initialization
  if (content.includes("createRouteHandlerClient({ cookies })")) {
    content = content.replace(oldClient, newClient);
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`⏭️  Already fixed or different pattern: ${filePath}`);
  }
});

console.log('\n✅ API routes updated! The 401 errors should be fixed.');
console.log('\nNext steps:');
console.log('1. Clear your browser cookies and cache');
console.log('2. Log out and log back in');
console.log('3. Try accessing the dashboard again');
console.log('\nIf you still see 500 errors, run: node scripts/check-missing-tables.js');