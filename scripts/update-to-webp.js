const fs = require('fs');
const path = require('path');

// Read the image mapping
const mapping = JSON.parse(fs.readFileSync(path.join(__dirname, '../image-mapping.json'), 'utf8'));

// Update blog posts file
const blogPostsPath = path.join(__dirname, '../lib/data/blog-posts.ts');
let content = fs.readFileSync(blogPostsPath, 'utf8');

// Replace all image paths
Object.entries(mapping).forEach(([oldPath, newPath]) => {
  const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  content = content.replace(regex, newPath);
});

fs.writeFileSync(blogPostsPath, content);
console.log('Updated blog posts to use WebP images');

// Update any other files that might have image references
const filesToUpdate = [
  '../app/page.tsx',
  '../app/about/page.tsx',
  '../app/(services)/services/[slug]/page.tsx',
  '../lib/data/services.ts'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let fileContent = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    Object.entries(mapping).forEach(([oldPath, newPath]) => {
      const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (fileContent.includes(oldPath)) {
        fileContent = fileContent.replace(regex, newPath);
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, fileContent);
      console.log(`Updated ${file}`);
    }
  }
});