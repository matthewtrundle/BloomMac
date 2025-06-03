import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    
    // Recursively get all image files
    function getImageFiles(dir: string, baseDir: string = ''): string[] {
      const files: string[] = [];
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(baseDir, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
          // Recursively get files from subdirectories
          files.push(...getImageFiles(fullPath, relativePath));
        } else {
          // Check if it's an image file
          const ext = path.extname(item).toLowerCase();
          if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) {
            // Convert to web path
            files.push('/images/' + relativePath.replace(/\\/g, '/'));
          }
        }
      }
      
      return files;
    }
    
    const imageFiles = getImageFiles(imagesDir);
    
    // Sort images by name for consistent ordering
    imageFiles.sort();
    
    res.status(200).json({ 
      images: imageFiles,
      count: imageFiles.length 
    });
    
  } catch (error) {
    console.error('Error reading images directory:', error);
    res.status(500).json({ error: 'Failed to read images directory' });
  }
}