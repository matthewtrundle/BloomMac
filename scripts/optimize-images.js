const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');

async function optimizeImages() {
  console.log('Starting image optimization...');
  
  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  // Get all PNG images
  const files = await fs.readdir(IMAGES_DIR);
  const pngFiles = files.filter(file => file.endsWith('.png') && file.startsWith('biff'));
  
  console.log(`Found ${pngFiles.length} images to optimize`);
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  for (const file of pngFiles) {
    const inputPath = path.join(IMAGES_DIR, file);
    const stats = await fs.stat(inputPath);
    totalOriginalSize += stats.size;
    
    const baseName = path.basename(file, '.png');
    
    try {
      // Generate WebP version (best compression)
      const webpPath = path.join(OUTPUT_DIR, `${baseName}.webp`);
      await sharp(inputPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(webpPath);
      
      const webpStats = await fs.stat(webpPath);
      totalOptimizedSize += webpStats.size;
      
      // Also create an optimized PNG (as fallback)
      const pngPath = path.join(OUTPUT_DIR, `${baseName}.png`);
      await sharp(inputPath)
        .png({ quality: 85, compressionLevel: 9 })
        .toFile(pngPath);
      
      // Create placeholder for blur effect
      const placeholderPath = path.join(OUTPUT_DIR, `${baseName}-placeholder.webp`);
      await sharp(inputPath)
        .resize(20) // Very small for blur placeholder
        .webp({ quality: 20 })
        .toFile(placeholderPath);
      
      console.log(`✓ Optimized ${file}`);
    } catch (error) {
      console.error(`✗ Error optimizing ${file}:`, error.message);
    }
  }
  
  const reduction = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
  console.log(`\nOptimization complete!`);
  console.log(`Original total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized total size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Size reduction: ${reduction}%`);
}

// Create a mapping file for easy replacement
async function createImageMapping() {
  const files = await fs.readdir(OUTPUT_DIR);
  const webpFiles = files.filter(file => file.endsWith('.webp') && !file.includes('-placeholder'));
  
  const mapping = {};
  for (const file of webpFiles) {
    const pngName = file.replace('.webp', '.png');
    mapping[`/images/${pngName}`] = `/images/optimized/${file}`;
  }
  
  await fs.writeFile(
    path.join(__dirname, '../image-mapping.json'),
    JSON.stringify(mapping, null, 2)
  );
  
  console.log('\nCreated image mapping file');
}

optimizeImages()
  .then(() => createImageMapping())
  .catch(console.error);