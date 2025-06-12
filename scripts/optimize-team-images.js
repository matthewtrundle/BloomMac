const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  const inputDir = path.join(process.cwd(), 'public/images/Team');
  const outputDir = path.join(process.cwd(), 'public/images/optimized/Team');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const teamImages = [
    'IMG_1599.jpg',
    'IMG_1602.jpg',
    'IMG_1605.jpg',
    'IMG_1623.JPG',
    'IMG_1627.JPG'
  ];

  for (const imageName of teamImages) {
    const inputPath = path.join(inputDir, imageName);
    const outputName = imageName.toLowerCase().replace('.jpg', '.webp').replace('.jpeg', '.webp');
    const outputPath = path.join(outputDir, outputName);

    if (fs.existsSync(inputPath)) {
      try {
        await sharp(inputPath)
          .resize(800, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality: 85 })
          .toFile(outputPath);
        
        console.log(`✅ Optimized: ${imageName} → ${outputName}`);
      } catch (error) {
        console.error(`❌ Error optimizing ${imageName}:`, error);
      }
    }
  }
}

optimizeImages().then(() => {
  console.log('✨ All images optimized!');
}).catch(console.error);