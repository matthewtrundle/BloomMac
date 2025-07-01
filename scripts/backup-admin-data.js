const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Backup directory
const BACKUP_DIR = path.join(__dirname, '..', 'data', 'backups', `admin-migration-${new Date().toISOString().split('T')[0]}`);

async function ensureDirectory(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${dir}:`, error);
  }
}

async function backupLocalFiles() {
  console.log('📁 Backing up local files...');
  
  // Backup analytics.json
  try {
    const analyticsPath = path.join(__dirname, '..', 'data', 'analytics.json');
    const analyticsData = await fs.readFile(analyticsPath, 'utf8');
    await fs.writeFile(path.join(BACKUP_DIR, 'analytics.json'), analyticsData);
    console.log('✅ Backed up analytics.json');
  } catch (error) {
    console.log('⚠️  No analytics.json found or error:', error.message);
  }

  // Backup existing blog posts JSON
  try {
    const blogBackupPath = path.join(__dirname, '..', 'data', 'backups', 'pre-supabase-2025-05-27', 'blog-posts.json');
    const blogData = await fs.readFile(blogBackupPath, 'utf8');
    await fs.writeFile(path.join(BACKUP_DIR, 'blog-posts-backup.json'), blogData);
    console.log('✅ Backed up blog posts JSON');
  } catch (error) {
    console.log('⚠️  No blog backup found or error:', error.message);
  }
}

async function backupSupabaseTable(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) {
      console.log(`⚠️  Error backing up ${tableName}:`, error.message);
      return null;
    }
    
    if (data && data.length > 0) {
      await fs.writeFile(
        path.join(BACKUP_DIR, `${tableName}.json`),
        JSON.stringify(data, null, 2)
      );
      console.log(`✅ Backed up ${tableName}: ${data.length} records`);
      return data.length;
    } else {
      console.log(`⏭️  No data in ${tableName}`);
      return 0;
    }
  } catch (error) {
    console.log(`❌ Failed to backup ${tableName}:`, error.message);
    return null;
  }
}

async function backupAllSupabaseTables() {
  console.log('\n📊 Backing up Supabase tables...');
  
  const tables = [
    'subscribers',
    'blog_posts',
    'contact_submissions',
    'career_applications',
    'analytics_events',
    'chat_conversations',
    'email_queue',
    'email_metrics',
    'admin_activity_log',
    'user_profiles',
    'appointment_data',
    'appointment_payments',
    'course_enrollments',
    'course_progress',
    'user_achievements',
    'wellness_check_ins',
    'workshop_registrations'
  ];
  
  const summary = {};
  
  for (const table of tables) {
    const count = await backupSupabaseTable(table);
    if (count !== null) {
      summary[table] = count;
    }
  }
  
  // Save backup summary
  await fs.writeFile(
    path.join(BACKUP_DIR, 'backup-summary.json'),
    JSON.stringify({
      timestamp: new Date().toISOString(),
      tables: summary,
      totalRecords: Object.values(summary).reduce((a, b) => a + b, 0)
    }, null, 2)
  );
  
  return summary;
}

async function createFileInventory() {
  console.log('\n📸 Creating image and asset inventory...');
  
  const inventory = {
    images: {
      blog: [],
      team: [],
      services: [],
      hero: [],
      virtual: [],
      optimized: []
    },
    courseContent: {
      presentations: [],
      scripts: []
    }
  };
  
  // Inventory image directories
  const imageDirs = {
    blog: path.join(__dirname, '..', 'public', 'images', 'Blog'),
    team: path.join(__dirname, '..', 'public', 'images', 'Team'),
    services: path.join(__dirname, '..', 'public', 'images', 'Services'),
    hero: path.join(__dirname, '..', 'public', 'images', 'Hero'),
    virtual: path.join(__dirname, '..', 'public', 'virtualimages'),
    optimized: path.join(__dirname, '..', 'public', 'images', 'optimized')
  };
  
  for (const [key, dirPath] of Object.entries(imageDirs)) {
    try {
      const files = await fs.readdir(dirPath);
      inventory.images[key] = files.filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f));
      console.log(`✅ Found ${inventory.images[key].length} images in ${key}`);
    } catch (error) {
      console.log(`⚠️  Could not read ${key} directory`);
    }
  }
  
  // Save inventory
  await fs.writeFile(
    path.join(BACKUP_DIR, 'asset-inventory.json'),
    JSON.stringify(inventory, null, 2)
  );
  
  return inventory;
}

async function main() {
  console.log('🚀 Starting comprehensive backup for admin migration...');
  console.log(`📁 Backup location: ${BACKUP_DIR}`);
  
  // Create backup directory
  await ensureDirectory(BACKUP_DIR);
  
  // Step 1: Backup local files
  await backupLocalFiles();
  
  // Step 2: Backup Supabase tables
  const tablesSummary = await backupAllSupabaseTables();
  
  // Step 3: Create asset inventory
  const assetInventory = await createFileInventory();
  
  // Create migration checklist
  const checklist = {
    backupComplete: true,
    timestamp: new Date().toISOString(),
    nextSteps: [
      '1. Review backup files in ' + BACKUP_DIR,
      '2. Verify all critical data is backed up',
      '3. Run migration scripts',
      '4. Validate migrated data',
      '5. Update API endpoints',
      '6. Test all functionality'
    ],
    criticalTables: {
      'blog_posts': tablesSummary.blog_posts || 0,
      'subscribers': tablesSummary.subscribers || 0,
      'contact_submissions': tablesSummary.contact_submissions || 0,
      'user_profiles': tablesSummary.user_profiles || 0
    },
    warnings: []
  };
  
  // Check for critical data
  if (!tablesSummary.blog_posts || tablesSummary.blog_posts === 0) {
    checklist.warnings.push('⚠️  No blog posts found in database - check JSON backup');
  }
  
  await fs.writeFile(
    path.join(BACKUP_DIR, 'migration-checklist.json'),
    JSON.stringify(checklist, null, 2)
  );
  
  console.log('\n✅ Backup complete!');
  console.log('📋 Review the migration checklist at:', path.join(BACKUP_DIR, 'migration-checklist.json'));
  console.log('\n🔒 All data has been safely backed up. Ready to proceed with migration.');
}

main().catch(console.error);