#!/usr/bin/env node

/**
 * Archive old routes before deploying secure versions
 * This prevents confusion and allows easy rollback
 * 
 * Usage: node scripts/archive_old_routes.js [prepare|archive|restore|status]
 */

const fs = require('fs').promises;
const path = require('path');

// Routes to archive (old route -> secure route mapping)
const ROUTE_MAPPINGS = {
  // Admin routes
  'app/api/admin/auth/login/route.ts': 'app/api/admin/auth/login/route-secure.ts',
  'app/api/admin/auth/logout/route.ts': 'app/api/admin/auth/logout/route-secure.ts',
  'app/api/admin/auth/session/route.ts': 'app/api/admin/auth/session/route-secure.ts',
  'app/api/admin/contacts/route.ts': 'app/api/admin/contacts/route-secure.ts',
  'app/api/admin/contacts/[id]/route.ts': 'app/api/admin/contacts/[id]/route-secure.ts',
  'app/api/admin/careers/route.ts': 'app/api/admin/careers/route-secure.ts',
  'app/api/admin/careers/[id]/route.ts': 'app/api/admin/careers/[id]/route-secure.ts',
  
  // User routes
  'app/api/auth/signup/route.ts': 'app/api/auth/signup/route-secure.ts',
  'app/api/profile/save/route.ts': 'app/api/profile/save/route-secure.ts',
  'app/api/profile/update/route.ts': 'app/api/profile/update/route-secure.ts',
  
  // Public routes
  'app/api/contact/submit/route.ts': 'app/api/contact/submit/route-secure.ts',
  'app/api/careers/apply/route.ts': 'app/api/careers/apply/route-secure.ts',
  'app/api/unsubscribe/route.ts': 'app/api/unsubscribe/route-secure.ts',
  
  // Newsletter routes
  'app/api/user/newsletter-preferences/route.ts': 'app/api/user/newsletter-preferences/route-secure.ts',
  'app/api/user/newsletter-unsubscribe/route.ts': 'app/api/user/newsletter-unsubscribe/route-secure.ts',
  
  // Pages API routes
  'pages/api/analytics.ts': 'pages/api/analytics-secure.ts',
  'pages/api/chatbot.ts': 'pages/api/chatbot-secure.ts',
  'pages/api/email-analytics.ts': 'pages/api/email-analytics-secure.ts',
  'pages/api/newsletter-admin.ts': 'pages/api/newsletter-admin-secure.ts',
  'pages/api/newsletter-signup.ts': 'pages/api/newsletter-signup-secure.ts',
  'pages/api/track-email-click.ts': 'pages/api/track-email-click-secure.ts',
  'pages/api/track-email-open.ts': 'pages/api/track-email-open-secure.ts',
  'pages/api/track-event.ts': 'pages/api/track-event-secure.ts',
  
  // Webhook routes
  'app/api/webhooks/calendly/route.ts': 'app/api/webhooks/calendly/route-secure.ts',
  
  // Payment routes
  'app/api/payments/charge-no-show/route.ts': 'app/api/payments/charge-no-show/route-secure.ts',
};

const ARCHIVE_DIR = 'archived_routes';
const MANIFEST_FILE = 'archived_routes/archive_manifest.json';

