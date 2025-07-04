#!/usr/bin/env node

/**
 * Script to fix service role usage in API routes
 * This will help automate the conversion process
 */

const fs = require('fs').promises;
const path = require('path');

const fixes = require('./service-role-fixes.json');

// Template for secure API route
const secureRouteTemplate = `import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser } from '@/lib/supabase-server';

export async function {{METHOD}}(request: NextRequest) {
  try {
    // Create authenticated Supabase client
    const { supabase, response } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // TODO: Add your route logic here
    // Use 'supabase' client instead of 'supabaseAdmin'
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`;

// Special cases that need different handling
const specialCases = {
  'webhooks/calendly': 'webhook',
  'auth/signup': 'public',
  'contact/submit': 'public',
  'careers/apply': 'public',
  'newsletter-signup': 'public',
  'admin/auth/login': 'admin-auth',
  'cron/': 'cron',
  'stripe/webhook': 'webhook'
};

async function fixApiRoutes() {
  console.log('🔧 Fixing Service Role Usage in API Routes\n');
  
  // Filter high priority fixes
  const highPriorityFixes = fixes.filter(f => f.severity === 'high');
  
  console.log(`Found ${highPriorityFixes.length} high priority files to fix\n`);
  
  for (const fix of highPriorityFixes) {
    const filePath = path.join(__dirname, '..', fix.file);
    
    // Determine fix type
    let fixType = 'standard';
    for (const [pattern, type] of Object.entries(specialCases)) {
      if (fix.file.includes(pattern)) {
        fixType = type;
        break;
      }
    }
    
    console.log(`📄 ${fix.file}`);
    console.log(`   Type: ${fixType}`);
    
    try {
      // Read current file
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Check if already fixed
      if (content.includes('createSupabaseRouteHandlerClient')) {
        console.log('   ✅ Already fixed!\n');
        continue;
      }
      
      // Create backup
      const backupPath = filePath + '.backup';
      await fs.writeFile(backupPath, content);
      console.log(`   📦 Backup created: ${path.basename(backupPath)}`);
      
      // Generate fix instructions
      const instructions = generateFixInstructions(fix.file, fixType, content);
      
      // Save instructions
      const instructionsPath = filePath + '.fix.md';
      await fs.writeFile(instructionsPath, instructions);
      console.log(`   📝 Instructions saved: ${path.basename(instructionsPath)}`);
      
      // For demo files, create the secure version
      if (fix.file.includes('profile/update')) {
        console.log('   🔄 Demo fix already created as route-secure.ts');
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
    }
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Review the .fix.md files for each route');
  console.log('2. Apply fixes based on the instructions');
  console.log('3. Test each route after fixing');
  console.log('4. Remove .backup files after verification');
}

function generateFixInstructions(filePath, fixType, content) {
  let instructions = `# Fix Instructions for ${filePath}\n\n`;
  instructions += `## Fix Type: ${fixType}\n\n`;
  
  switch (fixType) {
    case 'webhook':
      instructions += `### Webhook Route Fix\n\n`;
      instructions += `1. This is a webhook endpoint that needs to validate signatures\n`;
      instructions += `2. Use createSupabaseServiceClient() ONLY for webhook operations\n`;
      instructions += `3. Add signature validation:\n\n`;
      instructions += `\`\`\`typescript
import { createSupabaseServiceClient, validateWebhookSignature } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-webhook-signature') || '';
  
  if (!validateWebhookSignature(body, signature, process.env.WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  const supabase = createSupabaseServiceClient();
  // Process webhook...
}
\`\`\`\n`;
      break;
      
    case 'public':
      instructions += `### Public Route Fix\n\n`;
      instructions += `1. This is a public endpoint (no auth required)\n`;
      instructions += `2. Use anonymous Supabase client\n`;
      instructions += `3. Add rate limiting and validation:\n\n`;
      instructions += `\`\`\`typescript
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await rateLimit(...);
  
  const { supabase } = createSupabaseRouteHandlerClient(request);
  // No auth check needed for public routes
  // Process request...
}
\`\`\`\n`;
      break;
      
    case 'admin-auth':
      instructions += `### Admin Auth Route Fix\n\n`;
      instructions += `1. This handles admin authentication\n`;
      instructions += `2. Needs special handling for admin login\n`;
      instructions += `3. Migrate to Supabase Auth:\n\n`;
      instructions += `\`\`\`typescript
// Consider migrating admin auth to Supabase Auth with roles
// For now, use limited service client for admin verification only
\`\`\`\n`;
      break;
      
    case 'cron':
      instructions += `### Cron Job Fix\n\n`;
      instructions += `1. This is a cron job endpoint\n`;
      instructions += `2. Verify cron secret from Vercel\n`;
      instructions += `3. Use service client for batch operations:\n\n`;
      instructions += `\`\`\`typescript
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const supabase = createSupabaseServiceClient();
  // Process cron job...
}
\`\`\`\n`;
      break;
      
    default:
      instructions += `### Standard Route Fix\n\n`;
      instructions += `1. Replace service role client with authenticated client\n`;
      instructions += `2. Add proper authentication check\n`;
      instructions += `3. Use RLS policies for data access\n\n`;
      instructions += `Replace:\n`;
      instructions += `\`\`\`typescript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
\`\`\`\n\n`;
      instructions += `With:\n`;
      instructions += `\`\`\`typescript
const { supabase, response } = createSupabaseRouteHandlerClient(request);
const user = await getAuthenticatedUser(supabase);

if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
\`\`\`\n`;
  }
  
  instructions += `\n## Current Service Role Usage:\n\n`;
  
  // Find service role usage in content
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('SERVICE_ROLE') || line.includes('supabaseAdmin')) {
      instructions += `Line ${index + 1}: \`${line.trim()}\`\n`;
    }
  });
  
  instructions += `\n## Testing:\n\n`;
  instructions += `1. Test with authenticated user\n`;
  instructions += `2. Test with unauthenticated request (should return 401)\n`;
  instructions += `3. Verify RLS policies are working\n`;
  instructions += `4. Check for any permission errors\n`;
  
  return instructions;
}

// Run the fix script
fixApiRoutes().catch(console.error);