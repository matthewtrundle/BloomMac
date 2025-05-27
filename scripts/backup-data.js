const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const BACKUP_RETENTION_DAYS = 30;

// Files to backup
const FILES_TO_BACKUP = [
  'subscribers.json',
  'analytics.json'
];

async function ensureBackupDir() {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  await fs.mkdir(path.join(BACKUP_DIR, 'daily'), { recursive: true });
  await fs.mkdir(path.join(BACKUP_DIR, 'weekly'), { recursive: true });
  await fs.mkdir(path.join(BACKUP_DIR, 'monthly'), { recursive: true });
}

async function createBackup() {
  console.log('🔄 Starting backup process...');
  
  await ensureBackupDir();
  
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const dayOfWeek = new Date().getDay();
  const dayOfMonth = new Date().getDate();
  
  // Backup each file
  for (const file of FILES_TO_BACKUP) {
    const sourcePath = path.join(DATA_DIR, file);
    
    try {
      await fs.access(sourcePath);
      
      // Daily backup
      const dailyBackupPath = path.join(BACKUP_DIR, 'daily', `${timestamp}-${file}`);
      await fs.copyFile(sourcePath, dailyBackupPath);
      console.log(`✅ Daily backup created: ${file}`);
      
      // Weekly backup (on Sundays)
      if (dayOfWeek === 0) {
        const weeklyBackupPath = path.join(BACKUP_DIR, 'weekly', `${timestamp}-${file}`);
        await fs.copyFile(sourcePath, weeklyBackupPath);
        console.log(`✅ Weekly backup created: ${file}`);
      }
      
      // Monthly backup (on the 1st)
      if (dayOfMonth === 1) {
        const monthlyBackupPath = path.join(BACKUP_DIR, 'monthly', `${timestamp}-${file}`);
        await fs.copyFile(sourcePath, monthlyBackupPath);
        console.log(`✅ Monthly backup created: ${file}`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to backup ${file}:`, error.message);
    }
  }
  
  // Clean up old backups
  await cleanupOldBackups();
  
  // Create a combined backup archive
  await createBackupArchive(timestamp);
  
  console.log('✨ Backup process complete!');
}

async function cleanupOldBackups() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - BACKUP_RETENTION_DAYS);
  
  const dailyDir = path.join(BACKUP_DIR, 'daily');
  
  try {
    const files = await fs.readdir(dailyDir);
    
    for (const file of files) {
      const filePath = path.join(dailyDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.mtime < cutoffDate) {
        await fs.unlink(filePath);
        console.log(`🗑️  Deleted old backup: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error during cleanup:', error.message);
  }
}

async function createBackupArchive(timestamp) {
  try {
    const archiveName = `bloom-backup-${timestamp}.tar.gz`;
    const archivePath = path.join(BACKUP_DIR, archiveName);
    
    // Create compressed archive of all data files
    await execAsync(`tar -czf ${archivePath} -C ${DATA_DIR} ${FILES_TO_BACKUP.join(' ')}`);
    
    console.log(`📦 Created backup archive: ${archiveName}`);
    
    // Also create an export directory with human-readable files
    const exportDir = path.join(DATA_DIR, 'exports');
    await fs.mkdir(exportDir, { recursive: true });
    
    // Export subscribers as CSV
    try {
      const subscribersData = await fs.readFile(path.join(DATA_DIR, 'subscribers.json'), 'utf-8');
      const subscribers = JSON.parse(subscribersData);
      
      const csv = [
        'Email,First Name,Last Name,Status,Signup Date,Source',
        ...subscribers.map(s => 
          `"${s.email}","${s.firstName || ''}","${s.lastName || ''}","${s.status}","${new Date(s.timestamp).toLocaleDateString()}","${s.signupSource}"`
        )
      ].join('\n');
      
      await fs.writeFile(path.join(exportDir, `subscribers-${timestamp}.csv`), csv);
      console.log(`📄 Exported subscribers to CSV`);
    } catch (error) {
      console.error('Failed to export subscribers:', error.message);
    }
    
  } catch (error) {
    console.error('Failed to create archive:', error.message);
  }
}

// Run backup
createBackup().catch(console.error);