async function ensureArchiveDir() {
  try {
    await fs.mkdir(ARCHIVE_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

async function prepareArchive() {
  console.log('📋 PREPARING ARCHIVE PLAN\n');
  
  const manifest = {
    timestamp: new Date().toISOString(),
    routes: []
  };
  
  for (const [oldRoute, secureRoute] of Object.entries(ROUTE_MAPPINGS)) {
    const oldExists = await fileExists(oldRoute);
    const secureExists = await fileExists(secureRoute);
    
    const status = {
      oldRoute,
      secureRoute,
      oldExists,
      secureExists,
      action: oldExists && secureExists ? 'READY' : oldExists ? 'NO_SECURE' : 'MISSING'
    };
    
    manifest.routes.push(status);
    
    const emoji = status.action === 'READY' ? '✅' : status.action === 'NO_SECURE' ? '⚠️' : '❌';
    console.log(`${emoji} ${oldRoute}`);
    if (status.action === 'NO_SECURE') {
      console.log(`   └─ Secure version not found: ${secureRoute}`);
    } else if (status.action === 'MISSING') {
      console.log(`   └─ Original route not found`);
    }
  }
  
  await ensureArchiveDir();
  await fs.writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  
  console.log(`\n📊 Summary:`);
  const ready = manifest.routes.filter(r => r.action === 'READY').length;
  const noSecure = manifest.routes.filter(r => r.action === 'NO_SECURE').length;
  const missing = manifest.routes.filter(r => r.action === 'MISSING').length;
  
  console.log(`✅ Ready to archive: ${ready}`);
  console.log(`⚠️  No secure version: ${noSecure}`);
  console.log(`❌ Missing original: ${missing}`);
  
  console.log(`\nManifest saved to: ${MANIFEST_FILE}`);
}

async function archiveRoutes() {
  console.log('🗄️  ARCHIVING OLD ROUTES\n');
  
  // Load manifest
  let manifest;
  try {
    const data = await fs.readFile(MANIFEST_FILE, 'utf8');
    manifest = JSON.parse(data);
  } catch (error) {
    console.error('❌ No manifest found. Run "prepare" first.');
    return;
  }
  
  const archived = [];
  const replaced = [];
  
  for (const route of manifest.routes) {
    if (route.action === 'READY') {
      try {
        // Create archive path
        const archivePath = path.join(ARCHIVE_DIR, route.oldRoute);
        await fs.mkdir(path.dirname(archivePath), { recursive: true });
        
        // Move old route to archive
        const content = await fs.readFile(route.oldRoute, 'utf8');
        await fs.writeFile(archivePath, content);
        
        // Replace old route with secure version
        const secureContent = await fs.readFile(route.secureRoute, 'utf8');
        await fs.writeFile(route.oldRoute, secureContent);
        
        // Delete the -secure version
        await fs.unlink(route.secureRoute);
        
        archived.push(route.oldRoute);
        replaced.push(route.oldRoute);
        
        console.log(`✅ Archived & replaced: ${route.oldRoute}`);
      } catch (error) {
        console.error(`❌ Failed to archive ${route.oldRoute}:`, error.message);
      }
    }
  }
  
  // Update manifest
  manifest.archived = archived;
  manifest.replaced = replaced;
  manifest.archivedAt = new Date().toISOString();
  await fs.writeFile(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  
  console.log(`\n📊 Archive Complete:`);
  console.log(`📁 Archived: ${archived.length} files`);
  console.log(`🔄 Replaced: ${replaced.length} files`);
}

async function restoreRoutes() {
  console.log('🔄 RESTORING ORIGINAL ROUTES\n');
  
  // Load manifest
  let manifest;
  try {
    const data = await fs.readFile(MANIFEST_FILE, 'utf8');
    manifest = JSON.parse(data);
  } catch (error) {
    console.error('❌ No manifest found.');
    return;
  }
  
  if (!manifest.archived) {
    console.error('❌ No archived routes found in manifest.');
    return;
  }
  
  let restored = 0;
  
  for (const route of manifest.archived) {
    try {
      const archivePath = path.join(ARCHIVE_DIR, route);
      const content = await fs.readFile(archivePath, 'utf8');
      await fs.writeFile(route, content);
      
      console.log(`✅ Restored: ${route}`);
      restored++;
    } catch (error) {
      console.error(`❌ Failed to restore ${route}:`, error.message);
    }
  }
  
  console.log(`\n📊 Restored ${restored} files`);
}

async function checkStatus() {
  console.log('📊 ROUTE STATUS CHECK\n');
  
  for (const [oldRoute, secureRoute] of Object.entries(ROUTE_MAPPINGS)) {
    const oldExists = await fileExists(oldRoute);
    const secureExists = await fileExists(secureRoute);
    const archivedExists = await fileExists(path.join(ARCHIVE_DIR, oldRoute));
    
    if (oldExists && secureExists) {
      console.log(`⚠️  BOTH exist: ${oldRoute}`);
    } else if (oldExists && archivedExists) {
      console.log(`✅ Deployed: ${oldRoute} (archived backup exists)`);
    } else if (oldExists && !secureExists && !archivedExists) {
      console.log(`📌 Original: ${oldRoute}`);
    } else if (!oldExists && secureExists) {
      console.log(`🔧 Secure only: ${secureRoute}`);
    } else {
      console.log(`❓ Missing: ${oldRoute}`);
    }
  }
}

async function fileExists(filepath) {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

// Main execution
const command = process.argv[2];

async function main() {
  console.log('🚀 Bloom Route Archive Tool\n');
  
  switch (command) {
    case 'prepare':
      await prepareArchive();
      console.log('\n💡 Next: Review the plan, then run "archive" to proceed');
      break;
      
    case 'archive':
      console.log('⚠️  This will replace old routes with secure versions.');
      console.log('📁 Old routes will be backed up to:', ARCHIVE_DIR);
      console.log('\nPress Ctrl+C to cancel, or wait 5 seconds to continue...\n');
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      await archiveRoutes();
      break;
      
    case 'restore':
      console.log('⚠️  This will restore original routes from archive.');
      console.log('\nPress Ctrl+C to cancel, or wait 5 seconds to continue...\n');
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      await restoreRoutes();
      break;
      
    case 'status':
      await checkStatus();
      break;
      
    default:
      console.log('Usage: node scripts/archive_old_routes.js [command]');
      console.log('\nCommands:');
      console.log('  prepare  - Check what will be archived');
      console.log('  archive  - Archive old routes and activate secure ones');
      console.log('  restore  - Restore original routes from archive');
      console.log('  status   - Check current route status');
  }
}

main().catch(console.error);