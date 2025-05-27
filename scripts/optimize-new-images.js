const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Image optimization settings
const WEBP_QUALITY = 85;
const AVIF_QUALITY = 80;
const SIZES = [640, 750, 1080, 1200, 1920];

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const ext = path.extname(inputPath).toLowerCase();
  
  // Skip if not an image
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    return;
  }

  console.log(`Optimizing ${inputPath}...`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });

    // Generate WebP versions for different sizes
    for (const width of SIZES) {
      if (width <= metadata.width) {
        await image
          .resize(width, null, { withoutEnlargement: true })
          .webp({ quality: WEBP_QUALITY })
          .toFile(path.join(outputDir, `${filename}-${width}w.webp`));
        
        console.log(`  ✓ Created ${filename}-${width}w.webp`);
      }
    }

    // Generate full-size WebP
    await image
      .webp({ quality: WEBP_QUALITY })
      .toFile(path.join(outputDir, `${filename}.webp`));
    
    console.log(`  ✓ Created ${filename}.webp`);

    // Generate placeholder (blur)
    await image
      .resize(20)
      .blur()
      .webp({ quality: 60 })
      .toFile(path.join(outputDir, `${filename}-placeholder.webp`));
    
    console.log(`  ✓ Created ${filename}-placeholder.webp`);

  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
  }
}

async function optimizeDirectory(inputDir, outputBaseDir) {
  try {
    const entries = await fs.readdir(inputDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const inputPath = path.join(inputDir, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively optimize subdirectories
        const outputDir = path.join(outputBaseDir, entry.name);
        await optimizeDirectory(inputPath, outputDir);
      } else if (entry.isFile()) {
        // Optimize individual files
        await optimizeImage(inputPath, outputBaseDir);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${inputDir}:`, error);
  }
}

async function main() {
  const imageDirs = [
    { input: 'public/images/Hero', output: 'public/images/optimized/Hero' },
    { input: 'public/images/Home', output: 'public/images/optimized/Home' },
    { input: 'public/images/Services', output: 'public/images/optimized/Services' },
    { input: 'public/images/Team', output: 'public/images/optimized/Team' }
  ];

  // Check for specific Midjourney images that need optimization
  const midjourneyImages = await fs.readdir('public/images');
  const biffImages = midjourneyImages.filter(img => img.startsWith('biff') && img.endsWith('.png'));
  
  if (biffImages.length > 0) {
    console.log(`Found ${biffImages.length} Midjourney images to optimize`);
    
    for (const img of biffImages) {
      await optimizeImage(
        path.join('public/images', img),
        'public/images/optimized/midjourney'
      );
    }
  }

  // Optimize other directories
  for (const { input, output } of imageDirs) {
    console.log(`\nOptimizing ${input}...`);
    await optimizeDirectory(input, output);
  }

  console.log('\n✨ Image optimization complete!');
}

// Check if sharp is installed
try {
  require.resolve('sharp');
  main();
} catch (e) {
  console.error('Sharp is not installed. Installing now...');
  console.log('Run: npm install sharp');
  process.exit(1);
}