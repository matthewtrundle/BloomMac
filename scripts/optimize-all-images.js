const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const IMAGES_BASE = path.join(__dirname, '../public/images');
const HERO_DIR = path.join(IMAGES_BASE, 'Hero');
const TEAM_DIR = path.join(IMAGES_BASE, 'Team');
const HOME_DIR = path.join(IMAGES_BASE, 'Home');
const SERVICES_DIR = path.join(IMAGES_BASE, 'Services');

async function optimizeDirectory(dir, outputSubDir) {
  console.log(`\nOptimizing images in ${path.basename(dir)}...`);
  
  const outputDir = path.join(dir, '..', `${path.basename(dir)}-optimized`);
  await fs.mkdir(outputDir, { recursive: true });
  
  try {
    const files = await fs.readdir(dir);
    const imageFiles = files.filter(file => 
      file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
    );
    
    for (const file of imageFiles) {
      const inputPath = path.join(dir, file);
      const baseName = path.parse(file).name;
      const ext = path.parse(file).ext;
      
      try {
        // Skip if already optimized
        if (baseName.includes('optimized')) continue;
        
        // Generate WebP version
        const webpPath = path.join(outputDir, `${baseName}.webp`);
        await sharp(inputPath)
          .webp({ quality: 85 })
          .toFile(webpPath);
        
        // Generate optimized original format
        const optimizedPath = path.join(outputDir, `${baseName}-optimized${ext}`);
        if (ext === '.png') {
          await sharp(inputPath)
            .png({ quality: 85, compressionLevel: 9 })
            .toFile(optimizedPath);
        } else {
          await sharp(inputPath)
            .jpeg({ quality: 85, progressive: true })
            .toFile(optimizedPath);
        }
        
        console.log(`✓ Optimized ${file}`);
      } catch (error) {
        console.error(`✗ Error optimizing ${file}:`, error.message);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
}

async function createUpdateScript() {
  console.log('\nCreating update script...');
  
  const updates = [];
  
  // Map old paths to new optimized paths
  const mappings = [
    { old: '/images/Hero/herooptimzed.png', new: '/images/Hero-optimized/herooptimzed.webp' },
    { old: '/images/Hero/hero15.png', new: '/images/Hero-optimized/hero15.webp' },
    { old: '/images/Team/Jana Rundle.jpg', new: '/images/Team-optimized/Jana Rundle.webp' },
    { old: '/images/Home/new-mom.png', new: '/images/Home-optimized/new-mom.webp' },
    { old: '/images/Home/Confident Women.png', new: '/images/Home-optimized/Confident Women.webp' },
    { old: '/images/Home/Cozy Sunlit movie room.png', new: '/images/Home-optimized/Cozy Sunlit movie room.webp' },
    { old: '/images/Services/AnxietyManagement1.png', new: '/images/Services-optimized/AnxietyManagement1.webp' },
    { old: '/images/Services/AnxietyManagement2.png', new: '/images/Services-optimized/AnxietyManagement2.webp' },
    { old: '/images/Services/New Mothers.png', new: '/images/Services-optimized/New Mothers.webp' },
    { old: '/images/Services/Experienced Parents.png', new: '/images/Services-optimized/Experienced Parents.webp' },
    { old: '/images/Services/Walking through fields.png', new: '/images/Services-optimized/Walking through fields.webp' },
    { old: '/images/Services/Symbolic Shoes.png', new: '/images/Services-optimized/Symbolic Shoes.webp' },
    { old: '/images/Services/Hopeful Hands.png', new: '/images/Services-optimized/Hopeful Hands.webp' },
    { old: '/images/Services/Empty Armchair.png', new: '/images/Services-optimized/Empty Armchair.webp' },
  ];
  
  await fs.writeFile(
    path.join(__dirname, '../image-updates.json'),
    JSON.stringify(mappings, null, 2)
  );
  
  console.log('Created image update mappings');
}

async function main() {
  console.log('Starting comprehensive image optimization...');
  
  await optimizeDirectory(HERO_DIR);
  await optimizeDirectory(TEAM_DIR);
  await optimizeDirectory(HOME_DIR);
  await optimizeDirectory(SERVICES_DIR);
  
  await createUpdateScript();
  
  console.log('\nOptimization complete!');
}

main().catch(console.error);