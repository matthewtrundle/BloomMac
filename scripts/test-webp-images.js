const fs = require('fs');
const path = require('path');

// Test if key WebP images exist
const imagesToTest = [
  '/public/images/optimized/Hero/herooptimzed.webp',
  '/public/images/optimized/Team/Jana Rundle.webp',
  '/public/images/optimized/Hero/ABoutHero.webp',
  '/public/images/optimized/Services/AnxietyManagement1.webp',
  '/public/images/optimized/Home/new-mom.webp'
];

console.log('🔍 Testing WebP image availability...\n');

let allGood = true;

imagesToTest.forEach(imagePath => {
  const fullPath = path.join(process.cwd(), imagePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`✅ ${imagePath}`);
    console.log(`   Size: ${sizeKB} KB`);
  } else {
    console.log(`❌ ${imagePath} - NOT FOUND`);
    allGood = false;
  }
  console.log('');
});

// Also check for responsive versions
console.log('\n🔍 Checking responsive versions...\n');
const testResponsive = '/public/images/optimized/Hero/herooptimzed-1080w.webp';
const responsivePath = path.join(process.cwd(), testResponsive);

if (fs.existsSync(responsivePath)) {
  console.log(`✅ Responsive images exist (${testResponsive})`);
} else {
  console.log(`❌ Responsive images NOT FOUND`);
  allGood = false;
}

console.log('\n' + (allGood ? '✅ All images are properly optimized!' : '❌ Some images are missing!'));