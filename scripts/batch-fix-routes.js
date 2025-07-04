#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Template for different route types
const templates = {
  public: `import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase-server';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { z } from 'zod';

// TODO: Define validation schema
const inputSchema = z.object({
  // Add fields here
});

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const identifier = 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') ||
    'anonymous';
    
  const rateLimitResult = await rateLimit(RATE_LIMITS.default, identifier);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = inputSchema.parse(body);
    
    // Create anonymous Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // TODO: Implement logic here
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`,

  authenticated: `import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser } from '@/lib/supabase-server';
import { z } from 'zod';

// TODO: Define validation schema
const inputSchema = z.object({
  // Add fields here
});

export async function POST(request: NextRequest) {
  try {
    // Create authenticated Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validatedData = inputSchema.parse(body);
    
    // TODO: Implement logic here
    // Remember to check user owns the resource
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`,

  admin: `import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient, getAuthenticatedUser, checkUserRole } from '@/lib/supabase-server';
import { z } from 'zod';

// TODO: Define validation schema
const inputSchema = z.object({
  // Add fields here
});

export async function GET(request: NextRequest) {
  try {
    // Create authenticated Supabase client
    const { supabase } = createSupabaseRouteHandlerClient(request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabase);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has admin role
    const isAdmin = await checkUserRole(supabase, user.id, 'admin');
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    // TODO: Implement admin logic here
    
    // Log admin activity
    await supabase
      .from('admin_activity_log')
      .insert({
        action: 'admin_action',
        entity_type: 'resource',
        details: {
          // Add relevant details
        }
      });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`
};

// Routes to process
const routesToFix = [
  { file: 'app/api/profile/save/route.ts', type: 'authenticated' },
  { file: 'app/api/unsubscribe/route.ts', type: 'public' },
  { file: 'app/api/user/newsletter-preferences/route.ts', type: 'authenticated' },
  { file: 'app/api/user/newsletter-unsubscribe/route.ts', type: 'public' },
  { file: 'app/api/admin/careers/route.ts', type: 'admin' },
  { file: 'app/api/admin/careers/[id]/route.ts', type: 'admin' },
  { file: 'app/api/admin/contacts/[id]/route.ts', type: 'admin' },
  { file: 'pages/api/analytics.ts', type: 'public' },
  { file: 'pages/api/track-event.ts', type: 'public' },
  { file: 'pages/api/newsletter-signup.ts', type: 'public' },
  { file: 'pages/api/newsletter-admin.ts', type: 'admin' }
];

// Generate templates for quick fixes
routesToFix.forEach(route => {
  const secureFile = route.file.replace('.ts', '-secure.ts');
  const template = templates[route.type];
  
  if (!fs.existsSync(secureFile)) {
    console.log(`Creating template for: ${route.file} (${route.type})`);
    
    // Add file-specific comment
    const content = `// Secure version of ${route.file}
// Type: ${route.type}
// TODO: Review original file and implement secure logic

${template}`;
    
    fs.writeFileSync(secureFile, content);
    console.log(`  ✅ Created: ${secureFile}`);
  } else {
    console.log(`  ⏭️  Skipped: ${secureFile} (already exists)`);
  }
});

console.log('\nTemplates created! Now review each file and implement the specific logic.');