const fs = require('fs').promises;
const path = require('path');

// Mapping of old paths to new optimized paths
const imageMapping = {
  '/images/Team/Jana Rundle.jpg': '/images/optimized/Team/Jana Rundle.webp',
  '/images/Hero/ABoutHero.png': '/images/optimized/Hero/ABoutHero.webp',
  '/images/Hero/Hero.png': '/images/optimized/Hero/Hero.webp',
  '/images/Hero/Hero11.png': '/images/optimized/Hero/Hero11.webp',
  '/images/Hero/Hero2.png': '/images/optimized/Hero/Hero2.webp',
  '/images/Hero/Hero3.png': '/images/optimized/Hero/Hero3.webp',
  '/images/Hero/Hero4.png': '/images/optimized/Hero/Hero4.webp',
  '/images/Hero/Hero7.png': '/images/optimized/Hero/Hero7.webp',
  '/images/Hero/hero15.png': '/images/optimized/Hero/hero15.webp',
  '/images/Hero/herooptimzed.png': '/images/optimized/Hero/herooptimzed.webp',
  '/images/Home/Confident Women.png': '/images/optimized/Home/Confident Women.webp',
  '/images/Home/Cozy Sunlit movie room.png': '/images/optimized/Home/Cozy Sunlit movie room.webp',
  '/images/Home/Decorative Floral Pattern.png': '/images/optimized/Home/Decorative Floral Pattern.webp',
  '/images/Home/new-mom.png': '/images/optimized/Home/new-mom.webp',
  '/images/Services/AnxietyManagement1.png': '/images/optimized/Services/AnxietyManagement1.webp',
  '/images/Services/AnxietyManagement2.png': '/images/optimized/Services/AnxietyManagement2.webp',
  '/images/Services/Empty Armchair.png': '/images/optimized/Services/Empty Armchair.webp',
  '/images/Services/Experienced Parents.png': '/images/optimized/Services/Experienced Parents.webp',
  '/images/Services/Hopeful Hands.png': '/images/optimized/Services/Hopeful Hands.webp',
  '/images/Services/New Mothers.png': '/images/optimized/Services/New Mothers.webp',
  '/images/Services/Symbolic Shoes.png': '/images/optimized/Services/Symbolic Shoes.webp',
  '/images/Services/Walking through fields.png': '/images/optimized/Services/Walking through fields.webp'
};

async function updateFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let updated = false;

    // Replace each old path with the new optimized path
    for (const [oldPath, newPath] of Object.entries(imageMapping)) {
      if (content.includes(oldPath)) {
        content = content.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
        updated = true;
        console.log(`  ✓ Updated ${oldPath} → ${newPath}`);
      }
    }

    if (updated) {
      await fs.writeFile(filePath, content);
      console.log(`✨ Updated ${filePath}`);
    }

    return updated;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
    return false;
  }
}

async function updateDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let totalUpdated = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !['node_modules', '.next', '.git', 'out'].includes(entry.name)) {
      totalUpdated += await updateDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      console.log(`\nChecking ${fullPath}...`);
      if (await updateFile(fullPath)) {
        totalUpdated++;
      }
    }
  }

  return totalUpdated;
}

async function main() {
  console.log('🔄 Updating image paths to use optimized WebP versions...\n');
  
  const dirsToUpdate = ['app', 'components', 'lib'];
  let totalFiles = 0;

  for (const dir of dirsToUpdate) {
    console.log(`\n📁 Updating ${dir} directory...`);
    totalFiles += await updateDirectory(dir);
  }

  console.log(`\n✅ Complete! Updated ${totalFiles} files.`);
}

main().catch(console.error);